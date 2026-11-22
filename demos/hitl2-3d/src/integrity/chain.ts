import type { RunEvent } from '../simulation/contracts'

export const ENCODING = 'hitl2-demo/audit/v1'
export const GENESIS = '0'.repeat(64)

export type Entry = Readonly<{ event:RunEvent; previousDigest:string; digest:string }>
export type Checkpoint = Readonly<{
  length:number; head:string
  /** Local references for identifying the first difference, including a missing event. */
  positions:readonly Readonly<{ eventId:string; digest:string }>[]
}>
export type Chain = Readonly<{ entries:readonly Entry[]; checkpoint:Checkpoint }>
type Fault = 'sequence'|'previous'|'digest'|'rewritten'|'truncated'|'extended'|'head'
export type Verification =
  | { ok:true; length:number; head:string }
  | { ok:false; sequence:number; eventId:string; reason:Fault; detail:string }

/**
 * v1 hashes UTF-8 JSON of [ENCODING, previousDigest, completeEvent], no whitespace or newline.
 * Object keys sort recursively by UTF-16 code unit, arrays keep their order, and scalars use
 * JSON.stringify without Unicode normalization. Run keys and presentation state are excluded.
 */
function canonical(value:unknown):string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value)
  if (Array.isArray(value)) return `[${Array.from(value, canonical).join(',')}]`
  if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map(k => `${JSON.stringify(k)}:${canonical(record[k])}`).join(',')}}`
  }
  throw new TypeError('The audit encoding accepts JSON values only.')
}

async function hashEvent(previous:string, event:RunEvent):Promise<string> {
  const bytes = new TextEncoder().encode(canonical([ENCODING, previous, event]))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('')
}

export async function buildChain(events:readonly RunEvent[]):Promise<Chain> {
  const snapshot = structuredClone(events)
  const entries:Entry[] = []
  let head = GENESIS
  for (const event of snapshot) {
    const sequence = entries.length + 1
    if (event.sequence !== sequence) throw new Error(`Expected sequence ${sequence}, found ${event.sequence} (${event.eventId}).`)
    const digest = await hashEvent(head, event)
    entries.push({ event, previousDigest:head, digest })
    head = digest
  }
  return { entries, checkpoint:{
    length:entries.length, head, positions:entries.map(({event, digest}) => ({eventId:event.eventId, digest}))
  } }
}

/** Compare an entire candidate to the separately retained original checkpoint. Neither is signed. */
export async function verifyChain(candidate:readonly Entry[], original:Checkpoint):Promise<Verification> {
  const entries = structuredClone(candidate), checkpoint = structuredClone(original)
  let head = GENESIS
  for (const [index, { event, previousDigest, digest }] of entries.entries()) {
    const sequence = index + 1, reference = checkpoint.positions[index]
    const fail = (reason:Fault, detail:string):Verification => ({
      ok:false, sequence, eventId:reference?.eventId ?? event.eventId, reason, detail
    })
    if (sequence > checkpoint.length) return fail('extended', `Unexpected ${event.eventId} after the checkpoint’s ${checkpoint.length} events.`)
    if (event.sequence !== sequence) return fail('sequence', `Position ${sequence} contains ${event.eventId} with sequence ${event.sequence}.`)
    if (previousDigest !== head) return fail('previous', `Previous digest does not match ${index ? 'the preceding event' : 'the fixed genesis'}.`)
    if (await hashEvent(previousDigest, event) !== digest) return fail('digest', 'The stored digest does not match the event fields and previous digest.')
    if (digest !== reference.digest) return fail('rewritten', 'The recomputed digest differs from the original checkpoint at this position.')
    head = digest
  }
  if (entries.length < checkpoint.length) return {
    ok:false, sequence:entries.length + 1, eventId:checkpoint.positions[entries.length].eventId,
    reason:'truncated', detail:`Missing event. The copy ends after ${entries.length} of ${checkpoint.length} events.`
  }
  if (head !== checkpoint.head) return {
    ok:false, sequence:entries.length, eventId:entries.at(-1)?.event.eventId ?? 'GENESIS',
    reason:'head', detail:'The final digest differs from the checkpoint head.'
  }
  return { ok:true, length:entries.length, head }
}
