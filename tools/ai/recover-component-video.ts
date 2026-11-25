import {readFile,mkdir,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {validateDirectorResponse} from '../../src/engine/ai/services/VisualDirector';
import {hydrateComponents} from '../../src/engine/components/DirectorComponentIntegration';
import {ComponentRegistry} from '../../src/engine/components/ComponentRegistry';
async function main(){
 const [source,target]=process.argv.slice(2);if(!source||!target)throw new Error('Usage: recover-component-video.ts source-folder empty-output-folder');
 const input=JSON.parse(await readFile(join(source,'production-input.json'),'utf8'));
 const files=(await readdir(source)).filter(f=>/^candidate-\d+\.txt$/.test(f)).sort((a,b)=>Number(b.match(/\d+/)![0])-Number(a.match(/\d+/)![0]));
 await mkdir(target,{recursive:true});if((await readdir(target)).length)throw new Error('Use an empty output folder');
 const attempts:{file:string;error?:string}[]=[];
 for(const file of files){try{const raw=await readFile(join(source,file),'utf8');const video=await hydrateComponents(validateDirectorResponse(raw,input),new ComponentRegistry());attempts.push({file});await writeFile(join(target,'video.json'),JSON.stringify(video,null,2));await writeFile(join(target,'props.json'),JSON.stringify({video},null,2));await writeFile(join(target,'recovery-report.json'),JSON.stringify({selected:file,attempts},null,2));console.log('Recovered '+file);return;}catch(e){attempts.push({file,error:String(e)});}}
 await writeFile(join(target,'recovery-report.json'),JSON.stringify({attempts},null,2));throw new Error('No valid candidate recovered');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
