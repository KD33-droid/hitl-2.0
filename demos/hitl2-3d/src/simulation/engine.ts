import type { EventBody, ReplayInput, Response, Run, RunEvent, ScenarioCase, ScenarioInput } from './contracts'
import { resolveFixture, reviewScript,scenarios } from './scenarios'

const epoch=Date.UTC(2000,0,1)
const pad=(n:number)=>String(n).padStart(3,'0')
export const tail=(run:Run)=>run.events[run.events.length-1]
function append(run:Run,fixture:ScenarioCase,body:EventBody):Run{
  const n=run.events.length+1
  const event:RunEvent={fixtureId:fixture.id,fixtureVersion:fixture.version,origin:fixture.origin,
    proposalId:`P-${fixture.id}`,decisionId:`D-${fixture.id}`,sequence:n,eventId:`E-${pad(n)}`,
    logicalUtc:new Date(epoch+(n-1)*1000).toISOString(),...structuredClone(body)}
  return {...run,events:[...run.events,event]}
}
export function startRun(key:string,version:string,input:ScenarioInput):Run{
  const fixture=resolveFixture(version,input)
  if(!fixture)throw new Error('No scripted case for that version, action and condition.')
  return append({key,events:[]},fixture,{stage:'proposed',agentId:fixture.agentId,requested:input})
}
function source(run:Run){
  const first=run.events[0]
  if(first?.stage!=='proposed')throw new Error('Missing proposal.')
  const row=resolveFixture(first.fixtureVersion,first.requested)
  if(!row||row.id!==first.fixtureId)throw new Error('Unknown fixture.')
  return row
}
/** A stale command cannot accidentally advance two ticks. No transition is time driven. */
export function advance(run:Run,expectedSequence:number):Run{
  const last=tail(run)
  if(last.sequence!==expectedSequence)return run
  const row=source(run)
  switch(last.stage){
    case 'proposed':return append(run,row,{stage:'assessed',assessmentId:'AS-001',explanation:row.explanation})
    case 'assessed':return append(run,row,{stage:'evaluated',checks:row.checks})
    case 'evaluated':return append(run,row,{stage:'routed',route:row.route})
    case 'routed':
      if(last.route.kind==='request-review'){
        const script=reviewScript(row)
        return append(run,row,{stage:'waiting-for-human',requestId:'Q-001',mode:last.route.mode,reviewerAlias:script.reviewer,referralTarget:script.referral})
      }
      return append(run,row,{stage:'finalised',disposition:last.route,rationale:row.explanation})
    case 'finalised':return append(run,row,{stage:'recorded',finalDecisionSequence:last.sequence})
    default:return run
  }
}
/** A response is bound to the exact pending request, role, sequence and scope. */
export function respond(run:Run,expectedSequence:number,response:Response):Run{
  const last=tail(run)
  if(last.sequence!==expectedSequence||last.stage!=='waiting-for-human'||
    last.requestId!==response.requestId||last.reviewerAlias!==response.reviewerAlias||!response.rationale.trim())return run
  const accepts=last.mode==='bounded-confirmation'?'confirm':'approve'
  if(response.choice!==accepts&&response.choice!=='reject'&&!(response.choice==='refer'&&last.referralTarget))return run
  const row=source(run)
  const reviewed=append(run,row,{stage:'responded',response})
  if(response.choice==='refer'&&last.referralTarget)return append(reviewed,row,{
    stage:'waiting-for-human',mode:last.mode,requestId:'Q-002',reviewerAlias:last.referralTarget,referralTarget:null})
  return advanceToBoundary(append(reviewed,row,{stage:'finalised',
    disposition:{kind:response.choice==='reject'?'deny':'allow'},rationale:response.rationale}))
}
/** Reconstruct a separate history at its review/terminal boundary. Never appends to a session. */
export function reconstruct(input:ReplayInput):Run{
  const row=scenarios.find(s=>s.id===input.fixtureId&&s.version===input.version)
  if(!row)throw new Error('No scripted case.')
  let run=advanceToBoundary(startRun('REPLAY',row.version,row.input))
  for(const response of input.responses){
    const next=respond(run,tail(run).sequence,response)
    if(next===run)throw new Error('Response does not match the pending request.')
    run=next
  }
  return run
}
export function advanceToBoundary(run:Run):Run{
  let next=run
  for(;;){const updated=advance(next,tail(next).sequence);if(updated===next)return next;next=updated}
}
