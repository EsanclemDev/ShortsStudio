import React from "react";
import {useCurrentFrame,useVideoConfig} from "remotion";
import {getWorkoutState,type WorkoutConfig} from "../../animations/workout";
export const RepCounter: React.FC<{workout: WorkoutConfig; startFrame?: number; animationSpeed?: number; animationOffset?: number; color?: string; label?: string}> = ({workout,startFrame=0,animationSpeed=1,animationOffset=0,color="#22c55e",label="REPS"}) => {
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const state=getWorkoutState(Math.max(0,Math.max(0,frame-startFrame)/fps*animationSpeed+animationOffset),workout);
 return <div style={{background:"#071421",border:`2px solid ${color}`,borderRadius:18,padding:16,color,fontFamily:"Arial",textAlign:"center",flex:1}}><div style={{fontSize:32,fontWeight:700}}>{label}</div><div style={{fontSize:64,fontWeight:900}}>{state.count}</div><div style={{fontSize:24,fontWeight:state.failed?900:500,color:state.failed?"#ff5252":state.success?"#4ade80":color}}>{state.failed?"¡FALLO MUSCULAR!":state.success?"¡COMPLETADO!":state.done?"AL LÍMITE":"REPETICIONES"}</div></div>;
};
