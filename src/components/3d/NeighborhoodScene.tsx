import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { NeighborhoodHotspot } from '../../types';

// Stylized modern architectural house
function ModernHouse({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#1E293B',
  roofColor = '#3B82F6',
  accentColor = '#06B6D4',
  hasSolar = false,
  hasBalcony = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  roofColor?: string;
  accentColor?: string;
  hasSolar?: boolean;
  hasBalcony?: boolean;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* House Main Body Ground Floor */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.8, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Upper Floor Cantilever */}
      <mesh position={[0.1, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.6, 0.85]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Modern Balcony */}
      {hasBalcony && (
        <mesh position={[0.1, 0.8, 0.5]}>
          <boxGeometry args={[0.85, 0.2, 0.2]} />
          <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.8} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Glowing Warm Windows */}
      <mesh position={[0.22, 0.45, 0.49]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial color="#67E8F9" emissive="#06B6D4" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[-0.22, 0.45, 0.49]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial color="#FDE047" emissive="#EAB308" emissiveIntensity={0.7} roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.95, 0.44]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial color="#67E8F9" emissive="#0284C7" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>

      {/* Slanted Geometric Roof */}
      <mesh position={[0.1, 1.35, 0]} castShadow>
        <coneGeometry args={[0.7, 0.35, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Neon Edge Accent Strip */}
      <mesh position={[0.1, 0.68, 0.48]}>
        <boxGeometry args={[0.9, 0.04, 0.04]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Solar Panel Module */}
      {hasSolar && (
        <mesh position={[0.2, 1.4, 0.15]} rotation={[-0.4, 0.3, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.35]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
        </mesh>
      )}

      {/* Base Foundation slab with perimeter glow */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
        <meshStandardMaterial color="#0A1124" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Stylized miniature tree with layered foliage
function MiniTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
        <meshStandardMaterial color="#78350F" roughness={0.9} />
      </mesh>
      {/* Layered Foliage Cones */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <coneGeometry args={[0.28, 0.45, 7]} />
        <meshStandardMaterial color="#059669" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.2, 0.35, 7]} />
        <meshStandardMaterial color="#10B981" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.12, 0.25, 7]} />
        <meshStandardMaterial color="#34D399" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Wind Turbine
function WindTurbine({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const bladesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * 2.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Mast */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.06, 1.8, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Nacelle */}
      <mesh position={[0, 1.8, 0.08]}>
        <boxGeometry args={[0.12, 0.12, 0.25]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} />
      </mesh>
      {/* Rotating Blades */}
      <group ref={bladesRef} position={[0, 1.8, 0.22]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
          <mesh key={idx} rotation={[0, 0, angle]} position={[0, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, 0.01]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Animated Service Dispatch Vehicle
function MovingServiceVan({ radius = 2.7, speed = 0.5, offset = 0, color = '#3B82F6' }: { radius?: number; speed?: number; offset?: number; color?: string }) {
  const vanRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (vanRef.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      vanRef.current.position.set(x, 0.1, z);
      vanRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={vanRef}>
      {/* Van Body */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.16, 0.14, 0.32]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.1, 0.1]}>
        <boxGeometry args={[0.15, 0.08, 0.1]} />
        <meshStandardMaterial color="#000" roughness={0.1} />
      </mesh>
      {/* Headlight Beams */}
      <mesh position={[0.05, 0.06, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#FDE047" />
      </mesh>
      <mesh position={[-0.05, 0.06, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#FDE047" />
      </mesh>
      {/* Taillights */}
      <mesh position={[0.05, 0.06, -0.16]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[-0.05, 0.06, -0.16]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// Streetlight
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// Central Community Hub with spinning radar
function CentralHub({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const radarDishRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.9;
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 1.2;
    }
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Main Hub Tower */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.85, 1.5, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Hexagonal Tech Pillars */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, idx) => (
        <mesh key={idx} position={[Math.cos(ang) * 0.75, 0.5, Math.sin(ang) * 0.75]}>
          <cylinderGeometry args={[0.06, 0.08, 1.0, 6]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Glowing Energy Core */}
      <mesh ref={coreRef} position={[0, 1.6, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#38BDF8" emissive="#00F0FF" emissiveIntensity={1.8} />
      </mesh>

      {/* Rotating Radar Dish */}
      <group ref={radarDishRef} position={[0, 2.0, 0]}>
        <mesh rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.25, 0.15, 12, 1, true]} />
          <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Holographic Radar Ring */}
      <mesh ref={ringRef} position={[0, 1.6, 0]}>
        <torusGeometry args={[0.65, 0.02, 16, 32]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.0} />
      </mesh>

      {/* Pulsing Base Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.2, 32]} />
        <meshStandardMaterial color="#3B82F6" emissive="#2563EB" emissiveIntensity={0.8} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Interactive Hotspot Pin
function HotspotMarker({
  hotspot,
  isSelected,
  onSelect,
}: {
  hotspot: NeighborhoodHotspot;
  isSelected: boolean;
  onSelect: (spot: NeighborhoodHotspot) => void;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = state.clock.getElapsedTime() * 2.5;
      const s = 1 + Math.sin(t) * 0.3;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={hotspot.position}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.4}>
        <group
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hotspot);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          {/* Glowing Pin Sphere */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.24, 20, 20]} />
            <meshStandardMaterial
              color={hotspot.color}
              emissive={hotspot.color}
              emissiveIntensity={hovered || isSelected ? 1.6 : 0.9}
              roughness={0.1}
              metalness={0.6}
            />
          </mesh>

          {/* Pulse ring */}
          <mesh ref={pulseRef} position={[0, 0.85, 0]}>
            <ringGeometry args={[0.3, 0.38, 24]} />
            <meshBasicMaterial color={hotspot.color} transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>

          {/* Pin stem */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.02, 0.04, 0.85, 8]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.8} />
          </mesh>

          {/* Tooltip Overlay */}
          {(hovered || isSelected) && (
            <Html position={[0, 1.35, 0]} center distanceFactor={8}>
              <div className="bg-navy-950/95 backdrop-blur-md border border-cyan-500/50 px-3.5 py-2.5 rounded-2xl shadow-glow-cyan text-xs text-white whitespace-nowrap pointer-events-none transform -translate-y-2 transition-all">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {hotspot.service}
                </div>
                <div className="text-slate-200 text-[11px] font-semibold mt-0.5">{hotspot.proName}</div>
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mt-1">
                  <span className="text-amber-400 font-bold">⭐ {hotspot.rating}</span>
                  <span className="text-emerald-400 font-semibold">📍 {hotspot.distance}</span>
                </div>
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}

// Animated Network Connection Splines
function ConnectionCurves() {
  const lineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.children.forEach((child, idx) => {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        if (mat) {
          mat.opacity = 0.35 + Math.sin(state.clock.getElapsedTime() * 3 + idx) * 0.3;
        }
      });
    }
  });

  const curves = [
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(-1.2, 1.2, -0.9),
      new THREE.Vector3(-2.4, 0.6, -1.8)
    ),
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(1.0, 1.1, 0.6),
      new THREE.Vector3(2.1, 0.5, 1.2)
    ),
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0.9, 1.3, -1.1),
      new THREE.Vector3(1.8, 0.4, -2.2)
    ),
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(-0.9, 1.0, 1.0),
      new THREE.Vector3(-1.9, 0.5, 2.0)
    ),
  ];

  return (
    <group ref={lineRef}>
      {curves.map((curve, idx) => {
        const points = curve.getPoints(30);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: idx % 2 === 0 ? 0x06b6d4 : 0x3b82f6,
                  transparent: true,
                  opacity: 0.6,
                })
              )
            }
          />
        );
      })}
    </group>
  );
}

