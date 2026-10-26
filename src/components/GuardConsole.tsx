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
  DoorOpen,
  Activity,
  Radio,
  Sliders,
  Check
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

  const isGateOpen = gateStatus === 'Open';
  const isGateOpening = gateStatus === 'Opening';

  return (
    <div className="space-y-6">
      {/* Hardware Telemetry & Barrier Master Controller */}
      <div className="card-carbon-elevated p-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">Main Guardhouse Access Controller</h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GATE-01 ONLINE
                </span>
                <span className="hidden sm:inline-flex text-xs font-mono text-slate-500">
                  COM-4 • 115200 8N1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Optical barrier telemetry, access pass validation & instant stall dispatch
              </p>
            </div>
          </div>

          {/* Physical Barrier Actuator Bar */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold border flex items-center gap-2 transition-all duration-300 ${
              isGateOpen 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20' 
                : isGateOpening
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-slate-900/90 border-white/10 text-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isGateOpen ? 'bg-emerald-400' : isGateOpening ? 'bg-amber-400 animate-ping' : 'bg-slate-600'
              }`} />
              ARM POS: <span className="font-bold">{isGateOpen ? '85° (RAISED)' : isGateOpening ? 'IN MOTION' : '0° (SECURED)'}</span>
            </div>

            <button
              onClick={() => triggerGateOpen('Manual Guard Button Trigger')}
              disabled={isGateOpen || isGateOpening}
              className="btn-tactile px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/15"
            >
              <DoorOpen className="w-4 h-4" />
              <span>Actuate Barrier Arm</span>
            </button>
          </div>
        </div>

        {activeGateMessage && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span>Telemetry Dispatch: {activeGateMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Pass Processing & Expected Arrivals */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-carbon p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Guest Pass Verification & Clearance</h3>
              </div>
              <button
                onClick={() => setShowManualModal(true)}
                className="btn-tactile px-3 min-h-11 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-sm font-medium rounded-lg flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Walk-In Registration</span>
              </button>
            </div>

            {/* QR / Passcode Search Input */}
            <form onSubmit={handleScanSubmit} className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Optical Scanner / Numeric Pass Code Entry
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Scan QR or type code (e.g. QR-89421)..."
                  value={scanInput}
                  onChange={(e) => {
                    setScanInput(e.target.value);
                    setSelectedPassId(null);
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-32 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-mono tracking-wide transition-colors"
                />
                <QrCode className="w-4 h-4 text-slate-500 absolute left-3.5" />
                <button
                  type="submit"
                  disabled={!matchedPass}
                  className="absolute right-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-bold rounded text-xs transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            {/* Expected Arrivals Carousel/List */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Expected Pre-Registered Passes:</span>
                <span className="text-xs font-mono text-emerald-400">{activePasses.length} pending</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {activePasses.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-slate-500 text-xs bg-slate-950/60 rounded-lg border border-white/5 font-mono">
                    No pending visitor passes on file.
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
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50'
                            : 'bg-slate-950/70 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            {pass.passCode}
                          </span>
                          <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/10">
                            {pass.visitorType}
                          </span>
                        </div>
                        <div className="mt-2 space-y-0.5">
                          <div className="text-xs font-semibold text-white truncate">{pass.guestName}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>Unit {pass.unitNumber}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 truncate">{pass.residentName}</span>
                          </div>
                          {pass.vehiclePlate && (
                            <div className="text-xs font-mono text-amber-300/90 flex items-center gap-1 pt-0.5">
                              <Car className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{pass.vehiclePlate}</span>
                            </div>
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
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Pass Verified Clean</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-300">{matchedPass.passCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-xs block">Visitor</span>
                    <span className="text-white font-semibold">{matchedPass.guestName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Destination</span>
                    <span className="text-emerald-300 font-semibold">Unit {matchedPass.unitNumber} ({matchedPass.residentName})</span>
                  </div>
                </div>

                {/* Parking Space Selector */}
                <div className="pt-1">
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <ParkingSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Assign Designated Stall:
                  </label>
                  <select
                    value={selectedParkingBay}
                    onChange={(e) => setSelectedParkingBay(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {availableVisitorBays.map((bay) => (
                      <option key={bay.id} value={bay.bayNumber}>
                        {bay.bayNumber} — {bay.zone} ({bay.type})
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
                  className="btn-tactile w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Authorize & Lift Barrier</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Unit Lookup & Directory */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-carbon p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Resident Directory</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">{units.length} units</span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search unit or resident..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredUnits.map((u) => {
                const statusBadge =
                  u.status === 'ExpectingGuest'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : u.status === 'Occupied'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : u.status === 'DoNotDisturb'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-white/10';

                return (
                  <div
                    key={u.id}
                    className="p-3 bg-slate-950/70 border border-white/5 rounded-lg hover:border-white/15 transition duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">{u.unitNumber}</span>
                        <span className="text-xs text-slate-500">({u.block})</span>
                      </div>
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusBadge}`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">Resident</span>
                        <span className="font-medium text-slate-200">{u.residentName}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-slate-500">Phone</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <PhoneCall className="w-2.5 h-2.5" />
                          {u.residentPhone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Allocated Bay</span>
                        <span className="text-slate-300 font-mono">{u.allocatedParkingBay || 'None'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Logbook */}
      <div className="card-carbon p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Live On-Site Property Logbook</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {visitorLogs.filter((l) => l.status === 'Inside').length} Vehicles / Guests Inside
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-500 font-mono text-xs uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-3">Visitor / Guest</th>
                <th className="p-3">Type</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Vehicle Plate</th>
                <th className="p-3">Stall Bay</th>
                <th className="p-3">In Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {visitorLogs.map((log) => {
                const isOverstay = log.notes?.includes('Overstay');
                return (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-sans font-medium text-white">{log.guestName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-900 border border-white/10 text-slate-300">
                        {log.visitorType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-300">{log.unitNumber}</td>
                    <td className="p-3 text-slate-200">{log.vehiclePlate || 'N/A'}</td>
                    <td className="p-3 text-emerald-400 font-semibold">{log.assignedParkingBay || 'N/A'}</td>
                    <td className="p-3 text-slate-400">{log.entryTime}</td>
                    <td className="p-3">
                      {log.status === 'Inside' ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 w-max ${
                          isOverstay
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isOverstay && <AlertTriangle className="w-3 h-3" />}
                          {isOverstay ? 'OVERSTAY' : 'ACTIVE'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-900 text-slate-500 border border-white/5">
                          Departed ({log.exitTime})
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-sans">
                      {log.status === 'Inside' && (
                        <button
                          onClick={() => checkoutVisitorLog(log.id)}
                          className="btn-tactile px-3 min-h-11 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-medium text-xs flex items-center gap-1 ml-auto"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Check-Out</span>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-carbon-elevated max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Manual Walk-In Entry Clearance
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                aria-label="Close"
                className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Visiting Unit *</label>
                  <select
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.unitNumber}>
                        {u.unitNumber} ({u.residentName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="text-xs font-mono text-slate-400 block mb-1">License Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC-1234"
                    value={manualPlate}
                    onChange={(e) => setManualPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Assign Stall</label>
                  <select
                    value={selectedParkingBay}
                    onChange={(e) => setSelectedParkingBay(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
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
                <label className="text-xs font-mono text-slate-400 block mb-1">Purpose / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Priority delivery / plumbing inspection"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="btn-tactile w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-xs border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tactile w-1/2 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-emerald-500/20"
                >
                  Authorize Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
