'use client';

import React, { useState } from 'react';
import { useSystem } from '../lib/store';
import { 
  ParkingSquare, 
  Car, 
  Zap, 
  Accessibility, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Clock, 
  ShieldAlert,
  Info,
  Filter,
  RefreshCw,
  Layers
} from 'lucide-react';
import { ParkingSpace } from '../lib/types';
import { formatDuration } from '../lib/rules';

export const ParkingMap: React.FC = () => {
  const { parkingSpaces, updateParkingSpaceStatus } = useSystem();

  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);

  const zones = ['All', 'Zone B1 (Visitor)', 'Zone B2 (Resident)'];

  const filteredSpaces = selectedZone === 'All'
    ? parkingSpaces
    : parkingSpaces.filter((s) => s.zone === selectedZone);

  // Statistics
  const totalBays = parkingSpaces.length;
  const availableBays = parkingSpaces.filter((s) => s.status === 'Available').length;
  const visitorBaysOccupied = parkingSpaces.filter((s) => s.status === 'Occupied_Visitor').length;
  const overstayWarnings = parkingSpaces.filter((s) => s.status === 'Overstay_Warning').length;

  return (
    <div className="space-y-6">
      {/* Top Parking Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-carbon p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-mono block">TOTAL CAPACITY</span>
            <span className="text-2xl font-bold text-white font-mono">{totalBays} Bays</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300">
            <ParkingSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="card-carbon p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-mono block">VACANT AVAILABLE</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{availableBays} Open</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="card-carbon p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-mono block">VISITOR OCCUPIED</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">{visitorBaysOccupied} Stalls</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="card-carbon p-4 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-mono block">OVERSTAY VIOLATIONS</span>
            <span className="text-2xl font-bold text-rose-400 font-mono">{overstayWarnings} Stalls</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Interactive Parking Map & Slot Grid */}
      <div className="card-carbon-elevated p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Real-Time Bay Allocation Grid</h3>
              <p className="text-xs text-slate-400">Click any stall to view occupant telemetry or force release slot</p>
            </div>
          </div>

          {/* Zone Filter Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`btn-tactile px-3 py-1.5 rounded text-xs font-mono transition ${
                  selectedZone === zone
                    ? 'bg-slate-800 text-white font-bold border border-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-950/60 p-3 rounded-lg border border-white/5 font-mono">
          <span className="text-slate-500 font-semibold uppercase text-xs">Telemetry Status:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300 text-xs">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300 text-xs">Visitor Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
            <span className="text-slate-300 text-xs">Resident Assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
            <span className="text-rose-300 text-xs">Overstay (&gt;4h)</span>
          </div>
        </div>

        {/* Parking Grid Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredSpaces.map((space) => {
            const isAvailable = space.status === 'Available';
            const isVisitor = space.status === 'Occupied_Visitor';
            const isResident = space.status === 'Occupied_Resident';
            const isOverstay = space.status === 'Overstay_Warning';

            let cardBg = 'bg-slate-950/70 border-white/5 hover:border-white/20';
            let statusColor = 'text-slate-400';

            if (isAvailable) {
              cardBg = 'bg-emerald-950/15 border-emerald-500/25 hover:border-emerald-500/50';
              statusColor = 'text-emerald-400';
            } else if (isVisitor) {
              cardBg = 'bg-amber-950/15 border-amber-500/25 hover:border-amber-500/50';
              statusColor = 'text-amber-400';
            } else if (isResident) {
              cardBg = 'bg-sky-950/15 border-sky-500/25 hover:border-sky-500/50';
              statusColor = 'text-sky-400';
            } else if (isOverstay) {
              cardBg = 'bg-rose-950/25 border-rose-500/40 ring-1 ring-rose-500/40 animate-pulse';
              statusColor = 'text-rose-400';
            }

            return (
              <div
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-2 relative overflow-hidden group ${cardBg} btn-tactile`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white flex items-center gap-1">
                    {space.type === 'EV_Charging' && <Zap className="w-3 h-3 text-amber-400" />}
                    {space.type === 'Handicap' && <Accessibility className="w-3 h-3 text-sky-400" />}
                    {space.bayNumber}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isAvailable ? 'bg-emerald-400' :
                    isVisitor ? 'bg-amber-400' :
                    isResident ? 'bg-sky-400' :
                    isOverstay ? 'bg-rose-400 animate-ping' :
                    'bg-purple-400'
                  }`} />
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <div className={`text-xs font-semibold ${statusColor}`}>
                    {isAvailable ? 'VACANT' :
                     isVisitor ? 'VISITOR' :
                     isResident ? 'RESIDENT' :
                     isOverstay ? 'OVERSTAY' :
                     'RESERVED'}
                  </div>

                  {space.currentVehiclePlate && (
                    <div className="text-xs text-slate-100 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-white/10 w-max truncate">
                      {space.currentVehiclePlate}
                    </div>
                  )}

                  {space.occupantName && (
                    <div className="text-xs text-slate-400 truncate font-sans">
                      {space.occupantName}
                    </div>
                  )}

                  {space.assignedUnitNumber && (
                    <div className="text-xs text-slate-500">
                      Unit: <span className="text-slate-300">{space.assignedUnitNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Space Detail Modal */}
      {selectedSpace && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-carbon-elevated max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ParkingSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-mono">Bay Telemetry: {selectedSpace.bayNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedSpace(null)}
                aria-label="Close"
                className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-500">ZONE</span>
                <span className="text-white font-medium">{selectedSpace.zone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-500">BAY TYPE</span>
                <span className="text-emerald-400 font-semibold">{selectedSpace.type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-500">CURRENT STATUS</span>
                <span className="font-bold text-emerald-400 uppercase">{selectedSpace.status}</span>
              </div>

              {selectedSpace.currentVehiclePlate && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-500">VEHICLE PLATE</span>
                  <span className="text-amber-300 font-bold">{selectedSpace.currentVehiclePlate}</span>
                </div>
              )}

              {selectedSpace.occupantName && (
                <div className="flex justify-between py-1 border-b border-white/5 font-sans">
                  <span className="text-slate-500 font-mono">OCCUPANT</span>
                  <span className="text-slate-200 font-semibold">{selectedSpace.occupantName}</span>
                </div>
              )}

              {selectedSpace.assignedUnitNumber && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-500">ASSIGNED UNIT</span>
                  <span className="text-slate-200 font-bold">{selectedSpace.assignedUnitNumber}</span>
                </div>
              )}

              {selectedSpace.entryTime && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-500">PARK DURATION</span>
                  <span className="text-amber-400">{formatDuration(selectedSpace.entryTime)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex gap-3">
              {selectedSpace.status !== 'Available' ? (
                <button
                  onClick={() => {
                    updateParkingSpaceStatus(selectedSpace.id, 'Available');
                    setSelectedSpace(null);
                  }}
                  className="btn-tactile w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Release Bay & Mark Available</span>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedSpace(null)}
                  className="btn-tactile w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-xs border border-white/10"
                >
                  Close Telemetry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
