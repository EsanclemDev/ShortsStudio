import React from 'react';
import {resolveFrame} from '../timeline/TimelineEngine';
import {ENTITY_REGISTRY} from '../registry/EntityRegistry';
import {EntityRenderer} from './EntityRenderer';
export const OverlayRenderer:React.FC<{state:ReturnType<typeof resolveFrame>;fps:number}>=({state,fps})=>{
 const entities=state.entities.filter(e=>ENTITY_REGISTRY[e.type].layer==='screen');
 const render=(e:typeof entities[number])=><EntityRenderer key={e.id} entity={e} fps={fps} sceneDuration={state.durationInFrames}/>;
 const groups=new Map<string,typeof entities>();
 for(const e of entities)if(e.group)groups.set(e.group,[...(groups.get(e.group)??[]),e]);
 return <>{entities.filter(e=>!e.group).map(e=>{const node=render(e);if(e.layout)return <div key={e.id} style={{position:'absolute',display:'flex',...e.layout}}>{node}</div>;if(e.type==='text')return <div key={e.id} style={{position:'absolute',top:180,left:75,right:75}}>{node}</div>;return e.type==='repCounter'||e.type==='energyMeter'?<div key={e.id} style={{position:'absolute',bottom:480,left:90,right:90,display:'flex'}}>{node}</div>:<React.Fragment key={e.id}>{node}</React.Fragment>;})}{Array.from(groups,([id,items])=><div key={id} style={{position:'absolute',bottom:480,left:90,right:90,display:'flex',gap:24,...items[0].layout}}>{items.map(e=><div key={e.id} style={{flex:1,minWidth:0,display:'flex'}}>{render(e)}</div>)}</div>)}</>;
};
