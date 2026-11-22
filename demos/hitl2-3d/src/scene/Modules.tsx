import { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei/core/Edges.js'
import type { NodeId } from '../catalogue'

const tau=Math.PI*2
// Procedural radial light, shared by all stations. No bloom pass or HDR download.
let lightTexture:THREE.CanvasTexture|undefined
function radialTexture(){
  if(lightTexture)return lightTexture
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128
  const ctx=canvas.getContext('2d')!
  const gradient=ctx.createRadialGradient(64,64,0,64,64,64)
  for(const [at,alpha] of [[0,.94],[.22,.62],[.5,.19],[.8,.035],[1,0]])gradient.addColorStop(at,`rgba(255,255,255,${alpha})`)
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128)
  lightTexture=new THREE.CanvasTexture(canvas)
  return lightTexture
}
export function LightPool({color,core}:{color:string;core:boolean}){
  const map=useMemo(radialTexture,[])
  return <>
    <mesh rotation-x={-Math.PI/2} position-y={-.06} renderOrder={1}>
      <planeGeometry args={core?[6,6]:[3.6,3.6]}/>
      <meshBasicMaterial color={color} map={map} blending={THREE.AdditiveBlending} transparent opacity={core?.42:.32} depthWrite={false}/>
    </mesh>
    {core&&<sprite position-y={1.7} scale={[4.9,4.9,1]} renderOrder={2}>
      <spriteMaterial map={map} color="#48c8ff" transparent blending={THREE.AdditiveBlending} opacity={.27} depthWrite={false}/>
    </sprite>}
  </>
}
export function Ring({r,y=0,color,thick=.013,arc=tau,start=0}:{r:number;y?:number;color:string;thick?:number;arc?:number;start?:number}){
  return <group position-y={y} rotation-y={start}><mesh rotation-x={Math.PI/2}><torusGeometry args={[r,thick,6,arc<4?32:84,arc]}/><meshBasicMaterial color={color}/></mesh></group>
}
function Disk({r,y,h,color,segments=48}:{r:number;y:number;h:number;color:string;segments?:number}){
  return <mesh position-y={y}><cylinderGeometry args={[r,r*.97,h,segments]}/><meshStandardMaterial color={color} metalness={.46} roughness={.36}/></mesh>
}
// One batched line geometry for the fine instrument markings around each station.
function Ticks({r,n,y,color}:{r:number;n:number;y:number;color:string}){
  const positions=useMemo(()=>new Float32Array(Array.from({length:n},(_,i)=>{
    const a=tau*i/n, r2=r+(i%5===0?.13:.055)
    return [r*Math.cos(a),y,r*Math.sin(a),r2*Math.cos(a),y,r2*Math.sin(a)]
  }).flat()),[r,n,y])
  return <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><lineBasicMaterial color={color}/></lineSegments>
}
function Base({color,core}:{color:string;core:boolean}){
  const s=core?1.5:1
  return <group scale={[s,1,s]}>
    <Disk r={1.06} y={.015} h={.14} color="#0b1723" segments={16}/>
    <Disk r={1.0} y={.13} h={.13} color="#334760" segments={16}/>
    <Ring r={.94} y={.20} color={color} thick={.022}/>
    <Disk r={.94} y={.26} h={.12} color="#172a3c"/>
    <Disk r={.80} y={.35} h={.07} color="#425875"/>
    <Disk r={.70} y={.402} h={.05} color="#0b1d2e"/>
    <Ring r={.66} y={.433} color={color} thick={.009}/>
    <Ticks r={.80} y={.326} n={60} color="#8197aa"/>
    <Ring r={1.18} y={-.04} color={core?'#399dbd':'#354b65'} thick={.008}/>
    {[0,1,2,3].map(i=><Ring key={i} r={1.1} y={.01} color={color} start={i*tau/4+.15} arc={.43} thick={.017}/>)}
  </group>
}
function Nucleus(){
  return <group position-y={1.71}>
    <mesh rotation={[.13,.66,.12]}><icosahedronGeometry args={[.78,0]}/><meshPhysicalMaterial color="#51b6da" emissive="#085372" emissiveIntensity={.45} metalness={.27} roughness={.18} clearcoat={1} flatShading/><Edges color="#bbf6ff" threshold={5}/></mesh>
    <mesh rotation={[.16,.06,.2]}><icosahedronGeometry args={[1.02,0]}/><meshBasicMaterial color="#80dbff" wireframe/></mesh>
    <mesh rotation={[.16,.06,.2]}><icosahedronGeometry args={[1.04,0]}/><meshBasicMaterial color="#2a8cc2" transparent opacity={.07} depthWrite={false}/></mesh>
    {[[0,.1,-.27],[-.74,-.3,.8]].map(([x,y,z],i)=><group rotation={[x,y,z]} key={i}>
      <Ring r={1.28-i*.09} color={i?'#6acef1':'#b3f2ff'} thick={i?.012:.022} arc={5.0} start={i*2}/>
      <Ring r={1.32-i*.09} color="#326d90" thick={.012}/>
      <mesh position-x={1.28-i*.09}><sphereGeometry args={[.065,12,8]}/><meshBasicMaterial color="#d1f9ff"/></mesh>
    </group>)}
    {[0,1,2].map(i=><Ring key={i} r={.46+i*.14} y={-1.14+i*.13} color={i===0?'#a9edff':'#4596ba'} thick={.012}/>)}
  </group>
}
function Sensor(){
  return <group position-y={.48}>
    {[0,1,2].map(i=><group key={i} position-y={i*.22} rotation-y={Math.PI*.25}>
      <mesh><cylinderGeometry args={[.81-i*.07,.86-i*.07,.11,4]}/><meshStandardMaterial color={i===2?'#456991':'#243b58'} roughness={.33} metalness={.4}/><Edges color="#8eb2ee"/></mesh>
    </group>)}
    <group position-y={.96}>
      <mesh><icosahedronGeometry args={[.41,1]}/><meshStandardMaterial color="#769ed4" metalness={.38} roughness={.26} flatShading/></mesh>
      <mesh><icosahedronGeometry args={[.46,1]}/><meshBasicMaterial color="#bfd4ff" wireframe/></mesh>
      <Ring r={.66} color="#accfff" thick={.016} arc={5.2}/>
      <group rotation-z={.56}><Ring r={.59} color="#578dd2" thick={.013}/></group>
    </group>
  </group>
}
function Gate(){
  const shield=useMemo(()=>new THREE.Shape().moveTo(-.5,.57).lineTo(0,.72).lineTo(.5,.57).lineTo(.48,-.09).quadraticCurveTo(.4,-.41,0,-.7).quadraticCurveTo(-.4,-.42,-.48,-.09).closePath(),[])
  return <group position-y={1.25} rotation-y={-.39}>
    {[-.42,-.08,.27].map((z,i)=><mesh key={i} position-z={z} position-y={i*.035}>
      <extrudeGeometry args={[shield,{depth:.08,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:1}]}/>
      <meshStandardMaterial color={['#122f43','#155169','#26677e'][i]} roughness={.28} metalness={.45}/><Edges color="#89e2f6" threshold={30}/>
    </mesh>)}
    <mesh position={[0,.05,.39]} rotation-z={Math.PI/4}><boxGeometry args={[.33,.33,.035]}/><meshStandardMaterial color="#9ef5ff" emissive="#5fb5ce" emissiveIntensity={.6}/></mesh>
    <mesh position={[0,.05,.42]} rotation-z={Math.PI/4}><boxGeometry args={[.16,.16,.02]}/><meshBasicMaterial color="#26657a"/></mesh>
  </group>
}
function Oversight(){
  return <group position-y={.42}>
    <Ring r={.5} y={.11} color="#ffce7d" thick={.018}/>
    <mesh position-y={.42} scale={[.61,.42,.34]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#b37e3c" emissive="#a46122" emissiveIntensity={.26} metalness={.33} roughness={.4} flatShading/><Edges color="#f5c781" threshold={10}/></mesh>
    <mesh position-y={.94} scale={[.3,.37,.29]}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#ebbc74" roughness={.36} metalness={.23} flatShading/><Edges color="#ffd992" threshold={12}/></mesh>
    {[0,1].map(i=><Ring key={i} r={.7+i*.08} y={.43+i*.44} color={i?'#b68b55':'#d7a65e'} start={i*1.7} arc={4.9} thick={.009}/>)}
  </group>
}
function Archive(){
  return <group rotation-y={.52} position-y={.57}>
    {[0,1,2].map(i=><group key={i} position-y={i*.29}>
      <mesh><boxGeometry args={[1.13,.23,.88]}/><meshStandardMaterial color={['#2e425a','#3f546d','#586e8a'][i]} metalness={.45} roughness={.32}/><Edges color="#94afd1"/></mesh>
      <mesh position={[-.11,0,.448]}><boxGeometry args={[.66,.045,.01]}/><meshBasicMaterial color="#93bce9"/></mesh>
      <mesh position={[.41,0,.45]}><boxGeometry args={[.08,.055,.015]}/><meshBasicMaterial color="#cbebff"/></mesh>
    </group>)}
    <mesh position-y={.72}><boxGeometry args={[.77,.025,.56]}/><meshStandardMaterial color="#6986a4"/><Edges color="#c9def7"/></mesh>
  </group>
}
export function Station({id,color}:{id:NodeId;color:string}){
  return <><Base core={id==='agent'} color={color}/>{id==='agent'?<Nucleus/>:id==='risk'?<Sensor/>:id==='policy'?<Gate/>:id==='human'?<Oversight/>:<Archive/>}</>
}
