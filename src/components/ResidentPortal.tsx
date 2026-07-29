'use client';

import React, { useState } from 'react';
import { useSystem } from '../lib/store';
import { 
  Building2, 
  QrCode, 
  Share2, 
  PlusCircle, 
  Car, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Copy, 
  Send,
  Sparkles,
  UserCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { VisitorPass } from '../lib/types';

export const ResidentPortal: React.FC = () => {
  const { units, visitorPasses, createVisitorPass } = useSystem();
  
  const [selectedUnitId, setSelectedUnitId] = useState<string>('u-101');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [visitorType, setVisitorType] = useState<'Guest' | 'Delivery' | 'Contractor' | 'VIP'>('Guest');
  
  const [generatedPass, setGeneratedPass] = useState<VisitorPass | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const unitPasses = visitorPasses.filter((p) => p.unitNumber === activeUnit.unitNumber);

  const handleGeneratePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const pass = createVisitorPass({
      guestName,
      guestPhone: guestPhone || '+1 (555) 000-1111',
      vehiclePlate: vehiclePlate.toUpperCase() || undefined,
      unitId: activeUnit.id,
      unitNumber: activeUnit.unitNumber,
      residentName: activeUnit.residentName,
      visitorType,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 86400000).toISOString(),
    });

    try {
      const url = await QRCode.toDataURL(pass.passCode, { margin: 2, width: 240 });
      setQrDataUrl(url);
    } catch (err) {
      console.error('QR error', err);
    }

    setGeneratedPass(pass);
    setGuestName('');
    setGuestPhone('');
    setVehiclePlate('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Resident & Host Visitor Pre-Registration Portal
            </h3>
            <p className="text-xs text-slate-400">Issue instant QR digital passes to guests, drivers, and delivery contractors</p>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Logged in Unit:</span>
          <select
            value={selectedUnitId}
            onChange={(e) => {
              setSelectedUnitId(e.target.value);
              setGeneratedPass(null);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unitNumber} - {u.residentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue New Pass Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-indigo-400 font-semibold text-base">
              <PlusCircle className="w-5 h-5" />
              <h3>Issue New Digital Guest Pass</h3>
            </div>

            <form onSubmit={handleGeneratePass} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Harrison"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Guest Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Visitor Category</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Guest">Social Guest</option>
                    <option value="Delivery">Delivery / Food</option>
                    <option value="Contractor">Contractor / Service</option>
                    <option value="VIP">VIP Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Vehicle License Plate (Optional for LPR Gate Auto-Open)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LHM-4491"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-400 hover:to-sky-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Generate Instant Guest Pass QR Code
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Digital Pass Preview & Share Card */}
        <div className="lg:col-span-6 space-y-6">
          {generatedPass ? (
            <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 p-3 bg-indigo-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl">
                Pass Active & Ready
              </div>

              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-base border-b border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3>Digital Visitor Pass Created</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Guest QR Code" className="w-40 h-40 rounded-xl border border-white/20 p-2 bg-white" />
                ) : (
                  <div className="w-40 h-40 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                    Generating QR...
                  </div>
                )}

                <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
                  <span className="font-mono text-sm font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/30 inline-block">
                    {generatedPass.passCode}
                  </span>
                  <h4 className="text-white font-bold text-lg">{generatedPass.guestName}</h4>
                  <p className="text-slate-400">
                    Visiting Unit: <span className="text-white font-semibold">{generatedPass.unitNumber}</span> ({generatedPass.residentName})
                  </p>
                  {generatedPass.vehiclePlate && (
                    <p className="text-slate-400">
                      Registered Plate: <span className="font-mono text-amber-400 font-bold">{generatedPass.vehiclePlate}</span>
                    </p>
                  )}
                  <p className="text-slate-500 text-[11px] pt-1">
                    Valid 24 hours from issue time
                  </p>
                </div>
              </div>

              {/* Share & Copy Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => copyToClipboard(`https://sentinelguard.app/pass/${generatedPass.passCode}`)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Pass Link Copied!' : 'Copy Pass Link'}
                </button>

                <button
                  onClick={() => {
                    const text = `Hi ${generatedPass.guestName}, here is your digital entry pass for Unit ${generatedPass.unitNumber}: Pass Code: ${generatedPass.passCode}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Share via WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center py-16 text-slate-500 space-y-3">
              <QrCode className="w-12 h-12 text-slate-700" />
              <h4 className="text-slate-300 font-semibold">No Pass Generated Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Fill out the visitor form on the left to create a digital QR pass for your guest.
              </p>
            </div>
          )}

          {/* Active Passes List for Selected Unit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Active Passes for {activeUnit.unitNumber}</span>
              <span className="text-xs font-mono text-indigo-400">{unitPasses.length} Active</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {unitPasses.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No active passes issued for this unit.</p>
              ) : (
                unitPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{pass.guestName}</span>
                      <span className="text-slate-400 block font-mono text-[11px]">{pass.passCode} • {pass.visitorType}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pass.status === 'CheckedIn' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {pass.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
