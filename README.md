# 🔥 BELIARG: The Eternal Forge

> "Exure vivos donec sol taceat" — Burn the living until the sun falls silent.

**Beliarg** is a dark, gamified productivity and finance management ecosystem.

**This is an open source project** — free to use, modify, and distribute. 

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
- **Completion Tracking:** Tasks store completion timestamps for accurate activity tracking.

### 💰 Treasury (Finance)
- **Golden Streams:** Track Tribute (Income) and Sacrifices (Expenses).
- **Recurring Torment:** Auto-generate monthly expenses for the rest of the year.
- **Analytics:** Bar charts comparing monthly Income vs Expenses.
- **Financial Statistics:** Comprehensive overview of income, expenses, and net balance.

### 📅 Calendar View
- **Monthly Calendar:** Visual calendar grid showing all days of the month.
- **Event Indicators:** Color-coded indicators for tasks, rituals, transactions, and notes on each day.
- **Day Details Modal:** Click any day to see all events (tasks, rituals, transactions, notes) for that specific date.
- **Month Navigation:** Navigate between months to view historical and future events.
- **Smart Filtering:** Only displays events from the currently selected month.

### 📊 Analytics & Statistics
- **Activity Heatmap:** Visualize your productivity activity over the last 365 days with an interactive heatmap.
  - Color intensity shows activity level (dark = no activity, gold = high activity)
  - Tracks completed tasks by date
  - Persists data across page refreshes
- **Financial Analytics:** Monthly income vs expenses comparison with bar charts.
- **Statistics Overview:** 
  - Total and completed tasks count
  - Rituals performed and streak statistics
  - Notes created
  - Transactions summary
  - Average task completion time
- **Achievements System:** 
  - Track your progress with unlockable achievements
  - Progress bars for locked achievements
  - Achievement categories:
    - Task completion milestones (first task, 10, 50, 100 tasks)
    - Task streaks (7 days, 30 days)
    - Ritual streaks (7 days, 30 days)
    - Note creation milestones (10, 50 notes)
    - Gold accumulation milestones (1000, 10000 gold)

### 📜 Grimoire & Rituals
- **Grimoire:** A dedicated notebook for thoughts, styled as ancient scrolls.
  - **Content Limit:** Each scroll (note) is limited to 300 characters to keep thoughts concise and focused.
  - **Character Counter:** Real-time character count display (X/300) with visual feedback.
  - **Sigil Tagging:** Organize scrolls with colored sigils (tags).
- **Rituals:** Habit tracker with streak logic. Keep the fire burning.
  - **Daily Rituals:** Perform rituals once per day to maintain streaks.
  - **Streak Tracking:** Visual streak counters and statistics.

### 🏆 Achievements
- **Unlockable Badges:** Earn achievements by completing various milestones.
- **Progress Tracking:** See your progress toward each achievement with visual progress bars.
- **Categories:**
  - Task completion achievements
  - Task streak achievements
  - Ritual streak achievements
  - Note creation achievements
  - Gold accumulation achievements
- **Display:** Integrated into the Analytics page for easy viewing.

### 📴 Offline Mode
- **Offline Support:** Continue working even when disconnected from the internet.
- **Offline Indicator:** Visual indicator shows when you're offline and when data is syncing.
- **Automatic Sync:** When connection is restored, all offline changes are automatically synced to the server.
- **IndexedDB Storage:** Uses browser IndexedDB for reliable offline data storage.
- **Service Worker:** Caches static assets and API responses for offline access.

### 🌍 World Aspect
- **Localization:** Fully translated into **English**, **Russian**, and **Hebrew** (with RTL support and custom fonts).
- **Themes:** Switch between **Dark (Obsidian)** and **Light (Ash)** modes.
- **PWA:** Installable on mobile devices (iOS/Android) as a native-like app.
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices.

---

## 🛠 Tech Stack

### Frontend (The Interface)
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Audio:** Procedural Web Audio API (No external assets)
- **PWA:** Manifest & Service Worker ready
- **Offline Storage:** IndexedDB for offline data persistence

### Backend (The Engine)
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **Auth:** `jsonwebtoken` (JWT) + `bcryptjs`
- **Process Manager:** PM2
- **Web Server:** Nginx (reverse proxy)
- **SSL:** Let's Encrypt (Certbot)

