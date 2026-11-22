import { Icon } from '../Icon'
import type { Session } from '../simulation/session'
import type { Run } from '../simulation/contracts'
import { project } from '../simulation/projection'
export type View='Architecture'|'Simulator'|'Dashboard'|'Audit'
export function Status({value}:{value:string}){
  return <span className={'run-status '+(value==='Pending review'||value==='restrict'?'amber':value==='deny'?'critical':'')}><i/>{value}</span>
}
export function SessionStrip({session,run,sequence,open,inspect,replay,playing,toggle,live}:{
  session:Session;run:Run;sequence:number;open:(key:string)=>void;inspect:(seq:number)=>void;
  replay:boolean;playing:boolean;toggle:()=>void;live:()=>void
}){
  const {proposal,status}=project(run)
  return <section className="session-strip" aria-label="Selected decision">
    <label className="run-select"><span className="micro">SESSION RECORD</span>
      <select aria-label="Selected decision" value={run.key} onChange={e=>open(e.target.value)}>
        {session.runs.map(r=><option key={r.key} value={r.key}>{r.key} · {r.events[0].fixtureId}</option>)}
      </select></label>
    <div className="run-identity"><span className="micro">DECISION ID · RUN-LOCAL</span><code>{proposal.decisionId}</code></div>
    <div className="current-status"><span className="micro">CURRENT DISPOSITION</span><Status value={status}/></div>
    <div className="transport" aria-label="Read-only event playback">
      <button onClick={toggle} className="trace" aria-label={playing?'Pause replay':'Replay history'}><Icon name={playing?'pause':'play'} size={12}/>{playing?'Pause':'Replay'}</button>
      <label><span>{replay?'Inspecting':'Latest'} <b>{run.events[sequence-1].eventId}</b> / {run.events.length}</span>
        <input aria-label="Inspect event sequence" type="range" min={1} max={run.events.length} value={sequence} disabled={run.events.length===1} onChange={e=>inspect(Number(e.target.value))}/></label>
      {replay&&<button className="text-link" onClick={live}>Back to latest</button>}
    </div>
  </section>
}
