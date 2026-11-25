import {Box3,Vector3,Matrix4,Quaternion,Euler,PerspectiveCamera} from 'three';
import {inspectComponent} from '../../components/ComponentNormalizer';
import {validateVideo} from '../VideoValidator';
import {resolveProps} from '../timeline/PropertyResolver';
import type {EntityConfig} from '../VideoTypes';
type Vec=[number,number,number];
const vec=(v:unknown,f:Vec):Vec=>Array.isArray(v)?v as Vec:f;
const num=(v:unknown,f:number)=>typeof v==='number'?v:f;
const box=(min:Vec,max:Vec)=>new Box3(new Vector3(...min),new Vector3(...max));
const primary=new Set(['generated','character','object','anatomy','micro','primitive','liquid','osmosis']);
function times(e:EntityConfig,duration:number){const d=(e.end??duration)-(e.start??0);const n=Math.min(600,Math.max(1,Math.ceil(d*15)));return [...new Set([...Array.from({length:n+1},(_,i)=>i*d/n),...(e.tracks??[]).flatMap(t=>t.keyframes.map(k=>k.time))])];}
export function local(e:EntityConfig){const p=e.props;if(e.type==='generated'){const r=inspectComponent(p.component,p.animationId?p.animation:undefined);const b=r.motion??r.rest;const n=r.centered;e.props.normalization={scale:n.scale,offset:n.offset};return box(b.min,b.max);}
 if(e.type==='character')return box([-.46,-.16,-.12],[.46,1.08,.12]);
 if(e.type==='object'&&p.type==='apple')return box([-.65,-.15,-.65],[.65,1.35,.65]);
 if(e.type==='object'&&p.type==='sugarCube')return box([-.5,-.15,-.5],[.5,.85,.5]);
 if(e.type==='primitive'){const d=p.shape==='box'?vec(p.dimensions,[1,1,1]).map(v=>Math.abs(v)/2) as Vec:Array(3).fill(num(p.radius,.2)) as Vec;return box(d.map(v=>-v) as Vec,d);}
 if(e.type==='liquid'){const r=num(p.radius,1),h=num(p.height,1);return box([-r,-h,-r],[r,h,r]);}
 return box([-1.5,-1.5,-1.5],[1.5,1.5,1.5]);}
export function world(e:EntityConfig,b:Box3,duration:number){const result=new Box3();for(const t of times(e,duration)){const p=resolveProps(e,t);const s=num(e.type==='character'?p.size:p.scale,e.type==='character'?4:1);const n=p.normalization as {scale:number;offset:Vec}|undefined;const bounds=b.clone();if(n)bounds.applyMatrix4(new Matrix4().makeScale(n.scale,n.scale,n.scale)).translate(new Vector3(...n.offset));const m=new Matrix4().compose(new Vector3(...vec(p.position,[0,0,0])),new Quaternion().setFromEuler(new Euler(...vec(p.rotation,[0,0,0]))),new Vector3(s,s,s));result.union(bounds.applyMatrix4(m));}return result;}
export function fitCamera(b:Box3,aspect:number,coverage=.78,vertical=.65){const c=b.getCenter(new Vector3()),h=b.getSize(new Vector3()).multiplyScalar(.5);const tan=Math.tan(20*Math.PI/180);const distance=h.z+Math.max(h.x/(tan*aspect*coverage),h.y/(tan*vertical),1);return {position:[c.x,c.y,c.z+distance] as Vec,lookAt:c.toArray() as Vec,distance};}
export function composeVideo(raw:unknown){const video=validateVideo(structuredClone(raw));const report=[];for(const scene of video.scenes){const bounds=new Box3();const changes=[];const subjects:{entity:EntityConfig;bounds:Box3}[]=[];const warnings:string[]=[];const duration=scene.end-scene.start;for(const e of scene.entities){if(!primary.has(e.type))continue;const b=local(e);let w=world(e,b,duration);if(e.type==='generated'&&w.min.y<.05){const lift=.05-w.min.y;const p=vec(e.props.position,[0,0,0]);e.props.position=[p[0],p[1]+lift,p[2]];for(const track of e.tracks??[])if(track.property==='position')for(const k of track.keyframes){const v=vec(k.value,[0,0,0]);k.value=[v[0],v[1]+lift,v[2]];}w=world(e,b,duration);changes.push({entity:e.id,lift});}bounds.union(w);subjects.push({entity:e,bounds:w});if(e.type!=='generated'&&e.type!=='primitive')warnings.push(`${e.id}: estimated bounds`);}
 const heroes=subjects.filter(({entity:e})=>['generated','character','anatomy','micro','object'].includes(e.type)&&!(e.type==='object'&&e.props.type==='sugarCube'&&subjects.some(s=>s.entity.type==='anatomy'||s.entity.type==='generated')));
 const focus=heroes.length?heroes:subjects;
 // Compact simple character/food pairs only when there are no positional dependencies.
 if(focus.length===2&&focus.some(s=>s.entity.type==='character')&&focus.some(s=>s.entity.type==='object')&&scene.entities.every(e=>['character','object','text','screenEffect'].includes(e.type))&&focus.every(s=>!(s.entity.tracks??[]).some(t=>t.property==='position'))){
 const [a,b]=focus;const ac=a.bounds.getCenter(new Vector3()),bc=b.bounds.getCenter(new Vector3());const as=a.bounds.getSize(new Vector3()),bs=b.bounds.getSize(new Vector3());const gap=.12*Math.max(as.x,bs.x);const sign=ac.x<=bc.x?1:-1;const target=new Vector3(ac.x+sign*((as.x+bs.x)/2+gap),ac.y,ac.z);const delta=target.sub(bc);const p=vec(b.entity.props.position,[0,0,0]);b.entity.props.position=[p[0]+delta.x,p[1]+delta.y,p[2]+delta.z];b.bounds.translate(delta);changes.push({entity:b.entity.id,translation:delta.toArray()});
 }
 const focalBounds=new Box3();for(const s of focus)focalBounds.union(s.bounds);
 if(!focalBounds.isEmpty()){const fit=fitCamera(focalBounds,video.width/video.height,.86,.76);if(fit.distance<85){scene.camera={position:fit.position,lookAt:fit.lookAt};if(fit.distance>8)warnings.push('Camera distance may introduce environment fog');}else warnings.push('Bounds too large for safe camera; original retained');}
 const metrics=focus.map(({entity,bounds:b})=>{const c=scene.camera;if(!c?.position||!c.lookAt)return {entity:entity.id};const cam=new PerspectiveCamera(40,video.width/video.height,.1,100);cam.position.set(...c.position);cam.lookAt(...c.lookAt);cam.updateMatrixWorld();const projected=new Box3();for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])projected.expandByPoint(new Vector3(x,y,z).project(cam));return {entity:entity.id,widthFraction:(projected.max.x-projected.min.x)/2,heightFraction:(projected.max.y-projected.min.y)/2};});
 report.push({scene:scene.id,changes,warnings,camera:scene.camera,focus:focus.map(s=>s.entity.id),metrics});}return {video:validateVideo(video),report};}
