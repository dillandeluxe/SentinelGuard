// Run: node src/lib/rules.test.mjs (Node 22.6+ strips the TS types)
import assert from 'node:assert/strict';
import { isPassUsable, isPassExpired, isOverstay, formatDuration, toCsv } from './rules.ts';

const now = Date.parse('2026-10-27T12:00:00Z');
const pass = { status: 'Active', validFrom: '2026-10-27T10:00:00Z', validUntil: '2026-10-27T14:00:00Z' };

assert.equal(isPassUsable(pass, now), true);
assert.equal(isPassUsable({ ...pass, status: 'CheckedIn' }, now), false);
assert.equal(isPassUsable(pass, Date.parse('2026-10-27T15:00:00Z')), false);
assert.equal(isPassUsable(pass, Date.parse('2026-10-27T09:00:00Z')), false);
assert.equal(isPassExpired(pass, Date.parse('2026-10-27T15:00:00Z')), true);
assert.equal(isPassExpired(pass, now), false);

const bay = { status: 'Occupied_Visitor', entryTime: '2026-10-27T07:59:00Z' };
assert.equal(isOverstay(bay, now), true);
assert.equal(isOverstay({ ...bay, maxHoursAllowed: 6 }, now), false);
assert.equal(isOverstay({ ...bay, entryTime: 'Just now' }, now), false);
assert.equal(isOverstay({ ...bay, status: 'Occupied_Resident' }, now), false);

assert.equal(formatDuration('2026-10-27T10:30:00Z', now), '1h 30m');
assert.equal(formatDuration('Just now', now), 'Just now');

assert.equal(toCsv([{ a: 'x,"y"', b: undefined }]), '"a","b"\n"x,""y""",""');

console.log('rules: all checks passed');
