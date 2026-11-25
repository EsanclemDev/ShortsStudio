import {buildScriptPrompt} from '../prompts/ScriptPrompt';
import {ScriptSchema,GeneratedScriptSchema} from '../schemas/ScriptSchema';
import {parseAIJson,type AIProvider} from '../providers/AIProvider';
export async function generateScript(provider:AIProvider,topic:string,targetSeconds=45,language='es'){
 const prompt=buildScriptPrompt(topic,targetSeconds,language);
 const script=ScriptSchema.parse(parseAIJson(await provider.generate({system:prompt.system,prompt:prompt.user})));
 const narration=script.blocks.map(b=>b.narration).join('\n\n');
 const wordCount=narration.trim().split(/\s+/).length;
 return GeneratedScriptSchema.parse({...script,narration,wordCount,targetSeconds,estimatedSeconds:Math.round(wordCount/2.5),language});
}
