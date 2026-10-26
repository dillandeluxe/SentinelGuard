# SentinelGuard: Second Brain

The single place for **why this exists, what is real today, what is missing, and the order to finish it.**
Update the checkboxes as work lands. Last reviewed: 2026-10-27.

---

## 1. Intent: why this is being built

**The problem.** At the gate of a condo, apartment complex or gated village, visitor control runs on a paper logbook and phone calls:

- The guard calls the resident to confirm every guest. That is slow, and residents miss the call.
- Handwritten logs are illegible, incomplete and impossible to search after an incident.
- Nobody knows which visitor bays are free, or who has overstayed.
- Management has no data on traffic, peak hours or guard activity.
- Visitor personal data (names, phones, plates) sits in an open notebook anyone can read.

**The promise.** *A guest the resident expects gets through the gate in seconds. A guest nobody expects is stopped and recorded. Every entry and exit leaves a searchable, tamper-evident trail.*

**Who it serves**

| Person | Device | Job to be done |
|---|---|---|
| Guard | Tablet at the gatehouse | Decide fast who enters, open the gate, log in/out, manage visitor bays |
| Resident | Own phone | Pre-approve guests so they are not stuck at the gate; see where their car and their guests' cars are parked |
| Admin / property manager | Laptop | Set up units, bays and staff, review traffic and incidents, export records |

**The core loop (everything else supports this)**

1. Resident creates a pass → guest receives a QR code.
2. Guest arrives → guard scans the QR, or the camera reads the plate.
3. System checks: valid pass? right time window? not blacklisted? → gate opens, bay assigned, entry logged.
4. Guest leaves → check-out, bay freed, exit logged.
5. Admin sees and exports all of it.

**Definition of "complete"**: the loop above works **between two different devices** (resident phone → guard tablet) with **real login**, **data that survives** and **records that can be exported**. Hardware (real gate, real camera) is a bonus layer on top, not a blocker.

### Goals
- Replace the paper logbook end to end.
- Guard decision in under 10 seconds for a pre-registered guest.
- A full audit trail: who let whom in, when, and on whose authority.

### Non-goals (for now)
- Payments, billing or parking fees.
- Multi-property / multi-tenant SaaS.
- Native iOS/Android apps (the PWA covers it).
- Building our own plate-recognition AI model.

### Anti-goals (it "works" but has failed)
- A guard can be bypassed by anyone who picks "Admin" at login.
- A pass that keeps working forever, or can be reused by a stranger.
- Visitor phone numbers readable by any logged-in user.
- The gate tablet stops working when the Wi-Fi drops.

---

## 2. Current state (honest snapshot)

| Area | State | Notes |
|---|---|---|
| UI for all 3 roles | ✅ Built | Guard Console, Parking Grid, LPR, Resident Pass, Admin |
| Core loop logic | 🟡 In one browser only | `src/lib/store.tsx`, React context + localStorage |
| Login | ❌ Fake | Any password, anyone picks any role (`AuthPortal.tsx`) |
| Database | ❌ Not connected | `prisma/schema.prisma` exists but nothing uses it |
| Hosting | ⚠️ Static GitHub Pages | `output: "export"` means **no server, no API routes, no Prisma at runtime** |
| QR scanning | ❌ Text box only | `html5-qrcode` is installed but unused |
| LPR camera | 🟡 Simulator | Typed plate, random confidence |
| Gate hardware | 🟡 Simulated | `triggerGateOpen` is a timer |
| Offline / PWA | ❌ | No service worker; manifest `start_url` and icon miss `/SentinelGuard` |
| Tests | ❌ None | No test runner configured |

---

## 3. The one decision that unblocks everything: the backend

Because the site is a static export, a real backend has to live **somewhere else**. Two realistic paths:

