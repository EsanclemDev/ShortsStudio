import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Object3D } from "../../engine/objects/Object3D";
import { CinematicWorld } from "../../engine/environments/CinematicWorld";
import { CinematicLighting } from "../../engine/lighting/CinematicLighting";
import { CinematicCamera } from "../../engine/camera/CinematicCamera";

const ramp = (t: number, a: number, b: number) => interpolate(t,[a,b],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
const track = (t:number, times:number[], values:number[]) => interpolate(t,times,values,{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.inOut(Easing.cubic)});
export const SupplementDemo: React.FC = () => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const t=frame/fps;
 const jarOpen=ramp(t,.5,1.4);
 const shakerOpen=ramp(t,3.1,4.1)*(1-ramp(t,6.1,6.7));
 const times=[0,1.4,2,2.5,3.1,4.2,4.7,5.6,6.2,6.7];
 const x=track(t,times,[.05,.05,-.8,-.8,-.8,.85,.85,.85,.1,.1]);
 const y=track(t,times,[.75,.75,2.05,1.55,2.25,2.35,2.35,2.35,2.35,.75]);
 const z=track(t,times,[.55,.55,.05,.05,.05,.05,.05,.05,.55,.55]);
 const tilt=track(t,[0,4.2,4.7,5.6,6.2,8],[0,0,-1.85,-1.85,0,0]);
 const poured=ramp(t,4.7,5.6);
 const fill=ramp(t,2.4,2.9)*(1-poured);
 const shaking=ramp(t,6.7,7.0)*(1-ramp(t,7.7,8));
 return <AbsoluteFill style={{backgroundColor:"#071421"}}>
 <ThreeCanvas width={1080} height={1920} camera={{position:[0,2.8,8],fov:40,near:.1,far:100}}>
 <CinematicWorld preset="gym"/><CinematicLighting preset="gym"/>
 <CinematicCamera mode="static" target={[0,0,0]} startFrame={0} duration={8}/>
 <mesh position={[0,.65,0]}><boxGeometry args={[3.8,.15,1.65]}/><meshStandardMaterial color="#334155"/></mesh>
 <mesh position={[0,.3,0]}><boxGeometry args={[3.4,.6,1.35]}/><meshStandardMaterial color="#182231"/></mesh>
 <Object3D type="creatineJar" position={[-.8,.725,0]} options={{label:"CREATINA",open:jarOpen}}/>
 <Object3D type="shaker" position={[.85+Math.sin(t*36)*.12*shaking,.725+Math.abs(Math.sin(t*30))*.18*shaking,0]} rotation={[0,0,Math.sin(t*30)*.18*shaking]} options={{open:shakerOpen,fill:.5+.12*poured}}/>
 <Object3D type="scoop" position={[x,y,z]} rotation={[0,0,tilt]} scale={.65} options={{fill}}/>
 {Array.from({length:24},(_,i)=>{const age=t-(4.7+i*.9/24); if(age<0||age>.34)return null; return <mesh key={i} position={[.85+Math.sin(i*13)*.075,2.27-.48*(age/.34)**2,Math.cos(i*7)*.055]}><sphereGeometry args={[.016,6,6]}/><meshStandardMaterial color="#fff8e8"/></mesh>;})}
 </ThreeCanvas>
 <div style={{position:"absolute",top:160,left:60,right:60,textAlign:"center",fontFamily:"Arial",fontWeight:900,fontSize:76,color:"white",textShadow:"0 5px 15px black"}}>{t<1.4?"CREATINA":t<3.1?"RECOGER":t<4.7?"PREPARAR":t<6.1?"AÑADIR CREATINA":"MEZCLAR"}</div>
 </AbsoluteFill>;
};
