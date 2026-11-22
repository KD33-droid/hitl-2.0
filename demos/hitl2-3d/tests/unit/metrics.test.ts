import { describe, expect, it } from 'vitest'
import type { Response } from '../../src/simulation/contracts'
import { tail } from '../../src/simulation/engine'
import { projectMetrics } from '../../src/simulation/metrics'
import { scenarios } from '../../src/simulation/scenarios'
import { emptySession, reduceSession, type Session } from '../../src/simulation/session'

function start(s:Session, id:string) {
  const fixture = scenarios.find(row=>row.id===id)!
  return reduceSession(s, {type:'start', version:fixture.version, input:fixture.input})
}
function move(s:Session, key:string, type:'continue'|'step'='continue') {
  return reduceSession(s, {key, type, sequence:tail(s.runs.find(r=>r.key===key)!).sequence})
}
function respond(s:Session, key:string, choice:Response['choice']) {
  const event = tail(s.runs.find(r=>r.key===key)!)
  if (event.stage!=='waiting-for-human') throw new Error('Expected an open request.')
  return reduceSession(s, {key, type:'review', sequence:event.sequence, response:{
    requestId:event.requestId, reviewerAlias:event.reviewerAlias, choice, rationale:'Reviewed example scope.',
  }})
}

describe('dashboard evidence projections', ()=>{
  it('starts with no evidence in any metric and categorises risk using the fixture conditions', ()=>{
    const m = projectMetrics(emptySession)
    for (const measure of [m.agents,m.risk,m.decisions,m.pending,m.responses,m.policies]) {
      expect(measure.items).toHaveLength(0)
      for (const bucket of measure.groups.values()) expect(bucket).toHaveLength(0)
    }
    expect(m.recent).toHaveLength(0)
    expect([...m.risk.groups.keys()]).toEqual([...new Set(scenarios.map(s=>s.input.condition))])
  })

  it('requires each source stage; a proposed condition or provisional route is not an assessment or decision', ()=>{
    let s = start(emptySession, 'preview-detail')
    const key = s.selected!
    expect(projectMetrics(s).agents.groups.get('report-agent')?.[0].event).toBe(s.runs[0].events[0])
    expect(projectMetrics(s).risk.items).toHaveLength(0)
    s = move(s, key, 'step')
    const assessment = projectMetrics(s).risk.groups.get('detail-requested')
    expect(assessment).toHaveLength(1)
    expect(assessment![0].event).toBe(s.runs[0].events[1])
    expect(assessment![0].related).toBe(s.runs[0].events[0])
    expect(projectMetrics(s).policies.items).toHaveLength(0)
    s = move(move(s, key, 'step'), key, 'step')
    expect(projectMetrics(s).decisions.items).toHaveLength(0)
    expect(projectMetrics(s).recent).toEqual([])
    expect(projectMetrics(s).policies.groups.get('fail')).toHaveLength(1)
    s = move(s, key, 'step')
    expect(projectMetrics(s).decisions.groups.get('restrict')?.[0].event).toBe(tail(s.runs[0]))
    s = move(s, key)
    expect(projectMetrics(s).decisions.items).toHaveLength(1)
    expect(projectMetrics(s).risk.items).toHaveLength(1)
    expect(projectMetrics(s).agents.items).toHaveLength(1)
  })

  it('keeps every equal-ID run distinct and orders decisions by their final events, not start, clock, selection or recording', ()=>{
    let s = start(start(emptySession, 'preview-aggregate'), 'preview-aggregate')
    const [first, second] = s.runs.map(r=>r.key)
    for (let i=0;i<4;i++) s = move(s, second, 'step') // Final but not yet recorded.
    s = move(s, first)
    s = move(s, second)
    const m = projectMetrics(s)
    expect(s.selected).toBe(second)
    expect(m.agents.items.map(ref=>ref.key)).toEqual([first, second])
    expect(m.decisions.groups.get('allow')?.map(ref=>ref.key)).toEqual([second, first])
    expect(m.recent.map(({key,event})=>[key,event.eventId])).toEqual([[first,'E-005'],[second,'E-005']])
    for (const ref of m.recent) expect(ref.event).toBe(s.runs.find(r=>r.key===ref.key)!.events[4])
  })

  it('counts open requests across runs, replaces a referred request and retains each response as separate evidence', ()=>{
    let s = start(start(emptySession, 'release-elevated'), 'release-bounded')
    const [a, b] = s.runs.map(r=>r.key)
    s = move(move(s, a), b)
    expect(projectMetrics(s).pending.items.map(ref=>[ref.key,ref.event.requestId])).toEqual([[a,'Q-001'],[b,'Q-001']])
    s = respond(s, a, 'refer')
    const referral = projectMetrics(s)
    expect(referral.pending.items.map(ref=>[ref.key,ref.event.requestId])).toEqual([[b,'Q-001'],[a,'Q-002']])
    expect(referral.responses.groups.get('refer')?.[0].related).toBe(s.runs[0].events[4])
    expect(referral.decisions.items).toHaveLength(0)
    s = respond(respond(s, b, 'confirm'), a, 'reject')
    const m = projectMetrics(s)
    expect(m.pending.items).toHaveLength(0)
    expect(m.responses.items.map(({key,event})=>[key,event.response.choice,event.sequence]))
      .toEqual([[a,'refer',6],[b,'confirm',6],[a,'reject',8]])
    expect(m.responses.groups.get('reject')?.[0].related).toBe(s.runs[0].events[6])
    expect(m.decisions.items.map(ref=>ref.category)).toEqual(['allow','deny'])
  })

  it('counts individual check results, including repeated results from one evaluation, with exact check-level references', ()=>{
    const s = move(start(emptySession, 'export-outside'), 'RUN-001')
    const run = s.runs[0]
    // A multi-check event exercises the contract beyond the current one-check fixtures.
    const events = run.events.map(e=>e.stage!=='evaluated' ? e : {...e, checks:[
      ...e.checks, {id:'second-check', result:'not-applicable' as const, reason:'Outside scope.'},
      {id:'third-check', result:'fail' as const, reason:'Destination unavailable.'},
    ]})
    const m = projectMetrics({...s, runs:[{...run, events}]})
    expect(m.policies.items).toHaveLength(3)
    expect(m.policies.groups.get('fail')?.map(ref=>ref.checkIndex)).toEqual([0,2])
    expect(m.policies.groups.get('not-applicable')?.map(ref=>ref.checkIndex)).toEqual([1])
    for (const ref of m.policies.items) {
      expect(ref.event).toBe(events[2])
      expect(ref.event.checks[ref.checkIndex!].result).toBe(ref.category)
    }
  })
})
