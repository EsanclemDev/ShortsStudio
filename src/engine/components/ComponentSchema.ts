import {z} from 'zod';

const id = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/);
const coordinate = z.number().finite().min(-100).max(100);
const vec3 = z.tuple([coordinate, coordinate, coordinate]);
const positive = z.number().finite().min(0.001).max(100);
const scale = z.tuple([positive, positive, positive]);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const material = z.strictObject({color, roughness:z.number().min(0).max(1).default(0.6), metalness:z.number().min(0).max(1).default(0), opacity:z.number().min(0).max(1).default(1)});
const vec2 = z.tuple([coordinate,coordinate]);
const geometry = z.discriminatedUnion('type', [
 z.strictObject({type:z.literal('sphere'),radius:positive}),
 z.strictObject({type:z.literal('box'),size:scale}),
 z.strictObject({type:z.literal('cylinder'),radiusTop:z.number().min(0).max(100),radiusBottom:z.number().min(0).max(100),height:positive}),
 z.strictObject({type:z.literal('capsule'),radius:positive,length:positive}),
 z.strictObject({type:z.literal('torus'),radius:positive,tube:positive}),
 z.strictObject({type:z.literal('organic'),rings:z.array(z.strictObject({x:coordinate,y:coordinate,z:coordinate,radiusY:positive,radiusZ:positive})).min(3).max(16)}),
 z.strictObject({type:z.literal('extrusion'),outline:z.array(vec2).min(3).max(64),depth:positive,bevel:z.number().min(0).max(2).default(0)}),
 z.strictObject({type:z.literal('tube'),points:z.array(vec3).min(2).max(32),radius:positive}),
 z.strictObject({type:z.literal('mesh'),vertices:z.array(vec3).min(3).max(1024),triangles:z.array(z.tuple([z.number().int().nonnegative(),z.number().int().nonnegative(),z.number().int().nonnegative()])).min(1).max(2048)})
]);
const part = z.strictObject({id,parentId:id.optional(),geometry,material,position:vec3.default([0,0,0]),rotation:vec3.default([0,0,0]),scale:scale.default([1,1,1])});
const common = {schemaVersion:z.literal(1),id,version:z.number().int().positive(),name:z.string().min(1).max(100),description:z.string().min(1).max(500),category:z.enum(['anatomy','object','micro','character','diagram','other'])};
export const Component3DSchema = z.strictObject({...common,dimension:z.literal('3d'),parts:z.array(part).min(1).max(64)});
// 2D is reserved for a future renderer; no executable SVG or markup accepted.
export const ComponentRequestSchema = z.strictObject({id, name:z.string().min(1).max(100),description:z.string().min(1).max(1000),category:common.category,dimension:z.enum(['2d','3d'])});
export type ComponentRequest = z.infer<typeof ComponentRequestSchema>;
export type Component3D = z.infer<typeof Component3DSchema>;
export function validateComponent(input:unknown):Component3D {
 const component=Component3DSchema.parse(input);
 const parts=new Map(component.parts.map(p=>[p.id,p]));
 if(parts.size!==component.parts.length) throw new Error('Duplicate part ID');
 for(const p of component.parts){
  const visited=new Set([p.id]);
  let parent=p.parentId;
  while(parent!==undefined){
   if(visited.has(parent)) throw new Error('Cyclic part hierarchy');
   visited.add(parent);
   const next=parts.get(parent);
   if(!next) throw new Error('Unknown parent: '+parent);
   if(visited.size>8) throw new Error('Part hierarchy exceeds maximum depth');
   parent=next.parentId;
  }
  const g=p.geometry;
  if(g.type==='organic' && g.rings.some((r,i)=>i>0 && r.x<=g.rings[i-1].x)) throw new Error('Organic rings must increase along X');
  if(g.type==='tube' && g.points.some((v,i)=>i>0 && v.every((n,j)=>n===g.points[i-1][j]))) throw new Error('Repeated tube point');
  if(g.type==='extrusion') {
   const area=g.outline.reduce((a,v,i)=>{const w=g.outline[(i+1)%g.outline.length];return a+v[0]*w[1]-v[1]*w[0];},0);
   if(Math.abs(area)<1e-6 || g.bevel>g.depth/2) throw new Error('Invalid extrusion area or bevel');
  }
  if(g.type==='mesh') for(const t of g.triangles){
   if(new Set(t).size!==3 || t.some(i=>i>=g.vertices.length)) throw new Error('Invalid mesh triangle');
   const [a,b,c]=t.map(i=>g.vertices[i]);const u=b.map((n,i)=>n-a[i]),v=c.map((n,i)=>n-a[i]);
   if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])<1e-8) throw new Error('Degenerate mesh triangle');
  }
  if(p.geometry.type==='cylinder' && p.geometry.radiusTop===0 && p.geometry.radiusBottom===0) throw new Error('Degenerate cylinder');
 }
 return component;
}
