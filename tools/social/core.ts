import {z} from 'zod';
import {readFile,writeFile,mkdir,rename,stat} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
export const root=resolve('.secrets/social/youtube');
export const read=async(p:string)=>JSON.parse(await readFile(p,'utf8'));
export async function save(p:string,v:unknown){await mkdir(dirname(p),{recursive:true});const tmp=p+'.tmp';await writeFile(tmp,JSON.stringify(v,null,2)+'\n',{mode:0o600});await rename(tmp,p);}
export const Schema=z.strictObject({schemaVersion:z.literal(1),youtube:z.strictObject({title:z.string().min(1).max(100),description:z.string().max(5000),tags:z.array(z.string().min(1)).default([]),privacy:z.enum(['private','unlisted','public']).default('private'),madeForKids:z.boolean(),publishAt:z.iso.datetime({offset:true}).optional()})});
export function validate(raw:unknown){const p=Schema.parse(raw);if(p.youtube.publishAt&&(p.youtube.privacy!=='private'||Date.parse(p.youtube.publishAt)<=Date.now()))throw Error('Scheduling requires private privacy and a future date');return p;}
export async function prepare(folder:string){const p=validate(await read(resolve(folder,'publication.json')));const video=resolve(folder,'video.mp4');const s=await stat(video);if(!s.isFile()||!s.size)throw Error('Missing or empty video.mp4');return {p,video,bytes:s.size};}
export function run(fn:()=>Promise<void>){fn().catch(e=>{console.error('Social Publisher:',e instanceof Error?e.message:'Unknown error');process.exitCode=1;});}
