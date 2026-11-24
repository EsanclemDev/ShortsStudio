import React from "react";
import {Box,Dumbbell,type Vec3} from "./GymParts";
export const DumbbellRack: React.FC<{position: Vec3}> = ({position}) => <group position={position}>
  {[-1.3,1.3].map(x=><Box key={x} position={[x,0.65,0]} size={[0.12,1.3,0.65]} color="#526170" metalness={0.4}/>)}
  {[0.48,1.05].map((y,row)=><group key={y}><Box position={[0,y,0]} size={[2.8,0.1,0.62]} color="#344352"/>{Array.from({length:5},(_,i)=><Dumbbell key={i} position={[(i-2)*0.52,y+0.19,0]} scale={0.72+row*0.1+i*0.045}/>)}</group>)}
</group>;
