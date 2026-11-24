import React from "react";
import {Box, type Vec3} from "./GymParts";
export const GymBench: React.FC<{position: Vec3; rotation?: number}> = ({position,rotation=0}) => <group position={position} rotation={[0,rotation,0]}>
  <Box position={[0,0.62,0]} size={[0.55,0.15,1.65]} color="#202630"/>
  <Box position={[0,0.49,0]} size={[0.18,0.12,1.4]} color="#687583" metalness={0.5}/>
  {[-0.58,0.58].map(z=><group key={z}><Box position={[0,0.26,z]} size={[0.13,0.52,0.13]} color="#687583" metalness={0.5}/><Box position={[0,0.07,z]} size={[0.85,0.12,0.22]} color="#343e48"/></group>)}
</group>;
