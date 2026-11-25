import {buildCapabilityCatalog} from '../../src/engine/ai/catalog/CapabilityCatalog';
import {entityProps} from '../../src/engine/director/schemas/EntitySchema';
import {buildDirectorPrompt} from '../../src/engine/ai/prompts/DirectorPrompt';
import {buildScriptPrompt} from '../../src/engine/ai/prompts/ScriptPrompt';
function check(value:unknown,message:string){if(!value)throw new Error(message);}
const catalog=buildCapabilityCatalog();
check(Object.keys(catalog.entityProps).length===Object.keys(entityProps).length,'Missing entity');
check(Object.hasOwn(catalog.entityProps,'character'),'Missing character');
check(Object.hasOwn(catalog.entityProps,'primitive'),'Missing primitive');
check(JSON.parse(JSON.stringify(catalog)).schemaVersion===1,'Serialization failed');
const prompt=buildDirectorPrompt({id:'test',title:'Test',narration:'Hola',duration:5,fps:30,width:1080,height:1920,voiceSrc:'audio/voice/test.mp3'});
check(prompt.system.includes('lowerBodyMuscularity'),'Missing muscularity');
check(JSON.parse(prompt.user).duration===5,'Duration lost');
check(JSON.parse(buildScriptPrompt('ATP').user).topic==='ATP','Script topic lost');
console.log(`AI catalog smoke test OK (${Object.keys(catalog.entityProps).length} entities)`);