| | **A. Supabase (recommended)** | B. Move to Vercel + Next server + Prisma |
|---|---|---|
| Keeps GitHub Pages | Yes | No |
| Auth | Built in (email/password, magic link) | Add Auth.js yourself |
| Cross-device live updates | Built in (Realtime) | Need polling or a websocket service |
| Security model | Row-Level Security policies in Postgres | Checks in server actions |
| Reuses `schema.prisma` | Same Postgres tables (Prisma optional for migrations) | Yes, directly |
| Work | Least | More, but more "classic full-stack" |

**Recommendation: A (Supabase).** The guard tablet needs to see a pass the instant a resident creates it on their phone; Realtime gives that for free, and RLS enforces roles in the database rather than in the UI.
**Status: ✅ decided 2026-10-27: Supabase.** Code is in; it switches on when the two keys are set (see `HOW_TO_USE.md` → Connecting the real database). Without keys the app stays in demo mode.

---

## 4. Gap list and checklist

Priority: **P0** breaks the core loop or security · **P1** needed to call it complete · **P2** polish/bonus.

### Phase 1: Make the single-device loop correct (no backend needed)
- [x] **P0** Passes expire: a pass past `validUntil` is marked `Expired` and can no longer be used *(store tick, 2026-10-27)*
- [x] **P0** Check-out closes the pass (`Completed`) so it can't be reused *(2026-10-27)*
- [x] **P0** Overstay is detected automatically from real timestamps (`maxHoursAllowed`, default 4h) *(2026-10-27)*
- [x] **P1** Logs record the real logged-in guard, not "Officer Miller" *(2026-10-27)*
- [x] **P1** Export Audit Log produces a real CSV download *(2026-10-27)*
- [x] **P1** Resident "My Parking": Resident Pass tab shows the unit's own bay and every bay its guests occupy, with plate and time parked *(2026-10-27)*
- [x] **P1** Visitor log times stored as ISO, shown with date *(2026-10-27)*
- [ ] **P1** Edit / delete units and bays (admin) — today they can only be added
- [x] **P1** Resident is tied to their own unit: `profiles.unitNumber` + RLS, so they only see/issue for that unit *(Supabase mode, 2026-10-27)*
- [x] **P1** No double-booking or made-up bays: `pickBay` uses the chosen bay only if free, else first free visitor bay for a car, none on foot *(2026-10-27)*
- [ ] **P1** Unit status (`DoNotDisturb`, `Vacant`) actually blocks or warns on check-in
- [ ] **P2** Blacklist: admin can flag a plate/name → LPR returns `Blacklisted` / `Deny_Entry` (types already exist)
- [ ] **P2** Search/filter history in the logbook (by date, unit, plate)

### Phase 2: Real system (needs the backend decision)
- [x] **P0** Database: `supabase/schema.sql`; `store.tsx` loads from and writes to Supabase *(2026-10-27)*
- [x] **P0** Real auth (Supabase email/password); role read from `profiles`, not chosen at login *(2026-10-27)*
- [x] **P0** Row-Level Security: residents see only their unit; only admins write units/bays/roles; nobody can delete logs *(2026-10-27)*
- [ ] **P1** CSV export is still built from what the browser has loaded; move to a server-side export for admins only
- [x] **P0** Live sync via Supabase Realtime *(2026-10-27; needs a two-device test once keys are set)*
- [ ] **P1** Concurrent edits are last-write-wins per row; fine for one gate, revisit with several guard tablets
- [ ] **P1** Check-in is several separate writes (pass, log, bay); move to one database function so a dropped connection can't leave half a check-in
- [ ] **P1** Pass codes are unguessable (random 128-bit token in the QR, short code only for typing) and single-use
- [ ] **P1** Shareable pass link (`/pass/<token>`) that shows the QR to the guest; today it points at a fake domain
- [ ] **P1** Audit table: every gate open, check-in, override and setup change writes an immutable row (who, what, when, why)
- [ ] **P1** Admin invites guards/residents instead of open sign-up

