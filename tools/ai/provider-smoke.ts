import {MockProvider} from '../../src/engine/ai/providers/MockProvider';
import {parseAIJson} from '../../src/engine/ai/providers/AIProvider';
import {CompatibleProvider} from '../../src/engine/ai/providers/CompatibleProvider';
async function main(){
 const req={system:'Return JSON',prompt:'Test'};
 const mock=new MockProvider('{"ok":true}');
 if(JSON.stringify(parseAIJson(await mock.generate(req)))!=='{"ok":true}')throw new Error('Mock failed');
 const original=globalThis.fetch;
 try{
 globalThis.fetch=async (input,init)=>{
 if(String(input)!=='http://localhost:11434/v1/chat/completions')throw new Error('Wrong URL');
 const body=JSON.parse(String(init?.body));
 if(body.model!=='test'||body.messages[1].content!=='Test')throw new Error('Wrong request');
 return new Response(JSON.stringify({choices:[{message:{content:'{"ok":true}'}}]}));
 };
 const provider=new CompatibleProvider({baseUrl:'http://localhost:11434/v1',model:'test'});
 if(JSON.stringify(parseAIJson(await provider.generate(req)))!=='{"ok":true}')throw new Error('Provider failed');
 globalThis.fetch=async()=>new Response('',{status:429});
 let failed=false;try{await provider.generate(req);}catch{failed=true;}if(!failed)throw new Error('HTTP error not handled');
 }finally{globalThis.fetch=original;}
 console.log('AI provider smoke test OK');
}
void main();
