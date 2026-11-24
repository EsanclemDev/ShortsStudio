import React,{useMemo,useEffect} from "react";
import * as THREE from "three";
import {Box} from "./GymParts";
import {GymBench} from "./GymBench";
import {DumbbellRack} from "./DumbbellRack";
import {WeightRack} from "./WeightRack";
import {GymMirror} from "./GymMirror";
const GymFloor: React.FC = () => {
  const texture=useMemo(()=>{
    const canvas=document.createElement("canvas"); canvas.width=canvas.height=512;
    const ctx=canvas.getContext("2d"); if(!ctx) throw new Error("Cannot create gym floor");
    ctx.fillStyle="#141b22";ctx.fillRect(0,0,512,512);
    for(let x=0;x<4;x++) for(let y=0;y<4;y++) {ctx.fillStyle=(x+y)%2===0?"#29323b":"#252e37";ctx.fillRect(x*128+1,y*128+1,126,126);}
    let seed=42;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<6500;i++){ctx.fillStyle=i%3===0?"rgba(180,195,210,0.13)":"rgba(0,0,0,0.18)";ctx.fillRect(random()*512,random()*512,1+random()*2,1+random()*2);}
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);t.anisotropy=4;return t;
  },[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={[0,-0.02,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[20,20]}/><meshStandardMaterial map={texture} roughness={0.95} metalness={0.02}/></mesh>;
};
export const GymEnvironment: React.FC = () => <group>
  <GymFloor/>
  <Box position={[0,2.7,-4.7]} size={[18,5.4,0.25]} color="#202d3a"/>
  <Box position={[0,0.15,-4.5]} size={[18,0.3,0.15]} color="#111923"/>
  {[-5.4,-2.7,0,2.7,5.4].map(x=><GymMirror key={x} position={[x,2.65,-4.48]}/>)}
  <mesh position={[0,4.05,-4.43]}><boxGeometry args={[17,0.055,0.06]}/><meshBasicMaterial color="#46cbe8"/></mesh>
<DumbbellRack position={[0, 0, -3.65]} />
  <GymBench position={[-2.8,0,-1.8]} rotation={0.25}/>
  <GymBench position={[2.8,0,-1.8]} rotation={-0.25}/>
  <WeightRack position={[-4.5,0,-3.3]}/>
  <WeightRack position={[4.5,0,-3.3]}/>
</group>;
