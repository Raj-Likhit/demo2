"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

type StarMode = "intro" | "hero" | "logo";

function createStarGeometry() {
  // A four-point silhouette with curved shoulders, extruded and smoothly bevelled.
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.68);
  shape.bezierCurveTo(0.11, 0.75, 0.24, 0.30, 0.47, 0.18);
  shape.bezierCurveTo(0.70, 0.08, 1.08, 0.045, 1.68, 0);
  shape.bezierCurveTo(1.08, -0.045, 0.70, -0.08, 0.47, -0.18);
  shape.bezierCurveTo(0.24, -0.30, 0.11, -0.75, 0, -1.68);
  shape.bezierCurveTo(-0.11, -0.75, -0.24, -0.30, -0.47, -0.18);
  shape.bezierCurveTo(-0.70, -0.08, -1.08, -0.045, -1.68, 0);
  shape.bezierCurveTo(-1.08, 0.045, -0.70, 0.08, -0.47, 0.18);
  shape.bezierCurveTo(-0.24, 0.30, -0.11, 0.75, 0, 1.68);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.17,
    bevelSize: 0.12,
    bevelSegments: 8,
    curveSegments: 32
  });
  geometry.center();

  // Round/smooth normals for a soft, sculptural metal appearance.
  geometry.computeVertexNormals();
  return geometry;
}

function StarObject({ mode }: { mode: Exclude<StarMode, "logo"> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createStarGeometry(), []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    if (mode === "intro") {
      mesh.current.rotation.y += delta * 0.34;
      mesh.current.rotation.x = Math.sin(t * 0.65) * 0.08;
      mesh.current.rotation.z = Math.sin(t * 0.35) * 0.025;
    } else {
      mesh.current.rotation.y = Math.sin(t * 0.34) * 0.18;
      mesh.current.rotation.x = Math.sin(t * 0.48) * 0.10;
      mesh.current.rotation.z = -0.10 + Math.sin(t * 0.25) * 0.035;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#d9dce0"
        metalness={1}
        roughness={0.13}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={1.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function StarCanvas({ mode }: { mode: Exclude<StarMode, "logo"> }) {
  const isIntro = mode === "intro";

  return (
    <Canvas
      camera={{ position: [0, 0, isIntro ? 5.4 : 5.2], fov: 36 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <ambientLight intensity={0.32} />
      <directionalLight position={[3.5, 4, 5]} intensity={3.2} />
      <directionalLight position={[-4, -2, 3]} intensity={2.6} />
      <pointLight position={[0, 2, -2]} intensity={1.4} color="#ffffff" />
      <Environment preset="studio" />
      <Float
        speed={isIntro ? 1.1 : 0.7}
        rotationIntensity={isIntro ? 0.10 : 0.05}
        floatIntensity={isIntro ? 0.18 : 0.10}
      >
        <StarObject mode={mode} />
      </Float>
    </Canvas>
  );
}

function LogoStar() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 2 C56 34 66 44 98 50 C66 56 56 66 50 98 C44 66 34 56 2 50 C34 44 44 34 50 2Z" fill="currentColor" />
    </svg>
  );
}

export default function ChromeStar({ mode = "hero" }: { mode?: StarMode }) {
  if (mode === "logo") {
    return <LogoStar />;
  }

  return (
    <div className={`chrome-star chrome-star--${mode}`}>
      <StarCanvas mode={mode} />
    </div>
  );
}
