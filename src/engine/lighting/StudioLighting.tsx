import React from "react";

export const StudioLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.7} />

      <hemisphereLight
        args={["#a8eaff", "#041522", 1.2]}
      />

      {/* Luz principal */}
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Luz de relleno */}
      <pointLight
        position={[-5, 3, 4]}
        intensity={25}
        color="#168cff"
      />

      {/* Contraluz */}
      <pointLight
        position={[0, 5, -5]}
        intensity={35}
        color="#00d9ff"
      />
    </>
  );
};