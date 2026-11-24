import React from "react";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { MicroConfig } from "./MicroTypes";
import { MICRO_REGISTRY } from "./MicroRegistry";
import { getMicroPose } from "./MicroAnimations";

export const MicroObject: React.FC<MicroConfig> = ({
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

  const time =
    Math.max(0, frame - startFrame) / fps;

  const pose = getMicroPose(
    animation,
    time,
    speed,
    intensity,
    duration,
  );

  const Model = MICRO_REGISTRY[type];

  if (frame < startFrame) {
    return null;
  }

  const dividing =
    type === "cell" &&
    animation === "division";

  const daughterScale =
    1 - pose.division * (1 - Math.cbrt(0.5));

  return (
    <group
      position={[
        position[0] + pose.offsetX,
        position[1] + pose.offsetY,
        position[2],
      ]}
      rotation={[
        rotation[0] + pose.rotationX,
        rotation[1] + pose.rotationY,
        rotation[2] + pose.rotationZ,
      ]}
      scale={[
        scale * pose.scaleX,
        scale * pose.scaleY,
        scale * pose.scaleZ,
      ]}
    >
      {dividing ? (
        <>
          <group
            position={[-pose.division * 0.85, 0, 0]}
            scale={daughterScale}
          >
            <Model
              color={color}
              activity={pose.activity}
            />
          </group>

          {pose.division > 0.01 && (
            <group
              position={[pose.division * 0.85, 0, 0]}
              scale={daughterScale}
            >
              <Model
                color={color}
                activity={pose.activity}
              />
            </group>
          )}
        </>
      ) : (
        <Model
          color={color}
          activity={pose.activity}
        />
      )}
    </group>
  );
};