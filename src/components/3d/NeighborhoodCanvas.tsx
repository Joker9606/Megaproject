import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeighborhoodScene } from './NeighborhoodScene';
import { NeighborhoodHotspot } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { ShieldCheck, MapPin, Radio, Compass, Sun, Moon, Radar } from 'lucide-react';

interface NeighborhoodCanvasProps {
  onSelectPro?: (proName: string, service: string) => void;
}

export function NeighborhoodCanvas({ onSelectPro }: NeighborhoodCanvasProps) {
  const { hotspots, pros } = useNetwork();
  const [activeHotspot, setActiveHotspot] = useState<NeighborhoodHotspot | null>(null);
  const [themeMode, setThemeMode] = useState<'cyber' | 'daylight' | 'radar'>('cyber');
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const handleHotspotSelect = (spot: NeighborhoodHotspot) => {
    setActiveHotspot(spot);
    if (onSelectPro) {
      onSelectPro(spot.proName, spot.service);
    }
  };

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-[36px] overflow-hidden glass-card glow-border shadow-2xl bg-gradient-to-b from-navy-900/90 via-navy-950/95 to-navy-950">
      {/* Top Floating Status Indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-navy-900/95 border border-cyan-500/40 text-xs text-slate-200 backdrop-blur-xl shadow-glow-cyan">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-cyan-300">Live Hyperlocal Mesh</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">{pros.length} Certified Pros Nearby</span>
      </div>

      {/* 3D Theme Mode Switcher Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-2xl bg-navy-900/90 border border-slate-700/60 backdrop-blur-md shadow-lg">
        <button
          onClick={() => setThemeMode('cyber')}
          title="Cyber Night Mode"
          className={`p-1.5 rounded-xl text-xs transition ${
            themeMode === 'cyber'
              ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setThemeMode('radar')}
          title="Radar Mesh Mode"
          className={`p-1.5 rounded-xl text-xs transition ${
            themeMode === 'radar'
              ? 'bg-emerald-500 text-navy-950 font-bold shadow-glow-emerald'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radar className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setThemeMode('daylight')}
          title="Daylight Mode"
          className={`p-1.5 rounded-xl text-xs transition ${
            themeMode === 'daylight'
              ? 'bg-amber-400 text-navy-950 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Control Hint badge */}
      <div className="absolute top-16 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-900/80 border border-slate-700/50 text-[11px] text-slate-400 backdrop-blur-sm">
        <Compass className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag to orbit 360°</span>
      </div>

      {/* 3D Canvas / WebGL */}
      {webglSupported ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs tracking-wider uppercase font-semibold text-cyan-300">Loading 3D Smart Neighborhood...</p>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 5, 6], fov: 45 }}
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            className="cursor-grab active:cursor-grabbing"
          >
            <NeighborhoodScene
              hotspots={hotspots}
              onSelectHotspot={handleHotspotSelect}
              themeMode={themeMode}
            />
          </Canvas>
        </Suspense>
      ) : (
        /* Fallback 2.5D styled graphic if WebGL unavailable */
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-grid-pattern relative">
          <div className="relative w-64 h-64 rounded-full border border-cyan-500/30 flex items-center justify-center animate-pulse-slow">
            <div className="w-48 h-48 rounded-full border border-electric/40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center">
                <Radio className="w-10 h-10 text-cyan-400 mb-1 animate-bounce" />
                <span className="text-xs font-bold text-white">Smart Hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Hotspot Detail Bar (When selected) */}
      {activeHotspot && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-4 rounded-2xl bg-navy-900/95 border border-cyan-500/50 backdrop-blur-2xl shadow-glow-cyan animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">{activeHotspot.proName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {activeHotspot.service} • <span className="text-cyan-400 font-semibold">{activeHotspot.distance} away</span> • ⭐ {activeHotspot.rating}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPro && onSelectPro(activeHotspot.proName, activeHotspot.service)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            Direct Connect
          </button>
        </div>
      )}

      {/* Subtle bottom legend */}
      <div className="absolute bottom-3 left-4 hidden md:flex items-center gap-4 text-[11px] text-slate-300 font-medium pointer-events-none bg-navy-950/70 px-3 py-1 rounded-xl backdrop-blur-sm border border-slate-800">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span> Electrician</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span> Plumber</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span> Cleaner</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-sm shadow-pink-400"></span> Caregiver</span>
      </div>
    </div>
  );
}
