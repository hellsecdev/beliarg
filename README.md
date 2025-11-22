
# 🔥 BELIARG: The Eternal Forge

> "Exure vivos donec sol taceat" — Burn the living until the sun falls silent.

**Beliarg** is a thematic, gamified productivity and finance management application built with **React 19** and **TypeScript**. It completely abandons standard corporate design in favor of a "Hellish Forge" aesthetic, turning daily chores into "Chains" to be broken and expenses into "Sacrifices".

---

## 🗝 Key Features

### ⛓ Chains (Task Management)
- **CRUD Operations:** Create, read, update, and destroy tasks.
- **Subtasks (Links):** Break complex tasks down into smaller links.
- **Sigils (Tags):** Categorize tasks with custom colored tags (e.g., "Work", "Health").
- **Manual Control:** Drag & Drop sorting to prioritize your day physically.
- **Mobile Gestures:** Swipe **Right** to Execute (Complete), Swipe **Left** to Destroy (Delete).
- **Difficulty Levels:** Ash (Easy), Ember (Medium), Inferno (Hard).

### 💰 Treasury (Finance Tracking)
- **Tribute & Sacrifice:** Track Income and Expenses.
- **Recurring Torment:** Automatically generate monthly expenses for the rest of the year.
- **Visual Analytics:** Bar charts comparing Income vs Expenses.
- **The Inferno (Heatmap):** GitHub-style activity heatmap showing your productivity over the last 365 days.
- **Date Picking:** Retroactively add records with a custom calendar input.

### 📜 Grimoire (Notes)
- A dedicated space for thoughts, drafts, and ideas.
- Styled like ancient scrolls or stone tablets.
- Fully searchable via the "Eye of the Abyss".

### 🔥 Rituals (Habit Tracker)
- Track daily habits.
- Maintain "Streaks" (fire intensity) by performing rituals daily.

### ⚙️ Soul Vessel (Data Management)
- **Offline First:** All data is stored in the browser's `LocalStorage`.
- **Backup & Restore:** Export your entire database to a JSON file ("Extract Soul") and restore it later ("Resurrect") to prevent data loss or transfer to another device.

### 📱 PWA & Mobile Experience
- Fully responsive design.
- Installable on iOS and Android (Manifest included).
- Haptic feedback (Vibration) on interactions.

---

## 🛠 Tech Stack

- **Frontend:** React 19 (ES Modules)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via CDN)
- **Fonts:** Google Fonts (Cinzel Decorative, Nosifer, Rye)
- **State Management:** React Hooks (`useState`, `useReducer`, `useEffect`)
- **Persistence:** LocalStorage API
- **Audio:** Web Audio API (Procedural sound generation for clicks and interactions)
- **Icons:** Native SVG & Emoji

**Note:** This project is entirely **Client-Side**. It does not require a backend server or database. It has **Zero AI Dependencies** (Google Gemini API was fully removed).

---

## 📂 Project Structure

```text
/
├── index.html              # Entry point, PWA manifest, global styles
├── index.tsx               # React Root
├── App.tsx                 # Main Application Logic & Routing
├── types.ts                # TypeScript Interfaces (Task, Transaction, Note, etc.)
├── translations.ts         # Localization (RU/EN)
├── services/
│   ├── audioService.ts     # Web Audio API wrapper for UI sounds
│   └── geminiService.ts    # Static Demon Quotes (formerly AI)
└── components/
    ├── TaskCard.tsx        # Task item with Swipe & Drag logic
    ├── AddSoulModal.tsx    # Form for creating/editing tasks
    ├── AddTransactionModal.tsx # Form for finance
    ├── AnalyticsView.tsx   # Charts, Heatmap, and Tables
    ├── GrimoireCard.tsx    # Note display component
    ├── SettingsModal.tsx   # Theme, Lang, Backup controls
    ├── CritModal.tsx       # "Critical Success" animation
    └── ... (other UI components)
```

## 🚀 How to Run

Since this project uses ES Modules and CDN-based React, it requires no build step (like Webpack or Vite) for the provided environment, but in a standard local setup:

1.  **Clone the repository.**
2.  **Serve the directory:** You need a simple static HTTP server because ES modules cannot load via `file://` protocol due to CORS policies.

   ```bash
   # Example using Python
   python3 -m http.server 8000
   
   # Example using Node.js http-server
   npx http-server .
   ```

3.  **Open Browser:** Navigate to `http://localhost:8000`.

## 🎨 Theming

The app features a high-contrast **Dark Mode (Obsidian)** and a **Light Mode (Ash)**.
- **Dark Mode:** Optimized for OLED screens with deep blacks (#050505) and neon accents (Gold/Lava).
- **Light Mode:** Desaturated gray/white aesthetic resembling burnt ash.

## ⚖️ License

The Forge is open to all who dare to wield the hammer.
