import React,{useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {CinematicCamera} from '../../camera/CinematicCamera';
import type {VideoConfig} from '../VideoTypes';
import {sampleTrack} from '../timeline/KeyframeEngine';
type Camera=NonNullable<VideoConfig['scenes'][number]['camera']>;
const Manual:React.FC<{position:[number,number,number];target:[number,number,number]}>=({position,target})=>{
 const {camera,invalidate}=useThree();
 useLayoutEffect(()=>{camera.position.set(...position);camera.lookAt(...target);camera.updateMatrixWorld();invalidate();},[camera,invalidate,position,target]);
 return null;
};
export const ConfiguredCamera:React.FC<{config?:Camera;time:number;duration:number}>=({config,time,duration})=>{
 const position=config?.position??[0,2.8,8];
 const target=config?.lookAt??[0,1.7,0];
 if(config?.position||config?.lookAt||config?.tracks?.length){
 const sample=(key:string,fallback:[number,number,number])=>{
 const track=config.tracks?.find(t=>t.property===key);
 return track?sampleTrack(track,time) as [number,number,number]:fallback;
 };
 return <Manual position={sample('position',position)} target={sample('lookAt',target)}/>;
 }
 return <CinematicCamera mode={config?.mode} target={config?.target} duration={config?.duration??duration}/>;
};
