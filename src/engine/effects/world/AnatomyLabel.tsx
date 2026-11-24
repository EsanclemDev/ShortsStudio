import React, {
  useMemo,
  useEffect,
} from "react";

import * as THREE from "three";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { LabelConfig } from "../EffectTypes";

import {
  getEffectState,
  smoothstep,
} from "../EffectAnimations";

export const AnatomyLabel: React.FC<LabelConfig> = ({
  text,
  position,
  target,
  color = "#ffffff",
  fontSize = 64,
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

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 1024;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Cannot create label texture");
    }

    ctx.fillStyle = "rgba(4, 15, 25, 0.88)";

    ctx.beginPath();
    ctx.roundRect(10, 30, 1004, 196, 35);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    ctx.fillText(text, 512, 128, 940);

    const result = new THREE.CanvasTexture(canvas);

    result.colorSpace = THREE.SRGBColorSpace;

    return result;
  }, [text, color, fontSize]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const line = useMemo(() => {
    const start = new THREE.Vector3(...target);
    const end = new THREE.Vector3(...position);

    const direction = end.clone().sub(start);

    const length = direction.length();

    const quaternion = new THREE.Quaternion()
      .setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      );

    return {
      midpoint: start.clone().lerp(end, 0.5),
      length,
      quaternion,
    };
  }, [position, target]);

  const opacity = smoothstep(time * 4);

  if (!visible) return null;

  return (
    <group>
      {/* Connector */}
      {line.length > 0.001 && (
        <mesh
          position={line.midpoint}
          quaternion={line.quaternion}
        >
          <cylinderGeometry
            args={[0.012, 0.012, line.length, 8]}
          />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Target point */}
      <mesh position={target}>
        <sphereGeometry args={[0.045, 16, 12]} />

        <meshBasicMaterial color={color} />
      </mesh>

      {/* Camera-facing label */}
      <sprite
        position={position}
        scale={[1.8, 0.45, 1]}
      >
        <spriteMaterial
          map={texture}
          transparent
          opacity={opacity}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
};