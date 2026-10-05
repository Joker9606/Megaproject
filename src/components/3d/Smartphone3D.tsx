import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Html, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MapPin, Zap, Phone, Clock, Bell, Compass } from 'lucide-react';

function Floating3DBadge({
  position,
  text,
  subtext,
  icon: Icon,
  color = '#06B6D4',
  delay = 0,
}: {
  position: [number, number, number];
  text: string;
  subtext: string;
  icon: any;
  color?: string;
  delay?: number;
}) {
  const badgeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (badgeRef.current) {
      const t = state.clock.getElapsedTime() + delay;
      badgeRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group ref={badgeRef} position={position}>
      <Html transform distanceFactor={2.5} center>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-navy-950/95 border border-cyan-500/40 backdrop-blur-xl shadow-glow-cyan text-xs text-white whitespace-nowrap select-none pointer-events-none">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-white">{text}</div>
            <div className="text-[9px] text-cyan-300 font-medium">{subtext}</div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function PhoneModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.12;
      groupRef.current.rotation.x = 0.08 + Math.cos(state.clock.getElapsedTime() * 0.3) * 0.04;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Smartphone Outer Titanium Frame */}
        <RoundedBox args={[2.25, 4.5, 0.18]} radius={0.22} smoothness={6} castShadow>
          <meshStandardMaterial color="#1E293B" metalness={0.95} roughness={0.12} />
        </RoundedBox>

        {/* Screen Glass Face */}
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[2.1, 4.3]} />
          <meshStandardMaterial color="#020617" metalness={0.2} roughness={0.08} />
        </mesh>

        {/* Camera Bump on the Back */}
        <mesh position={[0.55, 1.45, -0.11]}>
          <boxGeometry args={[0.7, 0.7, 0.05]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Floating Interactive App Screen UI via Drei Html */}
        <Html
          position={[0, 0, 0.1]}
          transform
          scale={0.19}
          distanceFactor={1.5}
          className="w-[305px] h-[615px] bg-navy-950/98 text-white rounded-[34px] p-4 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800 select-none pointer-events-auto"
        >
          {/* Top Status Bar */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 px-1">
            <span className="font-bold text-white text-xs">9:41</span>
            {/* Dynamic Island */}
            <div className="w-20 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-xs"></div>
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-cyan-400" /> Indiranagar, Bengaluru
              </div>
              <div className="text-xs font-extrabold text-white">Smart Help Network</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center relative">
              <Bell className="w-3.5 h-3.5 text-cyan-300" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-ping"></span>
            </div>
          </div>

          {/* App Hyperlocal Mini Map View */}
          <div className="my-2 h-36 rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-2.5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-25 bg-grid-pattern"></div>
            <div className="relative z-10 flex justify-between items-center text-[10px]">
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Dispatch
              </span>
              <span className="text-cyan-300 font-bold">ETA: 12 min</span>
            </div>

            {/* Radar Center Pulse */}
            <div className="relative z-10 mx-auto my-auto flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-cyan-400/40 animate-ping absolute"></div>
              <div className="w-9 h-9 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <Zap className="w-4.5 h-4.5 text-cyan-300" />
              </div>
            </div>

            <div className="relative z-10 text-[9px] text-slate-200 text-center font-medium">
              Pro on way: <span className="font-bold text-white">Rajesh Sharma (Master Electrician)</span>
            </div>
          </div>

          {/* Active Service Card in App */}
          <div className="p-3 rounded-2xl bg-slate-900/95 border border-cyan-500/30 shadow-lg">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Pro"
                className="w-9 h-9 rounded-xl object-cover border border-cyan-400"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">Rajesh Sharma</span>
                  <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded">Verified Pro</span>
                </div>
                <div className="text-[9px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <span className="text-amber-400 font-bold">⭐ 4.98</span>
                  <span>•</span>
                  <span>Govt Certified #EL-8942</span>
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-300 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-cyan-400" /> Arriving in 12m
              </span>
              <button className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-[10px] flex items-center gap-1 shadow-md shadow-blue-500/20">
                <Phone className="w-2.5 h-2.5" /> Call Pro
              </button>
            </div>
          </div>

          {/* App Bottom Quick Dock */}
          <div className="pt-2 flex justify-around text-slate-400 border-t border-slate-800/80 text-[9px] font-semibold">
            <div className="text-cyan-400 font-bold flex flex-col items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <span>Explore</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Bookings</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Messages</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span>Account</span>
            </div>
          </div>
        </Html>

        {/* Orbiting 3D Holographic Badges */}
        <Floating3DBadge
          position={[1.8, 1.2, 0.4]}
          text="100% Verified"
          subtext="Aadhaar & Police Checked"
          icon={Zap}
          delay={0}
        />
        <Floating3DBadge
          position={[-1.8, -1.0, 0.4]}
          text="Hyperlocal Match"
          subtext="Under 15-min Response"
          icon={MapPin}
          delay={1.5}
        />

        <Sparkles count={30} scale={4} size={2} speed={0.4} opacity={0.6} color="#38BDF8" />
      </group>
    </Float>
  );
}

export function Smartphone3D() {
  const [webglSupported, setWebglSupported] = useState(true);

  return (
    <div className="relative w-full h-[500px] md:h-[580px] flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none"></div>

      {/* Subtle Hint */}
      <div className="absolute top-2 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag phone in 3D</span>
      </div>

      {webglSupported ? (
        <Canvas camera={{ position: [0, 0, 5.4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 10, 5]} intensity={1.8} />
          <directionalLight position={[-5, -5, -2]} intensity={0.7} color="#06B6D4" />
          <PhoneModel />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 2.3} />
        </Canvas>
      ) : (
        /* Fallback mockup */
        <div className="w-[280px] h-[520px] bg-slate-900 border-4 border-slate-700 rounded-[36px] p-4 shadow-2xl flex flex-col justify-between">
          <div className="text-center font-bold text-sm text-cyan-400">Smart Neighborhood App</div>
          <div className="text-center text-xs text-slate-400">Mobile Experience</div>
        </div>
      )}
    </div>
  );
}
