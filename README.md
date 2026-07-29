<div align="center">

  # 🛡️ SentinelGuard
  ### Next-Gen Residence Check-In & Smart Parking Management System (PWA)

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Installable-0284c7?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    A modern, high-performance Progressive Web Application designed for security guards in luxury residences, condominiums, and hotels to manage guest check-ins, unit occupancy, automated barrier gates, and smart parking space allocation.
  </p>

  [Live Demo](http://localhost:3000) · [Report Bug](https://github.com/dillandeluxe/SentinelGuard/issues) · [Request Feature](https://github.com/dillandeluxe/SentinelGuard/issues)

</div>

---

## 🌟 Key Features

### 👮 Guardhouse Tablet Console
* **Instant QR Code Guest Pass Scanner:** Sub-second validation for pre-registered visitor passes.
* **Unit Directory & Status Search:** Real-time occupancy lookup by unit number (e.g., `A-101`, `B-501`) showing resident contact details and DND/vacant flags.
* **Manual Walk-In Entry Modal:** Quick registration for unannounced guests, delivery couriers, and contractors.
* **1-Tap Barrier Gate Trigger:** Visual barrier gate controller (`Closed`, `Opening`, `Open`) with emergency manual override.
* **Live Visitor Logbook:** Active on-site vehicle tracking with 1-click departure checkout.

### 🚗 Smart Parking Space Allocation Grid
* **Live Visual Floorplan:** Real-time slot status map for **Resident Bays**, **Visitor Bays**, **EV Charging**, and **Handicap Spaces**.
* **Color-Coded Statuses:** Available (Emerald), Resident Parked (Sky Blue), Visitor Parked (Amber), Reserved (Purple), and Overstay Warning (Pulsing Red).
* **Automated Overstay Detection:** Alerts guards when a visitor vehicle exceeds allocated parking limits (>4 hours).

### 📹 AI License Plate Recognition (LPR / ANPR)
* **Live Camera Stream Vision Simulator:** RTSP 1080p stream simulation with OCR bounding box detection.
* **Automatic Gate Triggers:** Auto-approves registered resident plates (`SJK-8821`) and pre-registered guest passes (`LHM-4491`).
* **Unknown Vehicle Alerts:** Flags unregistered plates for guard manual verification.

### 🏠 Resident & Host Visitor Portal
* **Digital Guest Pass Generator:** Instant QR code pass creation for guests and drivers.
* **1-Click WhatsApp & Link Sharing:** Direct WhatsApp sharing integration for guests.

### 📊 Executive Security Analytics Dashboard
* **Property Metrics:** Total units, occupancy rates, daily visitor traffic, and parking bay utilization.
* **Traffic Category Breakdown:** Social Guests vs. Delivery Couriers vs. Maintenance Contractors.
* **Security Audit Trail Export:** Downloadable security event logs.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Full-stack React framework with SSR and API routes |
| **Language** | **TypeScript** | Type-safe data models and components |
| **Styling** | **Tailwind CSS + Lucide Icons** | Modern dark-mode glassmorphic UI system |
| **App Model** | **PWA (Progressive Web App)** | Installable on iPad/Android guard tablets without app stores |
| **QR Engine** | **qrcode / canvas-confetti** | High-speed QR code generation & rendering |
| **State Store** | **React Context API** | Real-time state updates across components |

---

## 📁 Repository Architecture

```text
SentinelGuard/
├── public/
│   └── manifest.json            # PWA Application Manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx           # PWA metadata & global layout
│   │   ├── page.tsx             # Navigation controller & tab switcher
│   │   └── globals.css          # Tailwind CSS & animations
│   ├── components/
│   │   ├── GuardConsole.tsx     # Main Guardhouse tablet interface
│   │   ├── ParkingMap.tsx       # Interactive visual parking grid
│   │   ├── LPRSimulator.tsx     # License Plate Vision AI camera feed
│   │   ├── ResidentPortal.tsx   # Guest QR pass generator & WhatsApp share
│   │   ├── AdminDashboard.tsx   # Executive security analytics
│   │   ├── LandingScreen.tsx    # Interactive splash/landing hero page
│   │   ├── AuthPortal.tsx       # Role-based login & signup portal
│   │   └── ProductionChecklistModal.tsx # Commercial deployment checklist
│   └── lib/
│       ├── types.ts             # TypeScript definitions
│       ├── mockData.ts          # Initial unit, visitor & parking mock database
│       ├── store.tsx            # Global state context store
│       └── productionChecklist.ts # Production readiness roadmap data
└── package.json
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dillandeluxe/SentinelGuard.git

# 2. Navigate into the project folder
cd SentinelGuard

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev -- -p 3000 -H localhost
```

Open **`http://localhost:3000`** in your browser.

---

## 📋 Production Readiness Roadmap

- [x] Progressive Web App (PWA) manifest & offline layout setup
- [x] Interactive Guard Console with QR scanner & barrier gate trigger
- [x] Visual Parking Bay Grid with overstay warning alerts
- [x] License Plate Recognition (LPR) camera simulator
- [x] Multi-Role Auth Portal (`Guard`, `Resident`, `Admin`)
- [ ] Connect PostgreSQL Database via Prisma ORM
- [ ] Implement NextAuth.js / Supabase JWT authentication
- [ ] Connect physical RTSP camera streams (Hikvision/Dahua)
- [ ] Relay controller MQTT integration for hardware gate barriers

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for Security Officers & Property Managers</sub>
</div>
