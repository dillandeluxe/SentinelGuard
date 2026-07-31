import { Unit, VisitorPass, VisitorLog, ParkingSpace, LPRDetection } from './types';

// Clean empty arrays for real data migration
export const realUnits: Unit[] = [];
export const realVisitorPasses: VisitorPass[] = [];
export const realVisitorLogs: VisitorLog[] = [];
export const realParkingSpaces: ParkingSpace[] = [];
export const realLPRDetections: LPRDetection[] = [];

// Sample starter templates for real property migration
export const sampleStarterUnits: Unit[] = [
  {
    id: 'u-101',
    unitNumber: '101',
    block: 'Block 1',
    floor: 1,
    residentName: 'Sample Resident',
    residentPhone: '+1 (555) 123-4567',
    status: 'Occupied',
    allocatedParkingBay: 'P-101',
    registeredVehicles: ['ABC-1234'],
  },
];

export const sampleStarterParkingSpaces: ParkingSpace[] = [
  { id: 'ps-v01', bayNumber: 'V-01', zone: 'Visitor Parking Level 1', type: 'Visitor', status: 'Available' },
  { id: 'ps-v02', bayNumber: 'V-02', zone: 'Visitor Parking Level 1', type: 'Visitor', status: 'Available' },
  { id: 'ps-v03', bayNumber: 'V-03', zone: 'EV Charging Bay', type: 'EV_Charging', status: 'Available' },
  { id: 'ps-r101', bayNumber: 'P-101', zone: 'Resident Parking Level 1', type: 'Resident', status: 'Available', assignedUnitNumber: '101' },
];

export const initialUnits: Unit[] = realUnits;
export const initialVisitorPasses: VisitorPass[] = realVisitorPasses;
export const initialVisitorLogs: VisitorLog[] = realVisitorLogs;
export const initialParkingSpaces: ParkingSpace[] = realParkingSpaces;
export const initialLPRDetections: LPRDetection[] = realLPRDetections;
