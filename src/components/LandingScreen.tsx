'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { 
  ShieldCheck, 
  ArrowRight,   
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check,  
  Package,
  ScanLine
} from 'lucide-react';
import QRCode from 'qrcode';

interface LandingScreenProps {
  onStartLogin: () => void;
  onDirectDemo: () => void;
  onOpenChecklist: () => void;
}

type ScenarioType = 'resident' | 'delivery' | 'rogue';

const ARRIVAL_STEPS = [
  { Icon: QrCode, title: 'Pass sent', meta: 'Sophia · Unit 402' },
  { Icon: ScanLine, title: 'Plate read', meta: 'ABC-8921' },
  { Icon: ShieldCheck, title: 'Gate open', meta: 'Bay V-03' },
];

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartLogin,
  onDirectDemo,
  onOpenChecklist,
}) => {
  // Hero arrival card: 0-2 = step in progress, 3 = all done (gate open)
  const [cycleStep, setCycleStep] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const arrivalStep = reducedMotion ? ARRIVAL_STEPS.length : cycleStep;

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setCycleStep((s) => (s + 1) % (ARRIVAL_STEPS.length + 1)), 1400);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const gateOpen = arrivalStep === ARRIVAL_STEPS.length;

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
      { margin: 1, width: 140, color: { dark: '#0F172A', light: '#ffffff' } }
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Hardware Grid */}
      <div className="absolute inset-0 bg-hardware-grid pointer-events-none opacity-40"></div>
      
      {/* Subtle Ambient Surface Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

      {/* Hardware Top Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between z-20 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">SENTINELGUARD</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChecklist}
            className="btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-white/10 hover:border-white/20 transition shadow-sm"
          >
            Roadmap
          </button>
          <button
            onClick={onStartLogin}
            className="btn-tactile min-h-11 px-4 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-white text-slate-950 transition"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero: copy + actions (left), animated guest-arrival card (right) */}
      <section className="max-w-7xl w-full mx-auto px-6 pt-14 pb-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="inline-flex items-center gap-2 text-xs font-mono-tabular text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Gatehouse software for condos &amp; gated communities
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05] text-balance">
            Every visitor, plate and parking bay — logged at the gate.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
            Guest passes, plate recognition and parking in one gatehouse app.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onDirectDemo}
              className="btn-tactile min-h-11 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold flex items-center gap-2"
            >
              Try the guard console
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={onStartLogin}
              className="btn-tactile min-h-11 px-5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 text-slate-100 text-sm font-medium"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Guest arrival, looping: pass sent -> plate read -> gate open */}
        <figure className="lg:col-span-5 card-carbon-elevated rounded-2xl p-6 space-y-6" aria-label="How a guest gets in: pass sent, plate read, gate opens">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tabular text-slate-400">GATE 1</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border transition-colors duration-300 ${
                gateOpen
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-300 border-white/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${gateOpen ? 'bg-emerald-400' : 'bg-slate-500'}`} aria-hidden="true" />
              {gateOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          <ol className="relative">
            {ARRIVAL_STEPS.map(({ Icon, title, meta }, i) => {
              const done = i < arrivalStep;
              const current = i === arrivalStep;
              return (
                <li key={title} className="relative flex items-center gap-4 pb-6 last:pb-0">
                  {i < ARRIVAL_STEPS.length - 1 && (
                    <span className="absolute left-[19px] top-10 bottom-0 w-px bg-white/10" aria-hidden="true">
                      <span
                        className={`absolute inset-x-0 top-0 bg-emerald-400 transition-all duration-500 ${done ? 'h-full' : 'h-0'}`}
                      />
                    </span>
                  )}
                  <span
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      done
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : current
                          ? 'bg-slate-900 border-emerald-400 text-emerald-300 ring-4 ring-emerald-500/15'
                          : 'bg-slate-900 border-white/10 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" aria-hidden="true" /> : <Icon className="w-4 h-4" aria-hidden="true" />}
                  </span>
                  <div className="flex-1 flex items-baseline justify-between gap-3 min-w-0">
                    <span className={`text-sm font-semibold transition-colors duration-300 ${done || current ? 'text-white' : 'text-slate-500'}`}>
                      {title}
                    </span>
                    <span className={`text-xs font-mono-tabular truncate transition-colors duration-300 ${done ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {meta}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Mini barrier: lifts when the last step completes */}
          <div className="relative h-16 rounded-xl bg-slate-950/70 border border-white/[0.06] overflow-hidden" aria-hidden="true">
            <div className="absolute bottom-0 inset-x-0 h-2 bg-slate-800" />
            <div className="absolute bottom-2 left-6 w-4 h-9 rounded-t bg-slate-700 border border-white/10" />
            <div
              className={`absolute bottom-9 left-[30px] h-2 w-40 sm:w-56 rounded-r-full origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                gateOpen ? '-rotate-[35deg]' : 'rotate-0'
              }`}
              style={{ background: 'repeating-linear-gradient(45deg, #e11d48, #e11d48 8px, #f8fafc 8px, #f8fafc 16px)' }}
            />
          </div>
        </figure>
      </section>

      {/* THE CENTERPIECE: The Living Guardhouse Console (Interactive Emil Kowalski Widget) */}
      <section className="max-w-7xl w-full mx-auto px-6 pb-16 z-10">
        <div className="card-carbon-elevated rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Top Control Bar of Simulator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                See the gate in action
              </h2>
            </div>

            {/* Scenario Selector Trigger Buttons */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => triggerScenario('resident')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'resident'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Resident</span>
              </button>

              <button
                onClick={() => triggerScenario('delivery')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'delivery'
                    ? 'bg-slate-800 text-sky-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Delivery</span>
              </button>

              <button
                onClick={() => triggerScenario('rogue')}
                className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeScenario === 'rogue'
                    ? 'bg-slate-800 text-rose-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Unknown</span>
              </button>
            </div>
          </div>

          {/* Two-Column Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Column 1: Optical LPR Camera Viewfinder (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between relative overflow-hidden min-h-[320px]">
              
              {/* Corner Reticles */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>

              {/* Laser Scan Line */}
              <div className="absolute inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-laser pointer-events-none"></div>

              {/* Viewfinder Top Metadata */}
              <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-400 z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Gate camera
                </span>
              </div>

              {/* Plate Visual Box in Center */}
              <div className="my-auto py-6 flex flex-col items-center justify-center z-10">
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeScenario === 'rogue' 
                    ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_24px_rgba(244,63,94,0.15)]' 
                    : 'bg-slate-900 border-white/20 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
                }`}>
                  <div className="px-6 py-3 rounded-lg bg-slate-950 border border-white/10 flex flex-col items-center">
                    <span className="text-xs font-mono-tabular tracking-widest text-slate-400 uppercase">
                      PILIPINAS • REGION VII
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-mono-tabular tracking-wider text-white my-1">
                      {activeScenario === 'resident' && 'ABC-8921'}
                      {activeScenario === 'delivery' && 'PH-7712'}
                      {activeScenario === 'rogue' && 'UNR-404X'}
                    </span>
                    <span className={`text-xs font-mono-tabular font-bold px-2 py-0.5 rounded ${
                      activeScenario === 'resident' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : activeScenario === 'delivery'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {activeScenario === 'resident' && 'RESIDENT'}
                      {activeScenario === 'delivery' && 'DELIVERY · 15 MIN'}
                      {activeScenario === 'rogue' && 'NOT REGISTERED'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 2: Physical Boom Barrier Mechanism (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tabular text-slate-400 uppercase tracking-wider">
                  Barrier
                </span>
                <span className={`text-xs font-mono-tabular font-bold px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                  gateRaised 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${gateRaised ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                  {gateRaised ? 'Open' : 'Closed'}
                </span>
              </div>

              {/* Physical Gate Graphic with Arm Motion */}
              <div className="my-8 flex items-center justify-center">
                <div className="relative w-64 h-36 flex items-end justify-center">
                  
                  {/* Gate Pedestal */}
                  <div className="w-12 h-24 bg-slate-800 border border-white/20 rounded-t-lg relative z-20 flex flex-col items-center justify-between py-2 shadow-lg">
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
                  <div className="absolute bottom-0 w-full h-3 bg-slate-900 border-t border-white/10 rounded"></div>
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
                    <span className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Plate verified. Gate open for 12 seconds.</span>
                  ) : (
                    <span className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />Plate not registered. Guard must verify before opening.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGateRaised(!gateRaised)}
                    className="btn-tactile flex-1 py-2.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-white/10 text-white transition flex items-center justify-center gap-1.5"
                  >
                    <span>{gateRaised ? 'Close gate' : 'Open gate'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Feature 2: Live Boarding-Pass Guest QR Generator */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-base font-bold text-white">Guest pass</h3>
              <p className="text-sm text-slate-400">Type a name and the QR updates.</p>

              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-xs font-mono-tabular text-slate-400 block mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono-tabular text-slate-400 block mb-1">Destination Unit</label>
                  <input
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Generated Pass Visual Card */}
            <div className="md:col-span-7 bg-slate-950 rounded-xl p-4 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-5">
              {passQrUrl ? (
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img src={passQrUrl} alt="Visitor QR Pass" className="w-28 h-28" />
                </div>
              ) : (
                <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-1.5 text-center sm:text-left flex-1 font-mono-tabular">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    VALID PASS
                  </span>
                  <span className="text-xs text-slate-400">#PAS-8819</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{guestName || 'Guest Visitor'}</h4>
                <p className="text-xs text-slate-400">{unitNumber} · Valid today</p>
              </div>

              <button
                onClick={copyPassLink}
                className="btn-tactile px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 flex items-center gap-1.5"
              >
                {passCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{passCopied ? 'Copied' : 'Share'}</span>
              </button>
            </div>

          </div>

          {/* Interactive Feature 3: Smart Bay Grid Strip */}
          <div className="pt-6 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tabular">
              <span className="text-slate-400 uppercase tracking-wider">
                Parking · tap a bay
              </span>
              <span className="text-emerald-400">
                {parkingBays.filter(b => !b.occupied).length} free
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {parkingBays.map(bay => (
                <div
                  key={bay.id}
                  onClick={() => toggleBay(bay.id)}
                  className={`btn-tactile p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between min-h-[85px] ${
                    bay.occupied
                      ? 'bg-slate-950/80 border-white/10 hover:border-white/20'
                      : 'bg-emerald-950/10 border-emerald-500/30 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-white">{bay.id}</span>
                    <span className={`w-2 h-2 rounded-full ${bay.occupied ? 'bg-slate-400' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'}`}></span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono-tabular">{bay.type}</span>
                    <span className={`text-xs font-mono-tabular font-bold ${bay.occupied ? 'text-slate-300' : 'text-emerald-400'}`}>
                      {bay.occupied ? (bay.plate || 'OCCUPIED') : 'VACANT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <footer className="border-t border-white/[0.08] py-6 text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span>SentinelGuard</span>
          <span>Residence &amp; parking security</span>
        </div>
      </footer>

    </div>
  );
};
