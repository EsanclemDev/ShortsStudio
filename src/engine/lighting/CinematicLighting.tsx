import React from "react";

import type {
  EnvironmentPreset,
} from "../environments/EnvironmentTypes";

import {
  ENVIRONMENT_PRESETS,
} from "../environments/EnvironmentPresets";

type Props = {
  preset?: EnvironmentPreset;
};

export const CinematicLighting: React.FC<Props> = ({
  preset = "studio",
}) => {
  const config = ENVIRONMENT_PRESETS[preset];

  return (
    <>
      <ambientLight
        color={config.ambientColor}
        intensity={config.ambientIntensity}
      />

      <hemisphereLight
        args={[
          config.horizon,
          config.background,
          1.2,
        ]}
      />

      {/* Key light */}
      <directionalLight
        position={[4, 8, 5]}
        color={config.keyColor}
        intensity={config.keyIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Fill light */}
      <pointLight
        position={[-5, 3, 4]}
        color={config.fillColor}
        intensity={config.fillIntensity}
      />

      {/* Rim light */}
      <pointLight
        position={[0, 5, -5]}
        color={config.rimColor}
        intensity={config.rimIntensity}
      />
    </>
  );
};