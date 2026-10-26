'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { Unit, VisitorPass, VisitorLog, ParkingSpace, LPRDetection } from './types';
import { isPassUsable, isPassExpired, isOverstay, pickBay, unitDeleteBlocker, bayDeleteBlocker, newPassCode } from './rules';
import { initialUnits, initialVisitorPasses, initialVisitorLogs, initialParkingSpaces, initialLPRDetections } from './mockData';

interface SystemContextType {
  units: Unit[];
  visitorPasses: VisitorPass[];
  visitorLogs: VisitorLog[];
  parkingSpaces: ParkingSpace[];
  lprDetections: LPRDetection[];
  activeGateMessage: string | null;
  gateStatus: 'Closed' | 'Opening' | 'Open' | 'Hold';
  
  // Actions
  addRealUnit: (unit: Omit<Unit, 'id'>) => void;
  addRealParkingSpace: (space: Omit<ParkingSpace, 'id'>) => void;
  // unitNumber/bayNumber are identities other records point at, so they can't be edited.
  updateUnit: (id: string, patch: Partial<Omit<Unit, 'id' | 'unitNumber'>>) => void;
  updateParkingSpace: (id: string, patch: Partial<Pick<ParkingSpace, 'zone' | 'type' | 'maxHoursAllowed'>>) => void;
  // Return why the delete was refused, or null when it went through.
  deleteUnit: (id: string) => string | null;
  deleteParkingSpace: (id: string) => string | null;
  checkInVisitor: (passId: string, parkingBayId?: string) => void;
  quickManualCheckIn: (data: {
    guestName: string;
    unitNumber: string;
    vehiclePlate?: string;
    visitorType: 'Guest' | 'Delivery' | 'Contractor' | 'VIP';
    assignedParkingBay?: string;
    notes?: string;
  }) => void;
  checkoutVisitorLog: (logId: string) => void;
  createVisitorPass: (pass: Omit<VisitorPass, 'id' | 'createdAt' | 'status' | 'passCode'>) => VisitorPass;
  triggerGateOpen: (reason: string) => void;
  updateParkingSpaceStatus: (spaceId: string, status: ParkingSpace['status'], plate?: string, occupant?: string) => void;
  simulateLPRScan: (plateNumber: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

// Demo mode (no Supabase keys) keeps data in this browser only.
const STORAGE_KEY = 'sentinelguard:v1';

const loadSaved = (): Partial<Pick<SystemContextType, 'units' | 'visitorPasses' | 'visitorLogs' | 'parkingSpaces' | 'lprDetections'>> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

type Key = 'units' | 'visitorPasses' | 'visitorLogs' | 'parkingSpaces' | 'lprDetections';
type Row = { id: string };
// Table name, and the column the initial load sorts by (newest first unless ascending).
const TABLES: Record<Key, [table: string, orderBy: string, ascending: boolean]> = {
  units: ['units', 'unitNumber', true],
  visitorPasses: ['visitor_passes', 'createdAt', false],
  visitorLogs: ['visitor_logs', 'entryTime', false],
  parkingSpaces: ['parking_spaces', 'bayNumber', true],
  lprDetections: ['lpr_detections', 'id', false],
};
// undefined means "cleared" in our state; JSON would drop it, so send null.
const toDb = (row: object) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v ?? null]));

