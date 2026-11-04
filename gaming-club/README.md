# ⚡ CYBERCLUB — Gaming Club & PlayStation Lounge Booking Engine

> **Production-grade, end-to-end Gaming Club & PlayStation 5 Lounge Booking Web Application.**
> Barcha zamonaviy kompyuter va PlayStation 5 xonalari uchun toʻliq avtomatlashtirilgan real-vaqt bron qilish va boshqaruv tizimi.

---

## 🎯 Asosiy Imkoniyatlar & Xususiyatlar (Features)

1. **50 ta PC uchun Jonli Interaktiv Floor Plan (`/booking/pc`)**:
   - `PC-01` dan `PC-50` gacha boʻlgan 50 ta professional oʻyin kompyuterlari.
   - 3 ta alohida zona: **Standard Hall** (PC 01-20), **VIP Hall** (PC 21-40, 360Hz), **Esports Tournament Zone** (PC 41-50, OLED 240Hz).
   - Real-vaqt indikatorlari: 🟢 **Boʻsh (Available)**, 🔴 **Band (Occupied)**, 🔵 **Tanlangan (Selected)**, 🟡 **Texnik xizmat (Maintenance)**.
   - Bir vaqtda bir nechta kompyuterni tanlash (jamoaviy 5v5 yoki 10+ kompyuterlar uchun).

2. **5 ta Hashamatli PS5 VIP Zallari (`/booking/ps`)**:
   - `PS-ROOM-1` dan `PS-ROOM-5` gacha boʻlgan alohida hashamatli kabinetlar.
   - Har bir zalda majburiy jihozlar:
     - 1x PlayStation 5 konsoli
     - 4x DualSense simsiz geympadlari
     - 65" 4K 120Hz displey / TV
     - Konditsioner (Air Conditioner)
     - Premium yumshoq sofa lounge va mini-bar

3. **Aqlli Narx Mexanizmi & Blokli Chegirmalar (Pricing Engine)**:
   - **PC Zali**:
     - 1 soat = **10,000 UZS**
     - 2 soatlik blok = **17,000 UZS** (har 2 soatlik blokda 3,000 UZS tejaladi)
     - Formula: `(Math.floor(hours / 2) * 17000) + ((hours % 2) * 10000)`
   - **PS5 VIP Zali**:
     - 1 soat = **45,000 UZS**
     - 2 soatlik blok = **80,000 UZS** (har 2 soatlik blokda 10,000 UZS tejaladi)
     - Formula: `(Math.floor(hours / 2) * 80000) + ((hours % 2) * 45000)`
   - **5+ Joy uchun Jamoaviy Bonus (Bulk Perk)**:
     - Bir vaqtda 5 yoki undan ortiq joy band qilinganda: barcha joylarga **+1 SOAT BEPUL BONUS** beriladi (`totalDuration = requestedHours + 1`, lekin toʻlov faqat `requestedHours` uchun olinadi).

4. **Yosh Chegarasi & Oʻzbekiston Telefon Validatsiyasi**:
   - Mijoz yoshi: `age >= 12`. Agar 12 yoshdan kichik boʻlsa: *"Minimum allowable age is 12 years old."* xatosi qaytariladi.
   - Telefon raqami formati: Oʻzbekiston standarti `^\+998\d{9}$`.

5. **Toʻqnashuvlarning Oldini Olish & Real-Vaqt Sinxronizatsiya (Socket.io)**:
   - Vaqt toʻqnashuvi formulasi: `startTime < existingEndTime AND endTime > existingStartTime`.
   - Tranzaksiyalar orqali "Race Condition" va ikkilamchi band qilishlarning oldi olingan.
   - Socket.io hodisalari: `station:reserved`, `station:released`, `station:status_updated`. Sahifani qayta yuklamasdan barcha mijozlarda holat soniyalarda yangilanadi.

6. **20+ Oʻrnatilgan Oʻyinlar Katalogi (`/games`)**:
   - CS2, EA Sports FC 25, Dota 2, Valorant, GTA V, UFC 5, Mortal Kombat 1, Tekken 8, Cyberpunk 2077, God of War Ragnarök va boshqalar.
   - Platforma boʻyicha filter: PC, PS5, Both.
   - Janr boʻyicha qidiruv va filtrlar.

7. **Yagona Admin Boshqaruv Portali (`/admin`)**:
   - Barcha 50 PC va 5 PS5 xonalarining jonli nazorati.
   - Har bir kompyuterni bir tugma bilan texnik xizmatga yopish (Maintenance Lock) yoki ochish.
   - Toʻliq buyurtmalar jurnali: Mijoz ismi, telefoni, yoshi, joylari, vaqti, toʻlov summasi, statusi.
   - Bronlarni bekor qilish va joylarni darhol boʻshatish.

