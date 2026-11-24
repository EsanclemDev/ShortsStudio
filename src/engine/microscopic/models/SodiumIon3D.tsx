import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

import type { MicroModelProps } from "../MicroTypes";
import { MicroMaterial } from "../MicroMaterial";

export const SodiumIon3D: React.FC<MicroModelProps> = ({
  color = "#fbbf24",
  activity = 0,
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Cannot create sodium texture");
    }

    ctx.clearRect(0, 0, 256, 256);

    ctx.font = "bold 100px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#422006";
    ctx.fillText("Na⁺", 128, 128);

    const result = new THREE.CanvasTexture(canvas);

    result.colorSpace = THREE.SRGBColorSpace;

    return result;
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.75, 32, 24]} />

        <MicroMaterial
          color={color}
          activity={activity}
        />
      </mesh>

      <mesh renderOrder={2}>
        <sphereGeometry args={[0.85, 32, 24]} />

        <MicroMaterial
          color={color}
          opacity={0.12}
        />
      </mesh>

      <sprite scale={[1.5, 1.5, 1]}>
        <spriteMaterial
          map={texture}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
};