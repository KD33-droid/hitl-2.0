import type { CSSProperties } from 'react'
import { components, type NodeId } from './catalogue'
import { Icon } from './Icon'
const positions:Record<NodeId,[number,number]>={agent:[50,46],risk:[19,24],policy:[81,24],human:[19,78],audit:[81,78]}
const paths=['M 50 46 L 40 46 27 24 19 24','M 19 24 L 26 12 74 12 81 24','M 81 24 L 73 24 60 46 50 46','M 50 46 L 40 46 25 76 19 78','M 19 78 L 29 78 44 49 50 46','M 50 46 L 60 46 76 78 81 78']
const arrows=[[33.5,35,-120],[50,12,0],[66.5,35,120],[32.5,61,117],[36.5,63.5,-63],[68,62,63]]
export function MapView({selected,select,step}:{selected:NodeId;select:(id:NodeId)=>void;step:number}){
  return <div className="flat-map" aria-label="2D architecture map">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {paths.map((d,i)=><path key={d} d={d} fill="none" vectorEffect="non-scaling-stroke" strokeWidth={i===step?3.5:1.5} stroke={i===step?'#c1efff':i===3||i===4?'#b0834f':'#42778f'} strokeDasharray={i===3||i===4?'4 3':undefined}/>)}
      {arrows.map(([x,y,a],i)=><path key={i} transform={`translate(${x} ${y}) rotate(${a})`} d="m-1.25 -1.25 1.4 1.25-1.4 1.25" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="2" stroke={i===3||i===4?'#eac080':'#9bd9f0'}/>)}
    </svg>
    {components.map(c=><button key={c.id} style={{left:positions[c.id][0]+'%',top:positions[c.id][1]+'%','--node':c.color} as CSSProperties}
      aria-label={'Select '+c.name} aria-pressed={c.id===selected} className={'map-node '+(c.id===selected?'chosen':'')} onClick={()=>select(c.id)}>
      <span className="map-symbol"><Icon name={c.id} size={31}/></span><span><b>{c.number}</b> {c.short}</span></button>)}
  </div>
}
