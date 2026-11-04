Markdown
Act as a Principal Full-Stack Software Engineer and System Architect. Build a production-grade, end-to-end Gaming Club & PlayStation Lounge Booking Web Application ("CyberClub Booking Engine").

---

### 1. CORE SYSTEM ARCHITECTURE & TECH STACK

- **Frontend:** React 19 (Vite), Tailwind CSS v4, Lucide React (icons), Axios, Socket.io-client.
- **Backend:** Node.js, Express.js (ES Modules), Socket.io, Prisma ORM with PostgreSQL (or MongoDB with Mongoose).
- **Architecture Pattern:** Clean Layered Architecture (Controllers -> Services -> Repositories/Models) with real-time WebSocket state distribution.

#### Folder Structure to Generate:
gaming-club/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── pc/          # 50-unit interactive PC Grid layout
│   │   │   ├── ps/          # 5-room VIP PS5 Lounge Cards
│   │   │   ├── booking/     # Multi-station booking modal & dynamic price calculator
│   │   │   ├── admin/       # Unified admin dashboard & live status board
│   │   │   └── common/      # Navbar, Notification Toasts, Badge, Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── PCBooking.jsx
│   │   │   ├── PSBooking.jsx
│   │   │   ├── GamesLibrary.jsx
│   │   │   ├── PricingOffers.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/         # SocketContext & BookingContext
│   │   └── services/        # API client
├── server/
│   ├── src/
│   │   ├── config/          # DB & Socket configuration
│   │   ├── controllers/     # Booking, Station, Game, Admin auth controllers
│   │   ├── services/        # Pricing calculation & reservation overlap algorithms
│   │   ├── models/          # Schema models
│   │   ├── middlewares/     # Age validator (12+), JWT auth, error handlers
│   │   ├── routes/          # Express route declarations
│   │   └── socket/          # Real-time event broadcasting
│   └── prisma/schema.prisma


---

### 2. BUSINESS RULES & PRICING ENGINE

Implement an exact calculation utility (`calculateBookingSummary`) conforming strictly to the following requirements:

1. **Station Capacity:**
   - **PC Hall:** Exactly 50 individual PC units labeled `PC-01` through `PC-50`.
   - **PlayStation Hall:** Exactly 5 dedicated VIP rooms labeled `PS-ROOM-1` through `PS-ROOM-5`.
     - Amenities for each PS room: 1x PlayStation 5 Console, 4x DualSense Wireless Controllers, 4K Display/TV, Air Conditioner (AC), Premium Sofa Lounge.

2. **Pricing Structure & Tiered Discounts:**
   - **PC Station:**
     - 1 Hour: 10,000 UZS.
     - 2 Hours Block: 17,000 UZS (saves 3,000 UZS per 2-hour block).
     - Formula: `(Math.floor(hours / 2) * 17000) + ((hours % 2) * 10000)`.
   - **PS5 VIP Room:**
     - 1 Hour: 45,000 UZS.
     - 2 Hours Block: 80,000 UZS (saves 10,000 UZS per 2-hour block).
     - Formula: `(Math.floor(hours / 2) * 80000) + ((hours % 2) * 45000)`.

3. **Bulk / Team Booking Rule (5+ Stations):**
   - If a customer reserves 5 or more stations simultaneously in a single transaction (e.g. 5v5 team match across 10 PCs or multi-station reservation):
     - Automatically grant **+1 Hour FREE Bonus** to all booked stations.
     - `totalDuration = requestedHours + 1`, but the client only pays for `requestedHours`.

4. **Age Restriction & Validation:**
   - Customer inputs: `fullName`, `phoneNumber` (must match Uzbekistan pattern `^\+998\d{9}$`), `age`.
   - Validation Rule: `age >= 12`. If `age < 12`, throw validation error: *"Minimum allowable age is 12 years old."*

---

### 3. CONCURRENCY & REAL-TIME SYNCHRONIZATION

- **Slot Collision Prevention:**
  - Check interval overlapping using: `startTime < existingEndTime AND endTime > existingStartTime`.
  - Database transactions must lock or verify station availability before confirming a reservation to prevent race conditions.
- **WebSocket Synchronization (Socket.io):**
  - Event `station:reserved`: When Station A is reserved for `[t1, t2]`, all active web clients must immediately mark Station A as "Occupied" for that slot without manual page refresh.
  - Expired reservations must automatically transition the station back to "Available".

---

### 4. APPLICATION PAGES & UI/UX SPECIFICATIONS

1. **Interactive PC Floor Plan (`/booking/pc`):**
   - 50-station visual grid with real-time color indicators:
     - 🟢 **Available (Green)**
     - 🔴 **Occupied / Reserved (Red)**
     - 🔵 **Selected by user (Blue)**
   - Allows selecting single or multiple PCs (for team play up to 10+ PCs).

2. **PS5 VIP Lounge Page (`/booking/ps`):**
   - 5 visually distinct cards with badges: "PS5 Console", "4x Gamepads Included", "Air Conditioner", "Lounge Sofas".
   - Slot selection and instant price breakdown.

3. **Game Catalog Page (`/games`):**
   - Searchable, filterable list of installed games with genre tags (FPS, Sports, MOBA, Story, Racing) and supported platforms (PC, PS5, or Both).

4. **Pricing, Discounts & Bonuses Page (`/pricing`):**
   - Transparent table breaking down hourly rates, 2-hour combo savings, the 5+ station bonus hour perk, and club safety/age policies.

5. **Unified Admin Panel (`/admin`):**
   - Single admin portal to control both PC and PS spaces.
   - Master live view: 50 PCs and 5 PS5 rooms with real-time operational status.
   - Reservations log: Customer Name, Phone, Age, Station IDs, Start/End Time, Total Amount, Discount Applied, Status (Active, Completed, Cancelled).
   - Action controls: Cancel reservations, manually release or lock stations for maintenance.

---

### 5. EXECUTION & DELIVERABLES INSTRUCTIONS

1. Write fully functional, clean, production-ready code with no placeholder comments (`// TODO`).
2. Include comprehensive database seeders (`seed.js` or Prisma seed) that pre-populate the 50 PCs, 5 PS5 lounges, sample games, and default admin credentials.
3. Include an intuitive `README.md` containing local setup instructions, environment vari