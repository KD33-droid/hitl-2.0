import type { ScenarioCase, ScenarioInput } from './contracts'
const fixed = { version:'1.0.0', origin:'synthetic-fixture', agentId:'report-agent' } as const
export const scenarios: readonly ScenarioCase[] = [
  {...fixed,id:'preview-aggregate',input:{action:'preview',condition:'aggregate-only'},explanation:'The example request is already limited to the aggregate view.',
    checks:[{id:'example-view-scope',result:'pass',reason:'Aggregate view requested.'}],route:{kind:'allow'}},
  {...fixed,id:'preview-detail',input:{action:'preview',condition:'detail-requested'},explanation:'The requested detail exceeds the example display scope.',
    checks:[{id:'example-view-scope',result:'fail',reason:'Only aggregate preview is provided in this case.'}],route:{kind:'restrict',alternative:'aggregate-only preview'}},
  {...fixed,id:'export-outside',input:{action:'export',condition:'outside-example-scope'},explanation:'The named destination is outside this case’s scope.',
    checks:[{id:'example-destination',result:'fail',reason:'The fixture supplies no alternative destination.'}],route:{kind:'deny'}},
  {...fixed,id:'release-bounded',input:{action:'release',condition:'bounded-authorised'},explanation:'A specific release within authorised scope is presented for L2 confirmation.',
    checks:[{id:'example-review-path',result:'pass',reason:'Bounded confirmation path specified by this row.'}],route:{kind:'request-review',mode:'bounded-confirmation'}},
  {...fixed,id:'release-elevated',input:{action:'release',condition:'elevated-authority'},explanation:'This example release needs explicit L3 approval from a privileged human.',
    checks:[{id:'example-review-path',result:'pass',reason:'Elevated approval path specified by this row.'}],route:{kind:'request-review',mode:'elevated-approval'}}
]
export function resolveFixture(version:string,input:ScenarioInput){
  if(!input||Object.keys(input).length!==2||!Object.hasOwn(input,'action')||!Object.hasOwn(input,'condition'))return undefined
  return scenarios.find(c=>c.version===version&&c.input.action===input.action&&c.input.condition===input.condition)
}

/** Demo-only review staging for these exact v1 cases; no change to their routes. */
export const reviewScript = (row:ScenarioCase) => {
  if(row.version==='1.0.0'&&row.id==='release-bounded')return {reviewer:'Scope reviewer', referral:null}
  if(row.version==='1.0.0'&&row.id==='release-elevated')return {reviewer:'Privileged reviewer',referral:'Second privileged reviewer'}
  throw new Error('No reviewer script for this fixture.')
}
