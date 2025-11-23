
# 🔥 BELIARG: The Eternal Forge

> "Exure vivos donec sol taceat" — Burn the living until the sun falls silent.

**Beliarg** is a dark, gamified productivity and finance management ecosystem. 

Originally a simple client-side tool, it has been reforged into a **Full-Stack Web Application**. It combines a **React 19** frontend with a **Node.js & PostgreSQL** backend to ensure your data survives even the apocalypse.

It features a unique "Hellish" aesthetic, turning daily tasks into "Chains", expenses into "Sacrifices", and habits into "Rituals".

---

## 🗝 Key Features

### 🔐 Gatekeeper (Authentication)
- **Secure Access:** Register and Login via Email/Password.
- **JWT Security:** Sessions are secured with JSON Web Tokens.
- **Multi-User:** Data is isolated per user. Your soul is yours alone.

### ⛓ Chains (Task Management)
- **CRUD Operations:** Forge, Break, and Reforge tasks.
- **Subtasks:** Break heavy chains into smaller links.
- **Sigils:** Tag tasks with colored magical sigils.
- **Manual Sort:** Drag & Drop tasks to prioritize your torture.
- **Mobile Gestures:** Swipe **Right** to Execute, Swipe **Left** to Destroy.
- **Critical Success:** 10% chance to trigger a "Blessing of the Abyss" upon task completion.

### 💰 Treasury (Finance)
- **Golden Streams:** Track Tribute (Income) and Sacrifices (Expenses).
- **Recurring Torment:** Auto-generate monthly expenses for the rest of the year.
- **The Inferno (Heatmap):** Visualize your productivity activity over the last 365 days.
- **Analytics:** Bar charts comparing monthly Income vs Expenses.

### 📜 Grimoire & Rituals
- **Grimoire:** A dedicated notebook for thoughts, styled as ancient scrolls.
- **Rituals:** Habit tracker with streak logic. Keep the fire burning.

### 🌍 World Aspect
- **Localization:** Fully translated into **English**, **Russian**, and **Hebrew** (with RTL support).
- **Themes:** Switch between **Dark (Obsidian)** and **Light (Ash)** modes.
- **PWA:** Installable on mobile devices (iOS/Android) with offline UI support.

---

## 🛠 Tech Stack

### Frontend (The Interface)
- **Framework:** React 19 (ES Modules)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via CDN)
- **Audio:** Procedural Web Audio API (No external assets)
- **Icons:** SVG & CSS Animations

### Backend (The Engine)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Auth:** `jsonwebtoken` (JWT) + `bcryptjs`

**Note:** The project has **Zero AI Dependencies**. All logic is deterministic.

---

## 📂 Project Structure

```text
/
├── index.html              # Entry point, PWA manifest, global styles
├── App.tsx                 # Main Application Controller
├── translations.ts         # Localization (RU/EN/HE)
├── services/
│   ├── authService.ts      # Login/Register logic
│   ├── storage.ts          # API Client (connects to backend)
│   └── audioService.ts     # Sound engine
├── components/             # UI Components (AuthPage, TaskCard, etc.)
├── server/
│   └── server.js           # Node.js Express Backend
└── sql/
    └── schema.sql          # PostgreSQL Database Schema
```

---

## 🚀 How to Summon (Installation)

### 1. Database Setup (PostgreSQL)
You need a running PostgreSQL instance (Local or Cloud).

1.  Create a database named `beliarg_db`.
2.  Run the schema script to create tables:
    ```bash
    psql -U postgres -d beliarg_db -f sql/schema.sql
    ```

### 2. Backend Setup (Server)
1.  Navigate to the project root.
2.  Install dependencies (if you haven't):
    ```bash
    npm install express cors pg dotenv jsonwebtoken bcryptjs
    ```
3.  Create a `.env` file in the root:
    ```env
    PORT=3000
    DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/beliarg_db
    JWT_SECRET=your_super_secret_key_666
    ```
4.  Start the server:
    ```bash
    node server/server.js
    ```

### 3. Frontend Setup (Client)
1.  Open `services/storage.ts` and ensure the `API_URL` matches your server location.
    *   *Dev:* `http://localhost:3000/api`
    *   *Prod:* `/api` (if served from same origin)
2.  Serve the frontend files:
    ```bash
    npx http-server .
    # OR
    python3 -m http.server 8000
    ```
3.  Open your browser at `http://localhost:8000`.

---

## ☁️ Deployment Guide (Single Server)

To host Beliarg on a single VPS (e.g., DigitalOcean Droplet):

1.  **Provision:** Get an Ubuntu server.
2.  **Install:** `sudo apt install postgresql nodejs npm nginx`.
3.  **Database:** Create the DB and user, run `sql/schema.sql`.
4.  **Backend:** 
    - Copy project files.
    - Run `npm install`.
    - Use `pm2` to keep `server/server.js` running.
5.  **Frontend:**
    - Configure **NGINX** to serve `index.html` and static files on port 80.
    - Configure **NGINX** to reverse-proxy requests starting with `/api` to `http://localhost:3000`.
6.  **SSL:** Use Certbot to enable HTTPS.

---

## 👨‍💻 Credits

**Developed with 🔥 by [D371L](https://github.com/D371L)**
