import assert from 'node:assert/strict';
import {validateComponent} from '../../src/engine/components/ComponentSchema';
import {createAdvancedGeometry,type Advanced} from '../../src/engine/components/AdvancedGeometry';
const base={schemaVersion:1,id:'test-organ',version:1,name:'Test',description:'Fixture',category:'anatomy',dimension:'3d'};
const parse=(geometry:unknown)=>validateComponent({...base,parts:[{id:'body',geometry,material:{color:'#aa3344'}}]}).parts[0].geometry;
const rings=[{x:-1,y:0,z:0,radiusY:.05,radiusZ:.05},{x:0,y:.1,z:0,radiusY:.8,radiusZ:.5},{x:1,y:0,z:0,radiusY:.05,radiusZ:.05}];
for(const g of [{type:'organic',rings},{type:'tube',points:[[0,0,0],[1,1,0],[2,0,0]],radius:.1},{type:'extrusion',outline:[[0,0],[1,0],[0,1]],depth:.3,bevel:.05},{type:'mesh',vertices:[[0,0,0],[1,0,0],[0,1,0]],triangles:[[0,1,2]]}]){
 const geo=createAdvancedGeometry(parse(g) as Advanced);assert.ok(geo.getAttribute('position').count>0);assert.ok(Array.from(geo.getAttribute('position').array).every(Number.isFinite));geo.dispose();
}
assert.throws(()=>parse({type:'organic',rings:[...rings].reverse()}));
assert.throws(()=>parse({type:'mesh',vertices:[[0,0,0],[1,0,0],[0,1,0]],triangles:[[0,1,3]]}));
assert.throws(()=>parse({type:'tube',points:[[0,0,0],[0,0,0]],radius:.1}));
console.log('Component geometry smoke test OK');