### Phase 3: Gatehouse reality
- [x] **P1** Camera QR scanning in Guard Console (`QrScanner.tsx`, `html5-qrcode`) *(2026-10-27; needs HTTPS or localhost)*
- [ ] **P1** PWA install + offline: service worker, fix manifest paths for `/SentinelGuard`, queue check-ins in IndexedDB while offline and sync after
- [ ] **P2** LPR: send a camera snapshot to a plate API (e.g. Plate Recognizer) from a small edge script; write results to the `LprDetection` table
- [ ] **P2** Gate relay: ESP32 / Raspberry Pi + relay that listens for an "open" command (MQTT or HTTPS) from the backend; manual override button stays
- [ ] **P2** Notify resident when their guest arrives (push or SMS)
- [ ] **P2** Resident parking extras: mark "I parked in bay X" when the bay isn't fixed, floor/zone map view, alert when a guest is close to overstaying
- [ ] **P2** Resident car in/out: LPR resident match sets their bay to `Occupied_Resident` and frees it on exit (needs an exit camera or exit scan)

### Phase 4: Trust, privacy, quality
- [ ] **P1** Privacy: mask visitor phones in lists, auto-delete visitor PII after N days (PH Data Privacy Act / GDPR-style retention)
- [ ] **P1** Tests: unit tests for the rules (pass validity, overstay, LPR matching) + one end-to-end test of the core loop
- [ ] **P2** 2FA for admins
- [ ] **P2** Reports: peak hours, average visit length, overstays per week
- [ ] **P2** Accessibility pass (contrast, focus states, large touch targets for gloved guards)
- [ ] **P2** Remove unused `canvas-confetti`, or use it; sync `README.md` (claims Next 15, app is on Next 16)

---

## 5. Implementation notes (how each piece should be built)

**Pass validity rule (single source of truth).** A pass is usable only if `status === 'Active'` and `validFrom <= now <= validUntil`. Enforced in the store today; in Phase 2 it moves into the database (RLS policy or a `check_in` function) so a modified client can't skip it.

**Timestamps.** Store ISO strings (`new Date().toISOString()`), format only when displaying. Locale strings like `"10:42 AM"` can't be compared, which is why overstay never fired before.

**Store → backend migration.** `store.tsx` already funnels every change through one action per operation (`checkInVisitor`, `checkoutVisitorLog`, …). Keep that interface; swap each action's body for a backend call and replace `useState` with data loaded from the backend + a Realtime subscription. Components should not need to change.

**Roles.** `page.tsx` hides tabs per role (`ROLE_TABS`); keep that for UX, but the real gate is the backend. Rule of thumb: if the server would allow it, assume a user can do it.

**Audit trail.** Append-only table. Never update or delete rows; the CSV export reads from it.

**Offline.** The guard tablet is the only device that must work offline. Queue writes locally, show a "pending sync" badge, and replay on reconnect. Resident and admin views can require a connection.

**Hardware boundary.** The web app never talks to the relay directly. It writes "open gate X, reason Y" to the backend; the edge device subscribes and acts, then writes back the result. This keeps the audit trail complete and works across networks.

---

## 6. Open questions for the owner
1. Backend: Supabase (recommended) or move off GitHub Pages to Vercel?
2. Is real hardware (camera / relay) required for the defense/demo, or is the simulator acceptable?
3. How long should visitor personal data be kept?
4. One property only, or several?

---

## 7. Change log
- **2026-10-27**: Created. Phase 1 items done: pass expiry, pass completion on check-out, automatic overstay, real guard name (`store.tsx`), CSV export (`AdminDashboard.tsx`), resident My Parking card (`ResidentPortal.tsx`). Rules are in `src/lib/rules.ts` and checked by `npm test`.
- **2026-10-27**: Backend chosen (Supabase). Added schema + RLS, real login, live sync, camera QR scan, ISO log times, bay picking. Fixed the Readiness checklist, which wrongly showed offline mode as done.
