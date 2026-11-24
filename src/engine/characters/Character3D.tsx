import React, {
  useMemo,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";

import { renderToStaticMarkup } from "react-dom/server";

import {
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";

import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Character } from "./Character";

import {
  getCharacterPose,
  type CharacterAction,
} from "../animations/characterAnimations";

type Character3DProps = {
  action?: CharacterAction;
  position?: [number, number, number];
  size?: number;
  startFrame?: number;
  billboard?: boolean;
  mouthOpen?: number;
};

export const Character3D: React.FC<Character3DProps> = ({
  action = "idle",
  position = [0, 0, 0],
  size = 4,
  startFrame = 0,
  billboard = true,
  mouthOpen = 1
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { camera, invalidate } = useThree();

  const groupRef = useRef<THREE.Group>(null);

  const time = Math.max(0, frame - startFrame) / fps;

  const {
    offsetY,
    rotation,
    scale,
    ...characterProps
  } = getCharacterPose(action, time);

  const textureWidth = 1008;
  const textureHeight = 1320;

  const canvas = useMemo(() => {
    const element = document.createElement("canvas");

    element.width = textureWidth;
    element.height = textureHeight;

    return element;
  }, []);

  const texture = useMemo(() => {
    const result = new THREE.CanvasTexture(canvas);

    result.colorSpace = THREE.SRGBColorSpace;
    result.minFilter = THREE.LinearFilter;
    result.magFilter = THREE.LinearFilter;
    result.generateMipmaps = false;

    return result;
  }, [canvas]);

  const svg = renderToStaticMarkup(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={textureWidth}
      height={textureHeight}
      viewBox="-120 -50 840 1100"
    >
      <g>
        <Character
  {...characterProps}
  mouthOpen={
    mouthOpen ?? characterProps.mouthOpen
  }
/>
      </g>
    </svg>,
  );

  useLayoutEffect(() => {
    const handle = delayRender("Updating character texture");

    const image = new Image();

    let finished = false;

    const finish = () => {
      if (!finished) {
        finished = true;
        continueRender(handle);
      }
    };

    image.onload = () => {
      const context = canvas.getContext("2d");

      if (!context) {
        finish();
        cancelRender(
          new Error("Unable to create character canvas"),
        );
        return;
      }

      context.clearRect(
        0,
        0,
        textureWidth,
        textureHeight,
      );

      context.drawImage(
        image,
        0,
        0,
        textureWidth,
        textureHeight,
      );

      texture.needsUpdate = true;

      invalidate();

      finish();
    };

    image.onerror = () => {
      finish();

      cancelRender(
        new Error("Unable to load character SVG"),
      );
    };

    image.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svg);

    return () => {
      image.onload = null;
      image.onerror = null;

      finish();
    };
  }, [svg, canvas, texture, invalidate]);

  useLayoutEffect(() => {
    if (!groupRef.current) {
      return;
    }

    if (billboard) {
      groupRef.current.rotation.y = Math.atan2(
        camera.position.x - position[0],
        camera.position.z - position[2],
      );
    }

    invalidate();
  });

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const planeWidth =
    size * (textureWidth / textureHeight);

  return (
    <group
      ref={groupRef}
      position={position}
    >
      <mesh
        position={[
          0,
          size * 0.5 - 0.45 - offsetY * 0.004,
          0,
        ]}
        rotation={[
          0,
          0,
          -THREE.MathUtils.degToRad(rotation),
        ]}
        scale={[scale, scale, 1]}
        castShadow={false}
      >
        <planeGeometry args={[planeWidth, size]} />

        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />

        <meshDepthMaterial
          attach="customDepthMaterial"
          map={texture}
          alphaTest={0.5}
          depthPacking={THREE.RGBADepthPacking}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};