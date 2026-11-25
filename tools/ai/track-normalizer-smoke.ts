import {validateDirectorResponse,type VisualDirectorInput} from '../../src/engine/ai/services/VisualDirector';
const input:VisualDirectorInput={id:'test',title:'Test',narration:'Test',duration:3,fps:30,width:1080,height:1920,voiceSrc:'audio/test.mp3',captionsSrc:'audio/test.json'};
const sample={scenes:[{id:'test',start:0,end:3,environment:'studio',entities:[{id:'hero',type:'character',props:{action:'idle'},tracks:[{property:'props.action',keyframes:[{time:0,value:'idle'},{time:1,value:'thumbsUp',easing:'step'}]}]}]}]};
const video=validateDirectorResponse(JSON.stringify(sample),input);
if(video.scenes[0].entities[0].tracks?.[0].property!=='action')throw new Error('Track normalization failed');
console.log('Track normalization smoke test OK');
