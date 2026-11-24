import React, {
  useMemo,
  useEffect,
} from "react";

import * as THREE from "three";

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { GlowConfig } from "./EffectTypes";

import { getEffectState } from "./EffectAnimations";

export const GlowEffect: React.FC<GlowConfig> = ({
  position = [0, 1.5, 0],
  color = "#38bdf8",
  radius = 1,
  intensity = 0.8,
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

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Cannot create glow texture");
    }

    const gradient = ctx.createRadialGradient(
      128, 128, 0,
      128, 128, 128,
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.5)");
    gradient.addColorStop(0.65, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const pulse =
    1 + Math.sin(time * speed * 3) * 0.12;

  const size = radius * 2 * pulse;

  return (
    <sprite
      position={position}
      scale={[size, size, 1]}
      visible={visible}
    >
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={Math.min(1, Math.max(0, intensity))}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
};