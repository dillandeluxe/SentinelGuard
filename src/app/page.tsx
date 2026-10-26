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

type Role = 'Guard' | 'Resident' | 'Admin';
type Tab = 'Guard' | 'Parking' | 'LPR' | 'Resident' | 'Admin';

const ALL_TABS = [
  { id: 'Guard', label: 'Guard Console', Icon: ShieldCheck },
  { id: 'Parking', label: 'Parking Grid', Icon: ParkingSquare },
  { id: 'LPR', label: 'Optical LPR', Icon: Camera },
  { id: 'Resident', label: 'Resident Pass', Icon: QrCode },
  { id: 'Admin', label: 'Analytics & Setup', Icon: BarChart3 },
] as const;

// shortcut: UI-only gating, any user can still pick any role at login; enforce on a server once real auth exists.
const ROLE_TABS: Record<Role, Tab[]> = {
  Guard: ['Guard', 'Parking', 'LPR'],
  Resident: ['Resident'],
  Admin: ['Guard', 'Parking', 'LPR', 'Resident', 'Admin'],
};

export default function Home() {
  const [viewState, setViewState] = useState<'Landing' | 'Auth' | 'App'>('Landing');
  const [currentUser, setCurrentUser] = useState<{ role: Role; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Guard');
  const allowedTabs = currentUser ? ROLE_TABS[currentUser.role] : [];
  const tabs = ALL_TABS.filter((t) => allowedTabs.includes(t.id));
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
          onDirectDemo={() => handleLoginSuccess('Guard', 'Officer Marcus Miller (Demo)')}
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
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
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
          {allowedTabs.includes(activeTab) && (
            <>
              {activeTab === 'Guard' && <GuardConsole />}
              {activeTab === 'Parking' && <ParkingMap />}
              {activeTab === 'LPR' && <LPRSimulator />}
              {activeTab === 'Resident' && <ResidentPortal />}
              {activeTab === 'Admin' && <AdminDashboard />}
            </>
          )}
        </main>

        {/* Readiness Checklist Modal */}
        {showChecklistModal && (
          <ProductionChecklistModal onClose={() => setShowChecklistModal(false)} />
        )}
      </div>
    </SystemProvider>
  );
}
