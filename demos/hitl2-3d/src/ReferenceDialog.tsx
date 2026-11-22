import { useEffect, useRef } from 'react'
import { scenarios } from './simulation/scenarios'
import { Icon } from './Icon'
export type ReferencePage='notes'|'fixtures'
export function ReferenceDialog({page,close}:{page:ReferencePage;close:()=>void}){
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{const el=ref.current;el?.showModal();return ()=>el?.close()},[])
  return <dialog ref={ref} aria-labelledby="dialog-title" onCancel={close} onClick={e=>{if(e.target===ref.current)close()}}>
    <article><header><span className="micro">HITL 2.0 / REFERENCE</span><button className="icon-btn" onClick={close} aria-label="Close reference"><Icon name="close"/></button></header>
      <h2 id="dialog-title">{page==='notes'?'Research notes':'Scenario fixtures'}</h2>
      {page==='notes'?<>
        <p>This explorer depicts the proposed HITL 2.0 architecture. The five objects group responsibilities for a walkthrough; they are not five implemented services.</p>
        <h3>Two architectural descriptions</h3><p>The <code>README.md</code> follows a proposal through the control plane. WM1 describes zones Z1–Z5: agent ecosystem, control plane, supporting services, trust/infrastructure and human stakeholders. Their formal crosswalk is open for WM2.</p>
        <h3>Repository status</h3><p>Typed placeholders, dataset ingestion and tests exist. Risk scoring, policy composition, approval routing and audit integrity are unresolved. Advisory and enforced governance are alternatives; the explorer selects neither.</p>
        <h3>Autonomy convention</h3><ol className="levels">{['Full autonomy','Human monitoring','Confirmation of a bounded, already-authorised action','Explicit privileged approval for elevated authority','Human control / override'].map((x,i)=><li key={x}><b>L{i}</b>{x}</li>)}</ol>
        <p className="citation">Sources: <code>docs/research/research-status.md</code> · <code>docs/research/workstreams/ws1-threat-model/system-characterization.md §§1–3</code></p>
      </>:<>
        <p>Version 1.0.0 · Five synthetic case rows drive the decision simulator. Each describes a single input combination. These are authored examples, not inferred policies or research measurements.</p>
        {scenarios.map(s=><section className="fixture" key={s.id}><span className="micro">{s.id}</span><h3>{s.input.action} <span>/ {s.input.condition}</span></h3><p>{s.explanation}</p><small>{s.checks[0].id}: {s.checks[0].result} · Scripted route: {s.route.kind}</small></section>)}
      </>}
    </article>
  </dialog>
}
