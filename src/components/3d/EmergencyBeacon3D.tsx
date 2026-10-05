import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function BeaconModel() {
  const pulse1 = useRef<THREE.Mesh>(null);
  const pulse2 = useRef<THREE.Mesh>(null);
  const pulse3 = useRef<THREE.Mesh>(null);
  const beaconCore = useRef<THREE.Mesh>(null);
  const outerCageRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (pulse1.current) {
      const s1 = 1 + (t % 2) * 1.8;
      pulse1.current.scale.set(s1, s1, s1);
      (pulse1.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - (t % 2) / 2);
    }

    if (pulse2.current) {
      const s2 = 1 + ((t + 0.6) % 2) * 1.8;
      pulse2.current.scale.set(s2, s2, s2);
      (pulse2.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - ((t + 0.6) % 2) / 2);
    }

    if (pulse3.current) {
      const s3 = 1 + ((t + 1.2) % 2) * 1.8;
      pulse3.current.scale.set(s3, s3, s3);
      (pulse3.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - ((t + 1.2) % 2) / 2);
    }

    if (beaconCore.current) {
      beaconCore.current.rotation.y += delta * 2.5;
      beaconCore.current.rotation.z += delta * 1.2;
    }

    if (outerCageRef.current) {
      outerCageRef.current.rotation.y -= delta * 1.5;
      outerCageRef.current.rotation.x += delta * 0.8;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={[0, 0, 0]}>
        {/* Core Octahedron Beacon Crystal */}
        <mesh ref={beaconCore} position={[0, 0.45, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#DC2626"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Outer glowing diamond cage */}
        <mesh ref={outerCageRef} position={[0, 0.45, 0]}>
          <octahedronGeometry args={[0.75, 0]} />
          <meshBasicMaterial color="#F59E0B" wireframe transparent opacity={0.7} />
        </mesh>

        {/* Floating Equatorial Gyro Ring */}
        <group ref={ringRef} position={[0, 0.45, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.95, 0.02, 16, 32]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.05, 0.02, 16, 32]} />
            <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Base Pillar */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.35, 0.5, 8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Radiating Expanding Sonic Pulse Waves */}
        <mesh ref={pulse1} position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 32]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>

        <mesh ref={pulse2} position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>

        <mesh ref={pulse3} position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        <Sparkles count={45} scale={3.5} size={3} speed={1.2} opacity={0.9} color="#F59E0B" />
      </group>
    </Float>
  );
}

export function EmergencyBeacon3D() {
  return (
    <div className="w-full h-56 md:h-72 relative flex items-center justify-center pointer-events-none">
      <Canvas camera={{ position: [0, 1.6, 3.8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.0} />
        <pointLight position={[0, 2, 2]} intensity={3.5} color="#EF4444" />
        <pointLight position={[0, -2, -2]} intensity={2.0} color="#F59E0B" />
        <BeaconModel />
      </Canvas>
    </div>
  );
}
