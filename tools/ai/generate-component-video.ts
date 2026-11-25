import {readFile,mkdir,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {analyzeCapabilities} from '../../src/engine/ai/services/CapabilityAnalyzer';
import {generateQualityVideo} from '../../src/engine/ai/services/QualityPipeline';
import type {VisualDirectorInput} from '../../src/engine/ai/services/VisualDirector';
import {ComponentRegistry} from '../../src/engine/components/ComponentRegistry';
import {provisionComponents,hydrateComponents} from '../../src/engine/components/DirectorComponentIntegration';
async function main(){
 const [file,folder,flag]=process.argv.slice(2);const {AI_BASE_URL,AI_MODEL,AI_API_KEY}=process.env;
 if(!file||!folder||!AI_BASE_URL||!AI_MODEL)throw new Error('Usage: generate-component-video.ts input.json output-folder [--create-missing]');
 await mkdir(folder,{recursive:true});if((await readdir(folder)).length)throw new Error('Use an empty output folder');
 const save=async(name:string,data:unknown)=>{await writeFile(join(folder,name+'.json'),JSON.stringify(data,null,2));console.log(name);};
 const input:VisualDirectorInput=JSON.parse(await readFile(file,'utf8'));const registry=new ComponentRegistry();input.registeredComponents=await registry.list();
 const provider=(model:string)=>new CompatibleProvider({baseUrl:AI_BASE_URL,model,apiKey:AI_API_KEY,timeoutMs:300000});
 const director=provider(AI_MODEL),capability=provider(process.env.AI_CAPABILITY_MODEL??AI_MODEL);
 let report;try{report=await analyzeCapabilities(capability,input);await save('preflight',report);}catch(e){await save('preflight-error',{error:String(e)});}
 if(report&&flag==='--create-missing'){await save('component-provisioning',await provisionComponents(registry,director,report));input.registeredComponents=await registry.list();}
 await save('registered-components',input.registeredComponents);await save('production-input',input);
 const video=await generateQualityVideo(director,input,{onStart:n=>console.log('Director attempt '+n),onCandidate:async(n,raw)=>{await writeFile(join(folder,`candidate-${n}.txt`),raw);},onAttempt:e=>console.log(e)},save,{capabilities:report?{missingCapabilities:report.missingCapabilities.filter(m=>!input.registeredComponents?.some(c=>c.id===m.name.toLowerCase()||c.name.toLowerCase()===m.name.toLowerCase()))}:undefined,providers:{capability,review:provider(process.env.AI_REVIEW_MODEL??AI_MODEL),repair:provider(process.env.AI_REPAIR_MODEL??AI_MODEL)}});
 await save('video-references',video);const hydrated=await hydrateComponents(video,registry);await save('video',hydrated);await save('props',{video:hydrated});
}
main().catch(e=>{console.error(e);process.exitCode=1;});