// Mounted only after login (client-side), so reading storage in initial state can't cause a hydration mismatch.
export const SystemProvider: React.FC<{ children: React.ReactNode; guardName?: string; role?: string }> = ({ children, guardName = 'Unknown Officer', role }) => {
  const [saved] = useState(() => (supabase ? {} : loadSaved()));
  const [units, setUnits] = useState<Unit[]>(saved.units ?? initialUnits);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>(saved.visitorPasses ?? initialVisitorPasses);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(saved.visitorLogs ?? initialVisitorLogs);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>(saved.parkingSpaces ?? initialParkingSpaces);
  const [lprDetections, setLprDetections] = useState<LPRDetection[]>(saved.lprDetections ?? initialLPRDetections);

  const [syncError, setSyncError] = useState<string | null>(null);
  const state: Record<Key, Row[]> = { units, visitorPasses, visitorLogs, parkingSpaces, lprDetections };
  const lastSynced = useRef(state);
  const fromServer = useRef(new WeakSet<object>());
  const deletedOnServer = useRef(new Set<string>());

  // Supabase: load everything this user may see (RLS decides), then merge live changes from other devices.
  useEffect(() => {
    if (!supabase) return;
    const db = supabase;
    const setters = {
      units: setUnits, visitorPasses: setVisitorPasses, visitorLogs: setVisitorLogs,
      parkingSpaces: setParkingSpaces, lprDetections: setLprDetections,
    } as unknown as Record<Key, React.Dispatch<React.SetStateAction<Row[]>>>;
    const merge = (key: Key, rows: Row[]) => {
      rows.forEach((row) => fromServer.current.add(row));
      setters[key]((prev) => {
        const incoming = new Map(rows.map((row) => [row.id, row]));
        const updated = prev.map((row) => incoming.get(row.id) ?? row);
        const added = rows.filter((row) => !prev.some((p) => p.id === row.id));
        return [...added, ...updated];
      });
    };
    (Object.keys(TABLES) as Key[]).forEach(async (key) => {
      const [table, orderBy, ascending] = TABLES[key];
      const { data, error } = await db.from(table).select('*').order(orderBy, { ascending });
      if (error) setSyncError(`Could not load ${table}: ${error.message}`);
      else merge(key, data);
    });
    const channel = db
      .channel('sentinelguard')
      .on('postgres_changes', { event: '*', schema: 'public' }, (change) => {
        const key = (Object.keys(TABLES) as Key[]).find((k) => TABLES[k][0] === change.table);
        if (!key) return;
        if (change.eventType === 'DELETE' && 'id' in change.old) {
          const id = change.old.id as string;
          deletedOnServer.current.add(id);
          setters[key]((prev) => prev.filter((row) => row.id !== id));
        } else if ('id' in change.new) merge(key, [change.new as Row]);
      })
      .subscribe();
    return () => {
      db.removeChannel(channel);
    };
  }, []);

  // Supabase: write every row this device changed. Rows that came from the server are skipped so they don't echo back.
  useEffect(() => {
    if (!supabase) return;
    const db = supabase;
    (Object.keys(TABLES) as Key[]).forEach((key) => {
      const prev = lastSynced.current[key];
      if (prev === state[key]) return;
      const prevRows = new Set<object>(prev);
      const prevIds = new Set(prev.map((row) => row.id));
      state[key].forEach(async (row) => {
        if (prevRows.has(row) || fromServer.current.has(row)) return;
        const table = db.from(TABLES[key][0]);
        // Separate insert/update (not upsert): upsert also needs insert rights, which guards don't have on parking.
        // .select() so a write RLS silently filtered out (0 rows) is reported instead of looking saved.
        const { data, error } = prevIds.has(row.id)
          ? await table.update(toDb(row)).eq('id', row.id).select('id')
          : await table.insert(toDb(row)).select('id');
        if (error || !data?.length) {
          setSyncError(`Not saved to server (${TABLES[key][0]}): ${error?.message ?? 'not permitted for your account'}`);
        }
      });
      // Rows gone from state were deleted here, unless the server told us they were deleted elsewhere.
      const ids = new Set(state[key].map((row) => row.id));
      prev.forEach(async (row) => {
        if (ids.has(row.id) || deletedOnServer.current.delete(row.id)) return;
        const { error } = await db.from(TABLES[key][0]).delete().eq('id', row.id);
        if (error) setSyncError(`Not deleted on server (${TABLES[key][0]}): ${error.message}`);
      });
    });
    lastSynced.current = state;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `state` is rebuilt from exactly these each render
  }, [units, visitorPasses, visitorLogs, parkingSpaces, lprDetections]);

  useEffect(() => {
    if (supabase) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ units, visitorPasses, visitorLogs, parkingSpaces, lprDetections }));
    } catch {
      // storage full or blocked (private mode): keep working in memory
    }
  }, [units, visitorPasses, visitorLogs, parkingSpaces, lprDetections]);

  // Expire stale passes and flag overstays once a minute; both rules live in ./rules.
  useEffect(() => {
    // Residents may not write these rows, so on their devices the change is shown locally and not synced.
    const local = <T extends object>(row: T) => {
      if (role === 'Resident') fromServer.current.add(row);
      return row;
    };
    const tick = () => {
      const now = Date.now();
      setVisitorPasses((prev) =>
        prev.some((p) => isPassExpired(p, now)) ? prev.map((p) => (isPassExpired(p, now) ? local({ ...p, status: 'Expired' as const }) : p)) : prev
      );
      setParkingSpaces((prev) =>
        prev.some((s) => isOverstay(s, now)) ? prev.map((s) => (isOverstay(s, now) ? local({ ...s, status: 'Overstay_Warning' as const }) : s)) : prev
      );
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- role is fixed for the provider's lifetime (remounts on login)
  }, []);

  const [gateStatus, setGateStatus] = useState<'Closed' | 'Opening' | 'Open' | 'Hold'>('Closed');
  const [activeGateMessage, setActiveGateMessage] = useState<string | null>(null);

  const addRealUnit = (data: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...data,
      id: `u-${crypto.randomUUID()}`,
    };
    setUnits((prev) => [newUnit, ...prev]);
  };

  const addRealParkingSpace = (data: Omit<ParkingSpace, 'id'>) => {
    const newSpace: ParkingSpace = {
      ...data,
      id: `ps-${crypto.randomUUID()}`,
    };
    setParkingSpaces((prev) => [...prev, newSpace]);
  };

  const updateUnit: SystemContextType['updateUnit'] = (id, patch) =>
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  const updateParkingSpace: SystemContextType['updateParkingSpace'] = (id, patch) =>
    setParkingSpaces((prev) => prev.map((ps) => (ps.id === id ? { ...ps, ...patch } : ps)));

  const deleteUnit = (id: string) => {
    const unit = units.find((u) => u.id === id);
    if (!unit) return null;
    const blocker = unitDeleteBlocker(unit.unitNumber, visitorPasses, visitorLogs);
    if (!blocker) setUnits((prev) => prev.filter((u) => u.id !== id));
    return blocker;
  };

  const deleteParkingSpace = (id: string) => {
    const bay = parkingSpaces.find((ps) => ps.id === id);
    if (!bay) return null;
    const blocker = bayDeleteBlocker(bay, units);
    if (!blocker) setParkingSpaces((prev) => prev.filter((ps) => ps.id !== id));
    return blocker;
  };

  const triggerGateOpen = (reason: string) => {
    setGateStatus('Opening');
    setActiveGateMessage(`Gate barrier triggered: ${reason}`);
    setTimeout(() => {
      setGateStatus('Open');
    }, 1200);
    setTimeout(() => {
      setGateStatus('Closed');
      setActiveGateMessage(null);
    }, 5500);
  };

  // Supabase: each gate operation is one database transaction (supabase/migrations/002); Realtime brings the result back.
  // The gate only opens once the server has accepted it.
  const runGateOp = async (fn: string, args: Record<string, unknown>, onDone: () => void) => {
    const { error } = await supabase!.rpc(fn, args);
    if (error) setSyncError(`Refused by server: ${error.message}`);
    else onDone();
  };

  const checkInVisitor = (passId: string, parkingBayId?: string) => {
    const pass = visitorPasses.find((p) => p.id === passId || p.passCode === passId);
    if (!pass || !isPassUsable(pass)) return;
    if (supabase) {
      void runGateOp('check_in', { p_pass_id: pass.id, p_bay: parkingBayId || null }, () =>
        triggerGateOpen(`Guest ${pass.guestName} Checked-In to Unit ${pass.unitNumber}`)
      );
      return;
    }

    const targetBay = pickBay(parkingSpaces, parkingBayId || pass.assignedParkingBay, !!pass.vehiclePlate);

    // Update pass status
    setVisitorPasses((prev) =>
      prev.map((p) => (p.id === pass.id ? { ...p, status: 'CheckedIn' } : p))
    );

    // Create log
    const newLog: VisitorLog = {
      id: `vl-${crypto.randomUUID()}`,
      passId: pass.id,
      guestName: pass.guestName,
      visitorType: pass.visitorType,
      unitNumber: pass.unitNumber,
      vehiclePlate: pass.vehiclePlate,
      entryTime: new Date().toISOString(),
      guardName,
      assignedParkingBay: targetBay,
      status: 'Inside',
    };
    setVisitorLogs((prev) => [newLog, ...prev]);

    if (targetBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === targetBay
            ? {
                ...ps,
                status: 'Occupied_Visitor',
                currentVehiclePlate: pass.vehiclePlate,
                assignedUnitNumber: pass.unitNumber,
                occupantName: pass.guestName,
                entryTime: new Date().toISOString(),
              }
            : ps
        )
      );
    }

    triggerGateOpen(`Guest ${pass.guestName} Checked-In to Unit ${pass.unitNumber}`);
  };

  const quickManualCheckIn = (data: {
    guestName: string;
    unitNumber: string;
    vehiclePlate?: string;
    visitorType: 'Guest' | 'Delivery' | 'Contractor' | 'VIP';
    assignedParkingBay?: string;
    notes?: string;
  }) => {
    if (supabase) {
      void runGateOp(
        'walk_in',
        {
          p_guest_name: data.guestName, p_unit_number: data.unitNumber, p_visitor_type: data.visitorType,
          p_vehicle_plate: data.vehiclePlate || null, p_bay: data.assignedParkingBay || null, p_notes: data.notes || null,
        },
        () => triggerGateOpen(`Manual entry: ${data.guestName} (${data.visitorType}) to Unit ${data.unitNumber}`)
      );
      return;
    }
    const targetBay = pickBay(parkingSpaces, data.assignedParkingBay, !!data.vehiclePlate);
    const newLog: VisitorLog = {
      id: `vl-${crypto.randomUUID()}`,
      guestName: data.guestName,
      visitorType: data.visitorType,
      unitNumber: data.unitNumber,
      vehiclePlate: data.vehiclePlate,
      entryTime: new Date().toISOString(),
      guardName,
      assignedParkingBay: targetBay,
      status: 'Inside',
      notes: data.notes,
    };
    setVisitorLogs((prev) => [newLog, ...prev]);

    if (targetBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === targetBay
            ? {
                ...ps,
                status: 'Occupied_Visitor',
                currentVehiclePlate: data.vehiclePlate,
                assignedUnitNumber: data.unitNumber,
                occupantName: data.guestName,
                entryTime: new Date().toISOString(),
              }
            : ps
        )
      );
    }

    triggerGateOpen(`Manual entry: ${data.guestName} (${data.visitorType}) to Unit ${data.unitNumber}`);
  };

  const checkoutVisitorLog = (logId: string) => {
    const log = visitorLogs.find((l) => l.id === logId);
    if (!log) return;
    if (supabase) {
      void runGateOp('check_out', { p_log_id: logId }, () => {});
      return;
    }

    setVisitorLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: 'Departed',
              exitTime: new Date().toISOString(),
            }
          : l
      )
    );

    // Free parking space
    if (log.assignedParkingBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === log.assignedParkingBay
            ? { ...ps, status: 'Available', currentVehiclePlate: undefined, occupantName: undefined, assignedUnitNumber: undefined, entryTime: undefined }
            : ps
        )
      );
    }

    // Close the pass so the same QR can't be reused after the guest leaves.
    if (log.passId) {
      setVisitorPasses((prev) => prev.map((p) => (p.id === log.passId ? { ...p, status: 'Completed' } : p)));
    }
  };

  const createVisitorPass = (data: Omit<VisitorPass, 'id' | 'createdAt' | 'status' | 'passCode'>): VisitorPass => {
    const newPass: VisitorPass = {
      ...data,
      id: `vp-${crypto.randomUUID()}`,
      passCode: newPassCode(),
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setVisitorPasses((prev) => [newPass, ...prev]);
    return newPass;
  };

  const updateParkingSpaceStatus = (spaceId: string, status: ParkingSpace['status'], plate?: string, occupant?: string) => {
    setParkingSpaces((prev) =>
      prev.map((ps) =>
        ps.id === spaceId
          ? { ...ps, status, currentVehiclePlate: plate, occupantName: occupant, ...(status === 'Available' && { assignedUnitNumber: undefined, entryTime: undefined }) }
          : ps
      )
    );
  };

  const simulateLPRScan = (plateNumber: string) => {
    const residentUnit = units.find((u) => u.registeredVehicles.includes(plateNumber.toUpperCase()));
    const guestPass = visitorPasses.find(
      (p) => p.vehiclePlate?.toUpperCase() === plateNumber.toUpperCase() && isPassUsable(p)
    );

    let matchStatus: LPRDetection['matchedStatus'] = 'Unknown_Vehicle';
    let suggestedAction: LPRDetection['suggestedAction'] = 'Prompt_Guard_Verification';
    let matchedUnit: string | undefined;
    let matchedName: string | undefined;

    if (residentUnit) {
      matchStatus = 'Resident_Approved';
      suggestedAction = 'Auto_Open_Gate';
      matchedUnit = residentUnit.unitNumber;
      matchedName = `${residentUnit.residentName} (Resident)`;
      triggerGateOpen(`LPR Auto-Approval: Resident ${residentUnit.residentName} (${plateNumber})`);
    } else if (guestPass) {
      matchStatus = 'PreRegistered_Guest';
      suggestedAction = 'Auto_Open_Gate';
      matchedUnit = guestPass.unitNumber;
      matchedName = `${guestPass.guestName} (Guest of ${guestPass.residentName})`;
      checkInVisitor(guestPass.id);
    } else {
      matchStatus = 'Unknown_Vehicle';
      suggestedAction = 'Prompt_Guard_Verification';
    }

    const newDetection: LPRDetection = {
      id: `lpr-${crypto.randomUUID()}`,
      plateNumber: plateNumber.toUpperCase(),
      confidence: +(95 + Math.random() * 4).toFixed(1),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cameraName: 'Gate 1 (LPR Entry Cam)',
      matchedStatus: matchStatus,
      matchedUnit,
      matchedName,
      suggestedAction,
    };

    setLprDetections((prev) => [newDetection, ...prev]);
  };

  return (
    <SystemContext.Provider
      value={{
        units,
        visitorPasses,
        visitorLogs,
        parkingSpaces,
        lprDetections,
        gateStatus,
        activeGateMessage,
        addRealUnit,
        addRealParkingSpace,
        updateUnit,
        updateParkingSpace,
        deleteUnit,
        deleteParkingSpace,
        checkInVisitor,
        quickManualCheckIn,
        checkoutVisitorLog,
        createVisitorPass,
        triggerGateOpen,
        updateParkingSpaceStatus,
        simulateLPRScan,
      }}
    >
      {syncError && (
        <div role="alert" className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-xl rounded-lg border border-rose-500/40 bg-rose-950/90 p-3 text-xs text-rose-200 flex justify-between gap-3">
          <span>{syncError}</span>
          <button onClick={() => setSyncError(null)} className="font-bold text-rose-100" aria-label="Dismiss sync error">✕</button>
        </div>
      )}
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within SystemProvider');
  return context;
};
