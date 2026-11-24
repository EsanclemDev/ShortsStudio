import React, {useMemo,useEffect} from "react";
import * as THREE from "three";
import type {SupplementOptions} from "../ObjectTypes";
export const CreatineJar3D: React.FC<SupplementOptions> = ({label="CREATINA",open=0}) => {
 const texture=useMemo(()=>{
  const canvas=document.createElement("canvas"); canvas.width=1024;canvas.height=512;
  const ctx=canvas.getContext("2d")!;
  ctx.fillStyle="#101827";ctx.fillRect(0,0,1024,512);
  ctx.fillStyle="#22c55e";ctx.fillRect(0,35,1024,35);ctx.fillRect(0,430,1024,35);
  ctx.textAlign="center";ctx.fillStyle="#ffffff";ctx.font="bold 100px Arial";ctx.fillText(label,512,240,950);
  ctx.font="bold 40px Arial";ctx.fillText("MONOHIDRATO",512,320,950);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
 },[label]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group>
  <mesh position={[0,.48,0]}><cylinderGeometry args={[.43,.43,.96,48]}/><meshStandardMaterial color="#182231" roughness={.5}/></mesh>
  <mesh position={[0,.48,0]} rotation={[0,Math.PI/2,0]}><cylinderGeometry args={[.434,.434,.72,48,1,true]}/><meshStandardMaterial map={texture} roughness={.7}/></mesh>
  <mesh position={[0,.955,0]}><cylinderGeometry args={[.36,.36,.015,40]}/><meshStandardMaterial color="#f5f1e8"/></mesh>
  <group position={[-open*.95,1.04+open*.18,-open*.18]} rotation={[0,0,-open*.3]}>
   <mesh><cylinderGeometry args={[.46,.46,.15,48]}/><meshStandardMaterial color="#222b39" roughness={.8}/></mesh>
   {Array.from({length:32},(_,i)=>{const a=i*Math.PI/16;return <mesh key={i} position={[.458*Math.cos(a),0,.458*Math.sin(a)]}><boxGeometry args={[.018,.12,.018]}/><meshStandardMaterial color="#414b59"/></mesh>})}
  </group>
 </group>;
};
