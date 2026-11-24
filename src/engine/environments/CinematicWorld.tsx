import React, { useMemo } from "react";
import * as THREE from "three";
import { GymEnvironment } from "./gym/GymEnvironment";
import { EnvironmentFloor } from "./EnvironmentFloor";
import type {
  EnvironmentPreset,
} from "./EnvironmentTypes";

import {
  ENVIRONMENT_PRESETS,
} from "./EnvironmentPresets";

type Props = {
  preset?: EnvironmentPreset;
};

const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;

  varying vec3 vPosition;

  void main() {
    float height = normalize(vPosition).y;

    float glow = exp(
      -abs(height) * 4.0
    );

    vec3 color = mix(
      topColor,
      horizonColor,
      glow * 0.85
    );

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const CinematicWorld: React.FC<Props> = ({
  preset = "studio",
}) => {
  const config = ENVIRONMENT_PRESETS[preset];

  const uniforms = useMemo(
    () => ({
      topColor: {
        value: new THREE.Color(
          config.background,
        ),
      },
      horizonColor: {
        value: new THREE.Color(
          config.horizon,
        ),
      },
    }),
    [config.background, config.horizon],
  );

  return (
    <>
      <color
        attach="background"
        args={[config.background]}
      />

      <fog
        attach="fog"
        args={[
          config.horizon,
          config.fogNear,
          config.fogFar,
        ]}
      />

      {/* Atmospheric background */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 32, 32]} />

        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {preset === "gym" ? <GymEnvironment /> : <EnvironmentFloor preset={preset} />}
    </>
  );
};