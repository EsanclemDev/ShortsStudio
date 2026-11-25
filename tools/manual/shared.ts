import {readFile,writeFile,mkdir,access,cp,mkdtemp,rm,rename} from 'node:fs/promises';
import {resolve,dirname,join,relative} from 'node:path';
import {tmpdir} from 'node:os';
import {isDeepStrictEqual} from 'node:util';
import {z} from 'zod';
import {validateComponent} from '../../src/engine/components/ComponentSchema';
import {validateAnimation} from '../../src/engine/components/ComponentAnimation';
import {ComponentRegistry} from '../../src/engine/components/ComponentRegistry';
import {hydrateComponents} from '../../src/engine/components/DirectorComponentIntegration';
import {validateVideo} from '../../src/engine/director/VideoValidator';
export const read=async(p:string)=>JSON.parse(await readFile(p,'utf8'));
export async function save(p:string,v:unknown){await mkdir(dirname(p),{recursive:true});await writeFile(p,JSON.stringify(v,null,2)+'\n');}
export const Asset=z.strictObject({component:z.unknown(),animations:z.array(z.unknown()).default([])});
export const Production=z.strictObject({schemaVersion:z.literal(1),video:z.unknown(),assets:z.array(Asset).default([])});
export const Patch=z.strictObject({schemaVersion:z.literal(1),videoId:z.string(),scenes:z.array(z.unknown()),assets:z.array(Asset).default([])});
async function existing<T>(get:()=>Promise<T>):Promise<T|undefined>{
 try{return await get();}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return undefined;throw e;}
}
async function registerAssets(registry:ComponentRegistry,assets:z.infer<typeof Asset>[]){
 for(const a of assets){
  const c=validateComponent(a.component);
  const old=await existing(()=>registry.getComponent(c.id,c.version));
  if(old&&!isDeepStrictEqual(old,c))throw new Error(`Component conflict: ${c.id}@${c.version}. Use a new version and update references.`);
  if(!old)await registry.registerComponent(c);
  for(const raw of a.animations){
   const anim=validateAnimation(raw,c);
   const previous=await existing(()=>registry.getAnimation(c.id,c.version,anim.id));
   if(previous&&!isDeepStrictEqual(previous,anim))throw new Error(`Animation conflict: ${c.id}@${c.version}/${anim.id}. Use a new animation ID and update references.`);
   if(!previous)await registry.registerAnimation(anim,c.id,c.version);
  }
 }
}
export async function install(raw:unknown,folder:string){
 const p=Production.parse(raw), video=validateVideo(p.video);
 const root=resolve('assets/components'), temp=await mkdtemp(join(tmpdir(),'shorts-manual-'));
 try{
  const stage=new ComponentRegistry(join(temp,'components'));
  await mkdir(stage.root,{recursive:true});
  if(await access(root).then(()=>true,()=>false))await cp(root,stage.root,{recursive:true});
  await registerAssets(stage,p.assets);
  const hydrated=await hydrateComponents(video,stage);
  const paths=[video.audio?.voice?.src,video.audio?.music?.src,...(video.audio?.effects??[]).map(a=>a.src),video.subtitles?.src,video.lipsync].filter((x):x is string=>!!x);
  for(const path of paths){const target=resolve('public',path);const rel=relative(resolve('public'),target);if(!rel||rel.startsWith('..')||path.includes('\\'))throw new Error('Invalid public asset: '+path);await access(target);}
  const registry=new ComponentRegistry(root);
  await registerAssets(registry,p.assets);
  await mkdir(folder,{recursive:true});
  for(const [name,data] of [['video.json',video],['props.json',{video:hydrated}]] as const){const dest=join(folder,name);await save(dest+'.manual-tmp',data);await rename(dest+'.manual-tmp',dest);}
  console.log(`Validated ${video.scenes.length} scenes: ${folder}`);
 }finally{await rm(temp,{recursive:true,force:true});}
}
export async function patch(raw:unknown,folder:string){const p=Patch.parse(raw),video=validateVideo(await read(join(folder,'video.json')));if(video.id!==p.videoId)throw new Error('Video ID mismatch');const seen=new Set<string>();for(const replacement of p.scenes){const s=z.object({id:z.string(),start:z.number(),end:z.number()}).parse(replacement);const i=video.scenes.findIndex(x=>x.id===s.id);if(i<0||seen.has(s.id)||!isDeepStrictEqual([s.start,s.end],[video.scenes[i].start,video.scenes[i].end]))throw new Error('Invalid scene replacement: '+s.id);seen.add(s.id);video.scenes[i]=replacement as typeof video.scenes[number];}await install({schemaVersion:1,video,assets:p.assets},folder);}
export function run(fn:()=>Promise<void>){void fn().catch(e=>{console.error(e);process.exitCode=1;});}
