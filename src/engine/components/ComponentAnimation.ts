import {z} from 'zod';
import type {Component3D} from './ComponentSchema';
const vec=z.tuple([z.number().finite(),z.number().finite(),z.number().finite()]);
const key=z.strictObject({time:z.number().min(0).max(60),value:vec,easing:z.enum(['linear','easeIn','easeOut','easeInOut','step']).default('linear')});
export const AnimationSchema=z.strictObject({schemaVersion:z.literal(1),componentId:z.string(),componentVersion:z.number().int().positive(),id:z.string().regex(/^[a-z][a-z0-9-]{0,63}$/),duration:z.number().min(0.1).max(60),loop:z.boolean(),tracks:z.array(z.strictObject({partId:z.string(),property:z.enum(['position','rotation','scale']),keyframes:z.array(key).min(2).max(64)})).min(1).max(128)});
export type ComponentAnimation=z.infer<typeof AnimationSchema>;
export function validateAnimation(raw:unknown,component:Component3D):ComponentAnimation {
 const a=AnimationSchema.parse(raw);if(a.componentId!==component.id||a.componentVersion!==component.version)throw new Error('Animation component mismatch');
 const seen=new Set<string>();for(const t of a.tracks){if(!component.parts.some(p=>p.id===t.partId))throw new Error('Unknown part '+t.partId);const k=t.partId+':'+t.property;if(seen.has(k))throw new Error('Duplicate track');seen.add(k);
 if(t.keyframes[0].time!==0||t.keyframes[t.keyframes.length-1].time!==a.duration)throw new Error('Track must span duration');
 for(const [i,f] of t.keyframes.entries()){if(i>0&&f.time<=t.keyframes[i-1].time)throw new Error('Unordered keyframes');if(f.value.some(v=>Math.abs(v)>100||(t.property==='scale'&&v<0.001)))throw new Error('Invalid transform');}
 if(a.loop&&t.keyframes[0].value.some((v,i)=>v!==t.keyframes[t.keyframes.length-1].value[i]))throw new Error('Loop endpoints must match');
 }return a;
}
export function sampleAnimation(component:Component3D,a:ComponentAnimation,time:number):Component3D {
 const s=Math.max(0,time);const t=a.loop?s%a.duration:Math.min(s,a.duration);const parts=component.parts.map(p=>({...p}));
 for(const track of a.tracks){const p=parts.find(p=>p.id===track.partId)!;const keys=track.keyframes;const j=keys.findIndex(k=>k.time>=t);if(j<=0){p[track.property]=keys[0].value;continue;}const l=keys[j-1],r=keys[j];let u=(t-l.time)/(r.time-l.time);switch(r.easing){case 'step':u=u===1?1:0;break;case 'easeIn':u=u*u;break;case 'easeOut':u=1-(1-u)**2;break;case 'easeInOut':u=u*u*(3-2*u);break;}p[track.property]=l.value.map((v,i)=>v+(r.value[i]-v)*u) as [number,number,number];}
 return {...component,parts};
}
