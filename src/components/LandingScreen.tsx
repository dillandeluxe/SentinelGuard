'use client';

import React from 'react';
import { 
  ShieldCheck, 
  ParkingSquare, 
  Camera, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Lock, 
  QrCode,
  Sparkles,
  Smartphone,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LandingScreenProps {
  onStartLogin: () => void;
  onDirectDemo: () => void;
  onOpenChecklist: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartLogin,
  onDirectDemo,
  onOpenChecklist,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-sky-500 selection:text-slate-950">
      {/* Background Decorative Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl text-white shadow-xl shadow-sky-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">SentinelGuard</h1>
            <p className="text-xs text-sky-400 font-mono font-medium">Smart Residence & Parking System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChecklist}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
          >
            Prod Checklist
          </button>
          <button
            onClick={onStartLogin}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-lg shadow-sky-500/25 flex items-center gap-2"
          >
            Sign In / Access Portal
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center z-10 space-y-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Next-Gen Security Guard & Parking Automation PWA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Seamless Guest Check-In & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Smart LPR Parking Control
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminate guardhouse paperwork. Enable instant guest QR code scanning, unit occupancy verification, AI license plate recognition, and real-time parking space allocation.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartLogin}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl transition shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 group"
            >
              <span>Launch SentinelGuard System</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onDirectDemo}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2"
            >
              <span>Explore Interactive Live Demo</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full pt-8">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl hover:border-sky-500/40 transition group space-y-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20 w-max">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition">
              Guardhouse Tablet Console
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast QR code scanner for guest passes, quick manual walk-in logging, unit occupancy lookup, and 1-tap automated barrier gate triggers.
            </p>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl hover:border-purple-500/40 transition group space-y-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 w-max">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
              AI License Plate Recognition (LPR)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optical character recognition stream auto-matches incoming plates against resident & pre-registered guest databases to raise gates in under 1 second.
            </p>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl hover:border-teal-500/40 transition group space-y-3">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20 w-max">
              <ParkingSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition">
              Smart Parking Space Allocation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live visual bay grid map tracking Resident slots, Visitor allocations, EV charging spaces, and automated overstay violation alerts (&gt;4h).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>SentinelGuard System • Designed for Residences, Condos & Hotels</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PWA Tablet Ready</span>
            <span>•</span>
            <span>Real-Time WebSockets</span>
            <span>•</span>
            <span>LPR Camera Vision</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
