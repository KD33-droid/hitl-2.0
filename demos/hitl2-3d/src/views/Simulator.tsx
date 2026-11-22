import { useState,type Dispatch } from 'react'
import { Icon } from '../Icon'
import { resolveFixture,scenarios } from '../simulation/scenarios'
import type { Command } from '../simulation/session'
import type { Response,Run,RunEvent,ScenarioInput } from '../simulation/contracts'
import { eventText,project,stageTitle } from '../simulation/projection'
import { Status } from './SessionStrip'

const stageIcon:Record<RunEvent['stage'],string>={proposed:'agent',assessed:'risk',evaluated:'policy',routed:'compass',
  'waiting-for-human':'human',responded:'human',finalised:'focus',recorded:'audit'}
const steps=['Proposal','Assess','Evaluate','Route','Review','Final','Record']
const stageStep:Record<RunEvent['stage'],number>={proposed:0,assessed:1,evaluated:2,routed:3,'waiting-for-human':4,responded:4,finalised:5,recorded:6}
function Composer({start}:{start:(input:ScenarioInput)=>void}){
  const [input,edit]=useState<ScenarioInput>(scenarios[0].input)
  const row=resolveFixture('1.0.0',input)
  return <section className="panel composer">
    <div className="bar"><h2><Icon name="layers"/>Scenario composer</h2><span className="count">V1.0.0</span></div>
    <div className="panel-content">
      <p className="kicker">NEW RECORD / PROPOSAL INPUTS</p>
      <label className="field">Requested action<select value={input.action} onChange={e=>edit(scenarios.find(s=>s.input.action===e.target.value)!.input)}>
        {['preview','export','release'].map(a=><option key={a} value={a}>{a} report</option>)}</select></label>
      <label className="field">Fixture condition<select value={input.condition} onChange={e=>edit({...input,condition:e.target.value})}>
        {scenarios.map(s=><option key={s.id}>{s.input.condition}</option>)}</select></label>
      <div className="fixture-detail"><div className="micro">{row?'MATCHED SCRIPT':'UNSUPPORTED INPUTS'}</div>
        <strong>{row?.id??'No scripted case'}</strong><p>{row?.explanation??'This combination has no authored response. Choose a supported action and condition.'}</p></div>
      <button className="action-primary" disabled={!row} onClick={()=>row&&start(row.input)}><Icon name="play" size={14}/> Start decision</button>
      <p className="fine-print">Starts a new session record. Risk explanations and policy checks are authored fixture text.</p>
    </div>
  </section>
}
export type ReviewDraft={reason:string;setReason:(value:string)=>void}
function ReviewCard({run,request,dispatch,draft}:{run:Run;request:Extract<RunEvent,{stage:'waiting-for-human'}>;dispatch:Dispatch<Command>;draft:ReviewDraft}){
  const {reason,setReason}=draft
  const p=project(run),bounded=request.mode==='bounded-confirmation'
  const send=(choice:Response['choice'])=>{
    dispatch({type:'review',key:run.key,sequence:request.sequence,response:{
      requestId:request.requestId,reviewerAlias:request.reviewerAlias,rationale:reason.trim(),choice}})
    setReason('')
  }
  return <section className="review-card" aria-label="Pending review request">
    <div className="review-heading"><div className="review-symbol"><Icon name="human" size={24}/></div><div><div className="kicker">HUMAN INTERVENTION / {request.requestId}</div>
      <h2>{bounded?'L2 · Confirm a bounded release':'L3 · Review elevated authority'}</h2></div><Status value="Pending review"/></div>
    <p><strong>{p.proposal.requested.action} report</strong> · {p.proposal.requested.condition}. {bounded?'Confirm only this action within its already-authorised scope.':'Explicit privileged approval is required for this elevated action.'}</p>
    <div className="review-evidence"><span>Assessment</span><p>{p.assessment?.explanation}</p><span>Policy check</span><p>{p.evaluation?.checks.map(c=>`${c.id}: ${c.result} · ${c.reason}`).join('; ')}</p></div>
    <div className="review-role"><Icon name="human" size={14}/>{request.reviewerAlias} <span>· synthetic role, not authenticated</span></div>
    <label className="field">Review rationale<input maxLength={500} required value={reason} onChange={e=>setReason(e.target.value)} placeholder="Record your reason for this decision"/></label>
    <div className="button-row"><button className="action-amber" disabled={!reason.trim()} onClick={()=>send(bounded?'confirm':'approve')}>{bounded?'Confirm bounded action':'Approve elevated action'}</button>
      <button className="action-reject" disabled={!reason.trim()} onClick={()=>send('reject')}>Reject</button>
      {request.referralTarget&&<button className="secondary" disabled={!reason.trim()} onClick={()=>send('refer')}>Refer for further review</button>}</div>
    <p className="fine-print">Pending until an explicit response. No timeout approval.</p>
  </section>
}
export function Simulator({run,dispatch,sequence,historical,inspect,live,openAudit,draft}:{
  run?:Run;dispatch:Dispatch<Command>;sequence:number;historical:boolean;inspect:(n:number)=>void;live:()=>void;openAudit:()=>void;draft:ReviewDraft
}){
  const p=run?project(historical?{...run,events:run.events.slice(0,sequence)}:run):undefined,active=run?.events[sequence-1]
  return <div className="sim-layout"><div><Composer start={input=>{live();dispatch({type:'start',version:'1.0.0',input})}}/>
    <div className="context-note"><Icon name="info" size={16}/><div><strong>Logical time</strong><p>Each run starts at 00:00:00 UTC on 1 January 2000. A tick is one scripted event, not elapsed review time.</p></div></div></div>
    <div className="sim-main">
      {run&&p?.pending&&!historical&&<ReviewCard key={run.key+p.pending.requestId} run={run} request={p.pending} dispatch={dispatch} draft={draft}/>}
      <section className="panel"><div className="bar"><h2><Icon name="network"/>Execution timeline</h2><span className="micro">{run?`${run.events.length} EVENTS`:'READY'}</span></div>
        {run&&p&&active?<><div className="pipeline-steps">{steps.map((s,i)=><span key={s} className={i===stageStep[active.stage]?'now':run.events.some(e=>stageStep[e.stage]===i&&e.sequence<=sequence)?'visited':''}>{s}</span>)}</div>
          <div className="timeline-header"><div><p className="kicker">{historical?'INSPECTING RECORDED HISTORY':'LATEST EVENT'} / {active.eventId}</p>
            <h2>{stageTitle[active.stage]}</h2><p aria-live="polite">{eventText(active)}</p></div></div>
          <div className="button-row timeline-actions">{historical?<button className="secondary" onClick={live}>Return to live record</button>:p.last.stage==='recorded'?<button className="secondary" onClick={openAudit}>Inspect audit record <Icon name="external" size={13}/></button>:!p.pending?<><button className="action-primary" onClick={()=>dispatch({type:'step',key:run.key,sequence})}>Next event <Icon name="next" size={14}/></button>
            <button className="secondary" onClick={()=>dispatch({type:'continue',key:run.key,sequence})}>Run to boundary</button></>:<span className="fine-print">Paused at the human review boundary.</span>}</div>
          <ol className="event-list">{run.events.map(e=><li key={e.eventId}><button className={sequence===e.sequence?'current':''} aria-pressed={sequence===e.sequence} onClick={()=>inspect(e.sequence)}>
            <span className={'event-symbol '+(stageStep[e.stage]===4?'amber':'')}><Icon name={stageIcon[e.stage]} size={15}/></span>
            <code>{e.eventId}</code><strong>{stageTitle[e.stage]}</strong><time>{e.logicalUtc.slice(11,19)} Z</time></button></li>)}</ol>
          {p.reviews.length>0&&<p className="review-summary">Review {p.final?'resolved':p.pending?'pending after referral':'response recorded'} · {p.reviews.map(e=>`${e.response.reviewerAlias}: ${e.response.choice}`).join(' → ')}</p>}
        </>:<div className="quiet-empty"><Icon name="network" size={34}/><h3>Awaiting a proposal</h3><p>Choose a case and start a decision. Step through the evidence, or run until the next review or audit boundary.</p></div>}
      </section>
    </div>
  </div>
}
