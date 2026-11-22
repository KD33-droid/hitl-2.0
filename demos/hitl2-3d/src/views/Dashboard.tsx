import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Icon } from '../Icon'
import { projectMetrics, type Evidence } from '../simulation/metrics'
import { eventText, stageTitle } from '../simulation/projection'
import type { Session } from '../simulation/session'
import './dashboard.css'

type Open = (key:string, view:'Simulator'|'Audit', sequence?:number) => void
const measures = {
  agents:{title:'Agent activity', icon:'agent', color:'#76d9ee', unit:'proposal', plural:'proposals',
    note:'One proposal per agent action.', empty:'Start a run in Simulator to see its proposal.'},
  decisions:{title:'Decision statistics', icon:'network', color:'#a1c4f7', unit:'terminal decision', plural:'terminal decisions',
    note:'Only final dispositions count.', empty:'No decision has reached a final disposition.'},
  pending:{title:'Pending review queue', icon:'human', color:'#efb768', unit:'open request', plural:'open requests',
    note:'Synthetic reviewer roles · Oldest open request first.', empty:'No review request is waiting for a human.'},
  responses:{title:'Human responses', icon:'input', color:'#efb768', unit:'response', plural:'responses',
    note:'Each submitted response counts, including referrals.', empty:'No reviewer has submitted a response.'},
  risk:{title:'Risk distribution', icon:'risk', color:'#90b9ff', unit:'assessed proposal', plural:'assessed proposals',
    note:'Grouped by authored proposal condition, without risk scores.', empty:'No proposal has reached assessment.'},
  policies:{title:'Policy results', icon:'policy', color:'#63d3ed', unit:'check result', plural:'check results',
    note:'Each check within an evaluation counts separately.', empty:'No policy check has been evaluated.'},
  recent:{title:'Recent decisions', icon:'audit', color:'#a1c4f7', unit:'terminal decision', plural:'terminal decisions',
    note:'Newest final disposition first, in session order.', empty:'Finalised decisions will appear here in session order.'},
} as const
type Metric = keyof typeof measures
type Lens = {metric:Metric; category?:string}
type Breakdown = {items:readonly Evidence[]; groups:ReadonlyMap<string, readonly Evidence[]>}
const tone = (metric:Metric) => ({'--dash-accent':measures[metric].color} as CSSProperties)
const unit = (metric:Metric, n:number) => n === 1 ? measures[metric].unit : measures[metric].plural

function PanelTitle({metric}:{metric:Metric}) {
  return <div className="dash-heading">
    <span className="dash-stamp"><Icon name={measures[metric].icon} size={16}/></span>
    <h2>{measures[metric].title}</h2>
  </div>
}

function Distribution({metric, data, inspect, selected}:{
  metric:Metric; data:Breakdown; inspect:(lens:Lens)=>void; selected:string|null
}) {
  const {items, groups} = data
  const {title, note, empty} = measures[metric]
  return <section className="dash-card" aria-label={title} style={tone(metric)}>
    <PanelTitle metric={metric}/>
    <button className="dash-total" onClick={()=>inspect({metric})}
      aria-label={`Inspect ${title}: ${items.length} ${unit(metric, items.length)}`}>
      <strong>{items.length}</strong><span>{unit(metric, items.length)}</span><Icon name="external" size={14}/>
    </button>
    <div className="dash-buckets">{Array.from(groups, ([label, refs]) =>
      <button key={label} className="dash-bucket" onClick={()=>inspect({metric, category:label})}
        aria-label={`Inspect ${label}: ${refs.length} ${unit(metric, refs.length)}`}>
        <span className="dash-bucket-top"><span>{label}</span><code>{refs.length}</code></span>
        <span className="dash-track" aria-hidden="true"><i style={{width:`${items.length ? refs.length/items.length*100 : 0}%`}}/></span>
        {refs.some(ref=>ref.key === selected) && <span className="dash-selected-tick" title="Includes selected run"/>}
      </button>
    )}</div>
    <p className="dash-note">{items.length ? note : empty}</p>
    {metric==='responses'&&items.length>0&&<button className="dash-link" onClick={()=>inspect({metric})}>Intervention history <Icon name="next" size={12}/></button>}
  </section>
}

function EvidenceLink({entry, open}:{entry:Evidence; open:Open}) {
  return <button className="dash-link" onClick={()=>open(entry.key, 'Audit', entry.event.sequence)}
    aria-label={`Inspect ${entry.key} ${entry.event.eventId} in Audit`}>
    {entry.event.eventId}<Icon name="external" size={12}/>
  </button>
}

