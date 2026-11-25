import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
import {parseAIJson} from '../../src/engine/ai/providers/AIProvider';
async function main(){
 const {AI_BASE_URL,AI_MODEL,AI_API_KEY}=process.env;
 if(!AI_BASE_URL||!AI_MODEL)throw new Error('Set AI_BASE_URL and AI_MODEL');
 const provider=new CompatibleProvider({baseUrl:AI_BASE_URL,model:AI_MODEL,apiKey:AI_API_KEY});
 const result=parseAIJson(await provider.generate({system:'Respond only with valid JSON.',prompt:'Return {"ok":true}.'}));
 console.log(JSON.stringify(result,null,2));
}
void main();
