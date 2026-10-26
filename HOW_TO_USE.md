# How to Use SentinelGuard

## What this app is for

SentinelGuard replaces the paper logbook at the front gate of a condo, apartment complex or gated village. It connects three groups of people:

| Who | What they need | Where they go in the app |
|---|---|---|
| **Security guard** (at the gatehouse, on a tablet) | Know who is allowed in, open the gate, log every visitor in and out | Guard Console, Parking Grid, Optical LPR |
| **Resident** (on their phone) | Pre-register guests so they get in without delays | Resident Pass |
| **Admin / property manager** | See traffic, parking use and the audit trail | Analytics |

### The core flow

1. A resident creates a **guest pass** and sends its QR code to the guest (for example on WhatsApp).
2. The guest arrives. The guard **scans or types the pass code**, or the **license plate camera (LPR)** recognises the car.
3. The pass is valid, so the **gate opens**. The visit is written to the **logbook** and a **parking bay** is assigned.
4. When the guest leaves, the guard taps **Check-Out**. The bay is freed and the exit time is logged.
5. The admin sees all of it on the **Analytics** dashboard.

---

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000/SentinelGuard. The `/SentinelGuard` part is needed because `next.config.ts` sets `basePath` for GitHub Pages.

### Connecting the real database (Supabase)
Without this the app runs in **demo mode**: data stays in one browser and any password works.

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql` and run it.
3. Copy **Project URL** and **anon public key** (Project Settings → API) into a `.env.local` file, using `.env.example` as the template. Restart `npm run dev`.
4. For the live site: add the same two values under GitHub → repo **Settings → Secrets and variables → Actions → Variables**, then push to `main`.
5. Sign up in the app. Every new account is a **Resident** with no unit. In Supabase → **Table Editor → profiles**, set your own `role` to `Admin`. For residents, set `unitNumber` (it must match a unit you registered); for guards, set `role` to `Guard`.

From then on the role comes from the account. Residents only see their own unit, and the guard tablet sees new passes instantly.

---

## Walkthrough

### 1. Landing page
- **Launch Terminal** or **Guardhouse Tablet Mode** skips login and opens the app as a demo guard.
- **Resident Pass Portal** and **Security Operations Hub** take you to the login screen.
- **System Specs** opens the production-readiness checklist (what still needs building).
- The interactive widgets on this page (plate scanner and pass preview) are demos. They are not connected to the real app data.

### 2. Login (`SENTINEL_AUTH`)
- Pick a role: **Guard**, **Resident** or **Admin**. The **Demo presets** buttons fill the form for you.
- Any password is accepted. This is a demo; there is no real authentication yet.
- Your role decides which tabs you see:
  - **Guard:** Guard Console, Parking Grid and Optical LPR.
  - **Resident:** Resident Pass.
  - **Admin:** everything.

### First-time setup (do this first)
The app starts empty. Log in as **Admin**, open **Analytics & Setup** and add data:
- **Register Unit & Resident:** unit number, block, floor, resident name and phone, allocated bay, and vehicle plates (separated by commas). Plates listed here open the gate automatically through LPR.
- **Register Parking Bay:** bay number, type (Visitor, Resident, EV or Handicap) and zone.

Data is saved in this browser and survives refreshes and logouts. To wipe it, clear the site data in your browser.

### 3. Guard Console (main guard screen)
- **Actuate Barrier Arm**: opens the gate manually. The status goes Closed → Opening → Open → Closed over about 5 seconds.
- **Guest Pass Verification**: type a pass code (for example `QR-12345`) and press **Verify**. If it matches an active pass, press **Authorize & Lift Barrier** to check the guest in.
- **Walk-In Registration**: for guests without a pass (couriers, contractors). Fill in name, unit, category, plate, bay and notes. Saving logs the visit and opens the gate.
- **Resident Directory**: search by unit number or resident name to see their phone number and parking bay.
- **Live On-Site Property Logbook**: everyone currently inside. Press **Check-Out** when they leave.

### 4. Parking Grid
- A map of every bay. Colours mean: Available, Visitor Active, Resident Assigned, and Overstay (more than 4 hours).
- Filter by zone. Click a bay to see the plate, occupant, unit and duration.
- **Release Bay & Mark Available** frees a bay by hand.

### 5. Optical LPR (license plate recognition)
- Simulates the gate camera. Choose a preset plate or type one, then press **Simulate Capture**.
- Resident plate → gate opens automatically.
- Plate on an active guest pass → guest is checked in automatically.
- Unknown plate → flagged for the guard to verify.
- Every read is listed in the **Detection Inference Ledger**.

### 6. Resident Pass
- Enter the guest's name, phone, category and plate, then press **Generate Encrypted QR Pass**.
- The pass code and QR are shown. You can copy the link or press **Send via WhatsApp**.
- The pass code is what the guard enters in the Guard Console.

### 7. Analytics & Setup (admin)
- Counts: units, today's clearances, parking occupancy and overstay flags.
- The forms for adding units and bays (see First-time setup).
- Visitors broken down by category, plus an officer audit trail.

### 8. Readiness
- Opens the production checklist: auth, database, cameras, gate hardware, offline mode and privacy.

---

## Known limitations

- **Units and bays can be added but not edited or deleted** from the app yet.
- The LPR preset plates (`SJK-8821`, `LHM-4491`) only match if you register them on a unit or a guest pass.
- **In demo mode, data lives only in this browser.** Connect Supabase to share data between devices.
- **In demo mode, login is fake.** Any password works and anyone can choose any role. Connect Supabase for real accounts.
- In demo mode, residents can issue passes for any unit.
- **Camera QR scanning** needs HTTPS or localhost (the live GitHub Pages site is HTTPS).
- **Offline mode / installing as an app** doesn't work yet (there's no service worker, and the manifest paths don't include `/SentinelGuard`).
