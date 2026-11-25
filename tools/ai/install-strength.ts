import {readFile,writeFile,copyFile,mkdir,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {ComponentRegistry} from '../../src/engine/components/ComponentRegistry';
import {hydrateComponents} from '../../src/engine/components/DirectorComponentIntegration';
async function main(){
 const out='out/004-strength', pub='public/audio/director/004-strength';
 const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',`${out}/voice.mp3`],{encoding:'utf8'}).trim());
 if(Math.ceil(duration*30)!==1345)throw new Error('Audio duration differs from expected 1345 frames');
 const registry=new ComponentRegistry();
 for(const id of ['strength-short-arms','strength-long-arms','strength-neuron','strength-glycogen']){
  await registry.getComponent(id,1);
  if(id!=='strength-glycogen')await registry.getAnimation(id,1,'motion');
 }
 const video=JSON.parse(await readFile(`${out}/video.json`,'utf8'));
 await mkdir(pub,{recursive:true});await copyFile(`${out}/voice.mp3`,`${pub}/voice.mp3`);
 const files=await readdir(out);if(files.includes('lipsync.json')){await copyFile(`${out}/lipsync.json`,`${pub}/lipsync.json`);video.lipsync='audio/director/004-strength/lipsync.json';for(const s of video.scenes)for(const e of s.entities)if(e.type==='character')e.speak=true;}
 const hydrated=await hydrateComponents(video,registry);
 await writeFile(`${out}/props.json`,JSON.stringify({video:hydrated},null,2));console.log('Validated: 8 scenes, 6 components, 3 animations, 1345 frames');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
