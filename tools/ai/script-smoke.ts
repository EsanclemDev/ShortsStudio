import {MockProvider} from '../../src/engine/ai/providers/MockProvider';
import {generateScript} from '../../src/engine/ai/services/ScriptGenerator';
async function main(){
 const sample={title:'Agua',blocks:[{role:'hook',narration:'¿Tienes sed?',visualIntent:'Vaso de agua'},{role:'explanation',narration:'El agua ayuda a regular la temperatura.',visualIntent:'Persona entrenando'},{role:'takeaway',narration:'Recuerda hidratarte.',visualIntent:'Vaso'}],description:'Hidratación',hashtags:['#agua'],claims:['El agua ayuda a regular la temperatura.']};
 const result=await generateScript(new MockProvider(JSON.stringify(sample)),'Agua');
 if(!result.narration.includes('Recuerda hidratarte.')||result.wordCount!==11)throw new Error('Narration assembly failed');
 let rejected=false;try{await generateScript(new MockProvider('{}'),'Agua');}catch{rejected=true;}if(!rejected)throw new Error('Invalid response accepted');
 console.log('AI script smoke test OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
