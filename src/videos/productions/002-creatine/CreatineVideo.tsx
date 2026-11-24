import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, interpolate, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Character3D} from '../../../engine/characters/Character3D';
import {CinematicWorld} from '../../../engine/environments/CinematicWorld';
import {CinematicLighting} from '../../../engine/lighting/CinematicLighting';
import {ContactShadow} from '../../../engine/lighting/ContactShadow';
import {Object3D} from '../../../engine/objects/Object3D';
import {MuscleFiber3D} from '../../../engine/microscopic/models/MuscleFiber3D';
import {ATP3D} from '../../../engine/microscopic/models/ATP3D';
import {ADP3D} from '../../../engine/microscopic/models/ADP3D';
import {Phosphocreatine3D} from '../../../engine/microscopic/models/Phosphocreatine3D';
import {MicroMaterial} from '../../../engine/microscopic/MicroMaterial';
import {RepCounter} from '../../../engine/effects/screen/RepCounter';
import {CharacterComparison} from '../../../engine/effects/screen/CharacterComparison';
import rawCaptions from './captions.json';
export const CREATINE_DURATION = 1560;
const green = {shirtColor:'#22c55e',shortsColor:'#334155',shoeColor:'#ffffff',hairColor:'#75452c',hairStyle:'short' as const};
const leftWorkout={reps:8,period:3.5,fail:true};
const rightWorkout={reps:9,period:3.5,fail:false};
const offset=28-33.52; // global animation clock: eighth repetition completes at 33.52s
const range={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ramp=(t:number,a:number,b:number)=>interpolate(t,[a,b],[0,1],range);
const track=(t:number,times:number[],values:number[])=>interpolate(t,times,values,{...range,easing:Easing.inOut(Easing.cubic)});
const words=rawCaptions.flatMap((w,i,a)=>{
 if(w.text==='fosfo' && a[i+1]?.text==='creatina,') return [{...w,text:'fosfocreatina,',endMs:a[i+1].endMs}];
 if(w.text==='creatina,' && a[i-1]?.text==='fosfo') return [];
 if(w.startMs===45620) return [{...w,text:'masa',endMs:45940}];
 if(w.startMs===45820) return [];
 return [{...w,text:w.startMs===48460?'sustituye':w.startMs===49180?'al':w.text}];
});
const Camera:React.FC<{micro:boolean;t:number}>=({micro,t})=>{
 const {camera,invalidate}=useThree();
 useLayoutEffect(()=>{camera.position.set(0,micro?2.1:2.8,micro?10-1.1*Math.sin(Math.PI*ramp(t,19.9,21.66)):8);camera.lookAt(0,micro?2.1:1.7,0);camera.updateMatrixWorld();invalidate();},[camera,invalidate,micro,t]);return null;
};
const Supplement:React.FC<{t:number}>=({t})=>{
 const jarOpen=ramp(t,.5,1.4),shakerOpen=ramp(t,3.1,4.1)*(1-ramp(t,6.1,6.7));
 const times=[0,1.4,2,2.5,3.1,4.2,4.7,5.6,6.2,6.7];
 const x=track(t,times,[.05,.05,-.8,-.8,-.8,.85,.85,.85,.1,.1]);
 const y=track(t,times,[.75,.75,2.05,1.55,2.25,2.35,2.35,2.35,2.35,.75]);
 const z=track(t,times,[.55,.55,.05,.05,.05,.05,.05,.05,.55,.55]);
 const tilt=track(t,[0,4.2,4.7,5.6,6.2,8],[0,0,-1.85,-1.85,0,0]);
 const poured=ramp(t,4.7,5.6),fill=ramp(t,2.4,2.9)*(1-poured),shaking=ramp(t,6.7,7)*(1-ramp(t,7.7,8));
 return <><mesh position={[0,.65,0]}><boxGeometry args={[3.8,.15,1.65]}/><meshStandardMaterial color="#334155"/></mesh><mesh position={[0,.3,0]}><boxGeometry args={[3.4,.6,1.35]}/><meshStandardMaterial color="#182231"/></mesh><Object3D type="creatineJar" position={[-.8,.725,0]} options={{label:'CREATINA',open:jarOpen}}/><Object3D type="shaker" position={[.85+Math.sin(t*36)*.12*shaking,.725+Math.abs(Math.sin(t*30))*.18*shaking,0]} rotation={[0,0,Math.sin(t*30)*.18*shaking]} options={{open:shakerOpen,fill:.5+.12*poured}}/><Object3D type="scoop" position={[x,y,z]} rotation={[0,0,tilt]} scale={.65} options={{fill}}/>{Array.from({length:24},(_,i)=>{const age=t-(4.7+i*.9/24);return age<0||age>.34?null:<mesh key={i} position={[.85+Math.sin(i*13)*.075,2.27-.48*(age/.34)**2,Math.cos(i*7)*.055]}><sphereGeometry args={[.016,6,6]}/><meshStandardMaterial color="#fff8e8"/></mesh>;})}</>;
};
const Muscle:React.FC<{t:number}>=({t})=>{
 const p=ramp(t,25.38,27.06),activity=Math.pow(Math.sin(t*Math.PI),2);
 return <>{[0,1,2].map(i=><group key={i} position={[0,2.9+i*.48,-.5]}><MuscleFiber3D activity={activity}/></group>)}{t>=12.84&&<group position={[-.25,1.65,0]}>{t<17.22||t>=27.06?<ATP3D activity={.5}/>:<ADP3D/>}</group>}{t>=17.22&&t<18.54&&<mesh position={[1.1,1.65-(t-17.22)*.3,0]}><sphereGeometry args={[.2,16,12]}/><MicroMaterial color="#fbbf24"/></mesh>}{t>=23.9&&<group position={[-.25,.65,0]}>{t<25.38?<Phosphocreatine3D/>:<mesh position={[-.55,0,0]}><sphereGeometry args={[.32,20,16]}/><MicroMaterial color="#a78bfa"/></mesh>}</group>}{t>=25.38&&t<27.06&&<mesh position={[-.25+.96*p,.65+p,0]}><sphereGeometry args={[.2,16,12]}/><MicroMaterial color="#fbbf24" activity={1}/></mesh>}</>;
};
export const CreatineVideo:React.FC=()=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=frame/fps;
 const supplement=t>=3.9&&t<8.26,micro=t>=8.26&&t<28.66,comparison=t>=28.66&&t<40.04,progress=t>=40.04&&t<46.74;
 const growth=progress?ramp(t,41.28,45.44):t>=46.74?1:0;
 const hook=t>=19.9&&t<21.66;
 const hookOpacity=Math.min(ramp(t,19.9,20.1),1-ramp(t,21.4,21.66));
 const active=words.findIndex(w=>t*1000>=w.startMs&&t*1000<w.endMs);const last=words.reduce((n,w,i)=>w.startMs<=t*1000?i:n,0);const base=Math.floor((active<0?last:active)/3)*3;
 const energy=interpolate(t,[12.84,17.22,21.66,25.38,27.06],[100,100,35,35,100],range);
 return <AbsoluteFill style={{background:'#071421',fontFamily:'Arial',color:'white'}}><Audio src={staticFile('audio/voice/creatine.mp3')}/><ThreeCanvas width={width} height={height} camera={{position:[0,2.8,8],fov:40,near:.1,far:100}}><Camera micro={micro} t={t}/><CinematicWorld preset={micro?'microscopic':'gym'}/><CinematicLighting preset={micro?'microscopic':'gym'}/>{supplement?<Supplement t={(t-3.9)*8/4.36}/>:micro?<Muscle t={t}/>:<><Character3D position={[-1.05,0,0]} size={2.7} appearance={{muscularity:.25*growth}} action={progress?'flex':t>=46.74?'thumbsUp':'bicepsCurl'} workout={comparison?leftWorkout:undefined} animationOffset={comparison?offset:0}/><Character3D position={[1.05,0,0]} size={2.7} appearance={{...green,muscularity:.8*growth}} action={progress?'flex':t>=46.74?'thumbsUp':'bicepsCurl'} workout={comparison?rightWorkout:undefined} animationOffset={comparison?offset:0}/><ContactShadow position={[-1.05,.015,0]} size={1.5} opacity={.6}/><ContactShadow position={[1.05,.015,0]} size={1.5} opacity={.6}/></>}</ThreeCanvas>{comparison&&<><CharacterComparison bottom={1530} left={<RepCounter workout={leftWorkout} animationOffset={offset} color="#ef4444" label="SIN CREATINA"/>} right={<RepCounter workout={rightWorkout} animationOffset={offset} label="CON CREATINA"/>}/></>}{micro&&t>=12.84&&<div style={{position:'absolute',bottom:480,left:120,right:140,textAlign:'center',fontSize:34}}>Disponibilidad energética ilustrativa<div style={{height:24,marginTop:18,background:'#334155',borderRadius:20,overflow:'hidden'}}><div style={{height:'100%',width:`${energy}%`,background:energy<55?'#ef4444':'#22c55e'}}/></div></div>}{hook&&<div style={{position:'absolute',top:200,left:75,right:75,textAlign:'center',fontSize:65,fontWeight:900,lineHeight:1.08,opacity:hookOpacity,textShadow:'0 4px 12px black',transform:`scale(${.92+.08*ramp(t,19.9,20.15)})`}}>¿Y SI RECUPERAS<br/>ESA ENERGÍA<br/><span style={{color:'#fde047'}}>MÁS RÁPIDO?</span></div>}{hook&&<AbsoluteFill style={{pointerEvents:'none',boxShadow:`inset 0 0 150px rgba(239,68,68,${.45*hookOpacity})`}}/>}<div style={{position:'absolute',bottom:265,left:65,right:125,textAlign:'center',fontSize:72,fontWeight:900,lineHeight:1.12,textShadow:'0 4px 8px black, 0 0 8px black'}}>{words.slice(base,base+3).map((w,i)=><React.Fragment key={w.startMs}><span style={{color:base+i===active?'#fde047':'white'}}>{w.text.toUpperCase()}</span>{' '}</React.Fragment>)}</div></AbsoluteFill>;
};
