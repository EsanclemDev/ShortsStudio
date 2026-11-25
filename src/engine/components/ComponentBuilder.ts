import {z} from 'zod';
import {parseAIJson, type AIProvider} from '../ai/providers/AIProvider';
import {Component3DSchema, ComponentRequestSchema, validateComponent, type Component3D, type ComponentRequest} from './ComponentSchema';

export async function buildComponent(provider:AIProvider, request:ComponentRequest, onCandidate?:(attempt:number,raw:string)=>Promise<void>):Promise<Component3D>{
 const input=ComponentRequestSchema.parse(request);
 if(input.dimension!=='3d') throw new Error('Only 3D components are supported in v0.8.2');
 const system='Create a recognizable stylized educational 3D model from declarative geometry. Return only a JSON instance, never a schema or code. Prefer one continuous organic surface for organs, not overlapping ellipsoids. Organic rings run left to right along X, with center y/z and elliptical radii radiusY/radiusZ; use small end rings and smoothly varying middle rings. Extrusion uses a simple non-self-intersecting XY polygon, depth along Z. Tube follows XYZ points. Mesh uses zero-based outward-wound triangles; prefer compact organic rings over explicit meshes. Use overlapping smooth shapes only for separate anatomical structures, coherent colors, centered geometry, typical overall size 2-4 units, radians for rotations, local transforms relative to parent. Avoid excessive nesting or extreme scales. Omit optional fields when defaults suffice; use short IDs, compact JSON, coordinates rounded to 3 decimals. For molecules use spheres and cylinders with correct connectivity; for pasta use a modest number of curved tubes with 5-10 points each. Preserve essential scientific structure. No text, external assets or invented geometry types. Match requested id, category, dimension; version 1. Schema: '+JSON.stringify(z.toJSONSchema(Component3DSchema,{io:'input'}));
 let feedback='';
 for(let attempt=1;attempt<=3;attempt++){
  let raw:string;
  try {
   raw=await provider.generate({system,prompt:JSON.stringify({request:input,feedback}),temperature:0.2,maxTokens:[8192,16000,32000][attempt-1]});
  } catch(e) {
   if(!/response truncated/i.test(String(e)) || attempt===3) throw e;
   feedback='Previous response exceeded output limit. Return compact complete JSON; omit default fields and unnecessary detail.';
   continue;
  }
  await onCandidate?.(attempt,raw);
  try{
   const candidate=validateComponent(parseAIJson(raw));
   if(candidate.id!==input.id||candidate.category!==input.category||candidate.version!==1) throw new Error('Component identity/category/version mismatch');
   return candidate;
  }catch(e){feedback=String(e).slice(0,4000);if(attempt===3)throw new Error('Component validation failed: '+feedback);}
 }
 throw new Error('Component generation exhausted');
}
