import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, CameraControlsImpl } from '@react-three/drei/core/CameraControls.js'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { byId, components, flow, type NodeId } from '../catalogue'
import { layout, type CameraCommand, type Point } from './layout'
import { Ring, Station, LightPool } from './Modules'

type Props={selected:NodeId;select:(id:NodeId)=>void;command:CameraCommand;step:number;playing:boolean;reduced:boolean;onFailure:()=>void}
const floorVertex=`varying vec3 w; void main(){vec4 p=modelMatrix*vec4(position,1.);w=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`
const floorFragment=`varying vec3 w;
void main(){
 vec2 v=w.xz; float d=length(v);
 vec2 grid=abs(fract(v/.52-.5)-.5)/fwidth(v/.52);
 float line=1.-min(min(grid.x,grid.y),1.);
 float fade=exp(-.012*d*d);
 float wash=exp(-.13*dot(v-vec2(0.,-.1),v-vec2(0.,-.1)));
 vec3 c=mix(vec3(.025,.044,.068),vec3(.074,.126,.175),fade);
 c+=vec3(.024,.095,.15)*wash;
 c+=vec3(.044,.077,.099)*line*fade;
 gl_FragColor=vec4(c, 1.-smoothstep(8.,18.,d));
}`
function Ground(){
  const dots=useMemo(()=>{
    let s=17
    const rand=()=>{s=(s*48271)%2147483647;return s/2147483647}
    return new Float32Array(Array.from({length:160},()=>[(rand()-.5)*26,rand()*5-.04,(rand()-.6)*22]).flat())
  },[])
  return <>
    <mesh rotation-x={-Math.PI/2} position-y={-.09}><planeGeometry args={[48,48]}/><shaderMaterial vertexShader={floorVertex} fragmentShader={floorFragment} transparent depthWrite={false}/></mesh>
    <group position-y={-.055}>
      {[2.02,2.15,4.94,5.04,6.53].map((r,i)=><Ring key={r} r={r} color={i===0?'#305d77':'#223949'} thick={.008}/>)}
      {[0,1,2,3].map(i=><Ring key={i} r={6.57} color="#496072" thick={.015} arc={.48} start={i*Math.PI/2+.25}/>)}
    </group>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[dots,3]}/></bufferGeometry><pointsMaterial color="#7297b6" size={.023} transparent opacity={.60}/></points>
  </>
}
function Path({points,color,width=.014}:{points:Point[];color:string;width?:number}){
  const path=useMemo(()=>{
    const curve=new THREE.CurvePath<THREE.Vector3>()
    const v=points.map(p=>new THREE.Vector3(...p))
    for(let i=1;i<v.length;i++)curve.add(new THREE.LineCurve3(v[i-1],v[i]))
    return curve
  },[points])
  return <mesh><tubeGeometry args={[path,Math.max(points.length*8,30),width,5,false]}/><meshBasicMaterial color={color}/></mesh>
}
const routes:Point[][]=[
  [[0,.08,-.1],[-1.96,.08,-.1],[-3.15,.08,-1.4],[-3.15,.08,-2.5],[-4.45,.08,-2.5]],
  [[-4.45,.08,-2.5],[-3.25,.08,-3.7],[3.25,.08,-3.7],[4.45,.08,-2.5]],
  [[4.45,.08,-2.5],[3.15,.08,-2.5],[3.15,.08,-1.4],[1.96,.08,-.1],[0,.08,-.1]],
  [[0,.08,-.1],[-1.62,.08,1.52],[-2.35,.08,1.52],[-3.7,.08,2.95]],
  [[-3.7,.08,2.95],[-2.2,.08,1.68],[-1.45,.08,1.68],[0,.08,-.1]],
  [[0,.08,-.1],[1.62,.08,1.52],[2.35,.08,1.52],[3.7,.08,2.95]]
]
function Packet({step,playing,reduced}:{step:number;playing:boolean;reduced:boolean}){
  const ref=useRef<THREE.Mesh>(null)
  const elapsed=useRef(0)
  const invalidate=useThree(s=>s.invalidate)
  const path=useMemo(()=>{
    const p=new THREE.CurvePath<THREE.Vector3>(),v=routes[step].map(x=>new THREE.Vector3(...x))
    for(let i=1;i<v.length;i++)p.add(new THREE.LineCurve3(v[i-1],v[i]))
    return p
  },[step])
  useLayoutEffect(()=>{elapsed.current=0;invalidate()},[step,invalidate])
  useFrame((_,dt)=>{
    if(!ref.current)return
    if(playing&&!reduced){elapsed.current+=Math.min(dt,.1);invalidate()}
    ref.current.position.copy(path.getPointAt(reduced?.5:(elapsed.current/1.8)%1))
    ref.current.position.y+=.08
  })
  return <mesh ref={ref}><sphereGeometry args={[.084,12,8]}/><meshBasicMaterial color={step===3||step===4?'#ffe0a1':'#c4f8ff'}/></mesh>
}
function Wires({step,playing,reduced}:Pick<Props,'step'|'playing'|'reduced'>){
  return <>{routes.map((points,i)=>{
    const v=new THREE.Vector3(...points[1]),w=new THREE.Vector3(...points[2])
    const mid=v.clone().lerp(w,.53);mid.y+=.02
    const angle=Math.atan2(w.x-v.x,w.z-v.z)
    const color=i===step?(i===3||i===4?'#ffcb78':'#9eefff'):(i===3||i===4?'#957245':'#447991')
    return <group key={i}><Path points={points} color={color} width={i===step?.034:.019}/>
      <group position={mid} rotation-y={angle}><Path points={[[-.1,0,-.1],[0,0,.07],[.1,0,-.1]]} color={color} width={.023}/></group>
    </group>
  })}{step>=0&&<Packet step={step} playing={playing} reduced={reduced}/>}</>
}
function CameraRig({command,reduced}:{command:CameraCommand;reduced:boolean}){
  const ref=useRef<CameraControlsImpl>(null)
  const {camera,size,invalidate}=useThree()
  const zoom=Math.min(size.width/14,size.height/7.5)
  useLayoutEffect(()=>{
    const c=ref.current
    if(!c)return
    c.minZoom=zoom*.6;c.maxZoom=zoom*3
    c.setLookAt(0,10.3,15.2,0,.57,0,false);c.zoomTo(zoom,false);invalidate()
  },[zoom,invalidate])
  useEffect(()=>{
    const c=ref.current;if(!c||!command.serial)return
    const smooth=!reduced,p=layout[command.target]
    if(command.kind==='overview'){c.setLookAt(0,10.3,15.2,0,.57,0,smooth);c.zoomTo(zoom,smooth)}
    else if(command.kind==='inspect'){c.setLookAt(p[0]+2.4,8,p[2]+13,p[0],1,p[2],smooth);c.zoomTo(zoom*1.73,smooth)}
    else c.zoomTo(THREE.MathUtils.clamp((camera as THREE.OrthographicCamera).zoom*(command.kind==='in'?1.23:1/1.23),c.minZoom,c.maxZoom),smooth)
    invalidate()
  },[command,camera,reduced,zoom,invalidate])
  return <CameraControls ref={ref} makeDefault minPolarAngle={.28} maxPolarAngle={1.28} smoothTime={.26} draggingSmoothTime={.12}/>
}
// Keep the label buttons in the ordinary DOM tree. Project their anchors at
// render time (after camera-controls updates), including the very first frame.
type Labels=RefObject<Partial<Record<NodeId,HTMLButtonElement>>>
function ProjectLabels({labels}:{labels:Labels}){
  const v=useMemo(()=>new THREE.Vector3(),[])
  useFrame(({camera,size})=>{
    for(const c of components){
      const el=labels.current[c.id]
      if(!el)continue
      v.set(...layout[c.id]);v.y=-.01;v.z+=c.id==='agent'?1.98:1.36
      v.project(camera)
      el.style.transform=`translate(${(v.x+1)*size.width/2}px,${(1-v.y)*size.height/2}px) translate(-50%,-50%)`
      el.style.visibility=Math.abs(v.x)>1||Math.abs(v.y)>1||Math.abs(v.z)>1?'hidden':'visible'
    }
  })
  return null
}
function Contents(props:Props&{labels:Labels}){
  const {gl,scene,invalidate}=useThree()
  useLayoutEffect(()=>{
    const room=new RoomEnvironment(),generator=new THREE.PMREMGenerator(gl)
    const reflections=generator.fromScene(room,.03,.1,100,{size:64})
    scene.environment=reflections.texture;scene.environmentIntensity=.53
    room.dispose();generator.dispose();invalidate()
    return ()=>{scene.environment=null;reflections.dispose()}
  },[gl,scene,invalidate])
  useEffect(()=>{
    const el=gl.domElement
    const lost=(e:Event)=>{e.preventDefault();props.onFailure()}
    el.addEventListener('webglcontextlost',lost)
    return ()=>el.removeEventListener('webglcontextlost',lost)
  },[gl,props.onFailure])
  return <>
    <hemisphereLight args={['#daefff','#44536a',1.72]}/>
    <directionalLight position={[-5,9,4]} color="#ccf3ff" intensity={3.2}/>
    <directionalLight position={[4,3,-6]} color="#4d9fff" intensity={3.8}/>
    <pointLight position={[-3.7,2,3]} color="#ffc275" intensity={6}/>
    <Ground/><Wires {...props}/><ProjectLabels labels={props.labels}/>
    {components.map(c=><group key={c.id} position={layout[c.id]}>
      <group onClick={e=>{if(e.delta>5)return;e.stopPropagation();props.select(c.id)}}
        onPointerOver={e=>{e.stopPropagation();gl.domElement.style.cursor='pointer'}} onPointerOut={()=>{gl.domElement.style.cursor='grab'}}>
        <Station id={c.id} color={c.color}/>
      </group>
      <LightPool color={c.color} core={c.id==='agent'}/>
      {props.selected===c.id&&<Ring r={c.id==='agent'?1.77:1.25} y={-.025} color={c.color} thick={.018} arc={5.6} start={.5}/>}
    </group>)}
    <CameraRig command={props.command} reduced={props.reduced}/>
  </>
}
export default function Scene(props:Props){
  const labels=useRef<Partial<Record<NodeId,HTMLButtonElement>>>({})
  return <div className="scene-root"><Canvas orthographic camera={{position:[0,10.3,15.2],zoom:55,near:.1,far:100}} dpr={[1,1.6]}
    frameloop="demand" gl={{antialias:true,alpha:true,powerPreference:'low-power'}} aria-label={`Interactive spatial architecture: ${byId[props.selected].name}${props.step>=0?', '+flow[props.step].label:''}`}>
    <Contents {...props} labels={labels}/>
  </Canvas>{components.map(c=><button key={c.id} className={'scene-label '+(props.selected===c.id?'chosen':'')}
    ref={el=>{if(el)labels.current[c.id]=el}}
    style={{borderColor:props.selected===c.id?c.color:undefined}}
    onClick={()=>props.select(c.id)} aria-pressed={props.selected===c.id} aria-label={'Select '+c.name}>
    <b style={{color:c.color}}>{c.number}</b>{c.short}</button>)}</div>
}
