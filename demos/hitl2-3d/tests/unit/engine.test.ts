import { expect,it } from 'vitest'
import { startRun,advance,advanceToBoundary,respond,reconstruct,tail } from '../../src/simulation/engine'
import { emptySession,reduceSession } from '../../src/simulation/session'
import { scenarios } from '../../src/simulation/scenarios'
import { project } from '../../src/simulation/projection'
import type { Run,Response } from '../../src/simulation/contracts'
it('completes the aggregate preview and records the exact final decision event',()=>{
  const input={action:'preview',condition:'aggregate-only'} as const
  const run=advanceToBoundary(startRun('run-001','1.0.0',input))
  expect(run.events.map(e=>e.stage)).toEqual(['proposed','assessed','evaluated','routed','finalised','recorded'])
  expect(run.events[4]).toMatchObject({sequence:5,disposition:{kind:'allow'}})
  expect(tail(run)).toMatchObject({sequence:6,finalDecisionSequence:5,logicalUtc:'2000-01-01T00:00:05.000Z'})
  expect(advanceToBoundary(startRun('run-002','1.0.0',input)).events).toEqual(run.events)
})
const boundary=(id:string)=>{
  const row=scenarios.find(s=>s.id===id)!
  return advanceToBoundary(startRun('RUN-001',row.version,row.input))
}
const response=(run:Run,choice:Response['choice']):Response=>{
  const q=project(run).pending!
  return {requestId:q.requestId,reviewerAlias:q.reviewerAlias,choice,rationale:'Checked the requested scope.'}
}
it.each([['preview-aggregate','allow'],['preview-detail','restrict'],['export-outside','deny'],['release-bounded','Pending review'],['release-elevated','Pending review']])('%s stops at %s with contiguous deterministic IDs',(id,status)=>{
  const run=boundary(id)
  expect(project(run).status).toBe(status)
  expect(run.events.map(e=>e.sequence)).toEqual(run.events.map((_,i)=>i+1))
  expect(new Set(run.events.map(e=>e.eventId)).size).toBe(run.events.length)
  if(status==='restrict')expect(project(run).final?.disposition).toEqual({kind:'restrict',alternative:'aggregate-only preview'})
  expect(advanceToBoundary(run)).toBe(run)
})
it('rejects unsupported starts before creating a record or emitting events',()=>{
  expect(()=>startRun('bad','1.0.0',{action:'export',condition:'aggregate-only'})).toThrow('No scripted case')
  expect(()=>startRun('bad','unknown',scenarios[0].input)).toThrow('No scripted case')
  const extra={...scenarios[0].input,authority:'unknown'}
  expect(()=>startRun('bad','1.0.0',extra)).toThrow('No scripted case')
  const existing=reduceSession(emptySession,{type:'start',version:'1.0.0',input:scenarios[1].input})
  expect(reduceSession(existing,{type:'start',version:'1.0.0',input:extra})).toBe(existing)
})
it.each([['release-bounded','confirm','allow'],['release-elevated','approve','allow'],['release-elevated','reject','deny'],['release-bounded','reject','deny']] as const)('%s: %s produces one %s disposition, then closes review',(id,choice,expected)=>{
  const pending=boundary(id),r=response(pending,choice),seq=tail(pending).sequence,done=respond(pending,seq,r)
  expect(tail(done).stage).toBe('recorded')
  expect(project(done)).toMatchObject({status:expected,pending:undefined})
  expect(project(done).reviews).toHaveLength(1)
  expect(respond(done,seq,r)).toBe(done)
  expect(respond(done,tail(done).sequence,r)).toBe(done)
  expect(reconstruct({fixtureId:id,version:'1.0.0',responses:[r]}).events).toEqual(done.events)
})
it('preserves pending review for stale, out-of-scope, wrong-role and unsupported referral inputs',()=>{
  const pending=boundary('release-bounded'),seq=tail(pending).sequence,ok=response(pending,'confirm')
  for(const bad of [{choice:'refer'},{choice:'approve'},{reviewerAlias:'other'},{requestId:'unknown'},{rationale:'  '}] as const)
    expect(respond(pending,seq,{...ok,...bad})).toBe(pending)
  expect(respond(pending,seq-1,ok)).toBe(pending)
  expect(advance(pending,seq)).toBe(pending)
})
it('a referral replaces the open request; re-submitting the old response cannot resolve the new one',()=>{
  const initial=boundary('release-elevated'),ref=response(initial,'refer')
  const pending=respond(initial,tail(initial).sequence,ref)
  expect(project(pending)).toMatchObject({status:'Pending review',pending:{requestId:'Q-002',referralTarget:null,mode:'elevated-approval'}})
  expect(project(pending).final).toBeUndefined()
  expect(respond(pending,tail(pending).sequence,ref)).toBe(pending)
  expect(respond(pending,tail(pending).sequence,response(pending,'refer'))).toBe(pending)
  const ok=response(pending,'approve'),done=respond(pending,tail(pending).sequence,ok)
  expect(done.events.map(e=>e.stage)).toEqual(['proposed','assessed','evaluated','routed','waiting-for-human','responded','waiting-for-human','responded','finalised','recorded'])
  expect(reconstruct({fixtureId:'release-elevated',version:'1.0.0',responses:[ref,ok]}).events).toEqual(done.events)
})
it('scopes history and duplicate guards to the addressed run; session ordinal is outside replay identity',()=>{
  let state=emptySession
  for(let i=0;i<2;i++)state=reduceSession(state,{type:'start',version:'1.0.0',input:scenarios[0].input})
  expect(state.runs[0].events).toEqual(state.runs[1].events)
  const cmd={type:'step',key:'RUN-001',sequence:1} as const
  const next=reduceSession(state,cmd)
  expect(next.order.map(i=>i.key)).toEqual(['RUN-001','RUN-002','RUN-001'])
  expect(reduceSession(next,cmd)).toBe(next)
  expect(next.runs[1]).toBe(state.runs[1])
})
