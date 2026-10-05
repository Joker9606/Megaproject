import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleConstellation({ count = 80, mouseReaction = true }: { count?: number; mouseReaction?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate initial particle positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 16;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 8;

      vel[i3] = (Math.random() - 0.5) * 0.008;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.008;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    return [pos, vel];
  }, [count]);

  const linePositions = useMemo(() => {
    // Max lines = count * count
    return new Float32Array(count * count * 6);
  }, [count]);

  const lineColors = useMemo(() => {
    return new Float32Array(count * count * 6);
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const pointer = state.pointer;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const currentPos = posAttr.array as Float32Array;

    let lineIndex = 0;
    const maxDistance = 2.4;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions
      currentPos[i3] += velocities[i3];
      currentPos[i3 + 1] += velocities[i3 + 1];
      currentPos[i3 + 2] += velocities[i3 + 2];

      // Bounce off boundaries
      if (Math.abs(currentPos[i3]) > 8) velocities[i3] *= -1;
      if (Math.abs(currentPos[i3 + 1]) > 5) velocities[i3 + 1] *= -1;
      if (Math.abs(currentPos[i3 + 2]) > 4) velocities[i3 + 2] *= -1;

      // Mouse influence
      if (mouseReaction) {
        const dx = pointer.x * 6 - currentPos[i3];
        const dy = pointer.y * 4 - currentPos[i3 + 1];
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 3.0) {
          currentPos[i3] += dx * 0.002;
          currentPos[i3 + 1] += dy * 0.002;
        }
      }

      // Check neighbor distances for connecting lines
      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        const dx = currentPos[i3] - currentPos[j3];
        const dy = currentPos[i3 + 1] - currentPos[j3 + 1];
        const dz = currentPos[i3 + 2] - currentPos[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          const alpha = 1.0 - dist / maxDistance;

          // Line start point
          linePositions[lineIndex] = currentPos[i3];
          linePositions[lineIndex + 1] = currentPos[i3 + 1];
          linePositions[lineIndex + 2] = currentPos[i3 + 2];

          // Line end point
          linePositions[lineIndex + 3] = currentPos[j3];
          linePositions[lineIndex + 4] = currentPos[j3 + 1];
          linePositions[lineIndex + 5] = currentPos[j3 + 2];

          // Color start
          lineColors[lineIndex] = 0.02; // R
          lineColors[lineIndex + 1] = 0.75 * alpha; // G
          lineColors[lineIndex + 2] = 0.95 * alpha; // B

          // Color end
          lineColors[lineIndex + 3] = 0.23; // R
          lineColors[lineIndex + 4] = 0.51 * alpha; // G
          lineColors[lineIndex + 5] = 0.96 * alpha; // B

          lineIndex += 6;
        }
      }
    }

    posAttr.needsUpdate = true;

    // Update lines geometry
    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.subarray(0, lineIndex), 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors.subarray(0, lineIndex), 3));
  });

  return (
    <group>
      {/* Particle points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#38BDF8"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic connecting lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function ParticleNetwork3D({ className = '', count = 70 }: { className?: string; count?: number }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ParticleConstellation count={count} />
      </Canvas>
    </div>
  );
}
