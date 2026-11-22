import { Component, lazy, Suspense, useCallback, useEffect, useReducer, useState, type CSSProperties, type ReactNode } from 'react'
import { emptySession,reduceSession } from './simulation/session'
import { Simulator } from './views/Simulator'
import { SessionStrip,type View } from './views/SessionStrip'
import { Dashboard } from './views/Dashboard'
import { Audit } from './views/Audit'
import { stageTitle } from './simulation/projection'
import type { RunEvent } from './simulation/contracts'
import './views/workspace.css'
import { byId, components, flow, type NodeId } from './catalogue'
import { Icon } from './Icon'
import { Inspector } from './Inspector'
import { MapView } from './MapView'
import { ReferenceDialog, type ReferencePage } from './ReferenceDialog'
import type { CameraCommand } from './scene/layout'
const Scene=lazy(()=>import('./scene/Scene'))
const pages:Record<View,[string,string,string]>={
  Architecture:['Architecture explorer','Inspect the components and connections of the HITL 2.0 governance framework.','cube'],
  Simulator:['Decision simulator','Trace a synthetic proposal from the initial request to its final disposition.','network'],
  Dashboard:['Governance dashboard','Explore the decisions, assessments and human interventions in this session.','panels'],
  Audit:['Audit explorer','Inspect the decision record and verify its local event sequence.','audit']
}
const station:Record<RunEvent['stage'],[NodeId,number]>={
  proposed:['agent',0],assessed:['risk',1],evaluated:['policy',2],routed:['agent',2],
  'waiting-for-human':['human',3],responded:['human',4],finalised:['agent',-1],recorded:['audit',5]
}
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(){this.props.onFailure()}
  render(){return this.state.failed?null:this.props.children}
}
function useReducedMotion(){
  const [reduced,set]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)'),fn=()=>set(m.matches)
    m.addEventListener('change',fn);return ()=>m.removeEventListener('change',fn)},[])
  return reduced
}
export function App(){
  const [guide,G]=useState<number|null>(null),[tourKey,K]=useState('')
  const [notice,N]=useState('')
  const [view,setView]=useState<View>('Architecture')
  const [session,dispatch]=useReducer(reduceSession,emptySession)
  const run=session.runs.find(r=>r.key===session.selected)
  const [drafts,setDrafts]=useState<Record<string,string>>({})
  const draftKey=run?`${run.key}/${run.events.length}`:''
  const draft={reason:drafts[draftKey]??'',setReason:(value:string)=>setDrafts(prev=>{
    const copy={...prev};if(value)copy[draftKey]=value;else delete copy[draftKey];return copy
  })}
  const [cursor,setCursor]=useState<number|null>(null),[replaying,setReplaying]=useState(false)
  const sequence=Math.min(cursor??(run?.events.length??1),run?.events.length??1)
  const event=run?.events[sequence-1]
  const live=()=>{setCursor(null);setReplaying(false)}
  const inspect=(seq:number)=>{setCursor(seq);setReplaying(false)}
  const open=(key:string,destination:View,seq?:number)=>{
    dispatch({type:'select',key});setView(destination);setCursor(seq??null);setReplaying(false)
  }
  const [selected,select]=useState<NodeId>('agent')
  const [mode,setMode]=useState<'3d'|'2d'>('3d'),[lost,setLost]=useState(false)
  const [reference,setReference]=useState<ReferencePage|null>(null)
  const [step,setStep]=useState(-1),[playing,setPlaying]=useState(false)
  const [command,setCommand]=useState<CameraCommand>({kind:'overview',target:'agent',serial:0})
  const reduced=useReducedMotion()
  const reveal=(id:string)=>{if(matchMedia('(max-width:760px)').matches)document.getElementById(id)?.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'})}
  const camera=(kind:CameraCommand['kind'])=>{setCommand(prev=>({kind,target:selected,serial:prev.serial+1}));if(kind==='inspect')reveal('scene')}
  const onFailure=useCallback(()=>{setLost(true);setMode('2d')},[])
  const node=byId[selected]
  const shownStep=event?station[event.stage][1]:step
  useEffect(()=>{
    if(!run||!replaying||reference)return
    const timer=window.setTimeout(()=>{if(sequence>=run.events.length)setReplaying(false);else setCursor(sequence+1)},1050)
    return ()=>window.clearTimeout(timer)
  },[replaying,sequence,run,reference])
  useEffect(()=>{if(event&&view==='Architecture')select(station[event.stage][0])},[event,view])
  useEffect(()=>{document.title=`${pages[view][0]} · HITL 2.0`;window.scrollTo(0,0)},[view])
  useEffect(()=>{
    if(!playing||reference||view!=='Architecture'||run)return
    const timer=window.setTimeout(()=>{if(step===flow.length-1){setPlaying(false)}else setStep(s=>s+1)},2200)
    return ()=>window.clearTimeout(timer)
  },[playing,step,reference,view,run])
  const toggleTrace=()=>{if(!playing&&(step<0||step===flow.length-1))setStep(0);setPlaying(p=>!p)}
  const titles=['Architecture overview','Component inspection','Agent decision proposal','Risk and policy evidence','Human intervention','Final governance decision','Dashboard impact','Audit verification','Tampering demonstration']
  const cues=['Orbit the five stations. Explain that this is a proposed architecture.','Inspect the risk interface and its repository sources.','A new synthetic elevated release is proposed. Identify its action and condition.','Inspect E-002 and E-003 in the timeline. The explanation and check come directly from the fixture.','Enter a rationale and explicitly approve or reject. A referral remains pending.','Read the final disposition and its rationale.','Trace the terminal decision and human response counts back to their records.','Choose Verify full sequence and read the local checkpoint result.','Choose Edit a copy, change a field and verify the copy. Compare the first mismatch with the original.']
  function visit(i:number){
    live();setPlaying(false);G(i)
    setView(i<2?'Architecture':i<6?'Simulator':i===6?'Dashboard':'Audit')
    if(i<2){select(i?'risk':'agent');setCommand(prev=>({serial:prev.serial+1,kind:i?'inspect':'overview',target:i?'risk':'agent'}));return}
    let guided=session.runs.find(r=>r.key===tourKey)
    if(!guided){dispatch({type:'start',version:'1.0.0',input:{action:'release',condition:'elevated-authority'}});K(`RUN-${String(session.runs.length+1).padStart(3,'0')}`);return}
    dispatch({type:'select',key:guided.key})
    if(i===3){for(let n=guided.events.length;n<3;n++)dispatch({type:'step',key:guided.key,sequence:n});setCursor(3)}
    if(i===4){dispatch({type:'continue',key:guided.key,sequence:guided.events.length});if(guided.events.at(-1)?.stage==='recorded')setCursor(5)}
    if(i===2)setCursor(1)
    if(i===5)setCursor(guided.events.find(e=>e.stage==='finalised')!.sequence)
  }
  function restartGuide(){K('');visit(0)}
  function reset(all:boolean){
    if(!window.confirm(all?'Clear all in-memory demonstration records?':'Restart this scenario at its proposal? Its previous in-memory events will be discarded.'))return
    if(all)dispatch({type:'clear'});else if(run)dispatch({type:'restart',key:run.key})
    G(null);K('');live();setDrafts({});setView(all?'Architecture':'Simulator');setStep(-1);setPlaying(false);camera('overview')
  }
  const guideDone=session.runs.find(r=>r.key===tourKey)?.events.at(-1)?.stage==='recorded'
  return <>
    <header className="global-header"><div className="header-inner">
      <a className="brand" href="#workspace" aria-label="HITL 2.0 workspace" onClick={()=>setView('Architecture')}><img src={import.meta.env.BASE_URL+'mark.svg'} alt=""/><b>HITL <em>2.0</em></b></a>
      <span className="brand-caption">Research console</span>
      <nav aria-label="Workspace navigation">{(Object.keys(pages) as View[]).map(v=><button className={view===v?'active':''} aria-current={view===v?'page':undefined} key={v} onClick={()=>{G(null);setView(v)}}><Icon name={pages[v][2]} size={15}/>{v}</button>)}</nav>
      <span className="local"><i/> Synthetic session</span>
    </div></header>
    <main id="workspace" data-guide={guide??undefined}>
      <div className="eyebrow"><span/> SYSTEMS LAB <b>/</b> LOCAL GOVERNANCE SIMULATION</div>
      <section className="intro"><div><h1>{pages[view][0]}</h1><p>{pages[view][1]}</p></div>
        <div className="button-row"><button className="secondary" onClick={()=>setReference('fixtures')}><Icon name="layers" size={15}/> Fixture index</button><button className="secondary" onClick={()=>setReference('notes')}><Icon name="book" size={16}/> Research notes <Icon name="external" size={13}/></button></div>
      </section>
      <div className="present-tools">
        {guide===null&&<button className="trace" onClick={restartGuide}>Guided walkthrough</button>}
        <button onClick={()=>{G(null);setView('Architecture');camera('overview')}}>Architecture overview</button>
        <button onClick={()=>reset(false)} disabled={!run}>Reset current scenario</button>
        <button onClick={()=>reset(true)} disabled={!run}>Reset session</button>
        {document.fullscreenEnabled&&<button onClick={async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{N('Fullscreen unavailable in this window.')}}}>Toggle fullscreen</button>}
        <span role="status">{notice}</span>
      </div>
      {guide!==null&&<section className="guide-panel" aria-label="Presenter guide"><div aria-live="polite"><small>FIELD GUIDE / {guide+1} OF 9</small><h2>{titles[guide]}</h2><p>{cues[guide]}</p></div><div className="button-row">
        <button className="secondary" disabled={!guide} onClick={()=>visit(guide-1)}>Previous</button>
        <button className="action-primary" disabled={guide===4&&!guideDone} onClick={()=>guide===8?G(null):visit(guide+1)}>{guide===8?'Finish':'Next'}</button>
        <button onClick={restartGuide}>Restart walkthrough</button><button onClick={()=>G(null)}>Exit guide</button></div></section>}
      {run&&<SessionStrip run={run} session={session} sequence={sequence} open={key=>open(key,view)} inspect={inspect} live={live} replay={cursor!==null} playing={replaying}
        toggle={()=>{if(!replaying&&(cursor===null||sequence>=run.events.length))setCursor(1);setReplaying(!replaying)}}/>}
      {view==='Simulator'?<Simulator run={run} dispatch={dispatch} sequence={sequence} historical={cursor!==null} inspect={inspect} live={live} openAudit={()=>setView('Audit')} draft={draft}/>:
       view==='Dashboard'?<Dashboard session={session} open={open}/>:
       view==='Audit'?run?<Audit key={run.key} run={run} sequence={sequence} inspect={inspect}/>:<section className="panel quiet-empty"><Icon name="audit" size={36}/><h2>No decision records yet</h2><p>Start a synthetic decision to inspect its history and check its local integrity.</p><button className="secondary" onClick={()=>setView('Simulator')}>Open simulator</button></section>:
       <><div className="workspace-grid">
        <section id="scene" className="viewport panel" aria-label="Architecture viewport">
          <div className="bar"><h2><Icon name="cube"/> Spatial workspace</h2><div className="switch" aria-label="Projection mode">
            <button aria-pressed={mode==='3d'} disabled={lost} onClick={()=>setMode('3d')}><Icon name="cube" size={13}/> 3D view</button>
            <button aria-pressed={mode==='2d'} onClick={()=>setMode('2d')}><Icon name="map" size={13}/> 2D map</button>
          </div></div>
          <div className="stage">
            <div className="stage-caption"><span className="figure">{event?event.eventId:'FIG. 01'}</span><span>{event?`${run?.key} / ${stageTitle[event.stage].toUpperCase()}`:'SYSTEM TOPOLOGY'}</span></div>
            <div className="stage-scale" aria-hidden="true">X <i/> Z</div>
            {mode==='3d'?<SceneBoundary onFailure={onFailure}><Suspense fallback={<div className="loading">Preparing spatial view…</div>}>
              <Scene selected={selected} select={select} command={command} step={shownStep} playing={(run?replaying:playing)&&!reference} reduced={reduced} onFailure={onFailure}/>
            </Suspense></SceneBoundary>:<MapView selected={selected} select={select} step={shownStep}/>}
            <div className="stage-bottom"><div className="legend"><span><i/>Governance flow</span><span><i/>Human review</span></div>
              {mode==='3d'&&<div className="cam-controls">
                <button onClick={()=>camera('out')} aria-label="Zoom out" title="Zoom out"><Icon name="minus" size={15}/></button>
                <button onClick={()=>camera('in')} aria-label="Zoom in" title="Zoom in"><Icon name="plus" size={15}/></button>
                <button onClick={()=>camera('overview')} aria-label="Reset overview camera" title="Reset overview"><Icon name="focus" size={15}/></button>
              </div>}
            </div>
          </div>
          {event?<div className="viewport-foot"><span><b>{event.eventId}</b>{stageTitle[event.stage]} · {event.fixtureId}</span><button className="trace" onClick={()=>setView('Simulator')}>View timeline <Icon name="next" size={12}/></button></div>:<div className="viewport-foot"><span>{step>=0?<><b>{String(step+1).padStart(2,'0')}/06</b> {flow[step].label}</>:<><Icon name={mode==='3d'?'mouse':'map'} size={15}/>{mode==='3d'?'Drag to orbit · Scroll to zoom':lost?'WebGL unavailable · Interactive 2D map':'Select a node to inspect its interfaces'}</>}</span>
            <div>{step>=0&&<button className="icon-btn" aria-label="Reset flow trace" title="Reset trace" onClick={()=>{setPlaying(false);setStep(-1)}}><Icon name="close" size={13}/></button>}
              <button className="trace" onClick={toggleTrace}><Icon name={playing?'pause':'play'} size={12}/>{playing?'Pause trace':step===-1?'Trace flow':step===5?'Replay trace':'Resume trace'}</button>
            </div>
          </div>}
        </section>
        <Inspector node={node} focus={()=>camera('inspect')} spatial={mode==='3d'}
          evidence={run?.events.slice(0,sequence).reverse().find(e=>station[e.stage][0]===selected)}/>
      </div>
      <section className="directory"><div className="section-title"><div><span className="short-rule"/><h2>Component directory</h2><span className="count">05</span></div><span className="directory-hint">Select a component to inspect <Icon name="next" size={14}/></span></div>
        <div className="tiles">{components.map(c=><button key={c.id} className={'tile '+(selected===c.id?'selected':'')} style={{'--node':c.color} as CSSProperties}
          aria-label={'Inspect '+c.name} aria-pressed={selected===c.id} onClick={()=>{select(c.id);reveal('inspector')}}>
          <span className="tile-top"><span className="tile-icon"><Icon name={c.id} size={20}/></span><small>NODE {c.number}</small></span>
          <strong>{c.short}</strong><span className="tile-bottom">{c.role}<Icon name="external" size={13}/></span>
        </button>)}</div>
      </section></>}
      <footer><span><i/> Synthetic simulation <b>·</b> No live governance execution</span><span>HITL 2.0 <b>/</b> PHASE 03</span></footer>
    </main>
    {reference&&<ReferenceDialog page={reference} close={()=>setReference(null)}/>}
  </>
}
