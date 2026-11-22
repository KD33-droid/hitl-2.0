import type { Response,Run, ScenarioInput } from './contracts'
import { advance,advanceToBoundary,respond,startRun,tail } from './engine'
import { resolveFixture } from './scenarios'
/** Interleaving metadata only. The canonical event body lives in its run once. */
export type Session={runs:readonly Run[];selected:string|null;order:readonly {key:string;sequence:number}[]}
export const emptySession:Session={runs:[],selected:null,order:[]}
export type Command={type:'start';version:string;input:ScenarioInput}|{type:'select';key:string}
  |{type:'clear'}|{type:'restart';key:string}
  |{type:'step'|'continue';key:string;sequence:number}
  |{type:'review';key:string;sequence:number;response:Response}
export function reduceSession(state:Session,cmd:Command):Session{
  if(cmd.type==='clear')return emptySession
  if(cmd.type==='restart'){
    const run=state.runs.find(r=>r.key===cmd.key),first=run?.events[0]
    if(!run||first?.stage!=='proposed')return state
    const next=startRun(run.key,first.fixtureVersion,first.requested)
    return {...state,runs:state.runs.map(r=>r===run?next:r),order:[...state.order.filter(e=>e.key!==run.key),{key:run.key,sequence:1}]}
  }
  if(cmd.type==='select')return state.runs.some(r=>r.key===cmd.key)?{...state,selected:cmd.key}:state
  if(cmd.type==='start'){
    if(!resolveFixture(cmd.version,cmd.input))return state
    const key=`RUN-${String(state.runs.length+1).padStart(3,'0')}`
    const run=startRun(key,cmd.version,cmd.input)
    return {runs:[...state.runs,run],selected:key,order:[...state.order,{key,sequence:1}]}
  }
  const run=state.runs.find(r=>r.key===cmd.key)
  if(!run||tail(run).sequence!==cmd.sequence)return state
  const next=cmd.type==='review'?respond(run,cmd.sequence,cmd.response):cmd.type==='step'?advance(run,cmd.sequence):advanceToBoundary(run)
  return next===run?state:{...state,runs:state.runs.map(r=>r===run?next:r),
    order:[...state.order,...next.events.slice(run.events.length).map(e=>({key:run.key,sequence:e.sequence}))]}
}