function Register({metric, items, selected, inspect, open}:{
  metric:'pending'|'recent'; items:readonly Evidence[]; selected:string|null; inspect:(lens:Lens)=>void; open:Open
}) {
  const {title, note, empty} = measures[metric]
  return <section className="dash-card dash-register" style={tone(metric)} aria-label={title}>
    <div className="dash-register-head">
      <PanelTitle metric={metric}/>
      <button className="dash-chip" onClick={()=>inspect({metric})} aria-label={`Inspect all ${title.toLowerCase()}`}>
        {items.length} {unit(metric, items.length)}<Icon name="external" size={12}/>
      </button>
    </div>
    <p className="dash-order">{note}</p>
    {items.length ? <ol className="dash-entries">{items.map(entry=>{
      const {key, event} = entry
      return <li className={selected===key ? 'dash-chosen' : ''} key={`${key}/${event.sequence}`}>
        <div className="dash-entry-context"><code>{key}</code>
          {key===selected && <span className="dash-chosen-label">Selected</span>}
        </div>
        <div className="dash-entry-info">
          {event.stage==='waiting-for-human' ? <>
            <strong>{event.reviewerAlias}</strong>
            <small>{event.requestId} · {event.mode}</small>
          </> : <><strong>{event.fixtureId}</strong><small>{event.decisionId}</small></>}
        </div>
        <div className="dash-entry-end">
          {event.stage==='waiting-for-human'
            ? <button className="dash-review" onClick={()=>open(key, 'Simulator')}>Review request <Icon name="next" size={12}/></button>
            : <span className="dash-disposition" data-result={entry.category}>{entry.category}</span>}
          <EvidenceLink entry={entry} open={open}/>
        </div>
      </li>
    })}</ol> : <p className="dash-empty">{empty}</p>}
  </section>
}

function EvidenceDialog({lens, items, selected, close, open}:{
  lens:Lens; items:readonly Evidence[]; selected:string|null; close:()=>void; open:Open
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(()=>{
    const dialog = ref.current
    dialog?.showModal()
    return ()=>dialog?.close()
  }, [])
  const metric = measures[lens.metric]
  return <dialog ref={ref} className="dash-dialog" aria-labelledby="dash-dialog-title" onCancel={close}
    onClick={ev=>{if (ev.target===ref.current) close()}}>
    <article>
      <header><span className="micro">SESSION / METRIC EVIDENCE</span>
        <button className="icon-btn" onClick={close} aria-label="Close metric evidence"><Icon name="close"/></button></header>
      <h2 id="dash-dialog-title">{metric.title}</h2>
      <p>{lens.category && <><code>{lens.category}</code> · </>}{items.length} {unit(lens.metric, items.length)}. {metric.note}</p>
      {!items.length && <p className="dash-empty">{lens.category ? 'No matching events in this session.' : metric.empty}</p>}
      <ol className="dash-evidence">{items.map(entry=>{
        const {event, key, related, checkIndex} = entry
        const check = event.stage==='evaluated' && checkIndex!==undefined ? event.checks[checkIndex] : null
        return <li key={`${key}/${event.sequence}/${checkIndex??''}`} className={key===selected ? 'dash-chosen' : ''}>
          <div className="dash-evidence-head"><code>{key}</code>
            {key===selected && <span className="dash-chosen-label">Selected</span>}
            <span>{stageTitle[event.stage]}</span></div>
          <strong>{check ? `${check.id} · ${check.result}` : event.fixtureId}</strong>
          <p>{check ? check.reason : eventText(event)}</p>
          <div className="dash-evidence-links"><span>Audit</span><EvidenceLink entry={entry} open={open}/>
            {related && <button className="dash-link" onClick={()=>open(key, 'Audit', related.sequence)}>
              {stageTitle[related.stage]} · {related.eventId}<Icon name="external" size={12}/></button>}
            <button className="dash-link" onClick={()=>open(key, 'Simulator', event.sequence)}
              aria-label={`View ${key} ${event.eventId} in Simulator`}>Simulator <Icon name="external" size={12}/></button>
            {event.stage==='waiting-for-human' && <button className="dash-review" onClick={()=>open(key, 'Simulator')}>Review request <Icon name="next" size={12}/></button>}
          </div>
        </li>
      })}</ol>
    </article>
  </dialog>
}

export function Dashboard({session, open}:{session:Session; open:Open}) {
  const metrics = projectMetrics(session)
  const [lens, inspect] = useState<Lens|null>(null)
  const entries = lens?.metric==='recent' ? metrics.recent : lens
    ? (lens.category===undefined ? metrics[lens.metric].items : metrics[lens.metric].groups.get(lens.category)??[]) : []
  return <div className="dash-view">
    <div className="dash-caption"><span>Session overview</span>
      {session.selected && <span className="dash-current">Selected run <code>{session.selected}</code></span>}
    </div>
    <div className="dash-overview">{(['agents', 'decisions', 'responses'] as const).map(metric=>
      <Distribution key={metric} metric={metric} data={metrics[metric]} inspect={inspect} selected={session.selected}/>
    )}</div>
    <div className="dash-pair">
      <Register metric="pending" items={metrics.pending.items} selected={session.selected} inspect={inspect} open={open}/>
      <Register metric="recent" items={metrics.recent} selected={session.selected} inspect={inspect} open={open}/>
    </div>
    <div className="dash-pair">{(['risk', 'policies'] as const).map(metric=>
      <Distribution key={metric} metric={metric} data={metrics[metric]} inspect={inspect} selected={session.selected}/>
    )}</div>
    {lens && <EvidenceDialog lens={lens} items={entries} selected={session.selected}
      close={()=>inspect(null)} open={(...target)=>{inspect(null);open(...target)}}/>}
  </div>
}
