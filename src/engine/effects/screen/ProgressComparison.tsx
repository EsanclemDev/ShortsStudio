import React from "react";
import {EnergyMeter} from "./EnergyMeter";
export const ProgressComparison: React.FC<{left:number;right:number;week:number}> = ({left,right,week}) => <div style={{position:"absolute",bottom:220,left:70,right:70,padding:24,background:"#071421",borderRadius:20,color:"white",fontFamily:"Arial",fontSize:32}}>SEMANA {week} · EJEMPLO ILUSTRATIVO<EnergyMeter value={left} label="SIN CREATINA" color="#ef4444"/><EnergyMeter value={right} label="CON CREATINA"/></div>;
