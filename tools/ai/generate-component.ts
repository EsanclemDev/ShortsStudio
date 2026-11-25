import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {ComponentRequestSchema} from '../../src/engine/components/ComponentSchema';
import {buildComponent} from '../../src/engine/components/ComponentBuilder';
async function main(){
 const [id,category,name,description,folder]=process.argv.slice(2);
 const request=ComponentRequestSchema.parse({id,category,name,description,dimension:'3d'});
 const {AI_BASE_URL,AI_MODEL,AI_COMPONENT_MODEL,AI_API_KEY}=process.env;const model=AI_COMPONENT_MODEL||AI_MODEL;
 if(!AI_BASE_URL||!model)throw new Error('Set AI_BASE_URL and AI_MODEL or AI_COMPONENT_MODEL');
 const dest=resolve(folder||`out/components/${id}`);await mkdir(dest,{recursive:true});
 const save=async(name:string,value:unknown)=>writeFile(resolve(dest,name),JSON.stringify(value,null,2),'utf8');
 await save('request.json',request);
 const component=await buildComponent(new CompatibleProvider({baseUrl:AI_BASE_URL,model,apiKey:AI_API_KEY,timeoutMs:300000}),request,async(attempt,raw)=>{await writeFile(resolve(dest,`candidate-${attempt}.txt`),raw,'utf8');console.log('Candidate',attempt);});
 await save('component.json',component);await save('props.json',{component});console.log('Validated component saved:',dest);
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
