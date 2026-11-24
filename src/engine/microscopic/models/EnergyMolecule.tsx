import React from "react";
import { MicroMaterial } from "../MicroMaterial";
export const EnergyMolecule: React.FC<{count:number; coreColor:string; activity?:number}> = ({count,coreColor,activity=0}) => <group>
 <mesh position={[-.55,0,0]}><sphereGeometry args={[.32,20,16]}/><MicroMaterial color={coreColor} activity={activity}/></mesh>
 {Array.from({length:count},(_,i)=><group key={i} position={[i*.48,0,0]}>
 <mesh position={[-.25,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.055,.055,.48,8]}/><MicroMaterial color="#cbd5e1"/></mesh>
 <mesh><sphereGeometry args={[.2,16,12]}/><MicroMaterial color="#fbbf24" activity={activity}/></mesh>
 </group>)}
 </group>;
