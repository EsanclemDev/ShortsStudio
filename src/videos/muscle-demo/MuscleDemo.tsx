import React from "react";
import { AbsoluteFill,useCurrentFrame,useVideoConfig,interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CinematicWorld } from "../../engine/environments/CinematicWorld";
import { CinematicLighting } from "../../engine/lighting/CinematicLighting";
import { MuscleEnergyScene } from "../../engine/microscopic/MuscleEnergyScene";
export const MuscleDemo: React.FC = () => {
 const frame=useCurrentFrame(); const {fps,width,height}=useVideoConfig(); const t=frame/fps;
 const energy=interpolate(t,[0,3,5,6.5,8],[100,35,35,100,100],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const title=t<3?"CONTRACCIÓN MUSCULAR":t<4?"ATP → ADP + Pi":t<6.5?"REGENERACIÓN DE ATP":"ATP REGENERADO";
 return <AbsoluteFill style={{backgroundColor:"#100b24",fontFamily:"Arial",color:"white"}}>
 <ThreeCanvas width={width} height={height} camera={{position:[0,2.1,10],fov:40,near:.1,far:100}}>
 <CinematicWorld preset="microscopic"/><CinematicLighting preset="microscopic"/><MuscleEnergyScene/>
 </ThreeCanvas>
 <div style={{position:"absolute",top:140,left:60,right:60,textAlign:"center",fontSize:68,fontWeight:900}}>{title}</div>
 <div style={{position:"absolute",bottom:260,left:100,right:100,fontSize:36,textAlign:"center"}}>
 {t<3?"ATP disponible":t<4?"El ATP se hidroliza durante el esfuerzo":t<6.5?"La fosfocreatina transfiere un fosfato al ADP":"ATP listo para otro ciclo"}
 <div style={{marginTop:30,height:30,borderRadius:15,background:"#334155",overflow:"hidden"}}><div style={{width:`${energy}%`,height:"100%",background:"#22c55e"}}/></div>
 <div style={{fontSize:25,marginTop:15}}>Disponibilidad energética ilustrativa · no a escala</div>
 </div>
 </AbsoluteFill>;
};
