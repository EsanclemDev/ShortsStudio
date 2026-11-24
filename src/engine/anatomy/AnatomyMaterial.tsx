import React from "react";

type Props = {
  color: string;
  activity?: number;
  roughness?: number;
  opacity?: number;
};

export const AnatomyMaterial: React.FC<Props> = ({
  color,
  activity = 0,
  roughness = 0.55,
  opacity = 1,
}) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.02}
      emissive={color}
      emissiveIntensity={0.03 + activity * 0.25}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity >= 1}
    />
  );
};