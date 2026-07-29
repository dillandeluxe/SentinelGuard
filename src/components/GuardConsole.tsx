'use client';

import React, { useState } from 'react';
import { useSystem } from '../lib/store';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  Building2, 
  Car, 
  UserCheck, 
  UserPlus, 
  Clock, 
  ParkingSquare, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  LogOut,
  Sparkles,
  PhoneCall,
  Camera,
  DoorOpen
} from 'lucide-react';

export const GuardConsole: React.FC = () => {
  const { 
    units, 
    visitorPasses, 
    visitorLogs, 
    parkingSpaces, 
    gateStatus, 
    activeGateMessage,
    checkInVisitor, 
    quickManualCheckIn, 
    checkoutVisitorLog,
    triggerGateOpen 
  } = useSystem();

  const [scanInput, setScanInput] = useState('');
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
  const [unitSearch, setUnitSearch] = useState('');
  const [selectedParkingBay, setSelectedParkingBay] = useState<string>('V-01');

  // Manual Check-In Form state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualUnit, setManualUnit] = useState('A-101');
  const [manualPlate, setManualPlate] = useState('');
  const [manualType, setManualType] = useState<'Guest' | 'Delivery' | 'Contractor' | 'VIP'>('Guest');
  const [manualNotes, setManualNotes] = useState('');

  // Active passes filtering
  const activePasses = visitorPasses.filter((p) => p.status === 'Active');
  const availableVisitorBays = parkingSpaces.filter((ps) => ps.type === 'Visitor' && ps.status === 'Available');

  // Search matched pass
  const matchedPass = activePasses.find(
    (p) => p.passCode.toLowerCase() === scanInput.trim().toLowerCase() || p.id === selectedPassId
  );

  // Search units
  const filteredUnits = units.filter(
    (u) => u.unitNumber.toLowerCase().includes(unitSearch.toLowerCase()) ||
           u.residentName.toLowerCase().includes(unitSearch.toLowerCase())
  );

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedPass) {
      checkInVisitor(matchedPass.id, selectedParkingBay);
      setScanInput('');
      setSelectedPassId(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    quickManualCheckIn({
      guestName: manualName,
      unitNumber: manualUnit,
      vehiclePlate: manualPlate.toUpperCase(),
      visitorType: manualType,
      assignedParkingBay: selectedParkingBay,
      notes: manualNotes,
    });
    setShowManualModal(false);
    setManualName('');
    setManualPlate('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Status Banner & Barrier Gate Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Guard House Gate Control Console</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  System Online
                </span>
              </div>
              <p className="text-sm text-slate-400">Gate 1 & Visitor Bay Real-time Enforcement Interface</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className={`px-4 py-2 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-all ${
              gateStatus === 'Open' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-pulse' :
              gateStatus === 'Opening' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' :
              'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              <DoorOpen className="w-4 h-4" />
              Gate Status: <span className="font-bold">{gateStatus}</span>
            </div>

            <button
              onClick={() => triggerGateOpen('Manual Guard Button Trigger')}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-sky-500/20 text-sm transition-all flex items-center gap-2"
            >
              <DoorOpen className="w-4 h-4" />
              Manual Open Barrier
            </button>
          </div>
        </div>

        {activeGateMessage && (
          <div className="mt-4 p-3 bg-sky-950/80 border border-sky-500/40 rounded-xl text-sky-200 text-sm flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            <span>{activeGateMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick QR & Visitor Pass Scanner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-base">
                <QrCode className="w-5 h-5" />
                <h3>Guest Pass & QR Scan Check-In</h3>
              </div>
              <button
                onClick={() => setShowManualModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                Manual Walk-In Entry
              </button>
            </div>

            {/* QR / Passcode Search Input */}
            <form onSubmit={handleScanSubmit} className="space-y-3">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Enter QR Pass Code or Scan Guest Pass
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. QR-89421 or select below..."
                  value={scanInput}
                  onChange={(e) => {
                    setScanInput(e.target.value);
                    setSelectedPassId(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-32 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                />
                <QrCode className="w-5 h-5 text-slate-500 absolute left-4" />
                <button
                  type="submit"
                  disabled={!matchedPass}
                  className="absolute right-2 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold rounded-lg text-sm transition flex items-center gap-1"
                >
                  Approve Entry
                </button>
              </div>
            </form>

            {/* Active Pre-Registered Passes Quick Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 font-medium block">Pre-Registered Visitor Passes (Expected Today):</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {activePasses.length === 0 ? (
                  <div className="col-span-2 text-center py-6 text-slate-500 text-sm bg-slate-950/50 rounded-xl border border-slate-800">
                    No active pre-registered passes found.
                  </div>
                ) : (
                  activePasses.map((pass) => {
                    const isSelected = matchedPass?.id === pass.id;
                    return (
                      <div
                        key={pass.id}
                        onClick={() => {
                          setSelectedPassId(pass.id);
                          setScanInput(pass.passCode);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-sky-950/60 border-sky-500 ring-1 ring-sky-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            {pass.passCode}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {pass.visitorType}
                          </span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-white font-semibold text-sm">{pass.guestName}</h4>
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            Unit: <span className="text-slate-200 font-medium">{pass.unitNumber}</span> ({pass.residentName})
                          </p>
                          {pass.vehiclePlate && (
                            <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                              <Car className="w-3 h-3 text-slate-500" />
                              Plate: <span className="font-mono text-slate-300 font-medium">{pass.vehiclePlate}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Matched Pass Action Box */}
            {matchedPass && (
              <div className="bg-sky-950/40 border border-sky-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-sky-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Valid Pass Verified</span>
                  </div>
                  <span className="text-xs font-mono text-sky-300">{matchedPass.passCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Guest Name:</span>
                    <p className="text-white font-semibold text-sm">{matchedPass.guestName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Visiting Unit:</span>
                    <p className="text-sky-300 font-semibold text-sm">{matchedPass.unitNumber} ({matchedPass.residentName})</p>
                  </div>
                </div>

                {/* Parking Space Selector */}
                <div className="pt-2">
                  <label className="text-xs text-slate-300 font-medium block mb-1.5 flex items-center gap-1">
                    <ParkingSquare className="w-3.5 h-3.5 text-sky-400" />
                    Assign Visitor Parking Bay:
                  </label>
                  <select
                    value={selectedParkingBay}
                    onChange={(e) => setSelectedParkingBay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {availableVisitorBays.map((bay) => (
                      <option key={bay.id} value={bay.bayNumber}>
                        {bay.bayNumber} - {bay.zone} ({bay.type})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    checkInVisitor(matchedPass.id, selectedParkingBay);
                    setScanInput('');
                    setSelectedPassId(null);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Confirm Check-In & Raise Barrier Gate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Unit Directory & Status Search */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Building2 className="w-4 h-4" />
                <h3>Unit Status & Resident Lookup</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">{units.length} Units Listed</span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search unit (e.g. A-101, B-501)..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredUnits.map((u) => {
                const statusBadge =
                  u.status === 'ExpectingGuest'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : u.status === 'Occupied'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : u.status === 'DoNotDisturb'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <div
                    key={u.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm font-mono">{u.unitNumber}</span>
                        <span className="text-xs text-slate-400">({u.block})</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadge}`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Resident:</span>
                        <span className="font-medium text-slate-200">{u.residentName}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Contact:</span>
                        <span className="text-sky-400 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          {u.residentPhone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Assigned Bay:</span>
                        <span className="text-slate-300 font-mono">{u.allocatedParkingBay || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Visitor Logs & Departure Checkout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-base">
            <Clock className="w-5 h-5" />
            <h3>Currently Inside Property (Active Visitor Logbook)</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {visitorLogs.filter((l) => l.status === 'Inside').length} Vehicles / Guests On-Site
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-3">Visitor / Guest</th>
                <th className="p-3">Type</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Vehicle Plate</th>
                <th className="p-3">Assigned Parking</th>
                <th className="p-3">Entry Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {visitorLogs.map((log) => {
                const isOverstay = log.notes?.includes('Overstay');
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white">{log.guestName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                        {log.visitorType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-sky-300">{log.unitNumber}</td>
                    <td className="p-3 font-mono font-medium text-slate-200">{log.vehiclePlate || 'N/A'}</td>
                    <td className="p-3 font-mono text-emerald-400 font-semibold">{log.assignedParkingBay || 'N/A'}</td>
                    <td className="p-3 text-slate-400 font-mono">{log.entryTime}</td>
                    <td className="p-3">
                      {log.status === 'Inside' ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 w-max ${
                          isOverstay
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isOverstay && <AlertTriangle className="w-3 h-3" />}
                          {isOverstay ? 'Overstay Warning' : 'Active On-Site'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          Departed ({log.exitTime})
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {log.status === 'Inside' && (
                        <button
                          onClick={() => checkoutVisitorLog(log.id)}
                          className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-medium text-xs transition flex items-center gap-1 ml-auto"
                        >
                          <LogOut className="w-3 h-3" />
                          Check-Out & Free Slot
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-In Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-400" />
                Manual Visitor Entry
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Visiting Unit *</label>
                  <select
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.unitNumber}>
                        {u.unitNumber} ({u.residentName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Visitor Category</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Guest">Guest</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Contractor">Contractor</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC-1234"
                    value={manualPlate}
                    onChange={(e) => setManualPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Assign Parking Bay</label>
                  <select
                    value={selectedParkingBay}
                    onChange={(e) => setSelectedParkingBay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  >
                    {availableVisitorBays.map((bay) => (
                      <option key={bay.id} value={bay.bayNumber}>
                        {bay.bayNumber} ({bay.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Notes / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Deliver food package / HVAC repair"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-sky-500/20"
                >
                  Log Entry & Open Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
