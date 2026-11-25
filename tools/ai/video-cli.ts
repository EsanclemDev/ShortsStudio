import {readFile,mkdir,writeFile,readdir,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {generateQualityVideo} from '../../src/engine/ai/services/QualityPipeline';
const inputSchema=z.strictObject({id:z.string().min(1),title:z.string().min(1),narration:z.string().min(1),duration:z.number().positive(),fps:z.number().int().positive(),width:z.number().int().positive(),height:z.number().int().positive(),voiceSrc:z.string().min(1),captionsSrc:z.string().min(1),lipsyncSrc:z.string().optional(),captions:z.array(z.strictObject({text:z.string(),startMs:z.number().nonnegative(),endMs:z.number().nonnegative()}).refine(w=>w.endMs>=w.startMs)).min(1),availableAudio:z.array(z.string()).optional(),blocks:z.array(z.strictObject({role:z.string(),narration:z.string(),visualIntent:z.string()})).optional()});
export async function main(resuming=false){
 const [file,folder='out/ai-video']=process.argv.slice(2);
 const {AI_BASE_URL,AI_MODEL,AI_API_KEY}=process.env;
 if(!file||!AI_BASE_URL||!AI_MODEL)throw new Error('Usage: generate-video.ts director-input.json output-folder; set AI_BASE_URL and AI_MODEL');
 const input=inputSchema.parse(JSON.parse(await readFile(file,'utf8')));
 const dest=resolve(folder);await mkdir(dest,{recursive:true});
 const load=async(name:string)=>{try{return JSON.parse(await readFile(resolve(dest,name+'.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return undefined;throw e;}};
 const previous=resuming?await load('production-input'):undefined;
 if(previous&&JSON.stringify(previous)!==JSON.stringify(input))throw new Error('Production input changed');
 if(!resuming&&(await readdir(dest)).length)throw new Error('Output folder is not empty; use a new folder or resume-video.ts');
 const initial=resuming?(await load('initial-video')??await load('video')):undefined;
 if(resuming&&!initial)throw new Error('No saved video to resume');
 const capabilities=resuming?await load('missing-capabilities'):undefined;
 const review=resuming&&previous?await load('visual-review'):undefined;
 const checkpoint=resuming&&previous?await load('repair-checkpoint'):undefined;
 const revised=resuming&&previous?await load('revised-video'):undefined;
 await writeFile(resolve(dest,'production-input.json'),JSON.stringify(input,null,2));
 const attempts:unknown[]=resuming?(await load('attempts')??[]):[];
 const makeProvider=(stage:string,model:string)=>{const inner=new CompatibleProvider({baseUrl:AI_BASE_URL!,model,apiKey:AI_API_KEY,timeoutMs:300000});let n=0;return {async generate(request:Parameters<typeof inner.generate>[0]){const raw=await inner.generate(request);await writeFile(resolve(dest,`${stage}-raw-${Date.now()}-${++n}.txt`),raw);return raw;}};};
 const providers={capability:makeProvider('capability',process.env.AI_CAPABILITY_MODEL??AI_MODEL),review:makeProvider('review',process.env.AI_REVIEW_MODEL??AI_MODEL),repair:makeProvider('repair',process.env.AI_REPAIR_MODEL??AI_MODEL)};

 const video=await generateQualityVideo(makeProvider('director',AI_MODEL),input,{
 onStart:n=>console.log(`Attempt ${n}: generating...`),
 onCandidate:async(n,raw)=>{await writeFile(resolve(dest,`candidate-${n}.txt`),raw);},
 onAttempt:event=>{attempts.push(event);console.log(`Attempt ${event.attempt} (${(event.elapsedMs/1000).toFixed(1)}s): ${event.error??'OK'}`);}
 },async(name,data)=>{console.log(name);await writeFile(resolve(dest,`${name}.json`),JSON.stringify(data,null,2));if(name==='visual-review-revised')await unlink(resolve(dest,'quality-repair-error.json')).catch(()=>{});if(name==='visual-review')await unlink(resolve(dest,'review-error.json')).catch(()=>{});if(name==='missing-capabilities'&&!(data as {status?:string}).status)await unlink(resolve(dest,'capability-error.json')).catch(()=>{});},{initial,capabilities,review,revised,checkpoint,providers}).finally(()=>writeFile(resolve(dest,'attempts.json'),JSON.stringify(attempts,null,2)));
 await writeFile(resolve(dest,'video.json'),JSON.stringify(video,null,2));
 await writeFile(resolve(dest,'props.json'),JSON.stringify({video},null,2));
 console.log(`Validated video saved to ${dest}`);
}
