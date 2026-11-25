import React,{useMemo,useEffect} from 'react';
import {createAdvancedGeometry,type Advanced} from './AdvancedGeometry';
const AdvancedMesh:React.FC<{geometry:Advanced}>=({geometry})=>{const geo=useMemo(()=>createAdvancedGeometry(geometry),[geometry]);useEffect(()=>()=>geo.dispose(),[geo]);return <primitive object={geo} attach="geometry"/>;};
import type {Component3D} from './ComponentSchema';
type Part=Component3D['parts'][number];
const Geometry:React.FC<{geometry:Part['geometry']}>=({geometry:g})=>{
 switch(g.type){
 case 'organic':case 'extrusion':case 'tube':case 'mesh':return <AdvancedMesh geometry={g}/>;
 case 'sphere':return <sphereGeometry args={[g.radius,32,24]}/>;
 case 'box':return <boxGeometry args={g.size}/>;
 case 'cylinder':return <cylinderGeometry args={[g.radiusTop,g.radiusBottom,g.height,32]}/>;
 case 'capsule':return <capsuleGeometry args={[g.radius,g.length,8,24]}/>;
 case 'torus':return <torusGeometry args={[g.radius,g.tube,16,48]}/>;
 }
};
export const ComponentRenderer:React.FC<{component:Component3D}>=({component})=>{
 const render=(p:Part):React.ReactElement=><group key={p.id} position={p.position} rotation={p.rotation} scale={p.scale}>
 <mesh><Geometry geometry={p.geometry}/><meshStandardMaterial {...p.material} transparent={p.material.opacity<1} depthWrite={p.material.opacity===1}/></mesh>
 {component.parts.filter(child=>child.parentId===p.id).map(render)}
 </group>;
 return <group>{component.parts.filter(p=>!p.parentId).map(render)}</group>;
};