**Note:** The project has **Zero AI Dependencies**. All logic is deterministic.

### Production Features
- **Auto-reconnection:** Automatic PostgreSQL reconnection on connection loss
- **Error Handling:** Comprehensive error logging and handling
- **Data Persistence:** All data stored in PostgreSQL with user isolation
- **Data Validation:** Client and server-side validation (e.g., note content limited to 300 characters)
- **HTTPS:** SSL/TLS encryption via Let's Encrypt
- **PWA Ready:** Full Progressive Web App support with custom icons
- **Offline Support:** Service Worker and IndexedDB for offline functionality
- **Achievement System:** Database-backed achievement tracking with progress monitoring

---

## 📂 Project Structure

```text
/
├── public/                 # Static assets (Favicons, Manifest, Icons)
│   ├── favicon.png         # Favicon (32x32)
│   ├── apple-touch-icon.png # iOS icon (180x180)
│   ├── icon-192.png        # PWA icon (192x192)
│   ├── icon-512.png        # PWA icon (512x512)
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service Worker
├── components/             # React UI Components
│   ├── AnalyticsView.tsx   # Analytics, Statistics, and Achievements
│   ├── CalendarView.tsx    # Calendar view with event indicators
│   ├── AchievementsView.tsx # Achievements display component
│   ├── OfflineIndicator.tsx # Offline status indicator
│   ├── TaskCard.tsx        # Task display card
│   ├── RitualCard.tsx      # Ritual display card
│   ├── GrimoireCard.tsx    # Note display card
│   └── ...                 # Other UI components
├── services/                # API & Audio Services
│   ├── authService.ts      # Authentication service
│   ├── storage.ts          # Data persistence service
│   ├── audioService.ts     # Audio effects
│   ├── offlineStorage.ts  # IndexedDB offline storage
│   └── geminiService.ts    # AI service (optional)
├── server/
│   └── server.js           # Node.js Express Backend (ES modules)
├── sql/
│   ├── schema.sql          # PostgreSQL Database Schema
│   └── create_achievements_table.sql # Achievements table migration
├── nginx/
│   └── beliarg.conf        # Nginx configuration template
├── index.html              # Entry point
├── index.tsx               # React entry point with Service Worker registration
├── App.tsx                 # Main React Controller
├── types.ts                # TypeScript type definitions
├── translations.ts         # Localization
├── ecosystem.config.cjs    # PM2 configuration
├── deploy.sh               # Deployment automation script
├── package.json            # Dependencies & Scripts
└── vite.config.ts         # Build Configuration
```

---

## 🚀 How to Summon (Installation)

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (v14+)

### 2. Database Setup
1.  Create a database named `beliarg_db`.
2.  Run the schema script to create tables:
    ```bash
    psql -U postgres -d beliarg_db -f sql/schema.sql
    ```
3.  Create the achievements table (if not included in schema.sql):
    ```bash
    sudo -u postgres psql -d beliarg_db -f sql/create_achievements_table.sql
    ```
4.  Ensure the `completed_at` column exists in the `tasks` table:
    ```bash
    sudo -u postgres psql -d beliarg_db -c "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;"
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

**Important:** Generate a strong JWT_SECRET:
```bash
openssl rand -base64 32
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

## ☁️ Deployment Guide

### GitHub Pages Demo (No Database Required)

The application is available as a **demo version on GitHub Pages** with pre-loaded test data.

