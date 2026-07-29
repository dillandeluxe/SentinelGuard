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
  FileCheck
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
        {/* Top Navbar */}
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setViewState('Landing')}
                className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-105 transition-transform"
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  SentinelGuard <span className="text-sky-400 text-xs px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 font-mono font-semibold">PWA v2.4</span>
                </h1>
                <p className="text-xs text-slate-400">Residence Check-In & Smart Parking Management System</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('Guard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'Guard'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Guard Console
              </button>

              <button
                onClick={() => setActiveTab('Parking')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'Parking'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ParkingSquare className="w-4 h-4" />
                Parking Grid
              </button>

              <button
                onClick={() => setActiveTab('LPR')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'LPR'
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                LPR Vision AI
              </button>

              <button
                onClick={() => setActiveTab('Resident')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'Resident'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                Resident Portal
              </button>

              <button
                onClick={() => setActiveTab('Admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'Admin'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </nav>

            {/* Current User Session Badge & Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChecklistModal(true)}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-3.5 h-3.5 text-sky-400" />
                Checklist
              </button>

              {currentUser && (
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold text-white">{currentUser.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    {currentUser.role}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 rounded-xl border border-slate-800 transition"
                title="Sign Out"
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

        {/* Modal */}
        {showChecklistModal && (
          <ProductionChecklistModal onClose={() => setShowChecklistModal(false)} />
        )}
      </div>
    </SystemProvider>
  );
}
