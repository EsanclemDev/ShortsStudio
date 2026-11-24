import React from "react";

export const GridWorld: React.FC = () => {
  return (
    <>
      <color
        attach="background"
        args={["#041522"]}
      />

      <fog
        attach="fog"
        args={["#041522", 15, 45]}
      />

      {/* Resplandor ambiental */}
      <mesh scale={50}>
        <sphereGeometry args={[1, 32, 32]} />

        <shaderMaterial
          side={1}
          depthWrite={false}
          uniforms={{
            topColor: {
              value: [0.015, 0.045, 0.075],
            },
            horizonColor: {
              value: [0.025, 0.20, 0.30],
            },
          }}
          vertexShader={`
            varying vec3 vPosition;

            void main() {
              vPosition = position;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;

            uniform vec3 topColor;
            uniform vec3 horizonColor;

            void main() {
              float h = normalize(vPosition).y;

              float glow = exp(
                -abs(h) * 5.0
              );

              vec3 color = mix(
                topColor,
                horizonColor,
                glow
              );

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {/* Suelo */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />

        <meshStandardMaterial
          color="#062436"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      <gridHelper
        args={[
          100,
          100,
          "#1688b0",
          "#0b4059",
        ]}
        position={[0, 0.005, 0]}
      />
    </>
  );
};