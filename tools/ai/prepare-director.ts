import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {ScriptSchema,GeneratedScriptSchema} from '../../src/engine/ai/schemas/ScriptSchema';
import {z} from 'zod';
const CaptionsSchema=z.array(z.strictObject({text:z.string(),startMs:z.number().nonnegative(),endMs:z.number().nonnegative()}).refine(w=>w.endMs>=w.startMs));
const LipSyncSchema=z.strictObject({fps:z.number().int().positive(),durationMs:z.number().nonnegative(),frames:z.array(z.number().min(0).max(1))});
import type {VisualDirectorInput} from '../../src/engine/ai/services/VisualDirector';
async function main(){
 const [id,scriptFile,voiceFile,captionFile,folder,lipFile]=process.argv.slice(2);
 if(!id||!scriptFile||!voiceFile||!captionFile||!folder||!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Usage: prepare-director.ts id script.json voice.mp3 captions.json output-folder [lipsync.json]');
 const raw:unknown=JSON.parse(await readFile(scriptFile,'utf8'));
 const enriched=GeneratedScriptSchema.safeParse(raw);
 const script=enriched.success?enriched.data:ScriptSchema.parse(raw);
 const captions=CaptionsSchema.parse(JSON.parse(await readFile(captionFile,'utf8')));
 const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',voiceFile],{encoding:'utf8'}).trim());
 if(!Number.isFinite(duration)||duration<=0||!captions.length||captions.some(w=>w.endMs>duration*1000+100))throw new Error('Invalid audio duration or captions');
 const fps=30;const base=`audio/director/${id}`;
 const ext=extname(voiceFile).toLowerCase();if(!['.mp3','.wav','.m4a'].includes(ext))throw new Error('Unsupported audio extension');
 const voiceSrc=`${base}/voice${ext}`,captionsSrc=`${base}/captions.json`,lipsyncSrc=lipFile?`${base}/lipsync.json`:undefined;
 if(lipFile){const lip=LipSyncSchema.parse(JSON.parse(await readFile(lipFile,'utf8')));if(Math.abs(lip.durationMs-duration*1000)>200)throw new Error('Lipsync duration mismatch');}
 const availableAudio:string[]=[];
 for(const dir of ['audio/music','audio/sfx'])for(const f of await readdir(resolve('public',dir),{withFileTypes:true}).catch(()=>[]))if(f.isFile()&&/\.(wav|mp3|m4a)$/i.test(f.name))availableAudio.push(`${dir}/${f.name}`);
 for(const [source,target] of [[voiceFile,voiceSrc],[captionFile,captionsSrc],...(lipFile&&lipsyncSrc?[[lipFile,lipsyncSrc]]:[])]){const dest=resolve('public',target);await mkdir(dirname(dest),{recursive:true});if(resolve(source)!==dest)await copyFile(source,dest);}
 const input:VisualDirectorInput={id,title:script.title,narration:script.blocks.map(b=>b.narration).join(' '),blocks:script.blocks,duration:Math.ceil(duration*fps)/fps,fps,width:1080,height:1920,voiceSrc,captionsSrc,lipsyncSrc,captions,availableAudio};
 await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'director-input.json'),JSON.stringify(input,null,2));console.log('Director input prepared');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
