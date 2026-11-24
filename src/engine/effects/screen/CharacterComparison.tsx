import React from "react";
export const CharacterComparison: React.FC<{left:React.ReactNode;right:React.ReactNode;bottom?:number}> = ({left,right,bottom=220}) => <div style={{position:"absolute",bottom,left:70,right:70,display:"flex",gap:30}}>{left}{right}</div>;
