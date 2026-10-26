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
  UserCheck,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { VisitorPass } from '../lib/types';
import { formatDuration } from '../lib/rules';

export const ResidentPortal: React.FC = () => {
  const { units, visitorPasses, parkingSpaces, createVisitorPass } = useSystem();
  
  const [selectedUnitId, setSelectedUnitId] = useState<string>('u-101');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [visitorType, setVisitorType] = useState<'Guest' | 'Delivery' | 'Contractor' | 'VIP'>('Guest');
  
  const [generatedPass, setGeneratedPass] = useState<VisitorPass | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  if (!activeUnit) {
    return (
      <div className="card-carbon p-6 flex flex-col items-center justify-center text-center py-14 text-slate-500 space-y-2">
        <Building2 className="w-10 h-10 text-slate-700" />
        <div className="text-xs font-semibold text-slate-300">No units registered yet</div>
        <p className="text-xs text-slate-500 max-w-xs font-mono">
          An admin must add units under Analytics &amp; Setup before guest passes can be issued.
        </p>
      </div>
    );
  }

  const unitPasses = visitorPasses.filter((p) => p.unitNumber === activeUnit.unitNumber);
  // The unit's own bay plus any bay a guest of this unit is parked in.
  const unitBays = parkingSpaces.filter(
    (ps) => ps.bayNumber === activeUnit.allocatedParkingBay || ps.assignedUnitNumber === activeUnit.unitNumber
  );

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
      const url = await QRCode.toDataURL(pass.passCode, { 
        margin: 1, 
        width: 220,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
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
      <div className="card-carbon-elevated p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Resident Guest Pass Dispatch</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a QR pass your guest shows at the gate
            </p>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-white/10">
          <span className="text-xs font-mono text-slate-500 pl-1.5">UNIT:</span>
          <select
            value={activeUnit.id}
            onChange={(e) => {
              setSelectedUnitId(e.target.value);
              setGeneratedPass(null);
            }}
            className="bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.unitNumber} — {u.residentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issue Pass Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-carbon p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Create Digital Access Pass</h3>
            </div>

            <form onSubmit={handleGeneratePass} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Harrison"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Visitor Category</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Guest">Social Guest</option>
                    <option value="Delivery">Delivery / Food</option>
                    <option value="Contractor">Contractor / Service</option>
                    <option value="VIP">VIP Guest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  License Plate (Enables LPR Optical Auto-Clearance)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LHM-4491"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="btn-tactile w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Generate QR Pass</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Pass Preview & Unit History */}
        <div className="lg:col-span-6 space-y-6">
          {generatedPass ? (
            <div className="card-carbon-elevated p-6 space-y-4 animate-fade-in relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">Active Pass Credential</h4>
                </div>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {generatedPass.passCode}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950/80 p-4 rounded-xl border border-white/10">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Visitor QR Code" 
                    className="w-36 h-36 rounded-lg p-2 bg-white shrink-0" 
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 text-xs font-mono">
                    GENERATING...
                  </div>
                )}

                <div className="space-y-1.5 text-xs flex-1 text-center sm:text-left">
                  <div className="text-sm font-bold text-white">{generatedPass.guestName}</div>
                  <div className="text-slate-400">
                    Destination: <span className="text-emerald-300 font-semibold">Unit {generatedPass.unitNumber}</span> ({generatedPass.residentName})
                  </div>
                  {generatedPass.vehiclePlate && (
                    <div className="text-slate-400 font-mono text-xs">
                      Vehicle: <span className="text-amber-300 font-bold">{generatedPass.vehiclePlate}</span>
                    </div>
                  )}
                  <div className="text-xs font-mono text-slate-500 pt-1">
                    EXPIRES: 24h from issue
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => copyToClipboard(`https://sentinelguard.app/pass/${generatedPass.passCode}`)}
                  className="btn-tactile py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => {
                    const text = `Hi ${generatedPass.guestName}, here is your digital entry pass for SentinelGuard Gate 1 (Unit ${generatedPass.unitNumber}): Pass Code ${generatedPass.passCode}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="btn-tactile py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="card-carbon p-6 flex flex-col items-center justify-center text-center py-14 text-slate-500 space-y-2">
              <QrCode className="w-10 h-10 text-slate-700" />
              <div className="text-xs font-semibold text-slate-300">No Pass Active in Preview</div>
              <p className="text-xs text-slate-500 max-w-xs font-mono">
                Submit guest details on the left to create a guest pass.
              </p>
            </div>
          )}

          {/* Where this unit's cars and guests are parked */}
          <div className="card-carbon p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-semibold text-white">My Parking — Unit {activeUnit.unitNumber}</span>
              <Car className="w-4 h-4 text-emerald-400" />
            </div>
            {unitBays.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 font-mono">No bay allocated to this unit.</div>
            ) : (
              <div className="space-y-2">
                {unitBays.map((bay) => (
                  <div key={bay.id} className="p-2.5 bg-slate-950/70 border border-white/5 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-white">{bay.bayNumber}</span>
                      <span className="text-slate-500 block">
                        {bay.zone}
                        {bay.occupantName && ` • ${bay.occupantName}`}
                        {bay.currentVehiclePlate && ` • ${bay.currentVehiclePlate}`}
                        {bay.entryTime && ` • ${formatDuration(bay.entryTime)}`}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      bay.status === 'Overstay_Warning' ? 'bg-rose-500/10 text-rose-400' :
                      bay.status === 'Available' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {bay.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Passes for Selected Unit */}
          <div className="card-carbon p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-semibold text-white">Issued Passes for Unit {activeUnit.unitNumber}</span>
              <span className="text-xs font-mono text-emerald-400">{unitPasses.length} total</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {unitPasses.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4 font-mono">No active passes issued.</div>
              ) : (
                unitPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className="p-2.5 bg-slate-950/70 border border-white/5 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{pass.guestName}</span>
                      <span className="text-slate-500 block font-mono text-xs">{pass.passCode} • {pass.visitorType}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      pass.status === 'CheckedIn' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300'
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
