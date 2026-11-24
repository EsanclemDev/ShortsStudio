import React, {
  useMemo,
  useEffect,
} from "react";

import * as THREE from "three";

import type {
  EnvironmentPreset,
} from "./EnvironmentTypes";

import {
  ENVIRONMENT_PRESETS,
} from "./EnvironmentPresets";

type Props = {
  preset?: EnvironmentPreset;
};

const TEXTURE_SIZE = 512;

const createFloorTexture = (
  preset: EnvironmentPreset,
): THREE.CanvasTexture => {
  const config = ENVIRONMENT_PRESETS[preset];

  const canvas = document.createElement("canvas");

  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Cannot create floor texture");
  }

  const size = TEXTURE_SIZE;

  ctx.fillStyle = config.floor;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = config.gridPrimary;
  ctx.lineWidth = 2;

  switch (preset) {
    case "studio": {
      const step = 64;

      ctx.globalAlpha = 0.65;

      for (let i = 0; i <= size; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }

      break;
    }

    case "medical": {
      const tileSize = 128;

      for (let x = 0; x < size; x += tileSize) {
        for (let y = 0; y < size; y += tileSize) {
          const alternate =
            (x / tileSize + y / tileSize) % 2 === 0;

          ctx.fillStyle = alternate
            ? "#547986"
            : "#456773";

          ctx.fillRect(
            x + 2,
            y + 2,
            tileSize - 4,
            tileSize - 4,
          );

          ctx.strokeStyle = "#7296a1";
          ctx.lineWidth = 2;

          ctx.strokeRect(
            x + 4,
            y + 4,
            tileSize - 8,
            tileSize - 8,
          );
        }
      }

      break;
    }

    case "microscopic": {
      const step = 64;

      for (let x = -step; x <= size; x += step) {
        for (let y = -step; y <= size; y += step) {
          const offset =
            Math.floor(y / step) % 2 === 0
              ? 0
              : step / 2;

          const cx = x + offset;
          const cy = y;

          const gradient = ctx.createRadialGradient(
            cx,
            cy,
            3,
            cx,
            cy,
            30,
          );

          gradient.addColorStop(0, "#503477");
          gradient.addColorStop(0.7, "#30204c");
          gradient.addColorStop(1, config.floor);

          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.arc(cx, cy, 30, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#68478f";
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      break;
    }

    case "danger": {
      const radius = size / (6 * Math.sqrt(3));

      const hexWidth = Math.sqrt(3) * radius;
      const hexHeight = radius * 1.5;

      ctx.strokeStyle = "#a83b46";
      ctx.lineWidth = 3;

      for (let row = -1; row < 14; row++) {
        for (let col = -1; col < 8; col++) {
          const cx =
            col * hexWidth +
            (row % 2 === 0 ? 0 : hexWidth / 2);

          const cy = row * hexHeight;

          ctx.beginPath();

          for (let side = 0; side < 6; side++) {
            const angle =
              Math.PI / 3 * side - Math.PI / 2;

            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);

            if (side === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.closePath();

          ctx.fillStyle =
            (row + col) % 3 === 0
              ? "#451820"
              : "#300c12";

          ctx.fill();
          ctx.stroke();
        }
      }

      break;
    }

    case "healthy": {
      ctx.strokeStyle = "#287c5b";
      ctx.lineWidth = 3;

      for (let y = 0; y < size; y += 32) {
        ctx.beginPath();

        for (let x = 0; x <= size; x++) {
          const wave =
            y +
            Math.sin(
              x / size * Math.PI * 4,
            ) * 10;

          if (x === 0) {
            ctx.moveTo(x, wave);
          } else {
            ctx.lineTo(x, wave);
          }
        }

        ctx.stroke();
      }

      break;
    }

    case "dark": {
      ctx.fillStyle = "#101018";
      ctx.fillRect(0, 0, size, size);

      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(12, 12);

  texture.anisotropy = 4;

  texture.needsUpdate = true;

  return texture;
};

export const EnvironmentFloor: React.FC<Props> = ({
  preset = "studio",
}) => {
  const texture = useMemo(
    () => createFloorTexture(preset),
    [preset],
  );

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const roughness =
    preset === "dark"
      ? 0.25
      : preset === "medical"
        ? 0.4
        : 0.85;

  const metalness =
    preset === "dark"
      ? 0.35
      : preset === "danger"
        ? 0.2
        : 0.05;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />

      <meshStandardMaterial
        map={texture}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
};