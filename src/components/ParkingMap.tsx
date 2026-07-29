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
  RefreshCw
} from 'lucide-react';
import { ParkingSpace } from '../lib/types';

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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Total Parking Bays</span>
            <span className="text-2xl font-bold text-white font-mono">{totalBays} Slots</span>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <ParkingSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Available Open Bays</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{availableBays} Open</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Active Visitor Bays</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">{visitorBaysOccupied} Vehicles</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Overstay Warnings</span>
            <span className="text-2xl font-bold text-rose-400 font-mono">{overstayWarnings} Flagged</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Interactive Parking Map & Slot Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ParkingSquare className="w-6 h-6 text-sky-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Live Parking Space Allocation Grid</h3>
              <p className="text-xs text-slate-400">Click any bay to view details, assign vehicles, or clear space</p>
            </div>
          </div>

          {/* Zone Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedZone === zone
                    ? 'bg-sky-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400"></span>
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400"></span>
            <span className="text-slate-300">Occupied (Visitor)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-400"></span>
            <span className="text-slate-300">Occupied (Resident)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400"></span>
            <span className="text-slate-300">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse border border-rose-400"></span>
            <span className="text-slate-300">Overstay Alert (&gt;4 Hours)</span>
          </div>
        </div>

        {/* Parking Grid Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSpaces.map((space) => {
            const isAvailable = space.status === 'Available';
            const isVisitor = space.status === 'Occupied_Visitor';
            const isResident = space.status === 'Occupied_Resident';
            const isOverstay = space.status === 'Overstay_Warning';
            const isReserved = space.status === 'Reserved';

            let cardBg = 'bg-slate-950/80 border-slate-800 hover:border-slate-700';
            let statusColor = 'text-slate-400';

            if (isAvailable) {
              cardBg = 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60';
              statusColor = 'text-emerald-400';
            } else if (isVisitor) {
              cardBg = 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/80';
              statusColor = 'text-amber-400';
            } else if (isResident) {
              cardBg = 'bg-sky-950/20 border-sky-500/40 hover:border-sky-500/80';
              statusColor = 'text-sky-400';
            } else if (isOverstay) {
              cardBg = 'bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/60 animate-pulse';
              statusColor = 'text-rose-400';
            } else if (isReserved) {
              cardBg = 'bg-purple-950/20 border-purple-500/40 hover:border-purple-500/80';
              statusColor = 'text-purple-400';
            }

            return (
              <div
                key={space.id}
                onClick={() => setSelectedSpace(space)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 relative overflow-hidden group ${cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white flex items-center gap-1">
                    {space.type === 'EV_Charging' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                    {space.type === 'Handicap' && <Accessibility className="w-3.5 h-3.5 text-sky-400" />}
                    {space.bayNumber}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isAvailable ? 'bg-emerald-500' :
                    isVisitor ? 'bg-amber-500' :
                    isResident ? 'bg-sky-500' :
                    isOverstay ? 'bg-rose-500 animate-ping' :
                    'bg-purple-500'
                  }`}></span>
                </div>

                <div className="text-xs space-y-1">
                  <div className={`font-semibold ${statusColor}`}>
                    {isAvailable ? 'Available' :
                     isVisitor ? 'Visitor Parked' :
                     isResident ? 'Resident' :
                     isOverstay ? 'OVERSTAY WARNING' :
                     'Reserved'}
                  </div>

                  {space.currentVehiclePlate && (
                    <div className="font-mono text-[11px] text-white font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 w-max">
                      {space.currentVehiclePlate}
                    </div>
                  )}

                  {space.occupantName && (
                    <div className="text-[11px] text-slate-300 truncate">
                      {space.occupantName}
                    </div>
                  )}

                  {space.assignedUnitNumber && (
                    <div className="text-[10px] text-slate-400">
                      Unit: <span className="font-mono text-slate-200">{space.assignedUnitNumber}</span>
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ParkingSquare className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white font-mono">Parking Bay {selectedSpace.bayNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedSpace(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Parking Zone:</span>
                <span className="text-white font-medium">{selectedSpace.zone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Bay Type:</span>
                <span className="text-sky-400 font-semibold">{selectedSpace.type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{selectedSpace.status}</span>
              </div>

              {selectedSpace.currentVehiclePlate && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Vehicle Plate:</span>
                  <span className="font-mono text-white font-bold">{selectedSpace.currentVehiclePlate}</span>
                </div>
              )}

              {selectedSpace.occupantName && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Occupant Name:</span>
                  <span className="text-slate-200 font-semibold">{selectedSpace.occupantName}</span>
                </div>
              )}

              {selectedSpace.assignedUnitNumber && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Assigned Unit:</span>
                  <span className="font-mono text-sky-300 font-bold">{selectedSpace.assignedUnitNumber}</span>
                </div>
              )}

              {selectedSpace.entryTime && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Duration Parked:</span>
                  <span className="text-amber-400 font-mono">{selectedSpace.entryTime}</span>
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
                  className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Release Bay & Mark Available
                </button>
              ) : (
                <button
                  onClick={() => setSelectedSpace(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition"
                >
                  Close Window
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
