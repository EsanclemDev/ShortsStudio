import React from "react";
import {Box,type Vec3} from "./GymParts";
export const GymMirror: React.FC<{position: Vec3}> = ({position}) => <group position={position}>
  <Box position={[0,0,0]} size={[2.55,2.05,0.09]} color="#4b6478" metalness={0.5}/>
  <mesh position={[0,0,0.055]}><planeGeometry args={[2.4,1.9]}/><meshBasicMaterial color="#344c60"/></mesh>
  <mesh position={[-0.55,0,0.06]} rotation={[0,0,-0.35]}><planeGeometry args={[0.16,1.75]}/><meshBasicMaterial color="#8298a9" transparent opacity={0.16} depthWrite={false}/></mesh>
</group>;
