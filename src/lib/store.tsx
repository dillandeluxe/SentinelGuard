'use client';

import React, { createContext, useContext, useState } from 'react';
import { Unit, VisitorPass, VisitorLog, ParkingSpace, LPRDetection } from './types';
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

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>(initialVisitorPasses);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(initialVisitorLogs);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>(initialParkingSpaces);
  const [lprDetections, setLprDetections] = useState<LPRDetection[]>(initialLPRDetections);
  const [gateStatus, setGateStatus] = useState<'Closed' | 'Opening' | 'Open' | 'Hold'>('Closed');
  const [activeGateMessage, setActiveGateMessage] = useState<string | null>(null);

  const addRealUnit = (data: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...data,
      id: `u-${Date.now()}`,
    };
    setUnits((prev) => [newUnit, ...prev]);
  };

  const addRealParkingSpace = (data: Omit<ParkingSpace, 'id'>) => {
    const newSpace: ParkingSpace = {
      ...data,
      id: `ps-${Date.now()}`,
    };
    setParkingSpaces((prev) => [...prev, newSpace]);
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

  const checkInVisitor = (passId: string, parkingBayId?: string) => {
    const pass = visitorPasses.find((p) => p.id === passId || p.passCode === passId);
    if (!pass) return;

    // Update pass status
    setVisitorPasses((prev) =>
      prev.map((p) => (p.id === pass.id ? { ...p, status: 'CheckedIn' } : p))
    );

    // Create log
    const newLog: VisitorLog = {
      id: `vl-${Date.now()}`,
      guestName: pass.guestName,
      visitorType: pass.visitorType,
      unitNumber: pass.unitNumber,
      vehiclePlate: pass.vehiclePlate,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guardName: 'Officer Miller',
      assignedParkingBay: parkingBayId || pass.assignedParkingBay || 'V-01',
      status: 'Inside',
    };
    setVisitorLogs((prev) => [newLog, ...prev]);

    // Occupy parking space if assigned
    const targetBay = parkingBayId || pass.assignedParkingBay;
    if (targetBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === targetBay || ps.id === targetBay
            ? {
                ...ps,
                status: 'Occupied_Visitor',
                currentVehiclePlate: pass.vehiclePlate,
                assignedUnitNumber: pass.unitNumber,
                occupantName: pass.guestName,
                entryTime: 'Just now',
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
    const newLog: VisitorLog = {
      id: `vl-${Date.now()}`,
      guestName: data.guestName,
      visitorType: data.visitorType,
      unitNumber: data.unitNumber,
      vehiclePlate: data.vehiclePlate,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guardName: 'Officer Miller',
      assignedParkingBay: data.assignedParkingBay || 'V-05',
      status: 'Inside',
      notes: data.notes,
    };
    setVisitorLogs((prev) => [newLog, ...prev]);

    if (data.assignedParkingBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === data.assignedParkingBay || ps.id === data.assignedParkingBay
            ? {
                ...ps,
                status: 'Occupied_Visitor',
                currentVehiclePlate: data.vehiclePlate,
                assignedUnitNumber: data.unitNumber,
                occupantName: data.guestName,
                entryTime: 'Just now',
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

    setVisitorLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: 'Departed',
              exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : l
      )
    );

    // Free parking space
    if (log.assignedParkingBay) {
      setParkingSpaces((prev) =>
        prev.map((ps) =>
          ps.bayNumber === log.assignedParkingBay
            ? { ...ps, status: 'Available', currentVehiclePlate: undefined, occupantName: undefined, assignedUnitNumber: undefined }
            : ps
        )
      );
    }
  };

  const createVisitorPass = (data: Omit<VisitorPass, 'id' | 'createdAt' | 'status' | 'passCode'>): VisitorPass => {
    const newPass: VisitorPass = {
      ...data,
      id: `vp-${Date.now()}`,
      passCode: `QR-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setVisitorPasses((prev) => [newPass, ...prev]);
    return newPass;
  };

  const updateParkingSpaceStatus = (spaceId: string, status: ParkingSpace['status'], plate?: string, occupant?: string) => {
    setParkingSpaces((prev) =>
      prev.map((ps) =>
        ps.id === spaceId ? { ...ps, status, currentVehiclePlate: plate, occupantName: occupant } : ps
      )
    );
  };

  const simulateLPRScan = (plateNumber: string) => {
    const residentUnit = units.find((u) => u.registeredVehicles.includes(plateNumber.toUpperCase()));
    const guestPass = visitorPasses.find(
      (p) => p.vehiclePlate?.toUpperCase() === plateNumber.toUpperCase() && p.status === 'Active'
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
      id: `lpr-${Date.now()}`,
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
        checkInVisitor,
        quickManualCheckIn,
        checkoutVisitorLog,
        createVisitorPass,
        triggerGateOpen,
        updateParkingSpaceStatus,
        simulateLPRScan,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within SystemProvider');
  return context;
};
