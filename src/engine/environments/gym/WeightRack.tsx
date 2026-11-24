import React from "react";
import {Box,type Vec3} from "./GymParts";
export const WeightRack: React.FC<{position: Vec3}> = ({position}) => <group position={position}>
  <Box position={[0,0.08,0]} size={[1.05,0.16,0.65]} color="#465565"/>
  <Box position={[0,0.8,0]} size={[0.14,1.6,0.14]} color="#657585" metalness={0.5}/>
  {[0.42,1.05].map((y,i)=><group key={y}>{[-1,1].map(side=><group key={side} position={[side*0.27,y,0]}><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.045,0.045,0.55,12]}/><meshStandardMaterial color="#a3b2c1" metalness={0.6}/></mesh>{[0,1].map(j=><mesh key={j} position={[side*(0.03+j*0.12),0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[i===0?0.23:0.16,0.065,8,24]}/><meshStandardMaterial color={j===0?"#29333e":"#455565"} roughness={0.8}/></mesh>)}</group>)}</group>)}
</group>;