**🌐 Live Demo:** [https://d371l.github.io/beliarg/](https://d371l.github.io/beliarg/)

**Demo Access:**
- **Email:** `admin@demo.local` (or simply `admin`)
- **Password:** `admin`

The demo version works entirely in the browser using localStorage - no backend or database required. All changes are saved locally in your browser. This is perfect for exploring the application's features without any setup.

**Note:** The demo version includes sample data (tasks, achievements, finances, rituals, notes) to showcase all features. You can modify, add, or delete items, and changes will persist in your browser's localStorage.

### Production Deployment (With Database)

The application is also deployed at **https://beliarg.online** with full backend and database support.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Setting Up Database (For Production)

To use the application with a real database:

1.  **Database Setup:** Create a PostgreSQL database and run the schema:
    ```bash
    psql -U postgres -d beliarg_db -f sql/schema.sql
    psql -U postgres -d beliarg_db -f sql/create_achievements_table.sql
    psql -U postgres -d beliarg_db -f sql/add_oauth_fields_to_users.sql
    ```

2.  **Configuration:** Set up your `.env` file with database connection:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/beliarg_db
    JWT_SECRET=your_secret_key
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    ```

3.  **Run:** Start the server with `npm start` or use PM2 for production.

### Quick Deployment Steps (Production Server)

1.  **Provision:** Get an Ubuntu server (tested on Ubuntu 24.04).
2.  **Install:** `sudo apt install postgresql nodejs npm nginx certbot`.
3.  **Database:** Create the DB and user, run `sql/schema.sql`.
4.  **Database Migrations:** 
    - Run `sql/create_achievements_table.sql` to create achievements table
    - Ensure `completed_at` column exists: `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;`
5.  **Deploy Code:** Upload project files to `/var/www/beliarg`.
6.  **Build:** Run `npm install` and `npm run build`.
7.  **Run:** Use `pm2` to keep the server running:
    ```bash
    npm install -g pm2
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup
    ```
8.  **Expose:** Configure NGINX to proxy port 80/443 to localhost:3000 (see `nginx/beliarg.conf`).
9.  **Secure:** Use Certbot to enable HTTPS:
    ```bash
    sudo certbot --nginx -d beliarg.online -d www.beliarg.online
    ```

### Deployment Files

- `ecosystem.config.cjs` - PM2 configuration
- `nginx/beliarg.conf` - Nginx configuration template
- `deploy.sh` - Automated deployment script
- `DEPLOYMENT.md` - Detailed deployment guide

### Database Permissions

**Important:** Ensure the database user has proper permissions:
```sql
-- Grant permissions to achievements table
GRANT ALL PRIVILEGES ON TABLE achievements TO beliarg_user;

-- Ensure user can create tables (for migrations)
ALTER USER beliarg_user CREATEDB;
```

---

## 🔧 Key Implementation Details

### Activity Heatmap
- Tracks completed tasks by their `completedAt` timestamp
- Falls back to `createdAt` for older tasks without completion dates
- Uses local timezone for accurate date display
- Persists data across page refreshes

### Achievements System
- Achievements are stored in PostgreSQL `achievements` table
- Progress is tracked and updated automatically
- Achievements unlock when progress reaches target
- Unlock timestamps are preserved

### Offline Mode
- Uses IndexedDB for local storage
- Service Worker caches static assets
- Automatic sync when connection is restored
- Visual indicators for offline/syncing status

### Calendar View
- Displays events from the selected month only
- Shows tasks (by completion date or deadline), rituals, transactions, and notes
- Day details modal shows all events for a specific date
- Rituals are view-only in calendar (cannot be performed from calendar)

---

## 🐛 Known Issues & Solutions

### Database Migration Errors
If you see "permission denied for schema public" or "must be owner of table":
- Run migrations as PostgreSQL superuser: `sudo -u postgres psql -d beliarg_db -f sql/schema.sql`
- Grant proper permissions to the database user

### Activity Heatmap Not Showing Data
- Ensure `completed_at` column exists in `tasks` table
- Check that tasks have `completedAt` timestamps set
- Verify data is being loaded from database correctly

### Achievements Not Displaying
- Ensure `achievements` table exists and has proper permissions
- Check that achievement entries are being created in the database
- Verify API endpoints are accessible (check server logs)

---

## 📝 Development Notes

### Adding New Features
- All data types are defined in `types.ts`
- Translations should be added to `translations.ts` for all three languages
- New API endpoints should be added to `server/server.js` before static file serving
- Components should follow the existing naming and structure conventions

### Database Schema Updates
- Always create migration scripts in `sql/` directory
- Test migrations on a development database first
- Ensure proper permissions are granted to the database user

---

## 📄 License

This project is **open source** and available under a **free open source license**. 

You are free to:
- Use the software for any purpose
- Modify the source code
- Distribute the software
- Contribute to the project

**Developed with 🔥 by [D371L](https://github.com/D371L)**
