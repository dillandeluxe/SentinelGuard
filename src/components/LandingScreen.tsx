'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Camera, 
  Car, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  Sliders, 
  KeyRound,
  Activity,
  Layers,
  Sparkles,
  ParkingSquare
} from 'lucide-react';
import QRCode from 'qrcode';

interface LandingScreenProps {
  onStartLogin: () => void;
  onDirectDemo: () => void;
  onOpenChecklist: () => void;
}

type ScenarioType = 'resident' | 'delivery' | 'rogue';

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartLogin,
  onDirectDemo,
  onOpenChecklist,
}) => {
  // LPR & Barrier Simulator State
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('resident');
  const [gateRaised, setGateRaised] = useState(true);
  const [scanning, setScanning] = useState(false);

  // Guest Pass Generator State
  const [guestName, setGuestName] = useState('Sophia Chen');
  const [unitNumber, setUnitNumber] = useState('Unit 402');
  const [passQrUrl, setPassQrUrl] = useState<string>('');
  const [passCopied, setPassCopied] = useState(false);

  // Parking Bays State
  const [parkingBays, setParkingBays] = useState([
    { id: 'A-01', type: 'Resident', occupied: true, plate: 'ABC-8921' },
    { id: 'A-02', type: 'Resident', occupied: true, plate: 'NDG-5519' },
    { id: 'A-03', type: 'Guest', occupied: false, plate: null },
    { id: 'A-04', type: 'Guest', occupied: true, plate: 'PH-7712' },
    { id: 'A-05', type: 'EV Fast', occupied: false, plate: null },
    { id: 'A-06', type: 'EV Fast', occupied: true, plate: 'TES-9920' },
  ]);

  // Generate QR code for sample pass
  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({ passId: 'PAS-8819', guest: guestName, unit: unitNumber, validUntil: '2026-09-25T23:59:59Z' }),
      { margin: 1, width: 140, color: { dark: '#09090b', light: '#ffffff' } }
    ).then(setPassQrUrl).catch(() => {});
  }, [guestName, unitNumber]);

  // Handle Scenario Change
  const triggerScenario = (scenario: ScenarioType) => {
    setActiveScenario(scenario);
    setScanning(true);
    setGateRaised(false);

    setTimeout(() => {
      setScanning(false);
      if (scenario === 'resident' || scenario === 'delivery') {
        setGateRaised(true);
      } else {
        setGateRaised(false); // Rogue vehicle stays locked down
      }
    }, 450);
  };

  const copyPassLink = () => {
    navigator.clipboard.writeText(`https://sentinelguard.residence/pass/PAS-8819`);
    setPassCopied(true);
    setTimeout(() => setPassCopied(false), 2000);
  };

  const toggleBay = (bayId: string) => {
    setParkingBays(prev => prev.map(b => {
      if (b.id === bayId) {
        return {
          ...b,
          occupied: !b.occupied,
          plate: !b.occupied ? 'VIS-' + Math.floor(1000 + Math.random() * 9000) : null
        };
      }
      return b;
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Hardware Grid */}
      <div className="absolute inset-0 bg-hardware-grid pointer-events-none opacity-40"></div>
      
      {/* Subtle Ambient Surface Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

      {/* Hardware Top Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between z-20 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">SENTINELGUARD</span>
              <span className="text-[10px] font-mono-tabular font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SYS-ONLINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono-tabular">Automated Gate & LPR Security</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChecklist}
            className="btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 hover:border-white/20 transition shadow-sm"
          >
            System Specs
          </button>
          <button
            onClick={onDirectDemo}
            className="btn-tactile px-4 py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-white text-zinc-950 transition flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            Launch Terminal
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Headline */}
      <section className="max-w-7xl w-full mx-auto px-6 pt-12 pb-8 text-center z-10 space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Automated Boom Barrier. Optical Vision. Zero Friction.
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          High-performance security console eliminating guardhouse manual paperwork. Optical AI license plate recognition, instant guest QR passes, and live bay allocation.
        </p>

        {/* Quick Launch Console Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-4">
          <button
            onClick={onDirectDemo}
            className="btn-tactile px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-zinc-200 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guardhouse Tablet Mode</span>
          </button>

          <button
            onClick={onStartLogin}
            className="btn-tactile px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-zinc-200 flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Resident Pass Portal</span>
          </button>

          <button
            onClick={onStartLogin}
            className="btn-tactile px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-zinc-200 flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Security Operations Hub</span>
          </button>
        </div>
      </section>

      {/* THE CENTERPIECE: The Living Guardhouse Console (Interactive Emil Kowalski Widget) */}
      <section className="max-w-7xl w-full mx-auto px-6 pb-16 z-10">
        <div className="card-carbon-elevated rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Top Control Bar of Simulator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tabular font-bold tracking-wider uppercase text-zinc-400">
                  Interactive Live Simulation
                </span>
                <span className="text-[10px] font-mono-tabular bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  60 FPS OPTICAL STREAM
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Guardhouse Barrier &amp; License Plate Scanner
              </h2>
            </div>

            {/* Scenario Selector Trigger Buttons */}
            <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => triggerScenario('resident')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'resident'
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>✓ Resident (ABC-8921)</span>
              </button>

              <button
                onClick={() => triggerScenario('delivery')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'delivery'
                    ? 'bg-zinc-800 text-sky-400 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>📦 Delivery (PH-7712)</span>
              </button>

              <button
                onClick={() => triggerScenario('rogue')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'rogue'
                    ? 'bg-zinc-800 text-rose-400 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>⚠️ Rogue (UNR-404X)</span>
              </button>
            </div>
          </div>

          {/* Two-Column Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Column 1: Optical LPR Camera Viewfinder (7 cols) */}
            <div className="lg:col-span-7 bg-zinc-950 rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between relative overflow-hidden min-h-[320px]">
              
              {/* Corner Reticles */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>

              {/* Laser Scan Line */}
              <div className="absolute inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-laser pointer-events-none"></div>

              {/* Viewfinder Top Metadata */}
              <div className="flex items-center justify-between text-xs font-mono-tabular text-zinc-400 z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  CAM-01 • ENTRY LANE NORTH
                </span>
                <span>ISO 400 • 1/500s</span>
              </div>

              {/* Plate Visual Box in Center */}
              <div className="my-auto py-6 flex flex-col items-center justify-center z-10">
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeScenario === 'rogue' 
                    ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_24px_rgba(244,63,94,0.15)]' 
                    : 'bg-zinc-900 border-white/20 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
                }`}>
                  <div className="px-6 py-3 rounded-lg bg-zinc-950 border border-white/10 flex flex-col items-center">
                    <span className="text-[10px] font-mono-tabular tracking-widest text-zinc-400 uppercase">
                      PILIPINAS • REGION VII
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-mono-tabular tracking-wider text-white my-1">
                      {activeScenario === 'resident' && 'ABC-8921'}
                      {activeScenario === 'delivery' && 'PH-7712'}
                      {activeScenario === 'rogue' && 'UNR-404X'}
                    </span>
                    <span className={`text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded ${
                      activeScenario === 'resident' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : activeScenario === 'delivery'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {activeScenario === 'resident' && 'RESIDENT PERMIT ACTIVE'}
                      {activeScenario === 'delivery' && '15-MIN UNLOAD PASS'}
                      {activeScenario === 'rogue' && 'UNAUTHORIZED / UNREGISTERED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewfinder Telemetry Readout */}
              <div className="pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center text-xs font-mono-tabular z-10">
                <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase">Confidence</span>
                  <span className="font-bold text-white">
                    {activeScenario === 'rogue' ? '74.2% (FAIL)' : '99.4% (VERIFIED)'}
                  </span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase">Match Latency</span>
                  <span className="font-bold text-emerald-400">138ms</span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase">Target Unit</span>
                  <span className="font-bold text-white">
                    {activeScenario === 'resident' && 'Unit 402 (Miller)'}
                    {activeScenario === 'delivery' && 'Unit 108 (Dropoff)'}
                    {activeScenario === 'rogue' && 'NONE (Alert Sent)'}
                  </span>
                </div>
              </div>

            </div>

            {/* Column 2: Physical Boom Barrier Mechanism (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-950 rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-zinc-400 uppercase tracking-wider">
                  Gate Controller #01
                </span>
                <span className={`text-xs font-mono-tabular font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                  gateRaised 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${gateRaised ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                  {gateRaised ? 'BARRIER OPEN' : 'BARRIER LOCKED'}
                </span>
              </div>

              {/* Physical Gate Graphic with Arm Motion */}
              <div className="my-8 flex items-center justify-center">
                <div className="relative w-64 h-36 flex items-end justify-center">
                  
                  {/* Gate Pedestal */}
                  <div className="w-12 h-24 bg-zinc-800 border border-white/20 rounded-t-lg relative z-20 flex flex-col items-center justify-between py-2 shadow-lg">
                    {/* Status Beacon LED */}
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      gateRaised 
                        ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]' 
                        : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                    }`}></div>
                    <div className="w-8 h-1 bg-white/20 rounded"></div>
                    <div className="w-8 h-1 bg-white/20 rounded"></div>
                  </div>

                  {/* Boom Barrier Pivot Arm */}
                  <div className="absolute left-[122px] bottom-[72px] z-10">
                    <div 
                      className={`h-4 w-44 rounded-r-full border border-white/20 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        gateRaised ? '-rotate-[70deg]' : 'rotate-0'
                      }`}
                      style={{
                        background: 'repeating-linear-gradient(45deg, #e11d48, #e11d48 10px, #ffffff 10px, #ffffff 20px)'
                      }}
                    ></div>
                  </div>

                  {/* Road Curb */}
                  <div className="absolute bottom-0 w-full h-3 bg-zinc-900 border-t border-white/10 rounded"></div>
                </div>
              </div>

              {/* Controller Status Footer */}
              <div className="space-y-3">
                <div className={`p-3 rounded-lg text-xs font-mono-tabular border transition-all ${
                  gateRaised 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  {gateRaised ? (
                    <span>✓ Optical verification confirmed. Barrier arm clearance timer active (12s).</span>
                  ) : (
                    <span>⚠️ Warning: Vehicle plate not recognized in database. Officer intervention required.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGateRaised(!gateRaised)}
                    className="btn-tactile flex-1 py-2.5 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white transition flex items-center justify-center gap-1.5"
                  >
                    <span>{gateRaised ? 'Manual Lock Gate' : 'Emergency Override Lift'}</span>
                  </button>
                  <button
                    onClick={onDirectDemo}
                    className="btn-tactile px-3.5 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition flex items-center justify-center gap-1"
                  >
                    <span>Open Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Feature 2: Live Boarding-Pass Guest QR Generator */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-mono-tabular font-bold tracking-wider text-emerald-400 uppercase">
                Self-Service Resident Pass
              </span>
              <h3 className="text-base font-bold text-white">
                Live Visitor QR Credential Generator
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate an authentic mobile QR pass. Visitors scan this at the guardhouse tablet to bypass manual registration logs.
              </p>

              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[11px] font-mono-tabular text-zinc-400 block mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono-tabular text-zinc-400 block mb-1">Destination Unit</label>
                  <input
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Generated Pass Visual Card */}
            <div className="md:col-span-7 bg-zinc-950 rounded-xl p-4 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-5">
              {passQrUrl ? (
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img src={passQrUrl} alt="Visitor QR Pass" className="w-28 h-28" />
                </div>
              ) : (
                <div className="w-28 h-28 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-1.5 text-center sm:text-left flex-1 font-mono-tabular">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    VALID PASS
                  </span>
                  <span className="text-xs text-zinc-400">#PAS-8819</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{guestName || 'Guest Visitor'}</h4>
                <p className="text-xs text-zinc-400">Target: {unitNumber} • 1-Day Pass</p>
                <p className="text-[10px] text-zinc-400">Expires: Today, 11:59 PM</p>
              </div>

              <button
                onClick={copyPassLink}
                className="btn-tactile px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 flex items-center gap-1.5"
              >
                {passCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{passCopied ? 'Link Copied' : 'Share Pass'}</span>
              </button>
            </div>

          </div>

          {/* Interactive Feature 3: Smart Bay Grid Strip */}
          <div className="pt-6 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tabular">
              <span className="text-zinc-400 uppercase tracking-wider">
                Live Parking Deck Allocation Grid (Click to toggle vacancy)
              </span>
              <span className="text-emerald-400">
                {parkingBays.filter(b => !b.occupied).length} BAYS AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {parkingBays.map(bay => (
                <div
                  key={bay.id}
                  onClick={() => toggleBay(bay.id)}
                  className={`btn-tactile p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between min-h-[85px] ${
                    bay.occupied
                      ? 'bg-zinc-950/80 border-white/10 hover:border-white/20'
                      : 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-white">{bay.id}</span>
                    <span className={`w-2 h-2 rounded-full ${bay.occupied ? 'bg-zinc-400' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'}`}></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-mono-tabular">{bay.type}</span>
                    <span className={`text-[11px] font-mono-tabular font-bold ${bay.occupied ? 'text-zinc-300' : 'text-emerald-400'}`}>
                      {bay.occupied ? (bay.plate || 'OCCUPIED') : 'VACANT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Hardware Telemetry Metric Bar */}
      <footer className="border-t border-white/[0.08] bg-zinc-950 py-8 text-xs font-mono-tabular text-zinc-400 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-white tracking-tight block">&lt; 140ms</span>
            <span className="text-zinc-400 uppercase text-[11px]">Optical LPR Latency</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight block">99.8%</span>
            <span className="text-zinc-400 uppercase text-[11px]">Barrier Reliability</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-white tracking-tight block">0</span>
            <span className="text-zinc-400 uppercase text-[11px]">Guardhouse Paper Logs</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight block">100%</span>
            <span className="text-zinc-400 uppercase text-[11px]">Offline Local Fallback</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
