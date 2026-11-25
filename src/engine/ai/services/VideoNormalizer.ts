import type {DirectorInput} from '../prompts/DirectorPrompt';
const obj=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
export function normalizeVideo(candidate:unknown,input:DirectorInput):unknown {
 if(!obj(candidate))return candidate;
 const video={...candidate}; delete video.catalogVersion; delete video.videoSchema;
 Object.assign(video,{schemaVersion:1,id:input.id,title:input.title,duration:input.duration,fps:input.fps,width:input.width,height:input.height});
 video.audio={...(obj(video.audio)?video.audio:{}),voice:{src:input.voiceSrc,volume:1,startFrame:0,loop:false}};
 if(input.captionsSrc)video.subtitles={...(obj(video.subtitles)?video.subtitles:{}),src:input.captionsSrc};
 if(input.lipsyncSrc)video.lipsync=input.lipsyncSrc;else delete video.lipsync;
 if(Array.isArray(video.scenes))video.scenes=video.scenes.map(scene=>{
  if(!obj(scene)||!Array.isArray(scene.entities))return scene;
  return {...scene,entities:scene.entities.map(entity=>{
   if(!obj(entity)||!Array.isArray(entity.tracks))return entity;
   return {...entity,tracks:entity.tracks.map(track=>obj(track)&&typeof track.property==='string'&&track.property.startsWith('props.')?{...track,property:track.property.slice(6)}:track)};
  })};
 });
 return video;
}
