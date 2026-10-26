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
| UI for all 3 roles | ✅ Built | Guard Console, Parking Grid, LPR, Resident Pass, Admin (setup, edit/delete, Users & Access) |
| Core loop logic | ✅ Cross-device | Supabase tables + Realtime; check-in/walk-in/check-out are single DB transactions. Demo mode (no keys) falls back to localStorage |
| Login | ✅ Real (Supabase mode) | Email/password; role and unit come from `profiles`, set by an admin. Open sign-up still on |
| Database | ✅ Supabase Postgres | `supabase/schema.sql` + `supabase/migrations/` (002, 003 applied on the live project); RLS per role |
| Hosting | ✅ GitHub Pages | Static export; all server logic lives in Supabase |
| QR scanning | ✅ Camera | `QrScanner.tsx` (`html5-qrcode`); needs HTTPS or localhost |
| LPR camera | 🟡 Simulator | Typed plate, random confidence |
| Gate hardware | 🟡 Simulated | `triggerGateOpen` is a timer |
| Offline / PWA | 🟡 Installable manifest | Manifest, start page and icon resolve under `/SentinelGuard` (fixed 2026-10-27). No service worker or offline queue yet |
| Tests | 🟡 Rules + DB + manual E2E | `npm test` (rules.ts); `supabase/tests/gate_ops_test.sql`; manual browser run of the core loop in demo mode passed 2026-10-27 (see change log). No automated end-to-end test yet |

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
- [x] **P1** Edit / delete units and bays (admin); delete is refused while a unit has visitors inside or live passes, or a bay is in use or allocated *(2026-10-27)*
- [x] **P1** Resident is tied to their own unit: `profiles.unitNumber` + RLS, so they only see/issue for that unit *(Supabase mode, 2026-10-27)*
- [x] **P1** No double-booking or made-up bays: `pickBay` uses the chosen bay only if free, else first free visitor bay for a car, none on foot *(2026-10-27)*
- [x] **P1** Unit status (`DoNotDisturb`, `Vacant`, deleted unit) warns the guard on pass check-in and walk-in; warns, doesn't block *(2026-10-27)*
- [ ] **P2** Blacklist: admin can flag a plate/name → LPR returns `Blacklisted` / `Deny_Entry` (types already exist)
- [x] **P1** Guard sees why a code won't work: not found, already used (checked in / left), expired, not valid yet (`passCodeProblem` in `rules.ts`, shown in `GuardConsole.tsx`) *(2026-10-27)*
- [ ] **P2** Search/filter history in the logbook (by date, unit, plate)

### Phase 2: Real system (needs the backend decision)
- [x] **P0** Database: `supabase/schema.sql`; `store.tsx` loads from and writes to Supabase *(2026-10-27)*
- [x] **P0** Real auth (Supabase email/password); role read from `profiles`, not chosen at login *(2026-10-27)*
- [x] **P0** Row-Level Security: residents see only their unit; only admins write units/bays/roles; nobody can delete logs *(2026-10-27)*
- [ ] **P1** CSV export is still built from what the browser has loaded; move to a server-side export for admins only
- [x] **P0** Live sync via Supabase Realtime *(2026-10-27; needs a two-device test once keys are set)*
- [ ] **P1** Concurrent edits are last-write-wins per row; fine for one gate, revisit with several guard tablets
- [x] **P1** Check-in, walk-in and check-out are single database transactions (`check_in`/`walk_in`/`check_out` in `supabase/migrations/002`), bay picked with row locks so two guards can't double-book; gate opens only after the server accepts *(2026-10-27; self-test: `supabase/tests/gate_ops_test.sql`)*
- [x] **P1** Writes blocked by RLS (0 rows) now show the red error banner instead of failing silently *(2026-10-27)*
- [x] **P1** Pass codes are unguessable (`QR-XXXX-XXXX`, ~10^12 combinations, `newPassCode`) and single-use (`check_in` refuses non-Active passes) *(2026-10-27)*
- [ ] **P1** Shareable pass link (`/pass/<token>`) that shows the QR to the guest; today it points at a fake domain
- [ ] **P1** Audit table: every gate open, check-in, override and setup change writes an immutable row (who, what, when, why)
- [x] **P1** Admin manages roles and resident units in-app (**Users & Access**, `UsersPanel.tsx`); admins can't demote themselves *(2026-10-27)*
- [ ] **P2** Admin invites people instead of open sign-up

### Phase 3: Gatehouse reality
- [x] **P1** Camera QR scanning in Guard Console (`QrScanner.tsx`, `html5-qrcode`) *(2026-10-27; needs HTTPS or localhost)*
- [x] **P1** Manifest paths fixed for `/SentinelGuard` (`layout.tsx`, `public/manifest.json`) *(2026-10-27)*
- [ ] **P1** Offline: service worker, queue check-ins in IndexedDB while offline and sync after
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
- [ ] **P2** Accessibility pass. Done in the redesign: visible focus, 44px targets on main actions, 12px minimum text, reduced motion, labelled icon buttons. Still to do: measure contrast with a tool, screen-reader run
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
- **2026-10-27**: Admin can edit and delete units and bays (`unitDeleteBlocker`/`bayDeleteBlocker` in `rules.ts`); deletes sync both ways via Realtime. New RLS policy `admin deletes parking` in `schema.sql`. Guard Console warns on vacant / Do Not Disturb units.
- **2026-10-27**: Users & Access panel; atomic gate operations (migration 002, self-test passed on the live project); unguessable pass codes; silent RLS failures surfaced. Migrations 002 and 003 are applied on the live project.
- **2026-10-27**: Manual end-to-end test in demo mode (Chrome, localhost), all passed: admin adds/edits units and bays; bay delete refused while allocated; pass created for a Do Not Disturb unit → guard sees the DND warning → check-in assigns visitor bay, logs real guard name and ISO time, pass becomes CheckedIn; same code can't be reused; unit/bay deletes refused while the guest is inside; check-out frees the bay, closes the pass, then deletes succeed; Guard role sees only Guard/Parking/LPR; data survives reload. Live site loads with no console errors. Not tested: Supabase mode across two devices (needs test accounts). Fixes from the run: pass-code feedback (`passCodeProblem`), manifest 404 under `/SentinelGuard`, header nav overflow (tab renamed "Admin", fake "EDGE OS / STATION 01" badges removed).
- **2026-10-27**: `HOW_TO_USE.md` rewritten as a walkthrough: real vs demo mode, first-time setup in order, one guest end to end (9 steps), screen reference, troubleshooting.
