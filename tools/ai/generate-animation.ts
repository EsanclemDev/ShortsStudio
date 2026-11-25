import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {validateComponent} from '../../src/engine/components/ComponentSchema';
import {buildAnimation} from '../../src/engine/components/AnimationBuilder';
async function main(){const [file,description,folder]=process.argv.slice(2);if(!file||!description||!folder)throw new Error('Usage: generate-animation component.json description output-folder');const component=validateComponent(JSON.parse(await readFile(file,'utf8')));const {AI_BASE_URL,AI_MODEL,AI_COMPONENT_MODEL,AI_API_KEY}=process.env;const model=AI_COMPONENT_MODEL||AI_MODEL;if(!AI_BASE_URL||!model)throw new Error('Set AI_BASE_URL and AI_MODEL');const animation=await buildAnimation(new CompatibleProvider({baseUrl:AI_BASE_URL,model,apiKey:AI_API_KEY,timeoutMs:300000}),component,description);await mkdir(folder,{recursive:true});for(const [name,data] of Object.entries({'animation.json':animation,'props.json':{component,animation}}))await writeFile(resolve(folder,name),JSON.stringify(data,null,2));console.log('Validated animation saved:',folder);}
void main().catch(e=>{console.error(e);process.exitCode=1;});
