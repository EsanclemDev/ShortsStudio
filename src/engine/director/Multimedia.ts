import {z} from 'zod';
import {staticFile} from 'remotion';
export const CaptionsSchema=z.array(z.strictObject({text:z.string(),startMs:z.number().nonnegative(),endMs:z.number().nonnegative()}).refine(w=>w.endMs>=w.startMs,'Invalid caption interval'));
export const LipSyncSchema=z.strictObject({fps:z.number().int().positive(),durationMs:z.number().nonnegative(),frames:z.array(z.number().min(0).max(1))});
export async function loadJson<T>(src:string,schema:{parse:(input:unknown)=>T}):Promise<T>{
 const response=await fetch(staticFile(src));
 if(!response.ok)throw new Error(`Cannot load ${src}: ${response.status}`);
 return schema.parse(await response.json());
}
