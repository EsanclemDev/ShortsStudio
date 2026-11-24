import React, { useMemo } from "react";

import * as THREE from "three";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { ArrowConfig } from "../EffectTypes";

import {
  getEffectState,
  smoothstep,
} from "../EffectAnimations";

export const Arrow3D: React.FC<ArrowConfig> = ({
  from,
  to,
  color = "#22c55e",
  thickness = 0.045,
  animated = true,
  speed = 1,
  startFrame = 0,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { time, visible } = getEffectState(
    frame,
    fps,
    startFrame,
    duration,
  );

  const [fx, fy, fz] = from;
  const [tx, ty, tz] = to;

  const data = useMemo(() => {
    const start = new THREE.Vector3(fx, fy, fz);
    const end = new THREE.Vector3(tx, ty, tz);

    const direction = end.clone().sub(start);

    const length = direction.length();

    direction.normalize();

    const quaternion = new THREE.Quaternion()
      .setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction,
      );

    return {
      start,
      length,
      quaternion,
    };
  }, [fx, fy, fz, tx, ty, tz]);

  const progress = animated
    ? smoothstep(time * speed * 2)
    : 1;

  const length = data.length * progress;

  if (!visible || length < 0.001) {
    return null;
  }

  const headLength = Math.min(
    thickness * 5,
    length * 0.35,
  );

  const shaftLength = length - headLength;

  return (
    <group
      position={data.start}
      quaternion={data.quaternion}
    >
      {/* Shaft */}
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry
          args={[
            thickness,
            thickness,
            shaftLength,
            12,
          ]}
        />

        <meshBasicMaterial
          color={color}
          toneMapped={false}
        />
      </mesh>

      {/* Arrowhead */}
      <mesh
        position={[
          0,
          shaftLength + headLength / 2,
          0,
        ]}
      >
        <coneGeometry
          args={[
            thickness * 2.6,
            headLength,
            16,
          ]}
        />

        <meshBasicMaterial
          color={color}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};