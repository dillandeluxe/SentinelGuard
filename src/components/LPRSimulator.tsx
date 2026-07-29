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
  RefreshCw
} from 'lucide-react';

export const LPRSimulator: React.FC = () => {
  const { lprDetections, simulateLPRScan, triggerGateOpen } = useSystem();
  const [testPlateInput, setTestPlateInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const presets = [
    { label: 'Resident Plate (Sarah J. - A-101)', plate: 'SJK-8821' },
    { label: 'Registered Guest Plate (Liam H. - A-101)', plate: 'LHM-4491' },
    { label: 'Unknown Visitor Plate (Walk-In)', plate: 'UNK-9941' },
    { label: 'Contractor Plate (Apex Plumbing)', plate: 'PLUMB-9' },
  ];

  const handleSimulate = (plate: string) => {
    setIsScanning(true);
    setTimeout(() => {
      simulateLPRScan(plate);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              LPR / ANPR Camera Vision Feed (Gate 1 & Gate 2)
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI Powered 99.4% Acc.
              </span>
            </h3>
            <p className="text-xs text-slate-400">Simulate incoming vehicle plates to trigger automatic gate barrier and guest match</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Camera Viewport & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                LIVE STREAM: Gate 1 (Primary Entry Lane)
              </span>
              <span className="text-xs font-mono text-purple-400">RTSP Stream 1080p @ 30FPS</span>
            </div>

            {/* Camera Simulated Viewport */}
            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4 group">
              {/* Scan Overlay Lines */}
              <div className="absolute inset-0 border-2 border-purple-500/30 rounded-xl pointer-events-none"></div>
              
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent top-0 animate-bounce"></div>
              )}

              {/* Simulated Vehicle Target Box */}
              <div className="relative z-10 p-6 bg-slate-900/90 border border-purple-500/50 rounded-2xl text-center space-y-3 shadow-2xl backdrop-blur-md max-w-sm w-full">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Scan className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Optical Character Recognition Active</span>
                </div>

                <div className="bg-amber-400 border-2 border-black text-slate-950 font-mono font-extrabold text-2xl py-2 px-6 rounded-lg tracking-wider shadow-inner inline-block">
                  {testPlateInput || 'SJK-8821'}
                </div>

                <p className="text-[11px] text-purple-300 font-mono">
                  {isScanning ? 'Processing Neural Vision Model...' : 'Ready for Detection'}
                </p>
              </div>

              {/* Camera Corner HUD Overlay */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-1 rounded border border-emerald-500/30">
                CAM-01: OK
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                1920x1080 • HDR ON
              </div>
            </div>

            {/* Simulation Trigger Preset Controls */}
            <div className="space-y-3 pt-2">
              <label className="text-xs text-slate-400 font-medium block">
                Test Camera Detection (Click a Preset to Simulate Vehicle Approach):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.plate}
                    onClick={() => {
                      setTestPlateInput(preset.plate);
                      handleSimulate(preset.plate);
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left transition group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 group-hover:text-purple-300">{preset.label}</span>
                      <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/20">
                        {preset.plate}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Plate Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (testPlateInput) handleSimulate(testPlateInput);
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  placeholder="Enter custom license plate..."
                  value={testPlateInput}
                  onChange={(e) => setTestPlateInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isScanning || !testPlateInput}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  Simulate LPR Capture
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: LPR Detections Audit History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Recent LPR Detections & Match Audit
              </span>
              <span className="text-xs text-slate-500 font-mono">{lprDetections.length} Scans</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {lprDetections.map((detection) => {
                const isResident = detection.matchedStatus === 'Resident_Approved';
                const isGuest = detection.matchedStatus === 'PreRegistered_Guest';
                const isUnknown = detection.matchedStatus === 'Unknown_Vehicle';

                return (
                  <div
                    key={detection.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                        {detection.plateNumber}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Confidence: {detection.confidence}%
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Matched Record:</span>
                        <span className={`font-semibold ${
                          isResident ? 'text-emerald-400' : isGuest ? 'text-sky-400' : 'text-rose-400'
                        }`}>
                          {detection.matchedName || 'Unregistered Vehicle'}
                        </span>
                      </div>

                      {detection.matchedUnit && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Associated Unit:</span>
                          <span className="font-mono text-sky-300 font-bold">{detection.matchedUnit}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                        <span className="text-slate-500 font-mono text-[10px]">{detection.timestamp}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
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