---

## 🏗️ Tizim Arxitekturasi (System Architecture)

```
gaming-club/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS v4, Lucide)
│   ├── src/
│   │   ├── components/
│   │   │   ├── pc/             # 50-unit interactive PC Grid layout
│   │   │   ├── ps/             # 5-room VIP PS5 Lounge Cards
│   │   │   ├── booking/        # Multi-station booking modal & dynamic price calculator
│   │   │   ├── admin/          # Unified admin dashboard & live status board
│   │   │   └── common/         # Navbar, Notification Toasts, Badge, Footer
│   │   ├── pages/              # Home, PCBooking, PSBooking, GamesLibrary, Pricing, Admin
│   │   ├── context/            # SocketContext & BookingContext
│   │   └── services/           # Axios API client
├── server/                     # Backend (Node.js, Express, Socket.io, Prisma ORM)
│   ├── src/
│   │   ├── config/             # DB & Socket configuration
│   │   ├── controllers/        # Booking, Station, Game, Admin auth controllers
│   │   ├── services/           # Pricing calculation & collision prevention algorithms
│   │   ├── middlewares/        # Age validator (12+), JWT auth, error handlers
│   │   ├── routes/             # Express route declarations
│   │   └── socket/             # Real-time event broadcasting
│   └── prisma/
│       ├── schema.prisma       # Prisma Database Schema
│       ├── seed.js             # Seeder (50 PCs, 5 PS5 rooms, 20+ games, Admin)
│       └── dev.db              # SQLite Database
```

---

## 🚀 Oʻrnatish & Ishga Tushirish (Quick Start Guide)

### Talablar:
- **Node.js**: v18+ yoki v20+ / v22+
- **npm**: v9+ / v10+ / v11+

### 1-Qadam: Serverni Ishga Tushirish (Backend)
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Server manzili: `http://localhost:5000` (WebSocket va REST API tayyor boʻladi).*

### 2-Qadam: Mijoz Qismini Ishga Tushirish (Frontend)
Yangi terminalda:
```bash
cd client
npm install
npm run dev
```
*Frontend manzili: `http://localhost:5173`*

---

## 🔑 Standart Tizim Maʼlumotlari (Credentials)

| Rol | Login / Email | Parol | Ruxsatlar |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` yoki `admin@cyberclub.uz` | `admin123` | Toʻliq nazorat, joylarni qulflash, bronlarni bekor qilish |
| **Operator** | `operator` yoki `operator@cyberclub.uz` | `admin123` | Jonli rejim nazorati |

---

## 📡 REST API Hujjatlari (API Endpoints)

### 1. Joylar (Stations)
- `GET /api/stations` — Barcha 55 ta joyning jonli holatini olish
- `GET /api/stations/type/:type` — Turi boʻyicha olish (`PC` yoki `PS5`)
- `GET /api/stations/:id` — Bitta joy haqida toʻliq maʼlumot
- `PATCH /api/stations/:id/status` — Joy statusini oʻzgartirish (Admin token talab qilinadi)

### 2. Bron Qilish (Bookings)
- `POST /api/bookings/pricing-summary` — Dinamik narx va chegirmalarni hisoblash
- `POST /api/bookings/check-availability` — Tanlangan vaqt oraligʻida joy boʻshligini tekshirish
- `POST /api/bookings/create` — Yangi bron yaratish (12+ yosh va Oʻzbekiston telefon raqami tekshiriladi)
- `GET /api/bookings/code/:code` — Bron kodi (`CC-XXXXX`) orqali izlash
- `PATCH /api/bookings/:id/cancel` — Bronni bekor qilish va joyni boʻshatish
- `GET /api/bookings` — Barcha bronlar jurnali (Admin token talab qilinadi)

### 3. Oʻyinlar (Games)
- `GET /api/games` — Oʻyinlar katalogi (filtrlash: `platform`, `genre`, `search`)
- `GET /api/games/categories` — Janrlar va platformalar roʻyxati

### 4. Admin
- `POST /api/admin/login` — Admin login va JWT token olish
- `GET /api/admin/stats` — Jonli statistikalar va bugungi tushum koʻrsatkichlari
- `PATCH /api/admin/stations/:id/maintenance` — Joyni texnik xizmatga qulflash / ochish

---

## 🧪 Avtomatlashtirilgan Testlarni Ishga Tushirish

Tizimdagi barcha narx hisoblash formulalari, chegirmalar, 5+ kompyuter bonusi, 50 PC va 5 PS5 xonalarining toʻliqligini tekshirish uchun:
```bash
cd server
node test-api.js
```
Natija: `27 PASSED, 0 FAILED` ✅

---

CYBERCLUB — Toshkent, Oʻzbekiston.
