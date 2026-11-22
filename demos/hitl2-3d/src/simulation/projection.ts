import type { Run,RunEvent } from './contracts'
export function project(run:Run){
  const events=run.events, last=events[events.length-1], proposal=events[0]
  if(proposal.stage!=='proposed')throw new Error('Missing proposal.')
  const assessment=events.find(e=>e.stage==='assessed'),evaluation=events.find(e=>e.stage==='evaluated')
  const provisional=events.find(e=>e.stage==='routed'),final=events.find(e=>e.stage==='finalised')
  const reviews=events.filter(e=>e.stage==='responded')
  const pending=last.stage==='waiting-for-human'?last:undefined
  return {proposal,assessment,evaluation,provisional,final,reviews,pending,last,
    status:final?.disposition.kind??(pending?'Pending review':'In progress')}
}
export const stageTitle:Record<RunEvent['stage'],string>={
  proposed:'Action proposal',assessed:'Risk assessment',evaluated:'Policy evaluation',routed:'Provisional decision',
  'waiting-for-human':'Review requested',responded:'Human intervention',finalised:'Final disposition',recorded:'Audit event recorded'
}
export function eventText(e:RunEvent){
  switch(e.stage){
    case 'proposed':return `${e.agentId} requested ${e.requested.action} · ${e.requested.condition}.`
    case 'assessed':return e.explanation
    case 'evaluated':return e.checks.map(c=>`${c.id}: ${c.result}. ${c.reason}`).join(' ')
    case 'routed':return e.route.kind==='request-review'?`Request ${e.route.mode}.`:e.route.kind==='restrict'?`Restrict to ${e.route.alternative}.`:`Scripted route: ${e.route.kind}.`
    case 'waiting-for-human':return `${e.requestId} → ${e.reviewerAlias} (synthetic role).`
    case 'responded':return `${e.response.reviewerAlias} (synthetic role): ${e.response.choice}. ${e.response.rationale}`
    case 'finalised':return `${e.disposition.kind}${e.disposition.kind==='restrict'?`: ${e.disposition.alternative}`:''}. ${e.rationale}`
    case 'recorded':return `References final disposition at event ${e.finalDecisionSequence}.`
  }
}
