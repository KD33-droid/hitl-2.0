import { useEffect, useId, useMemo, useState } from 'react'
import { Icon } from '../Icon'
import { buildChain, ENCODING, GENESIS, verifyChain, type Chain, type Entry, type Verification } from '../integrity/chain'
import type { Route, Run, RunEvent } from '../simulation/contracts'
import { eventText, project, stageTitle } from '../simulation/projection'
import './audit.css'

type Props = { run:Run; sequence:number; inspect:(sequence:number)=>void }
type Task<T> = () => Promise<T>

/** Effects start after render: gate reads by task identity as well as ignoring late completions. */
function useTask<T>(task:Task<T>|null) {
  const [completed, setCompleted] = useState<
    { task:Task<T>; data:T; error?:never } | { task:Task<T>; error:string; data?:never } | null
  >(null)
  useEffect(() => {
    if (!task) return
    let active = true
    task().then(data => { if (active) setCompleted({task, data}) }, err => {
      if (active) setCompleted({task, error:err instanceof Error ? err.message : 'Unable to compute the digest.'})
    })
    return () => { active = false }
  }, [task])
  return completed && completed.task === task ? completed : null
}

const clock = (utc:string) => utc.slice(11,19)
const pretty = (s:string) => s.charAt(0).toUpperCase() + s.slice(1)
function routeText(route:Route) {
  if (route.kind === 'request-review') return `Request review · ${route.mode}`
  if (route.kind === 'restrict') return `Restrict to ${route.alternative}`
  return pretty(route.kind)
}
function stamp(e:RunEvent) {
  return <span className="au-stamp"><code>{e.eventId}</code><time dateTime={e.logicalUtc}>{clock(e.logicalUtc)} UTC</time></span>
}

function Summary({run}:{run:Run}) {
  const {proposal, assessment, evaluation, provisional, final, last, status} = project(run)
  const reviews = run.events.filter(e => e.stage === 'waiting-for-human' || e.stage === 'responded')
  return <section className="panel au-summary" aria-label="Decision summary">
    <div className="bar"><h2><Icon name="file"/>Decision summary</h2><span className="badge">{pretty(status)}</span></div>
    <div className="au-banner">
      <div><div className="micro">DECISION ID</div><h3>{proposal.decisionId}</h3><code>{proposal.proposalId} · {proposal.agentId}</code></div>
      <div className="au-origin"><span className="badge">Synthetic fixture</span><code>{proposal.fixtureId} / v{proposal.fixtureVersion}</code></div>
    </div>
    <div className="au-milestones">
      <div><h4>Requested action</h4><strong>{pretty(proposal.requested.action)}</strong><p>{proposal.requested.condition}</p>{stamp(proposal)}</div>
      <div><h4>Provisional route</h4><strong>{provisional ? routeText(provisional.route) : 'Not yet routed'}</strong>{provisional && stamp(provisional)}</div>
      <div><h4>Final disposition</h4><strong>{final ? routeText(final.disposition) : 'Not yet finalised'}</strong>{final && <><p>{final.rationale}</p>{stamp(final)}</>}</div>
    </div>
    <div className="au-findings">
      <div><h4>Assessment &amp; evidence</h4>
        <p>{assessment ? assessment.explanation : 'No assessment recorded yet.'}</p>
        {assessment && stamp(assessment)}
        {evaluation ? <ul className="au-evidence">{evaluation.checks.map(c => <li key={c.id}>
          <span className="badge">{c.result}</span><span><code>{c.id}</code><br/>{c.reason}</span>
        </li>)}</ul> : <p className="au-muted">No policy checks recorded yet.</p>}
        {evaluation && stamp(evaluation)}
      </div>
      <div><h4>Human review</h4>
        {reviews.length ? <ol className="au-reviews">{reviews.map(e => <li key={e.sequence}>
          {e.stage === 'waiting-for-human'
            ? <><b>{e.requestId} · {e.mode}</b><p>Requested from {e.reviewerAlias} (synthetic role).{e.referralTarget && ` Referral available to ${e.referralTarget}.`}</p></>
            : <><b>{e.response.requestId} · {pretty(e.response.choice)}</b><p>{e.response.reviewerAlias} (synthetic role): {e.response.rationale}</p></>}
          {stamp(e)}
        </li>)}</ol> : <p>No human review requested in this sequence.</p>}
      </div>
    </div>
    <div className="au-range"><span>LOGICAL UTC</span><code>{proposal.logicalUtc} → {last.logicalUtc}</code></div>
  </section>
}

