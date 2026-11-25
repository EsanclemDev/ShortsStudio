import {z} from 'zod';
import {parseAIJson,type AIProvider} from '../providers/AIProvider';
import {serializeCatalog} from '../catalog/CatalogGenerator';
import {dailyQuota} from './StructuredResponse';
import {stripSchemaMetadata} from './stripSchemaMetadata';
import {validateDirectorResponse,type VisualDirectorInput} from './VisualDirector';
import type {Review} from './VisualReviewer';
type Video=ReturnType<typeof validateDirectorResponse>;
const PatchSchema=z.strictObject({replacements:z.array(z.strictObject({sceneId:z.string(),scene:z.record(z.string(),z.unknown())})).min(1).max(30)});
export function applyQualityPatch(video:Video,raw:string,input:VisualDirectorInput,allowedIds:readonly string[]):Video {
 const patch=PatchSchema.parse(stripSchemaMetadata(parseAIJson(raw)));
 const allowed=new Set(allowedIds);const seen=new Set<string>();
 const scenes=video.scenes.map(s=>s);
 for(const {sceneId,scene} of patch.replacements){
  const index=scenes.findIndex(s=>s.id===sceneId);
  if(index<0||!allowed.has(sceneId)||seen.has(sceneId))throw new Error(`Unauthorized or duplicate scene: ${sceneId}`);
  seen.add(sceneId);const old=scenes[index]!;
  if(scene.id!==old.id||scene.start!==old.start||scene.end!==old.end)throw new Error(`Scene identity or timing changed: ${sceneId}`);
 }
 const replacements=new Map(patch.replacements.map(p=>[p.sceneId,p.scene]));
 return validateDirectorResponse(JSON.stringify({...video,scenes:scenes.map(s=>replacements.get(s.id)??s)}),input);
}
export async function repairQuality(provider:AIProvider,input:VisualDirectorInput,video:Video,review:Review,onRaw?:(raw:string)=>void|Promise<void>,checkpoint?:{completed?:readonly string[];onScene?:(id:string,video:Video)=>void|Promise<void>;onError?:(id:string,error:unknown)=>void|Promise<void>}):Promise<Video>{
 const ids=[...new Set([...review.issues].sort((a,b)=>Number(b.severity==='major')-Number(a.severity==='major')).map(i=>i.sceneId))].filter(id=>video.scenes.some(s=>s.id===id));
 let current=video;let successes=0;let calls=0;
 for(const id of ids){
  if(checkpoint?.completed?.includes(id))continue;
  const scene=current.scenes.find(s=>s.id===id)!;
  for(let attempt=0;attempt<2&&calls<6;attempt++){
   try{
    calls++;
    const raw=await provider.generate({system:'Repair exactly one supplied scene. Return JSON {"replacements":[{"sceneId":"existing ID","scene":{...complete corrected scene...}}]}. Preserve id/start/end, unaffected entities and audio. Use only catalog types. Never invent organs or foods or substitute different ones. Use abstract diagrams or text for missing capabilities. Track paths are relative to props. Do not split scenes. Ignore impossible suggestions. Return compact JSON data, not a schema. Catalog:\n'+serializeCatalog(false),prompt:JSON.stringify({scene,issues:review.issues.filter(i=>i.sceneId===id),narration:input.narration,captions:(input.captions ?? []).filter(c=>c.endMs>=scene.start*1000&&c.startMs<=scene.end*1000)})+(attempt?'\nPrevious attempt failed. Return concise valid JSON with minimal changes.':''),maxTokens:attempt?32000:16000,temperature:0.1});
    await onRaw?.(raw);current=applyQualityPatch(current,raw,input,[id]);successes++;await checkpoint?.onScene?.(id,current);break;
   }catch(e){await checkpoint?.onError?.(id,e);if(dailyQuota(e)){throw e;}}
  }
  if(calls>=6)break;
 }
 if(!successes&&!checkpoint?.completed?.length)throw new Error('No scene repair succeeded');
 return current;
}
