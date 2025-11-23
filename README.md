
# 🔥 BELIARG: The Eternal Forge

> "Exure vivos donec sol taceat" — Burn the living until the sun falls silent.

**Beliarg** is a dark, gamified productivity and finance management ecosystem. 

It has been reforged into a **Full-Stack Web Application (PWA)**. It combines a **React 19** frontend (built with Vite) with a **Node.js & PostgreSQL** backend to ensure your data survives even the apocalypse.

It features a unique "Hellish" aesthetic, turning daily tasks into "Chains", expenses into "Sacrifices", and habits into "Rituals".

---

## 🗝 Key Features

### 🔐 Gatekeeper (Authentication)
- **Secure Access:** Register and Login via Email/Password.
- **JWT Security:** Sessions are secured with JSON Web Tokens.
- **Multi-User:** Data is isolated per user. Your soul is yours alone.
- **Social Login Ready:** UI placeholders for Google/Telegram login (requires API configuration).

### ⛓ Chains (Task Management)
- **CRUD Operations:** Forge, Break, and Reforge tasks.
- **Subtasks:** Break heavy chains into smaller links.
- **Sigils:** Tag tasks with colored magical sigils (Tags).
- **Manual Sort:** Drag & Drop tasks to prioritize your torture.
- **Mobile Gestures:** Swipe **Right** to Execute, Swipe **Left** to Destroy (with Haptic feedback).
- **Critical Success:** 10% chance to trigger a "Blessing of the Abyss" animation upon task completion.

### 💰 Treasury (Finance)
- **Golden Streams:** Track Tribute (Income) and Sacrifices (Expenses).
- **Recurring Torment:** Auto-generate monthly expenses for the rest of the year.
- **Analytics:** Bar charts comparing monthly Income vs Expenses.
- **The Inferno (Heatmap):** Visualize your productivity activity over the last 365 days.

### 📜 Grimoire & Rituals
- **Grimoire:** A dedicated notebook for thoughts, styled as ancient scrolls.
- **Rituals:** Habit tracker with streak logic. Keep the fire burning.

### 🌍 World Aspect
- **Localization:** Fully translated into **English**, **Russian**, and **Hebrew** (with RTL support and custom fonts).
- **Themes:** Switch between **Dark (Obsidian)** and **Light (Ash)** modes.
- **PWA:** Installable on mobile devices (iOS/Android) as a native-like app.

---

## 🛠 Tech Stack

### Frontend (The Interface)
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Audio:** Procedural Web Audio API (No external assets)
- **PWA:** Manifest & Service Worker ready

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
├── public/                 # Static assets (Favicons, Manifest)
├── src/                    # React Source Code
│   ├── components/         # UI Components
│   ├── services/           # API & Audio Services
│   ├── App.tsx             # Main Controller
│   └── translations.ts     # Localization
├── server/
│   └── server.js           # Node.js Express Backend
├── sql/
│   └── schema.sql          # PostgreSQL Database Schema
├── index.html              # Entry point
├── package.json            # Dependencies & Scripts
└── vite.config.ts          # Build Configuration
```

---

## 🚀 How to Summon (Installation)

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 2. Database Setup
1.  Create a database named `beliarg_db`.
2.  Run the schema script to create tables:
    ```bash
    psql -U postgres -d beliarg_db -f sql/schema.sql
    ```

### 3. Installation
Navigate to the project root and install dependencies:
```bash
npm install
```

### 4. Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/beliarg_db
JWT_SECRET=your_super_secret_key_666
```

### 5. Assets (Icons)
Ensure you have the following images in the `public/` folder for PWA support:
- `favicon.png`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`

### 6. Run (Development)
To run the frontend and backend separately during development:
```bash
npm run dev   # Starts Vite Frontend
# In another terminal
node server/server.js # Starts Backend
```

### 7. Build & Run (Production)
To run as a single monolith (Server serving the Frontend):

1.  Build the frontend:
    ```bash
    npm run build
    ```
    *(This creates a `dist` folder)*

2.  Start the server:
    ```bash
    npm start
    ```

3.  Open `http://localhost:3000`.

---

## ☁️ Deployment Guide (DigitalOcean Droplet)

1.  **Provision:** Get an Ubuntu server.
2.  **Install:** `sudo apt install postgresql nodejs npm nginx`.
3.  **Database:** Create the DB and user, run `sql/schema.sql`.
4.  **Deploy Code:** Upload project files to `/var/www/beliarg`.
5.  **Build:** Run `npm install` and `npm run build`.
6.  **Run:** Use `pm2` to keep the server running:
    ```bash
    npm install -g pm2
    pm2 start server/server.js --name beliarg
    ```
7.  **Expose:** Configure NGINX to proxy port 80 to localhost:3000.
8.  **Secure:** Use Certbot to enable HTTPS.

---

## 👨‍💻 Credits

**Developed with 🔥 by [D371L](https://github.com/D371L)**
