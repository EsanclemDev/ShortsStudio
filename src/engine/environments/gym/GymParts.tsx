import React from "react";
export type Vec3 = [number, number, number];
export const Box: React.FC<{position: Vec3; size: Vec3; color: string; metalness?: number; rotation?: Vec3}> = ({position,size,color,metalness=0.1,rotation=[0,0,0]}) => (
  <mesh position={position} rotation={rotation} receiveShadow>
    <boxGeometry args={size}/><meshStandardMaterial color={color} roughness={0.65} metalness={metalness}/>
  </mesh>
);
export const Dumbbell: React.FC<{position: Vec3; scale?: number}> = ({position,scale=1}) => (
  <group position={position} scale={scale}>
    <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.035,0.035,0.42,12]}/><meshStandardMaterial color="#aebdca" metalness={0.7} roughness={0.35}/></mesh>
    {[-1,1].map(side => <mesh key={side} position={[side*0.19,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[0.13,0.13,0.13,6]}/><meshStandardMaterial color="#252b33" roughness={0.9}/></mesh>)}
  </group>
);