export function NeighborhoodScene({
  hotspots = [],
  onSelectHotspot,
  themeMode = 'cyber',
}: {
  hotspots?: NeighborhoodHotspot[];
  onSelectHotspot?: (spot: NeighborhoodHotspot) => void;
  themeMode?: 'cyber' | 'daylight' | 'radar';
}) {
  const [selectedSpot, setSelectedSpot] = useState<NeighborhoodHotspot | null>(null);

  const handleSelect = (spot: NeighborhoodHotspot) => {
    setSelectedSpot(spot);
    if (onSelectHotspot) onSelectHotspot(spot);
  };

  const isDay = themeMode === 'daylight';
  const isRadar = themeMode === 'radar';

  return (
    <>
      <ambientLight intensity={isDay ? 1.4 : 0.9} />
      <directionalLight position={[10, 15, 10]} intensity={isDay ? 2.2 : 1.6} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.7} color={isRadar ? '#10B981' : '#38BDF8'} />
      <pointLight position={[0, 4, 0]} intensity={2.5} color={isRadar ? '#34D399' : '#06B6D4'} distance={12} />

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.7}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 3.8}
      />

      <group position={[0, -0.6, 0]}>
        {/* Main Base Island / Cyber Platform */}
        <mesh position={[0, -0.15, 0]} receiveShadow>
          <cylinderGeometry args={[4.3, 4.5, 0.35, 48]} />
          <meshStandardMaterial
            color={isDay ? '#1E293B' : isRadar ? '#022C22' : '#070D1B'}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>

        {/* Outer Glowing Edge Conduit */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.25, 4.38, 48]} />
          <meshBasicMaterial color={isRadar ? '#10B981' : '#00F0FF'} transparent opacity={0.9} />
        </mesh>

        {/* Circular Roadway Track */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.45, 2.95, 48]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.68, 2.72, 48]} />
          <meshBasicMaterial color={isRadar ? '#34D399' : '#38BDF8'} transparent opacity={0.5} />
        </mesh>

        {/* Animated Moving Service Vehicles */}
        <MovingServiceVan radius={2.7} speed={0.6} offset={0} color="#3B82F6" />
        <MovingServiceVan radius={2.7} speed={0.6} offset={Math.PI * 0.7} color="#10B981" />
        <MovingServiceVan radius={2.7} speed={0.6} offset={Math.PI * 1.4} color="#F59E0B" />

        {/* Streetlamps */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, idx) => (
          <StreetLamp key={idx} position={[Math.cos(angle) * 3.05, 0, Math.sin(angle) * 3.05]} />
        ))}

        {/* Central Community Hub */}
        <CentralHub position={[0, 0, 0]} />

        {/* Modern Houses */}
        <ModernHouse position={[-2.2, 0, -1.6]} rotation={[0, 0.4, 0]} color="#1E293B" roofColor="#3B82F6" accentColor="#38BDF8" hasSolar />
        <ModernHouse position={[2.0, 0, 1.1]} rotation={[0, -0.6, 0]} color="#0F172A" roofColor="#06B6D4" accentColor="#00F0FF" hasSolar />
        <ModernHouse position={[1.7, 0, -2.1]} rotation={[0, 0.8, 0]} color="#1E293B" roofColor="#10B981" accentColor="#34D399" />
        <ModernHouse position={[-1.8, 0, 1.9]} rotation={[0, -0.3, 0]} color="#0F172A" roofColor="#8B5CF6" accentColor="#A78BFA" hasSolar />
        <ModernHouse position={[-2.8, 0, 0.3]} rotation={[0, 1.2, 0]} color="#1E293B" roofColor="#F59E0B" accentColor="#FCD34D" />
        <ModernHouse position={[2.7, 0, -0.4]} rotation={[0, -1.1, 0]} color="#0F172A" roofColor="#EC4899" accentColor="#F472B6" />

        {/* Miniature Trees */}
        <MiniTree position={[-1.2, 0, -2.4]} scale={0.9} />
        <MiniTree position={[-2.7, 0, -1.0]} scale={0.75} />
        <MiniTree position={[1.2, 0, -2.8]} scale={0.85} />
        <MiniTree position={[2.9, 0, 0.8]} scale={0.9} />
        <MiniTree position={[1.1, 0, 2.4]} scale={0.8} />
        <MiniTree position={[-1.1, 0, 2.7]} scale={0.85} />
        <MiniTree position={[-2.9, 0, 1.4]} scale={0.7} />

        {/* Wind Turbines on platform edge */}
        <WindTurbine position={[3.6, 0, -1.8]} scale={0.8} />
        <WindTurbine position={[-3.6, 0, 1.8]} scale={0.8} />

        {/* Connection Spline Curves */}
        <ConnectionCurves />

        {/* Interactive Hotspot Pins */}
        {hotspots.map((spot) => (
          <HotspotMarker
            key={spot.id}
            hotspot={spot}
            isSelected={selectedSpot?.id === spot.id}
            onSelect={handleSelect}
          />
        ))}

        {/* Ambient Sparkles */}
        <Sparkles
          count={55}
          scale={6}
          size={3}
          speed={0.5}
          opacity={0.7}
          color={isRadar ? '#34D399' : '#38BDF8'}
        />
      </group>
    </>
  );
}
