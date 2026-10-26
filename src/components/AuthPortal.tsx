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
  KeyRound,
  ShieldAlert,
  SlidersHorizontal
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [unitOrGate, setUnitOrGate] = useState('');

  // Preset demo fillers
  const fillGuardPreset = () => {
    setSelectedRole('Guard');
    setEmail('officer.miller@sentinelguard.io');
    setPassword('GuardPass123!');
    setFullName('Officer Marcus Miller');
    setUnitOrGate('Gate 1 (Primary Lane)');
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
    setUnitOrGate('Security Ops Center');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = fullName.trim() || email.split('@')[0] || `${selectedRole} User`;
    onLoginSuccess(selectedRole, displayName);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Dot Matrix Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-md w-full space-y-4 relative z-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="btn-tactile text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Console</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-white text-xs">SENTINEL_AUTH</span>
          </div>
        </div>

        {/* Main Hardware Bezel Card */}
        <div className="card-carbon-elevated p-7 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isSignUp ? 'Enroll New Personnel' : 'Authentication Terminal'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? 'Register security profile for gatehouse or tenant clearance'
                : 'Select role credentials to authorize access'}
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block text-center">
              CLEARANCE LEVEL & PROFILE
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
              {(['Guard', 'Resident', 'Admin'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`btn-tactile py-2 rounded text-xs font-mono font-semibold transition ${
                    selectedRole === role
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Pre-load Credentials */}
          <div className="text-center pt-0.5">
            <span className="text-xs font-mono text-slate-500 block mb-1">DEMO PRESETS:</span>
            <div className="flex justify-center gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={fillGuardPreset}
                className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-2 transition-colors"
              >
                Officer
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={fillResidentPreset}
                className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-2 transition-colors"
              >
                Resident
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={fillAdminPreset}
                className="text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-2 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required={isSignUp}
                    placeholder="Enter identity name..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Officer Email / ID</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="identity@sentinelguard.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Access Token / Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 p-0.5 text-slate-500 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Post / Unit Assignment
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Gate 1 or Unit A-101"
                  value={unitOrGate}
                  onChange={(e) => setUnitOrGate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-tactile w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 mt-3"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSignUp ? 'Enroll Profile' : `Authenticate as ${selectedRole}`}</span>
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-xs text-slate-400 border-t border-white/5 pt-3">
            {isSignUp ? 'Already registered?' : 'Need temporary clearance?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-400 font-mono font-semibold hover:underline"
            >
              {isSignUp ? 'Return to Login' : 'Enroll Credentials'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
