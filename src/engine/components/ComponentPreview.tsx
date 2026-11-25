import React,{useMemo,useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Box3,Group,Vector3} from 'three';
import {validateComponent,type Component3D} from './ComponentSchema';
import {validateAnimation,sampleAnimation} from './ComponentAnimation';
import {ComponentRenderer} from './ComponentRenderer';
const Model:React.FC<{component:Component3D;animated:Component3D;angle:number}>=({component,animated,angle})=>{
 const inner=useRef<Group>(null);const fit=useRef<Group>(null);
 useLayoutEffect(()=>{
  if(!inner.current||!fit.current)return;
  fit.current.scale.setScalar(1);inner.current.position.set(0,0,0);
  inner.current.updateWorldMatrix(true,true);
  // Measure in unrotated local coordinates using a temporary detached clone.
  const clone=inner.current.clone(true);clone.updateMatrixWorld(true);
  const bounds=new Box3().setFromObject(clone);const center=bounds.getCenter(new Vector3());const size=bounds.getSize(new Vector3());
  const extent=Math.max(size.x,size.y,size.z);if(!Number.isFinite(extent)||extent<=0)throw new Error('Invalid model bounds');
  inner.current.position.copy(center.negate());fit.current.scale.setScalar(3/extent);
 },[component]);
 return <group rotation={[0,angle,0]}><group ref={fit}><group ref={inner}><ComponentRenderer component={animated}/></group></group></group>;
};
export const ComponentPreview:React.FC<{component:unknown;animation?:unknown}>=({component,animation})=>{
 const model=useMemo(()=>validateComponent(component),[component]);const frame=useCurrentFrame();const {width,height,durationInFrames,fps}=useVideoConfig();
 const clip=useMemo(()=>animation===undefined?undefined:validateAnimation(animation,model),[animation,model]);const animated=clip?sampleAnimation(model,clip,frame/fps):model;
 return <AbsoluteFill style={{background:'#101827',color:'white',fontFamily:'Arial'}}><ThreeCanvas width={width} height={height} camera={{position:[0,0,8],fov:40}}><ambientLight intensity={1.1}/><directionalLight position={[4,6,5]} intensity={2.5}/><directionalLight position={[-4,1,-3]} intensity={1.4}/><Model component={model} animated={animated} angle={clip?0:frame/durationInFrames*Math.PI*2}/></ThreeCanvas><div style={{position:'absolute',top:70,left:40,right:40,textAlign:'center',fontSize:42,fontWeight:700}}>{model.name}</div></AbsoluteFill>;
};
