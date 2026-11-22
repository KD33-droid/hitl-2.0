import { describe, expect, it } from 'vitest'
import { buildChain, GENESIS, verifyChain } from '../../src/integrity/chain'
import type { RunEvent } from '../../src/simulation/contracts'

const shared = { proposalId:'P', decisionId:'D', fixtureId:'f', fixtureVersion:'1', origin:'synthetic-fixture' } as const
const proposal = {
  ...shared, stage:'proposed', agentId:'α', requested:{condition:'scope|"A"', action:'preview'},
  sequence:1, eventId:'E-001', logicalUtc:'2000-01-01T00:00:00.000Z'
} as const satisfies RunEvent
const assessment = {
  ...shared, stage:'assessed', assessmentId:'AS', explanation:'line\n2',
  sequence:2, eventId:'E-002', logicalUtc:'2000-01-01T00:00:01.000Z'
} as const satisfies RunEvent
const events = [proposal, assessment]
// Independent Python 3 vector: start p = '0'*64, then for each event e above:
// p = hashlib.sha256(json.dumps(['hitl2-demo/audit/v1', p, e], ensure_ascii=False,
//     separators=(',', ':'), sort_keys=True).encode('utf-8')).hexdigest()
const first = '07606f438ae47b6cf9f85b6d35155c7ad6cd8a3f55ddc1b01467ae57435f5477'
const second = 'd349ee05e9f56f3a0ee1eb12f6dccd19f49b551ca8fe6c8b4a49bd0159960a15'

describe('in-memory audit chain v1', () => {
  it('matches the independent UTF-8 vector, including genesis, escaping and the second link', async () => {
    const { entries, checkpoint } = await buildChain(events)
    expect(entries.map(e => [e.previousDigest, e.digest])).toEqual([['0'.repeat(64), first], [first, second]])
    expect(checkpoint).toMatchObject({length:2, head:second})
    expect(await verifyChain(entries, checkpoint)).toEqual({ok:true, length:2, head:second})
  })

  it('ignores key insertion order even inside nested objects, but preserves array order', async () => {
    const reordered = {...Object.fromEntries(Object.entries(proposal).reverse()), requested:{action:'preview', condition:'scope|"A"'}} as RunEvent
    expect((await buildChain([reordered])).checkpoint.head).toBe(first)
    const checks = [
      { id:'one', reason:'One', result:'pass' },
      { id:'two', reason:'Two', result:'fail' }
    ] as const
    const evaluation = {...shared, logicalUtc:'2000-01-01T00:00:02.000Z', sequence:3, eventId:'E-003', stage:'evaluated', checks} as const
    const a = await buildChain([...events, evaluation])
    const b = await buildChain([...events, {...evaluation, checks:[...checks].reverse()}])
    expect(b.checkpoint.head).not.toBe(a.checkpoint.head)
  })

  it('reports the event with an edited payload, even if a later event is missing; original still verifies', async () => {
    const { entries, checkpoint } = await buildChain(events)
    const altered = {...entries[0], event:{...proposal, requested:{...proposal.requested, condition:'different'}}}
    expect(await verifyChain([altered], checkpoint)).toMatchObject({ok:false, reason:'digest', sequence:1, eventId:'E-001'})
    expect(await verifyChain(entries, checkpoint)).toMatchObject({ok:true})
  })

  it('checks both stored links against genesis, their predecessors and recomputed bytes', async () => {
    const { entries:[a,b], checkpoint } = await buildChain(events)
    expect(await verifyChain([{...a, previousDigest:second},b], checkpoint)).toMatchObject({ok:false, reason:'previous', sequence:1})
    expect(await verifyChain([a,{...b, previousDigest:GENESIS}], checkpoint)).toMatchObject({ok:false, reason:'previous', sequence:2})
    expect(await verifyChain([a,{...b, digest:first}], checkpoint)).toMatchObject({ok:false, reason:'digest', sequence:2})
  })

  it('requires contiguous one-based positions at capture and verification', async () => {
    const { entries:[a,b], checkpoint } = await buildChain(events)
    for (const n of [0, 1, 2.5, 3]) {
      const invalid = {...assessment, sequence:n}
      await expect(buildChain([proposal, invalid])).rejects.toThrow(/sequence 2/)
      expect(await verifyChain([a,{...b, event:invalid}], checkpoint)).toMatchObject({ok:false, reason:'sequence', sequence:2})
    }
    expect(await verifyChain([b,a], checkpoint)).toMatchObject({reason:'sequence', sequence:1, eventId:'E-001', detail:expect.stringContaining('E-002')})
  })

  it('locates a missing suffix or an unexpected extension and checks the terminal digest independently', async () => {
    const { entries, checkpoint } = await buildChain(events)
    const prefix = await buildChain([proposal])
    expect(await verifyChain(prefix.entries, checkpoint)).toMatchObject({reason:'truncated', sequence:2, eventId:'E-002'})
    expect(await verifyChain([], checkpoint)).toMatchObject({reason:'truncated', sequence:1, eventId:'E-001'})
    expect(await verifyChain(entries, prefix.checkpoint)).toMatchObject({reason:'extended', sequence:2, eventId:'E-002'})
    expect(await verifyChain(entries, {...checkpoint, head:first})).toMatchObject({ok:false, reason:'head', sequence:2})
    expect(await verifyChain([], (await buildChain([])).checkpoint)).toEqual({ok:true, length:0, head:GENESIS})
  })

  it('locates a fully rehashed change before the head using the retained original checkpoint', async () => {
    const last = {...shared, stage:'recorded', finalDecisionSequence:2, sequence:3, eventId:'E-003', logicalUtc:'2000-01-01T00:00:02.000Z'} as const
    const original = await buildChain([...events, last])
    const copy = await buildChain([proposal, {...assessment, explanation:'different'}, last])
    expect(await verifyChain(copy.entries, copy.checkpoint)).toMatchObject({ok:true})
    expect(await verifyChain(copy.entries, original.checkpoint)).toMatchObject({ok:false, reason:'rewritten', sequence:2, eventId:'E-002'})
    expect(await verifyChain(original.entries, original.checkpoint)).toMatchObject({ok:true})
  })
})
