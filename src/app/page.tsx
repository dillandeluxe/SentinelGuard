'use client';

import React, { useState } from 'react';
import { SystemProvider } from '../lib/store';
import { LandingScreen } from '../components/LandingScreen';
import { AuthPortal } from '../components/AuthPortal';
import { GuardConsole } from '../components/GuardConsole';
import { ParkingMap } from '../components/ParkingMap';
import { LPRSimulator } from '../components/LPRSimulator';
import { ResidentPortal } from '../components/ResidentPortal';
import { AdminDashboard } from '../components/AdminDashboard';
import { ProductionChecklistModal } from '../components/ProductionChecklistModal';
import { 
  ShieldCheck, 
  ParkingSquare, 
  Camera, 
  Building2, 
  BarChart3, 
  LogOut,
  User,
  QrCode,
  FileCheck,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

export default function Home() {
  const [viewState, setViewState] = useState<'Landing' | 'Auth' | 'App'>('Landing');
  const [currentUser, setCurrentUser] = useState<{ role: 'Guard' | 'Resident' | 'Admin'; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'Guard' | 'Parking' | 'LPR' | 'Resident' | 'Admin'>('Guard');
  const [showChecklistModal, setShowChecklistModal] = useState(false);

  const handleLoginSuccess = (role: 'Guard' | 'Resident' | 'Admin', name: string) => {
    setCurrentUser({ role, name });
    setViewState('App');
    if (role === 'Guard') setActiveTab('Guard');
    else if (role === 'Resident') setActiveTab('Resident');
    else if (role === 'Admin') setActiveTab('Admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewState('Landing');
  };

  if (viewState === 'Landing') {
    return (
      <>
        <LandingScreen
          onStartLogin={() => setViewState('Auth')}
          onDirectDemo={() => {
            setCurrentUser({ role: 'Guard', name: 'Officer Marcus Miller (Demo)' });
            setViewState('App');
          }}
          onOpenChecklist={() => setShowChecklistModal(true)}
        />
        {showChecklistModal && (
          <ProductionChecklistModal onClose={() => setShowChecklistModal(false)} />
        )}
      </>
    );
  }

  if (viewState === 'Auth') {
    return (
      <AuthPortal
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewState('Landing')}
      />
    );
  }

  return (
    <SystemProvider>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Precision Hardware Top Bar */}
        <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand Logo & Telemetry Indicator */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setViewState('Landing')}
                className="btn-tactile w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/20"
                title="Return to Landing"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-white tracking-tight">SentinelGuard</h1>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/10 text-emerald-400">
                    EDGE OS v2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STATION 01 • ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Hardware Segmented Navigation Switcher */}
            <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('Guard')}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'Guard'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Guard Console</span>
              </button>

              <button
                onClick={() => setActiveTab('Parking')}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'Parking'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ParkingSquare className="w-3.5 h-3.5" />
                <span>Parking Grid</span>
              </button>

              <button
                onClick={() => setActiveTab('LPR')}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'LPR'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Optical LPR</span>
              </button>

              <button
                onClick={() => setActiveTab('Resident')}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'Resident'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Resident Pass</span>
              </button>

              <button
                onClick={() => setActiveTab('Admin')}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'Admin'
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </nav>

            {/* User Session & Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChecklistModal(true)}
                className="btn-tactile px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Readiness</span>
              </button>

              {currentUser && (
                <div className="flex items-center gap-2 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-white max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                    {currentUser.role}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="btn-tactile p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-900 hover:bg-rose-500/10 rounded-lg border border-white/10 transition"
                title="Disconnect Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'Guard' && <GuardConsole />}
          {activeTab === 'Parking' && <ParkingMap />}
          {activeTab === 'LPR' && <LPRSimulator />}
          {activeTab === 'Resident' && <ResidentPortal />}
          {activeTab === 'Admin' && <AdminDashboard />}
        </main>

        {/* Readiness Checklist Modal */}
        {showChecklistModal && (
          <ProductionChecklistModal onClose={() => setShowChecklistModal(false)} />
        )}
      </div>
    </SystemProvider>
  );
}
