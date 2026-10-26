'use client';

import React, { useState } from 'react';
import { useSystem } from '../lib/store';
import { 
  Camera, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Scan, 
  Building2, 
  Play, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Target,
  Crosshair,
  Gauge
} from 'lucide-react';

export const LPRSimulator: React.FC = () => {
  const { lprDetections, simulateLPRScan, triggerGateOpen } = useSystem();
  const [testPlateInput, setTestPlateInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const presets = [
    { label: 'Sarah Jenkins (Resident)', plate: 'SJK-8821', type: 'Resident' },
    { label: 'Liam Hayes (Guest Pass)', plate: 'LHM-4491', type: 'Expected Guest' },
    { label: 'Unregistered Courier', plate: 'UNK-9941', type: 'Unregistered' },
    { label: 'Apex Plumbing Corp', plate: 'PLUMB-9', type: 'Contractor' },
  ];

  const handleSimulate = (plate: string) => {
    setIsScanning(true);
    setTimeout(() => {
      simulateLPRScan(plate);
      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Precision Header */}
      <div className="card-carbon-elevated p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Optical LPR & Edge Vision Pipeline</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                EDGE INFERENCE 99.4%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-speed neural plate recognition for automated barrier actuation and access audits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CAM-01 / CAM-02 RTSP SYNC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optical HUD Viewfinder */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-carbon p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-200">FEED: GATE-01 PRIMARY APPROACH</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">1080p @ 60 FPS • 14ms</span>
            </div>

            {/* Tactical Viewfinder Viewport */}
            <div className="relative h-72 bg-slate-950 rounded-xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 group">
              {/* Subtle Grid Matrix */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Tactical Corner Reticles */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500/60 pointer-events-none" />

              {/* Animated Laser Sweep Line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-[2px] bg-emerald-400 shadow-[0_0_12px_#10b981] animate-laser-scan pointer-events-none z-20" />
              )}

              {/* Target Bounding Box & Stamped Plate */}
              <div className="relative z-10 p-5 bg-slate-900/90 border border-white/15 rounded-xl text-center space-y-3 shadow-2xl backdrop-blur-md max-w-xs w-full transition-transform duration-300">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-white/10">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Crosshair className="w-3 h-3" />
                    BBOX TARGET #1
                  </span>
                  <span>CONF 99.6%</span>
                </div>

                {/* Stamped Metal License Plate */}
                <div className="relative inline-block bg-slate-950 border-2 border-slate-700 text-white font-mono font-extrabold text-2xl py-2 px-6 rounded-lg tracking-widest shadow-inner">
                  <div className="absolute -top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400" />
                  <div className="absolute -top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-slate-600 border border-slate-400" />
                  <div className="text-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {testPlateInput || 'SJK-8821'}
                  </div>
                  <div className="text-xs font-mono text-slate-500 tracking-widest mt-0.5">
                    CALIFORNIA RESIDENT
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>{isScanning ? 'INFERRING NEURAL WEIGHTS...' : 'OPTICAL MATRIX LOCKED'}</span>
                </div>
              </div>

              {/* Viewfinder Telemetry Overlays */}
              <div className="absolute top-3 left-8 text-xs font-mono text-emerald-400/80 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
                EXP: 1/2000s • ISO 400 • F/2.8
              </div>
              <div className="absolute bottom-3 right-8 text-xs font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-white/5">
                FPS 60.1 • LATENCY 14.2ms
              </div>
            </div>

            {/* Quick Trigger Presets */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-mono text-slate-400 block">
                Simulate Vehicle Approach (Tap to trigger test capture):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.plate}
                    onClick={() => {
                      setTestPlateInput(preset.plate);
                      handleSimulate(preset.plate);
                    }}
                    disabled={isScanning}
                    className="btn-tactile p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-emerald-500/40 rounded-lg text-left transition group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                        {preset.label}
                      </span>
                      <span className="text-xs font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-white/10 text-slate-400">
                        {preset.type}
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-amber-300">
                      {preset.plate}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (testPlateInput) handleSimulate(testPlateInput);
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  placeholder="Enter custom plate code..."
                  value={testPlateInput}
                  onChange={(e) => setTestPlateInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isScanning || !testPlateInput}
                  className="btn-tactile px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Capture</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: LPR Inference Audit History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-carbon p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Detection Inference Ledger</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{lprDetections.length} logs</span>
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {lprDetections.map((detection) => {
                const isResident = detection.matchedStatus === 'Resident_Approved';
                const isGuest = detection.matchedStatus === 'PreRegistered_Guest';

                return (
                  <div
                    key={detection.id}
                    className="p-3 bg-slate-950/70 border border-white/5 rounded-lg space-y-2 hover:border-white/15 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {detection.plateNumber}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        CONF {detection.confidence}%
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Match</span>
                        <span className={`font-medium ${
                          isResident ? 'text-emerald-400' : isGuest ? 'text-slate-200' : 'text-rose-400'
                        }`}>
                          {detection.matchedName || 'Unregistered Vehicle'}
                        </span>
                      </div>

                      {detection.matchedUnit && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Unit</span>
                          <span className="font-mono text-slate-300">{detection.matchedUnit}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs font-mono">
                        <span className="text-slate-500">{detection.timestamp}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                          detection.suggestedAction === 'Auto_Open_Gate'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {detection.suggestedAction.replaceAll('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
