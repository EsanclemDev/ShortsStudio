import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ObjectConfig } from "./ObjectTypes";
import { OBJECT_REGISTRY } from "./ObjectRegistry";
import { getObjectPose } from "../animations/objectAnimations";
export const Object3D: React.FC<ObjectConfig> = ({type, position=[0,0,0], rotation=[0,0,0], scale=1, animation="static", speed=1, startFrame=0, options}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = Math.max(0, frame-startFrame)/fps;
  const progress = Math.min(1, Math.max(0,time*speed));
  const pose = getObjectPose(animation === "open" || animation === "pour" ? "static" : animation,time,speed);
  const Model = OBJECT_REGISTRY[type];
  if(frame<startFrame) return null;
  return <group position={[position[0]+pose.offsetX,position[1]+pose.offsetY,position[2]]}
    rotation={[rotation[0]+pose.rotationX,rotation[1]+pose.rotationY,rotation[2]+pose.rotationZ+(animation === "pour" ? -1.9*Math.min(1,progress*2):0)]} scale={scale*pose.scale}>
    <Model {...options} time={time*speed} open={animation === "open" ? progress : options?.open} fill={animation === "pour" ? (options?.fill ?? 1)*(1-Math.max(0,progress*2-1)):options?.fill}/>
  </group>;
};
