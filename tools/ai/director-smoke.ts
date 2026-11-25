import {MockProvider} from '../../src/engine/ai/providers/MockProvider';
import {generateVideo,type VisualDirectorInput} from '../../src/engine/ai/services/VisualDirector';
const input:VisualDirectorInput={id:'test',title:'Agua',narration:'Bebe agua',duration:3,fps:30,width:1080,height:1920,voiceSrc:'audio/test.mp3',captionsSrc:'audio/test.json',captions:[{text:'Bebe agua',startMs:0,endMs:2000}]};
const sample={schemaVersion:1,id:input.id,title:input.title,duration:3,fps:30,width:1080,height:1920,audio:{voice:{src:input.voiceSrc}},subtitles:{src:input.captionsSrc},scenes:[{id:'hook',start:0,end:3,environment:'studio',entities:[{id:'glass',type:'object',props:{type:'waterGlass'}}]}]};
async function main(){
 const result=await generateVideo(new MockProvider(JSON.stringify(sample)),input);
 if(result.scenes.length!==1)throw new Error('Unexpected scene count');
 for(const bad of [{...sample,scenes:[{...sample.scenes[0],start:1}]}]){
 let rejected=false;try{await generateVideo(new MockProvider(JSON.stringify(bad)),input);}catch{rejected=true;}if(!rejected)throw new Error('Invalid video accepted');}
 console.log('AI visual director smoke test OK');
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
