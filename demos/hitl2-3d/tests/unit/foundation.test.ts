import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe,it,expect } from 'vitest'
import { components,flow } from '../../src/catalogue'
import { resolveFixture,scenarios } from '../../src/simulation/scenarios'
describe('source-backed presentation catalogue',()=>{
  it('locates every cited repository file without shipping it to the browser',()=>{
    for(const c of components)for(const s of c.sources){
      expect(existsSync(resolve('../..',s.path)),s.path).toBe(true)
      expect(s.section.trim()).not.toEqual('')
    }
  })
  it('connects all five stations and returns the optional review to the decision point',()=>{
    expect(new Set(flow.flatMap(f=>[f.from,f.to]))).toEqual(new Set(components.map(c=>c.id)))
    expect(flow.map(f=>f.to)).toEqual(['risk','policy','agent','human','agent','audit'])
  })
})
describe('v1 synthetic fixture contract',()=>{
  it('resolves every supported input unambiguously and independently of lookup order',()=>{
    expect(new Set(scenarios.map(s=>JSON.stringify([s.version,s.input.action,s.input.condition]))).size).toBe(scenarios.length)
    for(const row of [...scenarios].reverse())expect(resolveFixture(row.version,{...row.input})).toEqual(row)
  })
  it('does not substitute another policy or fixture for an unsupported input/version',()=>{
    expect(resolveFixture('2.0.0',scenarios[0].input)).toBeUndefined()
    expect(resolveFixture('1.0.0',{action:'release',condition:'aggregate-only'})).toBeUndefined()
  })
  it('keeps review requests distinct from a final disposition and preserves L2/L3 scope',()=>{
    expect(resolveFixture('1.0.0',{action:'release',condition:'bounded-authorised'})?.route).toEqual({kind:'request-review',mode:'bounded-confirmation'})
    expect(resolveFixture('1.0.0',{action:'release',condition:'elevated-authority'})?.route).toEqual({kind:'request-review',mode:'elevated-approval'})
  })
})
