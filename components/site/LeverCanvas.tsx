"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, ShaderMaterial } from "three";

function Rain() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });
  return (
    <mesh position={[0, 0, -1.6]}>
      <planeGeometry args={[7.2, 4.4]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`varying vec2 vUv; uniform float uTime;
          void main() {
            float columns = 48.0;
            float rows = 28.0;
            float col = floor(vUv.x * columns);
            float speed = 0.35 + mod(col, 5.0) * 0.08;
            float y = fract(vUv.y + uTime * speed + col * 0.037);
            float cell = floor(y * rows);
            float glyph = step(0.82, fract(sin(col * 12.9898 + cell * 78.233) * 43758.5453));
            float depth = 0.25 + 0.75 * step(0.5, fract(col * 0.17));
            float alpha = glyph * y * 0.22 * depth;
            gl_FragColor = vec4(0.24, 1.0, 0.54, alpha);
          }`}
      />
    </mesh>
  );
}

function LeverRig() {
  const rig = useRef<Group>(null);
  useFrame(() => {
    if (!rig.current) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    const target = -0.62 + progress * 0.85;
    rig.current.rotation.z += (target - rig.current.rotation.z) * 0.08;
  });
  return (
    <group ref={rig}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 3.5, 20]} />
        <meshStandardMaterial color="#143022" emissive="#3DFF8A" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-1.72, 0, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#FF5D6C" emissive="#FF5D6C" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[1.55, 0.05, 0]}>
        <sphereGeometry args={[0.42, 32, 24]} />
        <meshStandardMaterial color="#07140c" emissive="#3DFF8A" emissiveIntensity={0.45} wireframe />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-0.2 + index * 0.45, 0.16, 0.12]} rotation={[0, 0.4, 0.2]}>
          <boxGeometry args={[0.16, 0.28, 0.03]} />
          <meshStandardMaterial color="#0A0C0B" emissive="#3DFF8A" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Fulcrum() {
  const ref = useRef<Mesh>(null);
  return (
    <mesh ref={ref} position={[0, -0.42, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.28, 0.5, 4]} />
      <meshStandardMaterial color="#102117" emissive="#3DFF8A" emissiveIntensity={0.25} />
    </mesh>
  );
}

function FrameBudget() {
  const { invalidate } = useThree();
  useEffect(() => {
    const id = window.setInterval(() => invalidate(), 33);
    return () => window.clearInterval(id);
  }, [invalidate]);
  return null;
}

export default function LeverCanvas() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.15, 4.4], fov: 38 }}
      frameloop="demand"
    >
      <FrameBudget />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 3]} intensity={8} color="#3DFF8A" />
      <Rain />
      <Fulcrum />
      <LeverRig />
      <ContactShadows opacity={0.4} scale={7} blur={2.2} far={2} color="#02140a" position={[0, -0.7, 0]} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.45} luminanceThreshold={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
