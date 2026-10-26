import type { VisitorPass, VisitorLog, ParkingSpace, Unit } from './types';

const HOUR = 3600_000;

// Single source of truth for whether a pass may open the gate (see docs/SECOND_BRAIN.md §5).
export const isPassUsable = (pass: VisitorPass, now = Date.now()) =>
  pass.status === 'Active' && Date.parse(pass.validFrom) <= now && now <= Date.parse(pass.validUntil);

export const isPassExpired = (pass: VisitorPass, now = Date.now()) =>
  pass.status === 'Active' && now > Date.parse(pass.validUntil);

// entryTime must be ISO; legacy values like "Just now" parse to NaN and never flag.
export const isOverstay = (space: ParkingSpace, now = Date.now()) =>
  space.status === 'Occupied_Visitor' &&
  !!space.entryTime &&
  now - Date.parse(space.entryTime) > (space.maxHoursAllowed ?? 4) * HOUR;

export const formatDuration = (iso: string, now = Date.now()) => {
  const ms = now - Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  const mins = Math.max(0, Math.floor(ms / 60000));
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

// Requested bay if it's free; otherwise a guest with a car gets the first free visitor bay, a guest on foot gets none.
export const pickBay = (spaces: ParkingSpace[], requested: string | undefined, hasVehicle: boolean) => {
  const free = (ps: ParkingSpace) => ps.status === 'Available';
  if (requested && spaces.some((ps) => ps.bayNumber === requested && free(ps))) return requested;
  return hasVehicle ? spaces.find((ps) => ps.type === 'Visitor' && free(ps))?.bayNumber : undefined;
};

// Legacy logs stored "10:42 AM"; show those as-is.
export const formatTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers, ...rows.map((r) => headers.map((h) => r[h]))].map((r) => r.map(csvCell).join(',')).join('\n');
};

// Why a unit can't be deleted yet (null = safe). Deleting would orphan visitors inside or passes that still open the gate.
export const unitDeleteBlocker = (unitNumber: string, passes: VisitorPass[], logs: VisitorLog[]) =>
  logs.some((l) => l.unitNumber === unitNumber && l.status === 'Inside')
    ? 'A visitor for this unit is still inside. Check them out first.'
    : passes.some((p) => p.unitNumber === unitNumber && (p.status === 'Active' || p.status === 'CheckedIn'))
      ? 'This unit has guest passes that are still active.'
      : null;

// Why a bay can't be deleted yet (null = safe).
export const bayDeleteBlocker = (bay: ParkingSpace, units: Unit[]) => {
  if (bay.status !== 'Available') return 'This bay is in use. Release it first.';
  const owner = units.find((u) => u.allocatedParkingBay === bay.bayNumber);
  return owner ? `Allocated to unit ${owner.unitNumber}. Change that unit's bay first.` : null;
};

// Warning for the guard before letting someone in to this unit (null = nothing unusual). Warns, never blocks: the guard decides.
export const unitEntryWarning = (unit: Unit | undefined) =>
  !unit
    ? 'This unit is no longer registered.'
    : unit.status === 'Vacant'
      ? `Unit ${unit.unitNumber} is vacant. Confirm with management before letting anyone in.`
      : unit.status === 'DoNotDisturb'
        ? `Unit ${unit.unitNumber} is on Do Not Disturb. Call the resident before letting anyone in.`
        : null;

// Unguessable at the gate yet typeable: 8 symbols from 32 look-alike-free characters (~10^12 codes). 256 % 32 = 0, so no bias.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newPassCode = () => {
  const c = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => CODE_CHARS[b % 32]).join('');
  return `QR-${c.slice(0, 4)}-${c.slice(4)}`;
};
