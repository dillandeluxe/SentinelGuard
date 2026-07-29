'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Sparkles,
  KeyRound,
  Shield,
  UserCheck,
  ArrowLeft
} from 'lucide-react';

interface AuthPortalProps {
  onLoginSuccess: (userRole: 'Guard' | 'Resident' | 'Admin', username: string) => void;
  onBackToLanding: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Guard' | 'Resident' | 'Admin'>('Guard');
  const [email, setEmail] = useState('officer.miller@sentinelguard.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('Officer Marcus Miller');
  const [unitOrGate, setUnitOrGate] = useState('Gate 1 Guardhouse');

  const fillGuardPreset = () => {
    setSelectedRole('Guard');
    setEmail('officer.miller@sentinelguard.io');
    setFullName('Officer Marcus Miller');
    setUnitOrGate('Gate 1 (Primary Entry)');
  };

  const fillResidentPreset = () => {
    setSelectedRole('Resident');
    setEmail('sarah.jenkins@residence.com');
    setFullName('Sarah Jenkins');
    setUnitOrGate('Unit A-101');
  };

  const fillAdminPreset = () => {
    setSelectedRole('Admin');
    setEmail('admin.security@sentinelguard.io');
    setFullName('Director Alex Sterling');
    setUnitOrGate('Security Command Center');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole, fullName || email);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-sky-500 selection:text-slate-950">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Back Button & Logo */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm">SentinelGuard Auth</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-6 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isSignUp ? 'Create SentinelGuard Account' : 'Sign In to Access Portal'}
            </h2>
            <p className="text-xs text-slate-400">
              Select your role to load security permissions & guardhouse controls
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Quick Demo Credentials Presets:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={fillGuardPreset}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
                  selectedRole === 'Guard'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                👮 Guard Officer
              </button>
              <button
                type="button"
                onClick={fillResidentPreset}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
                  selectedRole === 'Resident'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🏠 Resident Host
              </button>
              <button
                type="button"
                onClick={fillAdminPreset}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
                  selectedRole === 'Admin'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📊 Admin Mgr
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Email / Officer ID</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Assigned Station / Unit</label>
              <div className="relative">
                <input
                  type="text"
                  value={unitOrGate}
                  onChange={(e) => setUnitOrGate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
            >
              <UserCheck className="w-4 h-4" />
              {isSignUp ? 'Complete Registration & Enter' : `Sign In as ${selectedRole}`}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sky-400 font-bold hover:underline"
            >
              {isSignUp ? 'Sign In Here' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
