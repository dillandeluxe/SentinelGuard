'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  UserCheck,
  ArrowLeft,
  KeyRound
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
  
  // Clean empty initial form state (no pre-filled accounts or dummy text)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [unitOrGate, setUnitOrGate] = useState('');

  // Optional quick demo fill helpers (only populates when explicitly clicked)
  const fillGuardPreset = () => {
    setSelectedRole('Guard');
    setEmail('officer.miller@sentinelguard.io');
    setPassword('GuardPass123!');
    setFullName('Officer Marcus Miller');
    setUnitOrGate('Gate 1 (Primary Entry)');
  };

  const fillResidentPreset = () => {
    setSelectedRole('Resident');
    setEmail('sarah.jenkins@residence.com');
    setPassword('ResidentPass123!');
    setFullName('Sarah Jenkins');
    setUnitOrGate('Unit A-101');
  };

  const fillAdminPreset = () => {
    setSelectedRole('Admin');
    setEmail('admin.security@sentinelguard.io');
    setPassword('AdminPass123!');
    setFullName('Director Alex Sterling');
    setUnitOrGate('Security Command Center');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = fullName.trim() || email.split('@')[0] || `${selectedRole} User`;
    onLoginSuccess(selectedRole, displayName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-sky-500 selection:text-slate-950">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-5 relative z-10">
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
            <span className="font-bold text-white text-sm">SentinelGuard Portal</span>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl space-y-6 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isSignUp ? 'Create SentinelGuard Account' : 'Sign In to Portal'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? 'Register your account to access guardhouse controls or host pass features'
                : 'Select your account role and enter your credentials to log in'}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
              Select Role & Access Level:
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('Guard')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition ${
                  selectedRole === 'Guard'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👮 Guard
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('Resident')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition ${
                  selectedRole === 'Resident'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏠 Resident
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('Admin')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition ${
                  selectedRole === 'Admin'
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 Admin
              </button>
            </div>
          </div>

          {/* Optional Demo Auto-Fill Presets */}
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block mb-1">Testing Demo Credentials:</span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={fillGuardPreset}
                className="text-[10px] text-sky-400 hover:text-sky-300 underline font-medium"
              >
                Auto-fill Guard Demo
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={fillResidentPreset}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Auto-fill Resident Demo
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={fillAdminPreset}
                className="text-[10px] text-teal-400 hover:text-teal-300 underline font-medium"
              >
                Auto-fill Admin Demo
              </button>
            </div>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required={isSignUp}
                    placeholder="Enter your full name..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Email / Officer ID</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono tracking-wide"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white transition rounded-lg"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Assigned Unit / Guard Station (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Gate 1 Guardhouse or Unit A-101"
                  value={unitOrGate}
                  onChange={(e) => setUnitOrGate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
            >
              <UserCheck className="w-4 h-4" />
              {isSignUp ? 'Create Account & Log In' : `Sign In as ${selectedRole}`}
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
