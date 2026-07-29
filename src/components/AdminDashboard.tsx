'use client';

import React from 'react';
import { useSystem } from '../lib/store';
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
  Download
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { units, visitorLogs, parkingSpaces } = useSystem();

  const totalUnits = units.length;
  const expectingGuestsUnits = units.filter((u) => u.status === 'ExpectingGuest').length;
  const totalLogs = visitorLogs.length;
  const activeInside = visitorLogs.filter((l) => l.status === 'Inside').length;

  const totalParking = parkingSpaces.length;
  const occupiedParking = parkingSpaces.filter((p) => p.status !== 'Available').length;
  const parkingOccupancyRate = Math.round((occupiedParking / totalParking) * 100);

  const overstayCount = parkingSpaces.filter((p) => p.status === 'Overstay_Warning').length;

  // Breakdown by visitor type
  const guestsCount = visitorLogs.filter((l) => l.visitorType === 'Guest').length;
  const deliveryCount = visitorLogs.filter((l) => l.visitorType === 'Delivery').length;
  const contractorCount = visitorLogs.filter((l) => l.visitorType === 'Contractor').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Property Security & Parking Analytics Dashboard
            </h3>
            <p className="text-xs text-slate-400">Real-time occupancy metrics, entry logs, and overstay enforcement reports</p>
          </div>
        </div>

        <button
          onClick={() => alert('Exporting Security Audit Log CSV...')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-teal-400" />
          Export Audit Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Property Units</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalUnits} Units</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {expectingGuestsUnits} units expecting visitors today
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Visitors Today</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{totalLogs} Entries</div>
          <p className="text-[11px] text-sky-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activeInside} visitors currently on-site
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Parking Space Occupancy</span>
            <ParkingSquare className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{parkingOccupancyRate}%</div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-teal-400 h-full rounded-full" style={{ width: `${parkingOccupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overstay Violations</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 font-mono">{overstayCount} Vehicles</div>
          <p className="text-[11px] text-rose-300">
            {overstayCount > 0 ? 'Requires Guard Towing/Clamping Notice' : 'No active overstay violations'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visitor Traffic Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Visitor Traffic Category Breakdown</span>
              <span className="text-xs text-slate-500 font-mono">Today's Traffic</span>
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Social Guests</span>
                  <span className="text-sky-400 font-mono">{guestsCount} Visits</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(guestsCount / totalLogs) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Delivery & Food Couriers</span>
                  <span className="text-amber-400 font-mono">{deliveryCount} Visits</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(deliveryCount / totalLogs) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Contractors & Maintenance</span>
                  <span className="text-purple-400 font-mono">{contractorCount} Visits</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(contractorCount / totalLogs) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Guard Audit Trail Logs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Security Guard Activity Logs</span>
              <span className="text-xs text-slate-500 font-mono">Live Audit Trail</span>
            </h4>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {visitorLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{log.guestName}</span>
                    <span className="text-slate-400 font-mono">{log.entryTime}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Checked in by: <strong className="text-slate-200">{log.guardName}</strong></span>
                    <span className="text-sky-400 font-mono">Unit {log.unitNumber}</span>
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
