import {join} from 'node:path';
import {z} from 'zod';
import {ComponentRegistry} from '../../src/engine/components/ComponentRegistry';
import {Component3DSchema} from '../../src/engine/components/ComponentSchema';
import {AnimationSchema} from '../../src/engine/components/ComponentAnimation';
import {VideoSchema} from '../../src/engine/director/schemas/VideoSchema';
import {entityProps} from '../../src/engine/director/schemas/EntitySchema';
import {read,save,run} from './shared';
import {prepareContext,exists} from './prepare-context';
import {inspectComponent} from '../../src/engine/components/ComponentNormalizer';
import {Production,Patch} from './shared';
run(async()=>{
 const [folder]=process.argv.slice(2);
 if(!folder)throw new Error('Usage: export-context.ts folder');
 const input=await prepareContext(folder);
 const registry=new ComponentRegistry();
 const catalog=await registry.list();
 const assets=await Promise.all(catalog.map(async entry=>{
  const component=await registry.getComponent(entry.id,entry.version);
  const animations=await Promise.all(entry.animations.map(async id=>{
   const animation=await registry.getAnimation(entry.id,entry.version,id);
   return {animation,spatial:inspectComponent(component,animation)};
  }));
  return {...entry,component,spatial:inspectComponent(component),animationDetails:animations};
 }));
 const schema=(s:z.ZodType)=>z.toJSONSchema(s,{unrepresentable:'any'});
 const example=await read(join('tools','manual','examples','strength.json'));
 const current=join(folder,'video.json');
 await save(join(folder,'manual-context.json'),{
  schemaVersion:1,contextRevision:2,input,
  schemas:{video:schema(VideoSchema),entityProps:Object.fromEntries(Object.entries(entityProps).map(([k,v])=>[k,schema(v)])),component:schema(Component3DSchema),animation:schema(AnimationSchema),production:schema(Production),patch:schema(Patch)},
  catalog:assets,examples:{strength:example},currentVideo:await exists(current)?await read(current):undefined,
  contract:{schemaVersion:1,video:'VideoSchema object',assets:[{component:'Component3DSchema object',animations:['AnimationSchema objects']}]},
  patchContract:{schemaVersion:1,videoId:'existing video ID',scenes:['complete replacement scenes with identical id/start/end'],assets:[]},
  visualProfile:{channel:'elcuerpoenclaro',language:'es',shirtColor:'#DC2626',presentation:'clean',subtitles:'dynamic',guidance:'Avoid redundant titles; prioritize clear visual explanation and meaningful changes every 2–4 seconds.'},
  spatialRules:['Three.js coordinates: Y up, X horizontal, Z depth; rotations in radians.','Bounds are source-space AABBs; motion bounds are sampled, not exact guarantees.','Normalization offset and scale are optional; omit anchor when assigning normalization props.','Camera framing depends on aspect ratio, distance and object bounds.'],
  rules:['Use existing catalog references or supply new versioned assets.','Preserve input duration, fps, dimensions and audio paths.','Scene times absolute; entity times scene-local; entity track times entity-local.','Initialize animated properties; keyframes strictly increasing and inside entity lifetime.','Scale must remain positive; use entity end to hide.','Loop animation endpoints must match.','No code or API calls.','Use Spanish visible text and meaningful visual changes.','Examples are illustrative: use current input audio and timing, not example paths.']
 });
 console.log('Manual context exported: '+join(folder,'manual-context.json'));
});
