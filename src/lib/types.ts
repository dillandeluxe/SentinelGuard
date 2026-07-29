export type UnitStatus = 'Occupied' | 'Vacant' | 'DoNotDisturb' | 'ExpectingGuest';

export interface Unit {
  id: string;
  unitNumber: string;
  block: string;
  floor: number;
  residentName: string;
  residentPhone: string;
  status: UnitStatus;
  allocatedParkingBay?: string;
  registeredVehicles: string[];
}

export type VisitorType = 'Guest' | 'Delivery' | 'Contractor' | 'VIP';

export interface VisitorPass {
  id: string;
  passCode: string; // e.g. QR-89421
  guestName: string;
  guestPhone: string;
  vehiclePlate?: string;
  unitId: string;
  unitNumber: string;
  residentName: string;
  visitorType: VisitorType;
  validFrom: string;
  validUntil: string;
  status: 'Active' | 'CheckedIn' | 'Completed' | 'Expired';
  assignedParkingBay?: string;
  createdAt: string;
}

export interface VisitorLog {
  id: string;
  guestName: string;
  visitorType: VisitorType;
  unitNumber: string;
  vehiclePlate?: string;
  entryTime: string;
  exitTime?: string;
  guardName: string;
  assignedParkingBay?: string;
  status: 'Inside' | 'Departed';
  notes?: string;
}

export type ParkingBayType = 'Resident' | 'Visitor' | 'EV_Charging' | 'Handicap';
export type ParkingBayStatus = 'Available' | 'Occupied_Resident' | 'Occupied_Visitor' | 'Reserved' | 'Overstay_Warning';

export interface ParkingSpace {
  id: string;
  bayNumber: string; // e.g. V-01, R-102
  zone: string; // Floor B1, B2
  type: ParkingBayType;
  status: ParkingBayStatus;
  currentVehiclePlate?: string;
  assignedUnitNumber?: string;
  occupantName?: string;
  entryTime?: string;
  maxHoursAllowed?: number;
}

export interface LPRDetection {
  id: string;
  plateNumber: string;
  confidence: number; // e.g. 98.4%
  timestamp: string;
  cameraName: string;
  matchedStatus: 'Resident_Approved' | 'PreRegistered_Guest' | 'Unknown_Vehicle' | 'Blacklisted';
  matchedUnit?: string;
  matchedName?: string;
  suggestedAction: 'Auto_Open_Gate' | 'Prompt_Guard_Verification' | 'Deny_Entry';
}
