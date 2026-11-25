import {isDeepStrictEqual} from 'node:util';
import {sampleTrack} from '../../director/timeline/KeyframeEngine';
// Scene-local operations are compiled into entity-local tracks. Existing tracks are preserved unless explicitly targeted (then rejected).
export function compileBeats(raw:any):any {
 const r=structuredClone(raw), s=r.scene;
 if(!Array.isArray(r.beats)||!Array.isArray(s?.entities)) throw Error('Missing scene or beats');
 const duration=s.end-s.start, used=new Set<string>();
 const compiled:any[]=[]; const warnings:string[]=[];
 const time=(v:any)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>=duration)throw Error('Operation outside scene');return v;};
 for(const b of r.beats){time(b.time);if(!Array.isArray(b.operations)||!b.operations.length||b.operations.length>12)throw Error('Beat requires 1–12 executable operations');
 for(const op of b.operations){const {kind,entityId,property}=op;const camera=kind==='camera';let e=s.entities.find((x:any)=>x.id===entityId);
 const emit=(event:string,t=b.time,p?:string)=>compiled.push({time:t,intent:b.intent,strategy:b.strategy,entityId:camera?'camera':entityId,event,...(p?{property:p}:{})});
 if(kind==='spawn'){if(e||!op.entity||op.entity.id!==entityId)throw Error('Invalid spawn identity');e={...op.entity,start:b.time};s.entities.push(e);emit('appear');continue;}
 if(!camera&&!e)throw Error('Unknown entity '+entityId);
 if(kind==='initial'){emit('initial');continue;}
 if(kind==='appear'||kind==='disappear'){
 const start=e.start??0,end=e.end??duration;
 if(kind==='appear'&&Math.abs(start-b.time)<1e-8||kind==='disappear'&&Math.abs(end-b.time)<1e-8){emit(kind);continue;}
 if(kind==='appear'&&e.tracks?.length)throw Error('Cannot shift start of animated entity without changing animation timing');
 const nextStart=kind==='appear'?b.time:start,nextEnd=kind==='disappear'?b.time:end;
 if(nextEnd<=nextStart||e.tracks?.some((t:any)=>t.keyframes.some((k:any)=>k.time>nextEnd-nextStart+1e-8)))throw Error('Retiming would invalidate entity interval or keyframes');
 e[kind==='appear'?'start':'end']=b.time;emit(kind);continue;}

 if(!['set','animate','camera'].includes(kind))throw Error('Unknown operation '+kind);
 if(typeof property!=='string'||! /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(property)||property.split('.').some(p=>['constructor','prototype','__proto__'].includes(p)))throw Error('Unsafe property');
 if(camera&&(!s.camera||!['position','lookAt'].includes(property)))throw Error('Invalid camera property');
 const target=camera?s.camera:e, offset=camera?0:e.start??0, end=camera?duration:e.end??duration;
 const local=b.time-offset; if(local<0||b.time>=end)throw Error('Operation outside entity interval');
 let value:any=camera?target:target.props;for(const p of property.split('.')){if(!value||!Object.hasOwn(value,p))throw Error('Initialize property '+property);value=value[p];}
 const key=JSON.stringify([camera?'camera':entityId,property]);target.tracks??=[];let track=target.tracks.find((t:any)=>t.property===property);
 if(track&&!used.has(key))throw Error('Operation conflicts with existing track '+property);
 if(!track){track={property,keyframes:[{time:0,value}]};}
 const last=track.keyframes.at(-1);if(local<last.time)throw Error('Overlapping or unordered operations');
 const from=sampleTrack(track,local), to=op.value;
 const numeric=typeof from==='number'&&typeof to==='number'&&Number.isFinite(to);const vector=Array.isArray(from)&&Array.isArray(to)&&to.length===3&&to.every((x:any)=>typeof x==='number'&&Number.isFinite(x));const color=typeof from==='string'&&typeof to==='string'&&/^#[0-9a-f]{6}$/i.test(from)&&/^#[0-9a-f]{6}$/i.test(to);
 if(!(numeric||vector||typeof from===typeof to&&['string','boolean'].includes(typeof to)))throw Error('Incompatible operation value');
 if(isDeepStrictEqual(from,to)){warnings.push('Redundant operation: '+b.intent+' / '+entityId+' / '+property);if(!camera&&kind==='set'&&b.time===0&&offset===0)emit('initial');continue;}
 if(!used.has(key)){target.tracks.push(track);used.add(key);}

 const animate=kind==='animate'||camera&&op.duration!==undefined;
 if(animate){if(!(numeric||vector||color)||typeof op.duration!=='number'||!Number.isFinite(op.duration)||op.duration<=0||b.time+op.duration>end+1e-8)throw Error('Invalid animation interval/value');if(local>last.time)track.keyframes.push({time:local,value:from,easing:'step'});track.keyframes.push({time:local+op.duration,value:to,easing:op.easing??'easeInOut'});emit(camera?'camera':'keyframe',b.time,property);}
 else {if(local<=last.time)throw Error('Set requires time after previous keyframe; initialize props at zero');track.keyframes.push({time:local,value:to,easing:'step'});emit(camera?'camera':'keyframe',b.time,property);}
 }}
 if(!compiled.length)throw Error('No effective beats');
 return {...r,beats:compiled,compilerWarnings:warnings};
}
