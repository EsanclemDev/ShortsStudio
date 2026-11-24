import React from "react";
import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";
export const MuscleFiber3D: React.FC<MicroModelProps> = ({color="#c83e59",activity=0}) => {
 const a=Math.max(0,Math.min(1,activity));
 return <group scale={[1-.22*a,1+.12*a,1+.12*a]}>
 {Array.from({length:7},(_,i)=> <group key={i} position={[0, i===0?0:Math.cos(i*Math.PI/3)*.22,i===0?0:Math.sin(i*Math.PI/3)*.22]} rotation={[0,0,Math.PI/2]}>
 <mesh><capsuleGeometry args={[.115,2.8,4,12]}/><MicroMaterial color={color} activity={a}/></mesh>
 {Array.from({length:12},(_,j)=><mesh key={j} position={[0,-1.32+j*.24,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.116,.024,6,16]}/><MicroMaterial color={j%2?"#f38a9a":"#85263e"}/></mesh>)}
 </group>)}
 </group>;
};
