import React from "react";
import type {SupplementOptions} from "../ObjectTypes";
export const Scoop3D: React.FC<SupplementOptions> = ({fill=1}) => {
 const level=Math.max(0,Math.min(1,fill));
 return <group>
  <mesh position={[0,.035,0]}><cylinderGeometry args={[.22,.18,.07,32]}/><meshStandardMaterial color="#b8c8d6"/></mesh>
  <mesh position={[0,.13,0]}><cylinderGeometry args={[.23,.19,.2,32,1,true]}/><meshStandardMaterial color="#b8c8d6" side={2}/></mesh>
  <mesh position={[-.48,.18,0]}><boxGeometry args={[.56,.055,.13]}/><meshStandardMaterial color="#b8c8d6"/></mesh>
  {level>0 && <mesh position={[0,.07+.075*level,0]}><cylinderGeometry args={[.195,.175,.15*level,32]}/><meshStandardMaterial color="#fff8e8" roughness={1}/></mesh>}
 </group>;
};
