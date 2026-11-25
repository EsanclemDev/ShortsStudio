import {Vector3} from 'three';
import type {EntityConfig} from '../VideoTypes';
type Vec=[number,number,number];
export type Move={old:Vector3;now:Vector3;factor:number;entity:EntityConfig};
const isVec=(v:unknown):v is Vec=>Array.isArray(v)&&v.length===3&&v.every(x=>typeof x==='number');
export function nearest(point:Vec,moves:Move[]){return [...moves].sort((a,b)=>a.old.distanceToSquared(new Vector3(...point))-b.old.distanceToSquared(new Vector3(...point)))[0];}
export function relocate(e:EntityConfig,moves:Move[]){const anchor=e.props.target??e.props.position??e.props.from;if(!isVec(anchor)||!moves.length)return undefined;const m=nearest(anchor,moves);const transform=(v:Vec)=>new Vector3(...v).sub(m.old).multiplyScalar(m.factor).add(m.now).toArray();
for(const key of ['position','target','from','to']){if(isVec(e.props[key]))e.props[key]=transform(e.props[key]);for(const t of e.tracks??[])if(t.property===key)for(const k of t.keyframes)if(isVec(k.value))k.value=transform(k.value);}
for(const key of ['radius','size','thickness']){if(typeof e.props[key]==='number')e.props[key]=(e.props[key] as number)*m.factor;for(const t of e.tracks??[])if(t.property===key)for(const k of t.keyframes)if(typeof k.value==='number')k.value*=m.factor;}
if(isVec(e.props.spread))e.props.spread=e.props.spread.map(v=>v*m.factor);for(const t of e.tracks??[])if(t.property==='spread')for(const k of t.keyframes)if(isVec(k.value))k.value=k.value.map(v=>v*m.factor) as Vec;
return m.entity.id;}
