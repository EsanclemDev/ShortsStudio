import React, {
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";

import * as THREE from "three";

import { useThree } from "@react-three/fiber";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  LiquidStreamConfig,
} from "./LiquidTypes";

import { LiquidMaterial } from "./LiquidMaterial";
import { LIQUID_PRESETS } from "./LiquidPresets";

const DROPLET_COUNT = 32;

export const LiquidStream: React.FC<
  LiquidStreamConfig
> = ({
  type = "water",
  from,
  to,
  radius = 0.06,
  speed = 1,
  curvature = 0.5,
  startFrame = 0,
  duration,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const invalidate = useThree(
    (state) => state.invalidate,
  );

  const meshRef =
    useRef<THREE.InstancedMesh>(null);

  const time =
    Math.max(0, frame - startFrame) / fps;

  const [fx, fy, fz] = from;
  const [tx, ty, tz] = to;

  const curve = useMemo(() => {
    const start = new THREE.Vector3(fx, fy, fz);
    const end = new THREE.Vector3(tx, ty, tz);

    const middle = start
      .clone()
      .lerp(end, 0.5);

    middle.y += curvature;

    return new THREE.QuadraticBezierCurve3(
      start,
      middle,
      end,
    );
  }, [fx, fy, fz, tx, ty, tz, curvature]);

  const dummy = useMemo(
    () => new THREE.Object3D(),
    [],
  );

  const up = useMemo(
    () => new THREE.Vector3(0, 1, 0),
    [],
  );

  const visible =
    frame >= startFrame &&
    (duration === undefined || time < duration);

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) return;

    for (let i = 0; i < DROPLET_COUNT; i++) {
      const progress =
        (i / DROPLET_COUNT + time * speed) % 1;

      const point = curve.getPoint(progress);

      const tangent = curve
        .getTangent(progress)
        .normalize();

      dummy.position.copy(point);

      dummy.quaternion.setFromUnitVectors(
        up,
        tangent,
      );

      dummy.scale.set(
        radius * 0.75,
        radius * 1.8,
        radius * 0.75,
      );

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;

    invalidate();
  }, [
    time,
    speed,
    radius,
    curve,
    dummy,
    up,
    invalidate,
  ]);

  const liquidColor =
    color ?? LIQUID_PRESETS[type].color;

  return (
    <group visible={visible}>
      {/* Continuous stream */}
      <mesh>
        <tubeGeometry
          args={[curve, 48, radius, 10, false]}
        />

        <LiquidMaterial
          type={type}
          color={color}
        />
      </mesh>

      {/* Moving droplets */}
      <instancedMesh
        ref={meshRef}
        args={[
          undefined,
          undefined,
          DROPLET_COUNT,
        ]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 8]} />

        <meshStandardMaterial
          color={liquidColor}
          emissive={liquidColor}
          emissiveIntensity={0.3}
          roughness={0.15}
        />
      </instancedMesh>
    </group>
  );
};