function Verify({check, label, copy=false}:{check:Task<Verification>; label:string; copy?:boolean}) {
  const [request, setRequest] = useState<{source:Task<Verification>; task:Task<Verification>}|null>(null)
  const task = request?.source === check ? request.task : null
  const settled = useTask(task)
  const result = settled?.data
  return <div className="au-verify">
    <button type="button" className="focus-btn" disabled={!!task && !settled}
      onClick={() => setRequest({source:check, task:() => check()})}><Icon name="network" size={16}/>{label}<Icon name="next" size={15}/></button>
    <div role="status" aria-label={copy ? 'Copy verification result' : 'Original verification result'}
      className={'au-result ' + (result ? result.ok ? 'au-match' : 'au-mismatch' : '')}>
      {settled?.error ? <>Verification unavailable: {settled.error}</>
        : result ? result.ok ? <><strong>Locally consistent with this checkpoint</strong>All {result.length} events match the original checkpoint.</>
          : <><strong>First mismatch: {result.eventId} · sequence {result.sequence}</strong>{result.detail}</>
        : task ? 'Checking every event…' : copy ? 'Copy not verified.' : 'Original sequence not yet verified.'}
    </div>
  </div>
}

type Change = 'edit'|'rehash'|'swap'|'truncate'
const editedTime = (event:RunEvent) => new Date(Date.parse(event.logicalUtc) + 60_000).toISOString()
function CopyEditor({chain, selected}:{chain:Chain; selected:RunEvent}) {
  const timeHint = useId()
  const [draft, setDraft] = useState(() => ({kind:'edit' as Change, index:selected.sequence - 1, time:editedTime(selected)}))
  const event = chain.entries[draft.index].event
  const setTarget = (kind:Change, index:number) => {
    const target = kind === 'swap' ? Math.min(index, chain.entries.length - 2) : index
    setDraft({kind, index:target, time:target === draft.index ? draft.time : editedTime(chain.entries[target].event)})
  }
  const check = useMemo(() => async () => {
    const {index, kind, time} = draft
    let copy:Entry[] = [...chain.entries]
    if (kind === 'truncate') copy = copy.slice(0,index)
    else if (kind === 'swap') [copy[index], copy[index+1]] = [copy[index+1], copy[index]]
    else {
      const entry = copy[index]
      copy[index] = {...entry, event:{...entry.event, logicalUtc:time}}
      if (kind === 'rehash') {
        const rebuilt = await buildChain(copy.map(e => e.event))
        return verifyChain(rebuilt.entries, chain.checkpoint)
      }
    }
    return verifyChain(copy, chain.checkpoint)
  }, [chain, draft])
  const editTime = draft.kind === 'edit' || draft.kind === 'rehash'
  return <div className="au-copy">
    <p>Change a working copy, then compare it to the original checkpoint.</p>
    <label>Copy operation<select value={draft.kind} onChange={e => setTarget(e.target.value as Change, draft.index)}>
      <option value="edit">Edit a logical time</option><option value="rehash">Edit time and rehash the copy</option>
      <option value="swap" disabled={chain.entries.length < 2}>Swap with the next event</option><option value="truncate">Truncate before an event</option>
    </select></label>
    <label>Copy event<select value={draft.index} onChange={e => setTarget(draft.kind, Number(e.target.value))}>
      {chain.entries.map(({event:e}, i) => <option key={i} value={i} disabled={draft.kind === 'swap' && i === chain.entries.length - 1}>
        {e.eventId} · {stageTitle[e.stage]}
      </option>)}
    </select></label>
    {editTime && <><label>Copied logical time (UTC)<input value={draft.time} spellCheck={false} aria-describedby={timeHint}
      onChange={e => setDraft({...draft, time:e.target.value})}/></label><small id={timeHint}>Original: {event.logicalUtc}</small></>}
    <Verify check={check} label="Verify edited copy" copy/>
  </div>
}

