# 🌸 Vrindavan Rides (Meri Dhanno) — Backend API & Architecture

This repository contains the complete full-stack implementation for **Vrindavan Rides (Meri Dhanno)**, a peer-to-peer bike, scooter, motorcycle, and electric cycle rental platform designed for Vrindavan & Mathura.

---

## 🚀 Quick Start

### 1. Environment Configuration
Copy the sample environment configuration:
```bash
cp .env.example .env
```

### 2. Start the Backend API Server
```bash
npm run server
```
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **Database**: SQLite embedded at [`server/vrindavan.db`](file:///D:/com.meridhanno/server/vrindavan.db) with automatic seeding on first run.

### 3. Start the Frontend Client
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- Configured with Vite proxy in [`vite.config.js`](file:///D:/com.meridhanno/vite.config.js) to forward all `/api/*` calls to `http://localhost:5000`.

---

## 🗄️ Database Architecture (`SQLite` via `better-sqlite3`)

The database is initialized in [`server/db.js`](file:///D:/com.meridhanno/server/db.js) with WAL mode enabled:

| Table | Description |
|---|---|
| `vehicles` | Fleet vehicles (specs, pricing, EV range & charging, documents, 6 photos, approval status). |
| `bookings` | Rental bookings across 10 lifecycle stages, pricing (base + Bike Saathi add-on), payments, KYC. |
| `inspections` | Pre- and post-rental handover audits (odometer, fuel %, 7 photo angles, 360° video, damage notes, dual signatures). |
| `customers` | Renter directory with KYC verification status and trip histories. |
| `owners` | Fleet hosts with verification badges, vehicle counts, and 85% net earnings ledger. |
| `disputes` | Inspection damage disparities, admin communication notes timeline, and resolutions. |
| `admin_settings` | Global platform commission rate (15%), minimum duration, WhatsApp support. |
| `legal_config` | Protection plan guidelines, yatra shield legal notices, active cities. |

---

## 📡 REST API Reference

### 🛵 Vehicles Fleet (`/api/vehicles`)
- `GET /api/vehicles`: List all vehicles. Optional filters: `?type=scooter&transmission=automatic&area=Prem Mandir Road&maxPrice=800&status=active&search=activa`
- `GET /api/vehicles/:id`: Fetch specific vehicle details.
- `POST /api/vehicles`: Add a new vehicle (Host 7-step onboarding, defaults to `pending_approval`).
- `PATCH /api/vehicles/:id/status`: Toggle between `active` and `suspended`.
- `PATCH /api/vehicles/:id/verify`: Admin review action (`{ "action": "Verified" | "Rejected" | "Changes Requested" | "Suspended" }`).

### 📋 Bookings Pipeline (`/api/bookings`)
- `GET /api/bookings`: Fetch all bookings. Optional filters: `?status=Active Rental&customerPhone=+919819944321`
- `GET /api/bookings/:id`: Fetch booking details by ID (`VRB-XXXX`).
- `POST /api/bookings`: Create new rental booking (calculates days, base rate, optional Bike Saathi guide fee).
- `PATCH /api/bookings/:id/status`: Transition lifecycle status across the 10 supported states:
  `Inquiry` → `KYC Pending` → `Payment Pending` → `Confirmed` → `Pickup Pending` → `Active Rental` → `Return Pending` → `Completed` / `Cancelled` / `Dispute`.
- `PATCH /api/bookings/:id/payment`: Update payment status (`Paid`, `Pending`, `Failed`, `Refunded`).
- `PATCH /api/bookings/:id/kyc`: Verify rider KYC (`Verified`, `Pending`).

### 📷 Digital Inspection Audit (`/api/inspections`)
- `GET /api/inspections`: List all inspection records grouped by booking ID.
- `GET /api/inspections/:bookingId`: Get Pre-rental and Post-rental inspection records.
- `POST /api/inspections/:bookingId`: Save pre/post inspection:
  ```json
  {
    "type": "pre",
    "inspectionData": {
      "odometer": 14250,
      "fuelLevel": 85,
      "frontPhoto": "https://...",
      "rearPhoto": "https://...",
      "leftPhoto": "https://...",
      "rightPhoto": "https://...",
      "dashboardPhoto": "https://...",
      "frontTyrePhoto": "https://...",
      "rearTyrePhoto": "https://...",
      "existingDamage": "Hairline scratch near silencer",
      "walkaroundVideoRecorded": true,
      "customerConfirmed": true,
      "ownerConfirmed": true
    }
  }
  ```

### 👤 Customers & Owners
- `GET /api/customers` / `PATCH /api/customers/:id/status`
- `GET /api/owners` / `PATCH /api/owners/:id/status`

### ⚠️ Disputes Management (`/api/disputes`)
- `GET /api/disputes`: List all dispute cases.
- `POST /api/disputes`: Open a new dispute case linked to a booking ID.
- `POST /api/disputes/:id/notes`: Append communication notes (`{ text, sender }`).
- `PATCH /api/disputes/:id/resolve`: Mark resolved and record financial compensation/deduction outcome.

### ⚙️ Platform Settings & Overview (`/api/settings` & `/api/stats`)
- `GET /api/settings`: Fetch current commission rate, support contacts, and legal notices.
- `PUT /api/settings`: Update admin platform settings.
- `PUT /api/settings/legal`: Update legal terms and policies.
- `POST /api/settings/reset`: Reset database to fresh seed state.
- `GET /api/stats/overview`: Real-time operational dashboard analytics (10 core metrics + fleet breakdown).

---

## 🔒 Role-Based Access Control (RBAC) & Security

The platform enforces end-to-end RBAC on both the Express backend middleware ([`server/middleware/rbac.js`](file:///D:/com.meridhanno/server/middleware/rbac.js)) and the React UI:

### Roles & Permissions Matrix
| Feature / Endpoint | Public / Customer (`customer`) | Host / Fleet Owner (`owner`) | Platform Administrator (`admin`) |
|---|:---:|:---:|:---:|
| Vehicle Catalog & Filters (`GET /api/vehicles`) | ✅ | ✅ | ✅ |
| Create Booking (`POST /api/bookings`) | ✅ | ✅ | ✅ |
| Submit Digital Inspections (`POST /api/inspections`) | ✅ | ✅ | ✅ |
| List Vehicles for Rental (`POST /api/vehicles`) | ❌ (403) | ✅ | ✅ |
| Toggle Fleet Status (`PATCH /api/vehicles/:id/status`) | ❌ (403) | ✅ | ✅ |
| Verify Vehicle Documents (`PATCH /api/vehicles/:id/verify`) | ❌ (403) | ❌ (403) | ✅ |
| Customer Directory (`GET /api/customers`) | ❌ (403) | ❌ (403) | ✅ |
| Fleet Owner Status Override (`PATCH /api/owners/:id/status`) | ❌ (403) | ❌ (403) | ✅ |
| Disputes & Compensation (`/api/disputes`) | ❌ (403) | ❌ (403) | ✅ |
| Platform Settings & Commission (`PUT /api/settings`) | ❌ (403) | ❌ (403) | ✅ |
| Financial & Operations Overview (`GET /api/stats/overview`) | ❌ (403) | ❌ (403) | ✅ |

### Authentication & Token Verification
- **Renter / Customer Login**: `POST /api/auth/customer-login` with `{ "phone": "+91 98199 44321", "name": "Amit Sharma", "email": "amit@example.com" }`. Issues a `vr_cust_...` bearer session token and returns the customer profile.
- **Host / Fleet Owner Login**: `POST /api/auth/owner-login` with `{ "phone": "+91 98371 44520", "name": "Radhe Shyam Sharma", "email": "radhe@example.com" }`. Issues a `vr_owner_...` bearer session token and returns the host profile.
- **Admin Authentication**: `POST /api/auth/admin-login` with `{ "pin": "7777" }`. Returns a cryptographically unique `vr_admin_...` bearer session token.
- **Session Profile Verification**: `GET /api/auth/me` with `Authorization: Bearer <token>`.
- **Session Revocation**: `POST /api/auth/logout` revokes the token from the active session store.
- **Header Injection**: Requests automatically carry `Authorization: Bearer <token>` and `x-user-role: customer | owner | admin`. Unauthorized attempts to assume admin without a valid token or PIN are rejected with `401 Unauthorized`.

### 📧 Email Verification & Account Distinction (`/api/auth`)
- `POST /api/auth/check-email`: Real-time debounced format validation and account distinction check. Returns whether the email is `available` (fresh for registration), `registered_same_role` (already exists under that role with masked phone hint, e.g. `+91 98****4321`), or `registered_other_role` (registered as host vs renter).
- `POST /api/auth/send-email-otp`: Generates a cryptographically secure 6-digit numeric OTP (10-minute expiry) with a 60-second rate-limiting cooldown. Sends an HTML email via Nodemailer/SMTP or falls back to local console simulation in dev mode.
- `POST /api/auth/verify-email-otp`: Verifies the submitted 6-digit code against `email_verifications` table (max 5 attempts allowed), marking `verified = 1` and synchronizing the verification flag in customer/owner accounts.


---

## 🔌 Frontend Client Integration
The frontend connects to the backend through [`src/api/client.js`](file:///D:/com.meridhanno/src/api/client.js) in [`src/context/AppContext.jsx`](file:///D:/com.meridhanno/src/context/AppContext.jsx).
- On initial load, state syncs automatically with SQLite.
- All actions (booking, inspection, onboarding, status changes) update both the backend database and the local reactive state.
- Includes automatic fallback to cached data if the server is offline.
- Live role switching automatically sends matching RBAC headers on each API request.

