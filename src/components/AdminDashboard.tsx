'use client';

import React, { useState } from 'react';
import { useSystem } from '../lib/store';
import { ParkingBayType } from '../lib/types';
import { 
  BarChart3, 
  Users, 
  Building2, 
  ParkingSquare, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileSpreadsheet,
  Zap,
  Download,
  Activity,
  Layers,
  PlusCircle
} from 'lucide-react';

const inputClass =
  'w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono';
const labelClass = 'text-[11px] font-mono text-zinc-400 block mb-1';

export const AdminDashboard: React.FC = () => {
  const { units, visitorLogs, parkingSpaces, addRealUnit, addRealParkingSpace } = useSystem();

  const emptyUnit = { unitNumber: '', block: '', floor: '1', residentName: '', residentPhone: '', allocatedParkingBay: '', vehicles: '' };
  const [unitForm, setUnitForm] = useState(emptyUnit);
  const [unitError, setUnitError] = useState('');
  const emptyBay = { bayNumber: '', zone: '', type: 'Visitor' as ParkingBayType };
  const [bayForm, setBayForm] = useState(emptyBay);
  const [bayError, setBayError] = useState('');

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const unitNumber = unitForm.unitNumber.trim().toUpperCase();
    if (units.some((u) => u.unitNumber.toUpperCase() === unitNumber)) {
      setUnitError(`Unit ${unitNumber} already exists.`);
      return;
    }
    const residentName = unitForm.residentName.trim();
    addRealUnit({
      unitNumber,
      block: unitForm.block.trim(),
      floor: Number(unitForm.floor) || 0,
      residentName,
      residentPhone: unitForm.residentPhone.trim(),
      status: residentName ? 'Occupied' : 'Vacant',
      allocatedParkingBay: unitForm.allocatedParkingBay.trim().toUpperCase() || undefined,
      registeredVehicles: unitForm.vehicles.split(',').map((v) => v.trim().toUpperCase()).filter(Boolean),
    });
    setUnitForm(emptyUnit);
    setUnitError('');
  };

  const handleAddBay = (e: React.FormEvent) => {
    e.preventDefault();
    const bayNumber = bayForm.bayNumber.trim().toUpperCase();
    if (parkingSpaces.some((p) => p.bayNumber.toUpperCase() === bayNumber)) {
      setBayError(`Bay ${bayNumber} already exists.`);
      return;
    }
    addRealParkingSpace({ bayNumber, zone: bayForm.zone.trim(), type: bayForm.type, status: 'Available' });
    setBayForm(emptyBay);
    setBayError('');
  };

  const totalUnits = units.length;
  const expectingGuestsUnits = units.filter((u) => u.status === 'ExpectingGuest').length;
  const totalLogs = visitorLogs.length;
  const activeInside = visitorLogs.filter((l) => l.status === 'Inside').length;

  const totalParking = parkingSpaces.length;
  const occupiedParking = parkingSpaces.filter((p) => p.status !== 'Available').length;
  const parkingOccupancyRate = totalParking ? Math.round((occupiedParking / totalParking) * 100) : 0;

  const overstayCount = parkingSpaces.filter((p) => p.status === 'Overstay_Warning').length;

  // Breakdown by visitor type
  const guestsCount = visitorLogs.filter((l) => l.visitorType === 'Guest').length;
  const deliveryCount = visitorLogs.filter((l) => l.visitorType === 'Delivery').length;
  const contractorCount = visitorLogs.filter((l) => l.visitorType === 'Contractor').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="card-carbon-elevated p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">System Telemetry & Audit Operations</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live capacity utilization, barrier transaction auditing, and overstay violations
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Generating Security Audit Log CSV...')}
          className="btn-tactile px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-medium rounded-lg text-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-carbon p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>RESIDENTIAL UNITS</span>
            <Building2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalUnits}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            {expectingGuestsUnits} units expecting guests
          </p>
        </div>

        <div className="card-carbon p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>DAILY CLEARANCES</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalLogs}</div>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-emerald-400" />
            {activeInside} vehicles on-site now
          </p>
        </div>

        <div className="card-carbon p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>PARKING OCCUPANCY</span>
            <ParkingSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{parkingOccupancyRate}%</div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${parkingOccupancyRate}%` }} 
            />
          </div>
        </div>

        <div className="card-carbon p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>OVERSTAY FLAGS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 font-mono">{overstayCount}</div>
          <p className="text-[11px] text-zinc-400 font-mono">
            {overstayCount > 0 ? 'Enforcement warning issued' : 'All stalls compliant'}
          </p>
        </div>
      </div>

      {/* Property Setup: register units and parking bays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleAddUnit} className="card-carbon p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Register Unit & Resident
            </span>
            <span className="text-[11px] font-mono text-zinc-500">{totalUnits} units</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="unit-number" className={labelClass}>Unit No. *</label>
              <input id="unit-number" required placeholder="A-101" value={unitForm.unitNumber} onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })} className={`${inputClass} uppercase`} />
            </div>
            <div>
              <label htmlFor="unit-block" className={labelClass}>Block *</label>
              <input id="unit-block" required placeholder="Block A" value={unitForm.block} onChange={(e) => setUnitForm({ ...unitForm, block: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="unit-floor" className={labelClass}>Floor *</label>
              <input id="unit-floor" required type="number" value={unitForm.floor} onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="unit-resident" className={labelClass}>Resident Name (blank = vacant)</label>
              <input id="unit-resident" placeholder="Sarah Jenkins" value={unitForm.residentName} onChange={(e) => setUnitForm({ ...unitForm, residentName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="unit-phone" className={labelClass}>Resident Phone</label>
              <input id="unit-phone" type="tel" placeholder="+63 900 000 0000" value={unitForm.residentPhone} onChange={(e) => setUnitForm({ ...unitForm, residentPhone: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="unit-bay" className={labelClass}>Allocated Bay</label>
              <input id="unit-bay" placeholder="R-101" value={unitForm.allocatedParkingBay} onChange={(e) => setUnitForm({ ...unitForm, allocatedParkingBay: e.target.value })} className={`${inputClass} uppercase`} />
            </div>
            <div>
              <label htmlFor="unit-plates" className={labelClass}>Vehicle Plates (comma-separated)</label>
              <input id="unit-plates" placeholder="SJK-8821, ABC-1234" value={unitForm.vehicles} onChange={(e) => setUnitForm({ ...unitForm, vehicles: e.target.value })} className={`${inputClass} uppercase`} />
            </div>
          </div>
          {unitError && <p role="alert" className="text-[11px] font-mono text-rose-400">{unitError}</p>}
          <button type="submit" className="btn-tactile w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition">
            Add Unit
          </button>
        </form>

        <form onSubmit={handleAddBay} className="card-carbon p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Register Parking Bay
            </span>
            <span className="text-[11px] font-mono text-zinc-500">{totalParking} bays</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="bay-number" className={labelClass}>Bay No. *</label>
              <input id="bay-number" required placeholder="V-01" value={bayForm.bayNumber} onChange={(e) => setBayForm({ ...bayForm, bayNumber: e.target.value })} className={`${inputClass} uppercase`} />
            </div>
            <div>
              <label htmlFor="bay-type" className={labelClass}>Type</label>
              <select id="bay-type" value={bayForm.type} onChange={(e) => setBayForm({ ...bayForm, type: e.target.value as ParkingBayType })} className={inputClass}>
                <option value="Visitor">Visitor</option>
                <option value="Resident">Resident</option>
                <option value="EV_Charging">EV Charging</option>
                <option value="Handicap">Handicap</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="bay-zone" className={labelClass}>Zone *</label>
            <input id="bay-zone" required placeholder="Basement 1" value={bayForm.zone} onChange={(e) => setBayForm({ ...bayForm, zone: e.target.value })} className={inputClass} />
          </div>
          {bayError && <p role="alert" className="text-[11px] font-mono text-rose-400">{bayError}</p>}
          <button type="submit" className="btn-tactile w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition">
            Add Bay
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visitor Category Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-carbon p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-semibold text-white">Visitor Distribution by Category</span>
              <span className="text-[11px] font-mono text-zinc-500">TODAY</span>
            </div>

            <div className="space-y-4 pt-1 font-mono">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-sans">Social Guests</span>
                  <span className="text-zinc-200">{guestsCount} visits</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${totalLogs ? (guestsCount / totalLogs) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-sans">Delivery & Couriers</span>
                  <span className="text-amber-300">{deliveryCount} visits</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalLogs ? (deliveryCount / totalLogs) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-sans">Contractors & Trades</span>
                  <span className="text-zinc-300">{contractorCount} visits</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-white/10">
                  <div className="bg-zinc-400 h-full rounded-full" style={{ width: `${totalLogs ? (contractorCount / totalLogs) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Guard Audit Trail */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-carbon p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-semibold text-white">Officer Clearance Audit Trail</span>
              <span className="text-[11px] font-mono text-zinc-500">LIVE FEED</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs font-mono">
              {visitorLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-zinc-950/70 border border-white/5 rounded-lg space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-white font-sans">{log.guestName}</span>
                    <span className="text-zinc-500 text-[11px]">{log.entryTime}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Officer: <span className="text-zinc-200">{log.guardName}</span></span>
                    <span className="text-emerald-400">Unit {log.unitNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
