'use client';

import React, { useState } from 'react';
import { SystemProvider } from '../lib/store';
import { supabase } from '../lib/supabase';
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

// Convenience only. With Supabase, the database (RLS) enforces roles; in demo mode anyone can pick any role.
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
    supabase?.auth.signOut();
    setCurrentUser(null);
    setViewState('Landing');
  };

  if (viewState === 'Landing') {
    return (
      <>
        <LandingScreen
          onStartLogin={() => setViewState('Auth')}
          onDirectDemo={() => (supabase ? setViewState('Auth') : handleLoginSuccess('Guard', 'Officer Marcus Miller (Demo)'))}
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
    <SystemProvider guardName={currentUser?.name}>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Precision Hardware Top Bar */}
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand Logo & Telemetry Indicator */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewState('Landing')}
                aria-label="Return to landing page"
                className="btn-tactile w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 cursor-pointer shadow-sm shadow-emerald-500/20"
                title="Return to Landing"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-white tracking-tight">SentinelGuard</h1>
                  <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-white/10 text-emerald-400">
                    EDGE OS v2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STATION 01 • ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Hardware Segmented Navigation Switcher */}
            <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`btn-tactile px-3 min-h-11 rounded text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
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
                aria-label="Production readiness checklist"
                className="btn-tactile px-3 min-h-11 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 rounded-lg text-sm flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Readiness</span>
              </button>

              {currentUser && (
                <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-white max-w-[120px] truncate">{currentUser.name}</span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/5">
                    {currentUser.role}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="btn-tactile w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-lg border border-white/10 transition"
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
