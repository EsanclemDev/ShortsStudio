import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {generateScript} from '../../src/engine/ai/services/ScriptGenerator';
async function main(){
 const [topic,seconds='45',folder='out/ai-script']=process.argv.slice(2);
 const {AI_BASE_URL,AI_MODEL,AI_API_KEY}=process.env;
 if(!topic||!AI_BASE_URL||!AI_MODEL)throw new Error('Usage: generate-script.ts "topic" 45 output-folder; set AI_BASE_URL and AI_MODEL');
 const result=await generateScript(new CompatibleProvider({baseUrl:AI_BASE_URL,model:AI_MODEL,apiKey:AI_API_KEY}),topic,Number(seconds));
 const dest=resolve(folder);await mkdir(dest,{recursive:true});
 await writeFile(resolve(dest,'script.json'),JSON.stringify(result,null,2),'utf8');
 await writeFile(resolve(dest,'narration.txt'),result.narration,'utf8');
 console.log(`Script saved to ${dest}. Estimated duration: ${result.estimatedSeconds}s. Review claims before publication.`);
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
