import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { AnatomyConfig } from "./AnatomyTypes";

import { ANATOMY_REGISTRY } from "./AnatomyRegistry";

import { getOrganPose } from "./AnatomyAnimations";

export const AnatomyOrgan: React.FC<AnatomyConfig> = ({
  type,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = "static",
  speed = 1,
  intensity = 1,
  duration = 3,
  color,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = Math.max(0, frame - startFrame) / fps;

  const pose = getOrganPose(
    animation,
    time,
    speed,
    intensity,
    duration,
  );

  const Model = ANATOMY_REGISTRY[type];

  if (frame < startFrame) {
    return null;
  }

  return (
    <group
      position={[
        position[0],
        position[1] + pose.offsetY,
        position[2],
      ]}
      rotation={[
        rotation[0],
        rotation[1] + pose.rotationY,
        rotation[2],
      ]}
      scale={scale}
    >
      <group position={[0, 1, 0]}>
        <group
          scale={[
            pose.scaleX,
            pose.scaleY,
            pose.scaleZ,
          ]}
        >
          <group position={[0, -1, 0]}>
            <Model
              color={color}
              activity={pose.activity}
            />
          </group>
        </group>
      </group>
    </group>
  );
};