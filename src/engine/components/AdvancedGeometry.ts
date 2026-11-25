import {BufferGeometry,Float32BufferAttribute,CatmullRomCurve3,Vector3,Shape,ExtrudeGeometry,TubeGeometry} from 'three';
import type {Component3D} from './ComponentSchema';
type G=Component3D['parts'][number]['geometry'];
export type Advanced=Extract<G,{type:'organic'|'extrusion'|'tube'|'mesh'}>;
export function createAdvancedGeometry(g:Advanced):BufferGeometry {
 if(g.type==='extrusion'){
  const shape=new Shape();g.outline.forEach(([x,y],i)=>i===0?shape.moveTo(x,y):shape.lineTo(x,y));shape.closePath();
  const geo=new ExtrudeGeometry(shape,{depth:g.depth,bevelEnabled:g.bevel>0,bevelSize:g.bevel,bevelThickness:g.bevel,bevelSegments:3,steps:1});geo.translate(0,0,-g.depth/2);return geo;
 }
 if(g.type==='tube')return new TubeGeometry(new CatmullRomCurve3(g.points.map(p=>new Vector3(...p))),64,g.radius,12,false);
 const geo=new BufferGeometry();
 if(g.type==='mesh'){geo.setAttribute('position',new Float32BufferAttribute(g.vertices.flat(),3));geo.setIndex(g.triangles.flat());}
 else {
  const positions:number[]=[],indices:number[]=[];const segments=32,steps=(g.rings.length-1)*8;
  const centers=new CatmullRomCurve3(g.rings.map(r=>new Vector3(r.x,r.y,r.z)),false,'catmullrom',0.35);
  const radii=new CatmullRomCurve3(g.rings.map(r=>new Vector3(r.radiusY,r.radiusZ,0)),false,'catmullrom',0.35);
  for(let i=0;i<=steps;i++){
   const c=centers.getPoint(i/steps),r=radii.getPoint(i/steps);
   for(let j=0;j<segments;j++){const a=j/segments*Math.PI*2;positions.push(c.x,c.y+Math.max(.001,r.x)*Math.cos(a),c.z+Math.max(.001,r.y)*Math.sin(a));}
  }
  for(let i=0;i<steps;i++)for(let j=0;j<segments;j++){const a=i*segments+j,b=i*segments+(j+1)%segments,c=a+segments,d=b+segments;indices.push(a,b,c,b,d,c);}
  const first=g.rings[0],last=g.rings[g.rings.length-1];const start=positions.length/3;positions.push(first.x,first.y,first.z,last.x,last.y,last.z);
  for(let j=0;j<segments;j++){const k=(j+1)%segments;indices.push(start,k,j,start+1,steps*segments+j,steps*segments+k);}
  geo.setAttribute('position',new Float32BufferAttribute(positions,3));geo.setIndex(indices);
 }
 geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();return geo;
}
