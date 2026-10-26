import type { VisitorPass, ParkingSpace } from './types';

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

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
export const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers, ...rows.map((r) => headers.map((h) => r[h]))].map((r) => r.map(csvCell).join(',')).join('\n');
};
