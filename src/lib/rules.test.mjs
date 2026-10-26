// Run: node src/lib/rules.test.mjs (Node 22.6+ strips the TS types)
import assert from 'node:assert/strict';
import { isPassUsable, isPassExpired, isOverstay, formatDuration, toCsv, pickBay, formatTime, unitDeleteBlocker, bayDeleteBlocker, unitEntryWarning, newPassCode, passCodeProblem } from './rules.ts';

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

const spaces = [
  { bayNumber: 'R-1', type: 'Resident', status: 'Available' },
  { bayNumber: 'V-1', type: 'Visitor', status: 'Occupied_Visitor' },
  { bayNumber: 'V-2', type: 'Visitor', status: 'Available' },
];
assert.equal(pickBay(spaces, 'R-1', true), 'R-1');
assert.equal(pickBay(spaces, 'V-1', true), 'V-2'); // taken -> auto
assert.equal(pickBay(spaces, 'V-9', false), undefined); // missing, on foot
assert.equal(pickBay(spaces, undefined, true), 'V-2');
assert.equal(pickBay(spaces, undefined, false), undefined);
assert.equal(pickBay([], undefined, true), undefined);

assert.equal(formatTime('10:42 AM'), '10:42 AM');
assert.equal(formatTime(undefined), '');
assert.notEqual(formatTime('2026-10-27T10:42:00Z'), '2026-10-27T10:42:00Z');

const logs = [{ unitNumber: 'A-1', status: 'Inside' }, { unitNumber: 'B-1', status: 'Departed' }];
const passes = [{ unitNumber: 'C-1', status: 'Active' }, { unitNumber: 'B-1', status: 'Completed' }];
assert.match(unitDeleteBlocker('A-1', passes, logs), /inside/);
assert.match(unitDeleteBlocker('C-1', passes, logs), /active/);
assert.equal(unitDeleteBlocker('B-1', passes, logs), null);

const units = [{ unitNumber: 'A-1', allocatedParkingBay: 'R-1' }];
assert.match(bayDeleteBlocker({ bayNumber: 'V-1', status: 'Occupied_Visitor' }, units), /in use/);
assert.match(bayDeleteBlocker({ bayNumber: 'R-1', status: 'Available' }, units), /A-1/);
assert.equal(bayDeleteBlocker({ bayNumber: 'V-2', status: 'Available' }, units), null);

assert.match(unitEntryWarning(undefined), /no longer registered/);
assert.match(unitEntryWarning({ unitNumber: 'A-1', status: 'Vacant' }), /vacant/);
assert.match(unitEntryWarning({ unitNumber: 'A-1', status: 'DoNotDisturb' }), /Do Not Disturb/);
assert.equal(unitEntryWarning({ unitNumber: 'A-1', status: 'Occupied' }), null);

const codes = Array.from({ length: 2000 }, newPassCode);
codes.forEach((c) => assert.match(c, /^QR-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/));
assert.equal(new Set(codes).size, codes.length);

const codePasses = [
  { ...pass, passCode: 'QR-AAAA-BBBB', guestName: 'Ana' },
  { ...pass, passCode: 'QR-CCCC-DDDD', guestName: 'Ben', status: 'CheckedIn' },
  { ...pass, passCode: 'QR-EEEE-FFFF', guestName: 'Cy', status: 'Completed' },
  { ...pass, passCode: 'QR-GGGG-HHHH', guestName: 'Di', status: 'Expired' },
];
assert.equal(passCodeProblem('qr-aaaa-bbbb', codePasses, now), null);
assert.match(passCodeProblem('QR-CCCC-DDDD', codePasses, now), /checked in/);
assert.match(passCodeProblem('QR-EEEE-FFFF', codePasses, now), /left/);
assert.match(passCodeProblem('QR-GGGG-HHHH', codePasses, now), /expired/);
assert.match(passCodeProblem('QR-AAAA-BBBB', codePasses, Date.parse('2026-10-27T15:00:00Z')), /expired/);
assert.match(passCodeProblem('QR-AAAA-BBBB', codePasses, Date.parse('2026-10-27T09:00:00Z')), /not valid yet/);
assert.match(passCodeProblem('QR-ZZZZ-ZZZZ', codePasses, now), /No pass/);
assert.equal(passCodeProblem('QR-ZZ', codePasses, now), null); // still typing
assert.equal(passCodeProblem('', codePasses, now), null);

console.log('rules: all checks passed');
