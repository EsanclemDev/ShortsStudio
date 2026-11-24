import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

type ContactShadowProps = {
  position?: [number, number, number];
  size?: number;
  opacity?: number;
};

export const ContactShadow: React.FC<
  ContactShadowProps
> = ({
  position = [0, 0.015, 0],
  size = 2,
  opacity = 0.65,
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create shadow");
    }

    const gradient = context.createRadialGradient(
      64, 64, 0,
      64, 64, 64,
    );

    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.4, "rgba(0,0,0,0.6)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[size, size * 0.55]} />

      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
};