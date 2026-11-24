import {validateVideo} from '../../src/engine/director/VideoValidator';
import {resolveFrame,getTotalFrames} from '../../src/engine/director/timeline/TimelineEngine';
import config from '../../src/videos/configurable-demo/video.json';
const video=validateVideo(config);
function assert(ok:boolean,message:string){if(!ok)throw new Error(message);}
assert(getTotalFrames(video)===180,'duration');
for(const [frame,expected] of [[0,0],[75,.4],[150,.8],[179,.8]]){const props=resolveFrame(video,frame).entities[0].props;assert(Math.abs((props.appearance as {muscularity:number}).muscularity-expected)<1e-8,`frame ${frame}`);}
assert(
  config.scenes[0]?.entities[0]?.props.appearance?.muscularity === 0,
  'mutation',
);let rejected=false;try{validateVideo({...config,duration:7});}catch{rejected=true;}assert(rejected,'invalid duration');
console.log('Director smoke test OK');
