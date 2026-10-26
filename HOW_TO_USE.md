# How to Use SentinelGuard

SentinelGuard replaces the paper logbook at the gate of a condo, apartment complex or gated village.
Residents pre-approve their guests, the guard lets them in with one scan, and every entry, exit and parking bay is recorded.

| Who | Uses it on | Sees these tabs |
|---|---|---|
| **Guard** | Tablet at the gatehouse | Guard Console, Parking Grid, Optical LPR |
| **Resident** | Their phone | Resident Pass |
| **Admin** (property manager) | Laptop | Everything, including **Admin** |

**Contents:** [1. Start the app](#1-start-the-app) · [2. First-time setup](#2-first-time-setup) · [3. Walk one guest through the gate](#3-walk-one-guest-through-the-gate) · [4. Screen by screen](#4-screen-by-screen) · [5. Troubleshooting](#5-troubleshooting) · [6. Known limitations](#6-known-limitations)

---

## 1. Start the app

```bash
npm install
npm run dev
```

Open **http://localhost:3000/SentinelGuard** (the `/SentinelGuard` part is required).
The live version is at **https://dillandeluxe.github.io/SentinelGuard/**.

The app runs in one of two modes:

| | **Real mode** | **Demo mode** |
|---|---|---|
| When | `.env.local` has the Supabase keys (this repo's live site does) | No keys set |
| Login | Real accounts; your role comes from your account | Any password; you pick the role |
| Data | Shared live between every device | Stays in this one browser |
| Use it for | Actual use, testing with several devices | Trying the screens quickly |

> To try demo mode, delete `.env.local` and restart `npm run dev`. On the landing page, **Try the guard console** opens the guard screen without logging in.

---

## 2. First-time setup

Do this once, in order. Steps 1–2 are already done for this repo's Supabase project.

### Step 1: Create the database (already done)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**. Run `supabase/schema.sql`, then each file in `supabase/migrations/` in number order.
3. Optional check: run `supabase/tests/gate_ops_test.sql`. It should end with the error **ALL CHECKS PASSED**. That is the success message; it also undoes everything it created.

### Step 2: Connect the app (already done)
1. In Supabase → **Project Settings → API keys**, copy the **Project URL** and the **publishable key**.
2. Copy `.env.example` to `.env.local` and paste both values in. Restart `npm run dev`.
3. For the live site, add the same two values in GitHub → **Settings → Secrets and variables → Actions → Variables**, then push to `main`.

### Step 3: Make yourself admin
1. On the landing page click **Sign in**, then **Enroll Credentials**. Enter your name, email and a password, then click **Enroll Profile**.
2. If Supabase emails you a confirmation link, click it.
   *Testing and don't want emails?* Turn off **Confirm email** in Supabase → **Authentication → Sign In / Providers → Email**.
3. New accounts start as **Resident**. Promote yourself, just this once, in Supabase → **Table Editor → profiles**: change your `role` to `Admin`.
4. Back in the app, click **Sign In**. You'll see every tab.

### Step 4: Add the property
Open the **Admin** tab.

1. **Register Parking Bay**: add every bay. Give it a number (`V-01`), a type (Visitor, Resident, EV or Handicap) and a zone (`Basement 1`).
   Add at least one **Visitor** bay; guests are parked in those automatically.
2. **Register Unit & Resident**: add every unit. Give it a unit number, block, floor, resident name and phone, the bay it owns, and the residents' plates separated by commas.
   Plates you list here open the gate automatically when the camera reads them.
3. Made a mistake? Each form has a list below it. Click the **pencil** to edit a row, or the **bin** twice to delete it.
   Deleting is refused while a unit has a visitor inside or active passes, or while a bay is occupied or belongs to a unit.

### Step 5: Add the people
1. Ask each guard and resident to sign up the same way (**Sign in → Enroll Credentials**).
2. In **Admin → Users & Access** you'll see every account:
   - Guards: set **Role** to `Guard`.
   - Residents: leave the role as `Resident` and pick their **Unit**. Without a unit, a resident can't issue passes.
3. Changes take effect the next time that person signs in.

Setup is done.

---

## 3. Walk one guest through the gate

The easiest way to see the whole system working. Use two devices (or two browser windows, one of them private): one signed in as a **resident**, one as a **guard**.

| # | Who | Where | What to do | What you should see |
|---|---|---|---|---|
| 1 | Resident | **Resident Pass** | Enter the guest's name, phone, type and car plate. Click **Generate QR Pass**. | A QR code and a code like `QR-7KD9-X2MF`. |
| 2 | Resident | Same screen | Click **Send via WhatsApp** (or copy the code). | WhatsApp opens with the code ready to send. |
| 3 | Guard | **Guard Console** | Do nothing. Look at **Expected Pre-Registered Passes**. | The new pass appears on its own within a second or two. |
| 4 | Guard | Guard Console | Click **Scan with Camera** and point it at the QR code. Or type the code and click **Verify**. | The guest's name, unit and plate appear. Any warning about the unit (vacant, Do Not Disturb) shows in amber. |
| 5 | Guard | Same panel | Choose a stall, or leave **Auto**. Click **Authorize & Lift Barrier**. | The barrier goes Opening → Open → Closed. The guest appears in **Live On-Site Property Logbook** with a bay. |
| 6 | Resident | **Resident Pass** | Look at **My Parking** and the pass list. | The pass now says **CheckedIn**. The guest's bay, plate and time parked are shown. |
| 7 | Guard | **Parking Grid** | Click the guest's bay. | Plate, guest, unit and time parked. After 4 hours the bay turns red (**Overstay**). |
| 8 | Guard | Guard Console | When the guest leaves, click **Check-Out** in the logbook. | The bay is free again and the pass becomes **Completed**, so the code can't be used again. |
| 9 | Admin | **Admin** | Look at the counts and the visitor list. Click **Export Audit Log (CSV)**. | A CSV file of every visit downloads. |

**Also try:**
- **Walk-in with no pass** (couriers, contractors): Guard Console → **Walk-In Registration**. Fill in name, unit, type and plate, then click **Authorize Entry**. It's logged and the gate opens. A guest on foot gets no bay.
- **Number-plate camera**: **Optical LPR** → type a plate → **Simulate Capture**.
  A resident's plate opens the gate. A plate on an active guest pass checks that guest in. Anything else is flagged for the guard.
- **Reusing a pass**: verify the same code again after step 5. It's refused.

---

## 4. Screen by screen

### Guard Console (guard)
| Part | What it does |
|---|---|
| **Actuate Barrier Arm** | Opens the gate by hand (Closed → Opening → Open → Closed, about 5 seconds). |
| **Scan with Camera** / pass code box + **Verify** | Finds an active pass. Then **Authorize & Lift Barrier** checks the guest in. |
| **Expected Pre-Registered Passes** | Passes that are valid right now. Click one to select it. |
| **Walk-In Registration** | Logs a visitor who has no pass. |
| **Resident Directory** | Search by unit or name for the resident's phone and bay. |
| **Live On-Site Property Logbook** | Everyone inside right now. **Check-Out** when they leave. |

### Parking Grid (guard)
A map of every bay: Available, Visitor, Resident, or **Overstay** (red, more than 4 hours). Filter by zone, click a bay for details, and **Release Bay & Mark Available** to free one by hand.

### Optical LPR (guard)
A stand-in for the gate camera. Every plate read is listed in the **Detection Inference Ledger**.

### Resident Pass (resident)
Create guest passes (valid for 24 hours), share them, see your issued passes, and see **My Parking**: your own bay and any bay your guests are using.

### Admin (admin)
| Part | What it does |
|---|---|
| Counts at the top | Units, today's visitors, parking use, overstays. |
| **Register Unit & Resident** / **Register Parking Bay** | Add, edit and delete units and bays. A unit's **Status** (Vacant, Do Not Disturb) warns the guard at check-in. |
| **Users & Access** | Set each account's role and link residents to units. You can't change your own role. |
| **Export Audit Log (CSV)** | Downloads the visitor log. |

### Readiness (top bar)
The production checklist: what's done and what still needs building. The full plan lives in `docs/SECOND_BRAIN.md`.

---

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| **"Invalid login credentials"** | Wrong email or password, or the email isn't confirmed yet. Click the link in the confirmation email. |
| Signed in but I only see **Resident Pass** | Your account is still a Resident. An admin must change it in **Users & Access** (or in Supabase for the first admin). Then sign out and in again. |
| Resident sees **No units registered yet** | The admin hasn't linked this resident to a unit in **Users & Access**. |
| A red banner says **Refused by server** or **Not saved to server** | The database said no: your role isn't allowed to do that, or the pass is used or expired. Read the message; nothing was half-saved. |
| **Scan with Camera** shows "Camera unavailable" | Allow camera access in the browser. The camera only works on `https://` or `localhost`; otherwise type the code. |
| The new pass doesn't appear on the guard tablet | Check that both devices are in real mode (same site, signed in). Refresh once; if it still doesn't appear, check the internet connection. |
| Bays saved before an update never turn red | They have an old time format. Release the bay and park it again. |

---

## 6. Known limitations

- **Offline mode doesn't work yet.** The guard tablet needs internet in real mode, and the app can't be installed to a home screen yet.
- **The gate and camera are simulated.** No real barrier or camera is connected yet.
- **Unit and bay numbers can't be renamed** (other records point at them). Delete and re-add once nothing is using them.
- **Anyone can sign up.** New accounts are Residents with no unit, so they can't do anything until an admin links them.
- **Role changes apply at the next sign-in.**
- **Passes made before the code upgrade** keep their old 5-digit codes until they expire.
- **In demo mode**, login is fake, data stays in one browser, and residents can issue passes for any unit.
