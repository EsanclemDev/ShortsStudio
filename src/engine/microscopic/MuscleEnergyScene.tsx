import React from "react";
import { useCurrentFrame,useVideoConfig,interpolate } from "remotion";
import { MuscleFiber3D } from "./models/MuscleFiber3D";
import { ATP3D } from "./models/ATP3D";
import { ADP3D } from "./models/ADP3D";
import { Phosphocreatine3D } from "./models/Phosphocreatine3D";
import { MicroMaterial } from "./MicroMaterial";
export const MuscleEnergyScene: React.FC = () => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig(); const t=f/fps;
 const p=interpolate(t,[5,6.5],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const activity=t<3?Math.pow(Math.sin(t*Math.PI),2):0;
 return <>
 {[0,1,2].map(i=><group key={i} position={[0,2.9+i*.48,-.5]}><MuscleFiber3D activity={activity}/></group>)}
 <group position={[-.25,1.65,0]}>{t<3||t>=6.5?<ATP3D activity={.5}/>:<ADP3D/>}</group>
 {t>=3&&t<5&&<mesh position={[1.1,1.65-(t-3)*.3,0]}><sphereGeometry args={[.2,16,12]}/><MicroMaterial color="#fbbf24"/></mesh>}
 {t>=4&&<group position={[-.25,.65,0]}>{t<5?<Phosphocreatine3D/>:<mesh position={[-.55,0,0]}><sphereGeometry args={[.32,20,16]}/><MicroMaterial color="#a78bfa"/></mesh>}</group>}
 {t>=5&&t<6.5&&<mesh position={[-.25+.96*p,.65+p,0]}><sphereGeometry args={[.2,16,12]}/><MicroMaterial color="#fbbf24" activity={1}/></mesh>}
 </>;
};