function Integrity({chain, selected}:{chain:Chain; selected:RunEvent}) {
  const [copy, setCopy] = useState(false)
  const check = useMemo(() => () => verifyChain(chain.entries, chain.checkpoint), [chain])
  return <>
    <div className="au-checkpoint">
      <div className="au-check-meta"><h4>Original checkpoint</h4><code>{chain.checkpoint.length} events</code></div>
      <div className="au-head"><span>Head</span><code>{chain.checkpoint.head}</code></div>
    </div>
    <div className="tabs au-tabs" role="group" aria-label="Verification source">
      <button type="button" aria-pressed={!copy} onClick={() => setCopy(false)}>Original sequence</button>
      <button type="button" aria-pressed={copy} onClick={() => setCopy(true)}>Edit a copy</button>
    </div>
    <div className="au-check-body">{copy ? <CopyEditor chain={chain} selected={selected}/> : <>
      <p>Check every sequence number, previous digest and event digest, then compare the length and head.</p>
      <Verify check={check} label="Verify full sequence"/>
    </>}</div>
    <details className="au-method"><summary>Encoding &amp; limits</summary>
      <p><code>{ENCODING}</code> hashes UTF-8 JSON arrays containing the version, previous digest and complete event. Object keys are sorted recursively; array order is preserved.</p>
      <div className="au-head"><span>Genesis</span><code>{GENESIS}</code></div>
      <p>Per-event references locate the first difference. Replacing both the sequence and its checkpoint could hide a change.</p>
    </details>
  </>
}

function EventInspector({event, entry}:{event:RunEvent; entry?:Entry}) {
  return <article className="au-inspector" aria-label="Selected audit event">
    <div className="au-inspector-id"><span className="figure">{event.eventId}</span><span className="micro">ORIGINAL EVENT / {String(event.sequence).padStart(2,'0')}</span></div>
    <h3>{stageTitle[event.stage]}</h3><p>{eventText(event)}</p>
    <dl className="au-digests">
      <div><dt>Logical UTC</dt><dd><code>{event.logicalUtc}</code></dd></div>
      <div><dt>Previous digest</dt><dd><code>{entry?.previousDigest ?? '—'}</code></dd></div>
      <div><dt>Current digest</dt><dd><code>{entry?.digest ?? '—'}</code></dd></div>
    </dl>
    <details className="au-fields"><summary>All event fields</summary><pre>{JSON.stringify(event, null, 2)}</pre></details>
  </article>
}

export function Audit({run, sequence, inspect}:Props) {
  const build = useMemo(() => () => buildChain(run.events), [run.events])
  const prepared = useTask(build), chain = prepared?.data
  const selected = run.events.find(e => e.sequence === sequence) ?? run.events[0]
  return <div className="au-workspace">
    <div className="au-top"><Summary run={run}/>
      <section className="panel au-integrity" aria-label="Sequence integrity">
        <div className="bar"><h2><Icon name="network"/>Sequence integrity</h2><span className="figure">SHA-256</span></div>
        {chain ? <Integrity chain={chain} selected={selected}/> : <p className="au-check-body" role="status">
          {prepared?.error ? `Checkpoint unavailable: ${prepared.error}` : 'Preparing the original checkpoint…'}
        </p>}
        <p className="au-limit"><Icon name="info" size={14}/>Checkpoint captured on inspection in this browser. No signature, trusted clock or independent proof of origin.</p>
      </section>
    </div>
    <section className="panel au-sequence" aria-label="Event sequence">
      <div className="bar"><h2><Icon name="audit"/>Event sequence</h2><span className="micro">{run.events.length} ORIGINAL EVENTS</span></div>
      <div className="au-record-grid">
        <ol className="au-event-list">{run.events.map(e => <li key={e.sequence}>
          <button type="button" aria-label={`Inspect ${e.eventId}: ${stageTitle[e.stage]}`} aria-pressed={e.sequence === selected.sequence}
            onClick={() => inspect(e.sequence)}>
            <code>{e.eventId}</code><strong>{stageTitle[e.stage]}</strong><time dateTime={e.logicalUtc}>{clock(e.logicalUtc)}</time>
            <Icon name="arrow" size={13}/>
          </button>
        </li>)}</ol>
        <EventInspector event={selected} entry={chain?.entries[selected.sequence - 1]}/>
      </div>
    </section>
  </div>
}
