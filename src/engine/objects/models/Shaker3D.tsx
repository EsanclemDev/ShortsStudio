import React from "react";
import type {SupplementOptions} from "../ObjectTypes";
export const Shaker3D: React.FC<SupplementOptions> = ({fill=.55,open=0}) => {
 const level=Math.max(0,Math.min(1,fill));
 return <group>
  <mesh position={[0,.05,0]}><cylinderGeometry args={[.29,.27,.1,40]}/><meshStandardMaterial color="#334155"/></mesh>
  {level>0 && <mesh position={[0,.1+level*.48,0]}><cylinderGeometry args={[.255+.055*level,.255,.96*level,40]}/><meshStandardMaterial color="#b9e6ef" roughness={.35}/></mesh>}
  <mesh position={[0,.58,0]} renderOrder={2}><cylinderGeometry args={[.34,.28,1.04,40,1,true]}/><meshStandardMaterial color="#a8d9eb" transparent opacity={.27} depthWrite={false} side={2}/></mesh>
  <group position={[open*.8,1.13+open*.18,-open*.2]} rotation={[0,0,-open*.4]}>
   <mesh><cylinderGeometry args={[.35,.35,.15,40]}/><meshStandardMaterial color="#22c55e"/></mesh>
   <mesh position={[.12,.13,0]}><cylinderGeometry args={[.11,.13,.13,24]}/><meshStandardMaterial color="#172331"/></mesh>
  </group>
 </group>;
};
