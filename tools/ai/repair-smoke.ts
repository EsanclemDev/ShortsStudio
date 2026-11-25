import type {AIProvider} from '../../src/engine/ai/providers/AIProvider';
import {generateVideoWithRepair,type VisualDirectorInput} from '../../src/engine/ai/services/VisualDirector';
const input:VisualDirectorInput={id:'test',title:'Agua',narration:'Bebe agua',duration:3,fps:30,width:1080,height:1920,voiceSrc:'audio/test.mp3',captionsSrc:'audio/test.json',captions:[{text:'Bebe agua',startMs:0,endMs:2000}]};
const sample={schemaVersion:1,id:input.id,title:input.title,duration:3,fps:30,width:1080,height:1920,audio:{voice:{src:input.voiceSrc}},subtitles:{src:input.captionsSrc},scenes:[{id:'hook',start:0,end:3,environment:'studio',entities:[{id:'glass',type:'object',props:{type:'waterGlass'}}]}]};
async function main(){
 let calls=0;const provider:AIProvider={async generate(request){calls++;if(calls===1)return 'invalid JSON';if(!request.prompt.includes('invalid JSON'))throw new Error('Missing repair context');return JSON.stringify(sample);}};
 const events:number[]=[];await generateVideoWithRepair(provider,input,{onAttempt:e=>events.push(e.attempt)});
 if(calls!==2||events.length!==2)throw new Error('Repair failed');
 calls=0;let rejected=false;try{await generateVideoWithRepair({async generate(){calls++;return '{}';}},input,{maxAttempts:2});}catch{rejected=true;}
 if(!rejected||calls!==2)throw new Error('Retry limit failed');
 console.log('AI repair smoke test OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
