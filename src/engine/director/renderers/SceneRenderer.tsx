import React from 'react';
import {AbsoluteFill,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CinematicWorld} from '../../environments/CinematicWorld';
import {CinematicLighting} from '../../lighting/CinematicLighting';
import {ConfiguredCamera} from './ConfiguredCamera';
import {TransitionEngine} from '../../transitions/TransitionEngine';
import {resolveFrame} from '../timeline/TimelineEngine';
import {ENTITY_REGISTRY} from '../registry/EntityRegistry';
import {EntityRenderer} from './EntityRenderer';
import {OverlayRenderer} from './OverlayRenderer';
export const SceneRenderer:React.FC<{state:ReturnType<typeof resolveFrame>}>=({state})=>{
 const {width,height,fps}=useVideoConfig();
 return <TransitionEngine config={state.scene.transition} startFrame={0}><AbsoluteFill>
 <ThreeCanvas width={width} height={height} camera={{position:[0,2.8,8],fov:40,near:.1,far:100}}>
 <CinematicWorld preset={state.scene.environment}/><CinematicLighting preset={state.scene.environment}/>
 <ConfiguredCamera config={state.scene.camera} time={state.localFrame/fps} duration={state.durationInFrames/fps}/>
 {state.entities.filter(e=>ENTITY_REGISTRY[e.type].layer==='world').map(e=><EntityRenderer key={e.id} entity={e} fps={fps} sceneDuration={state.durationInFrames}/>)}
 </ThreeCanvas><OverlayRenderer state={state} fps={fps}/></AbsoluteFill></TransitionEngine>;
};
