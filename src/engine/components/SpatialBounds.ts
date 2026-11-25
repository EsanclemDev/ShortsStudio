import {Box3, Vector3, Matrix4, Euler, Quaternion, SphereGeometry, BoxGeometry, CylinderGeometry, CapsuleGeometry, TorusGeometry} from 'three';
import {createAdvancedGeometry} from './AdvancedGeometry';
import type {Component3D} from './ComponentSchema';
import {sampleAnimation, validateAnimation, type ComponentAnimation} from './ComponentAnimation';
type Part=Component3D['parts'][number];
type Vec=[number,number,number];
export function partGeometry(g:Part['geometry']) {
 switch(g.type){
 case 'sphere':return new SphereGeometry(g.radius,32,24);
 case 'box':return new BoxGeometry(...g.size);
 case 'cylinder':return new CylinderGeometry(g.radiusTop,g.radiusBottom,g.height,32);
 case 'capsule':return new CapsuleGeometry(g.radius,g.length,8,24);
 case 'torus':return new TorusGeometry(g.radius,g.tube,16,48);
 default:return createAdvancedGeometry(g);
 }
}
function localBounds(c:Component3D){return new Map(c.parts.map(p=>{const g=partGeometry(p.geometry);try{g.computeBoundingBox();return [p.id,g.boundingBox!.clone()] as const;}finally{g.dispose();}}));}
function measure(c:Component3D,boxes:Map<string,Box3>){
 const parts=new Map(c.parts.map(p=>[p.id,p]));const matrices=new Map<string,Matrix4>();
 function matrix(p:Part):Matrix4{const cached=matrices.get(p.id);if(cached)return cached;const m=new Matrix4().compose(new Vector3(...p.position),new Quaternion().setFromEuler(new Euler(...p.rotation)),new Vector3(...p.scale));if(p.parentId)m.premultiply(matrix(parts.get(p.parentId)!));matrices.set(p.id,m);return m;}
 const result=new Box3();for(const p of c.parts)result.union(boxes.get(p.id)!.clone().applyMatrix4(matrix(p)));return result;
}
export function describeBounds(b:Box3){const size=b.getSize(new Vector3());const center=b.getCenter(new Vector3());const maxDimension=Math.max(size.x,size.y,size.z);if(b.isEmpty()||![...b.min.toArray(),...b.max.toArray(),maxDimension].every(Number.isFinite)||maxDimension<1e-8)throw new Error('Invalid spatial bounds');return {min:b.min.toArray() as Vec,max:b.max.toArray() as Vec,size:size.toArray() as Vec,center:center.toArray() as Vec,ground:[center.x,b.min.y,center.z] as Vec,maxDimension};}
export function componentBounds(c:Component3D){return describeBounds(measure(c,localBounds(c)));}
export function animationBounds(c:Component3D,raw:ComponentAnimation,samplesPerSecond=15){
 const a=validateAnimation(raw,c);if(!Number.isFinite(samplesPerSecond)||samplesPerSecond<1||samplesPerSecond>60)throw new Error('Invalid sampling rate');const boxes=localBounds(c);const count=Math.ceil(a.duration*samplesPerSecond);const times=new Set(Array.from({length:count+1},(_,i)=>i*a.duration/count));for(const track of a.tracks)for(const k of track.keyframes)times.add(k.time);const bounds=new Box3();for(const t of times)bounds.union(measure(sampleAnimation(c,a,t),boxes));return {...describeBounds(bounds),samples:times.size,approximate:true as const};
}
export type SpatialBounds=ReturnType<typeof componentBounds>;
