import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {validateVideo} from '../src/engine/director/VideoValidator';

function isVec3(value: unknown): value is [number, number, number] {
 return Array.isArray(value)
  && value.length === 3
  && value.every(x => typeof x === 'number' && Number.isFinite(x));
}

// Paths are relative to entity.props, or to scene.camera with --camera.
const [input,command,...args]=process.argv.slice(2);
const options=new Map<string,string>();
try {
 for(const arg of args){const m=/^--([\w-]+)=(.*)$/.exec(arg);if(!m||options.has(m[1]))throw Error(`Invalid option: ${arg}`);options.set(m[1],m[2]);}
 const allowed=['scene','entity','type','camera','path','value','out','tracks'];
 for(const k of options.keys())if(!allowed.includes(k))throw Error(`Unknown option: ${k}`);
 if(!input||!['list','set'].includes(command))throw Error('Usage: edit-video.ts INPUT list|set --scene=ID --type=TYPE --entity=ID --path=PATH --value=JSON --out=DIR');
 const raw=JSON.parse(readFileSync(input,'utf8'));
 const wrapped=Object.hasOwn(raw,'video');
 const video=validateVideo(wrapped?raw.video:raw);
 const camera=options.get('camera')==='true';
 if(options.has('camera')&&!camera)throw Error('Use --camera=true');
 if(camera&&(options.has('entity')||options.has('type')))throw Error('Camera cannot use entity/type filters');
 const scenes=video.scenes.filter(s=>!options.has('scene')||s.id===options.get('scene'));
 const targets=scenes.flatMap(s=>camera?(s.camera?[{name:`${s.id}/camera`,props:s.camera as Record<string,unknown>,tracks:s.camera.tracks??[]}]:[]):s.entities.filter(e=>(!options.has('entity')||e.id===options.get('entity'))&&(!options.has('type')||e.type===options.get('type'))).map(e=>({name:`${s.id}/${e.id} (${e.type})`,props:e.props,tracks:e.tracks??[]})));
 if(!targets.length)throw Error('No matching targets');
 if(command==='list'){for(const t of targets){console.log(t.name,JSON.stringify(t.props,(k,v)=>['component','animation'].includes(k)&&typeof v==='object'?'[embedded resource]':v,2));console.log('Tracks:',t.tracks.map(t=>t.property).join(', ')||'none');}}
 else {
 const path=options.get('path'),out=options.get('out'),valueText=options.get('value');
 if(!path||!out||valueText===undefined)throw Error('set requires --path, --value and --out');
 if(!camera&&!options.has('entity')&&!options.has('type'))throw Error('Select --entity or --type explicitly');
 const parts=path.split('.');if(parts.some(p=>! /^[A-Za-z_][A-Za-z0-9_]*$/.test(p)||['__proto__','constructor','prototype','tracks','component','normalization','componentId','version','animationId'].includes(p)))throw Error('Unsafe or protected property path');
 if(camera&&!['position','lookAt'].includes(path))throw Error('Camera supports position and lookAt');
 const value=JSON.parse(valueText);if(!(typeof value==='string'||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)||isVec3(value)))throw Error('Expected string, boolean, finite number or vec3');
 if(/Color$|^color$/.test(parts.at(-1)!)&&(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value)))throw Error('Use #RRGGBB color');
 const policy=options.get('tracks')??'reject';if(!['reject','all'].includes(policy))throw Error('Use --tracks=reject or --tracks=all');
 for(const t of targets){
  const overlapping=t.tracks.filter(k=>k.property===path||k.property.startsWith(path+'.')||path.startsWith(k.property+'.'));
  if(overlapping.some(k=>k.property!==path)||overlapping.length&&policy!=='all')throw Error(`${t.name}: animated property ${path}; use --tracks=all for exact track`);
  let obj=t.props;for(const p of parts.slice(0,-1)){if(!Object.hasOwn(obj,p))obj[p]={};const next=obj[p];if(!next||typeof next!=='object'||Array.isArray(next))throw Error(`${t.name}: invalid parent ${p}`);obj=next as Record<string,unknown>;}
  const key=parts.at(-1)!;console.log(`${t.name}: ${path}: ${JSON.stringify(obj[key])} -> ${JSON.stringify(value)}`);obj[key]=structuredClone(value);
  for(const track of overlapping)for(const frame of track.keyframes)frame.value=structuredClone(value);
 }
 const checked=validateVideo(video);
 mkdirSync(out,{recursive:false});
 writeFileSync(join(out,'video.json'),JSON.stringify(checked,null,2)+'\n',{flag:'wx'});
 writeFileSync(join(out,'props.json'),JSON.stringify(wrapped?{...raw,video:checked}:{video:checked},null,2)+'\n',{flag:'wx'});
 console.log(`Updated ${targets.length} target(s). Output: ${out}`);
 }
} catch(e){console.error(e instanceof Error?e.message:String(e));process.exitCode=1;}
