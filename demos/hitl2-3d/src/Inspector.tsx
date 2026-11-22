import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { ComponentRecord } from './catalogue'
import { Icon } from './Icon'
import type { RunEvent } from './simulation/contracts'
import { eventText,stageTitle } from './simulation/projection'
export function Inspector({node,focus,spatial,evidence}:{node:ComponentRecord;focus:()=>void;spatial:boolean;evidence?:RunEvent}){
  const [tab,setTab]=useState<'profile'|'sources'>('profile')
  return <aside id="inspector" className="inspector panel" aria-label="Component inspector" style={{'--node':node.color} as CSSProperties}>
    <div className="bar"><h2><Icon name="panels" size={16}/> Component inspector</h2><span className="live-dot"/></div>
    <div className="identity">
      <div className="node-stamp"><Icon name={node.id} size={27}/></div>
      <div><div className="micro">NODE / {node.number}</div><span className="role">{node.role}</span></div>
      <div className="id-watermark" aria-hidden="true">{node.number}</div>
    </div>
    <div className="inspector-name"><h3>{node.name}</h3><span className="badge"><i/> Proposed architecture</span> <span className="repo-badge">Repo: {node.id==='policy'||node.id==='human'?'namespace only':'placeholder'}</span></div>
    <div className="tabs" aria-label="Inspector sections"><button aria-pressed={tab==='profile'} onClick={()=>setTab('profile')}>Profile</button><button aria-pressed={tab==='sources'} onClick={()=>setTab('sources')}>Sources <small>{node.sources.length}</small></button></div>
    <div className="inspector-body">
      {tab==='profile'?<>
        {evidence&&<div className="node-evidence"><div className="micro">{evidence.eventId} / SYNTHETIC EVENT</div><b>{stageTitle[evidence.stage]}</b><p>{eventText(evidence)}</p></div>}
        <h4>Responsibility</h4><p>{node.description}</p>
        <h4><Icon name="input" size={14}/> Inputs</h4><div className="tags">{node.inputs.map(str=><span key={str}>{str}</span>)}</div>
        <h4><Icon name="output" size={14}/> Outputs</h4><div className="tags">{node.outputs.map(str=><span key={str}>{str}</span>)}</div>
        <details key={node.id}><summary>Dependencies &amp; boundaries</summary><p>{node.dependencies}</p><strong>Repository implementation</strong><p>{node.implementation}</p><strong>Demo depiction</strong><p>{node.illustration}</p></details>
      </>:<>
        <h4>Repository evidence</h4><p>{node.implementation}</p>
        {node.sources.map(s=><div className="source" key={s.path}><code>{s.path}</code><b>{s.section}</b><p>{s.note}</p></div>)}
        <h4>Demo depiction</h4><p>{node.illustration}</p>
      </>}
    </div>
    {spatial&&<div className="inspector-foot"><button className="focus-btn" onClick={focus}><Icon name="focus" size={15}/> Focus component <Icon name="next" size={15}/></button></div>}
  </aside>
}
