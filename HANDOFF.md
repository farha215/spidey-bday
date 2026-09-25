# 🕷️ Spidey Memory Tracker - Handoff & Session Documentation

> **Last Updated:** September 25, 2026  
> **Repository:** `https://github.com/farha215/spidey-bday`  
> **Status:** Production Ready & Pushed to GitHub `main`

---

## 📌 Executive Summary

The **Spidey Memory Tracker** is an interactive, retro 8-bit handheld console web application built for a custom birthday experience. It features an interactive world map powered by Google Maps, real-time shared database synchronization using Supabase, a secret 8-bit keypad passcode lock, custom background music, and interactive memory creation with image compression.

---

## 🔒 Crucial Rules & Constraints (MUST REMEMBER)

1. **Passcode Gate Security:**
   - **Secret Code:** `2692006`
   - **Session Scope:** Managed via `sessionStorage.getItem("spidey_unlocked") === "true"`. Every new browser tab or session will present the retro 8-bit passcode keypad.

2. **Git Deployment Directive:**
   - **DO NOT DEPLOY AUTOMATICALLY.**
   - Only execute `git push origin main` when the user explicitly enters the prompt `"deploy"`.
   - **DO NOT RUN `git status`.**

3. **Audio Engine Rules:**
   - Song: `public/sounds/oh-yeah.mp3`
   - Controlled via **SOUND ON / SOUND OFF** buttons.
   - Spanish TTS voice narration disabled per user preference.

4. **Supabase Cloud Project Configuration:**
   - **URL:** `https://natqyjlcienlysgnczad.supabase.co`
   - **Public Anon Key:** Hardcoded in `lib/supabase.ts` with `process.env` fallback so GitHub Pages static exports connect seamlessly.
   - **Table Name:** `memories`
   - **Columns:** `id` (text), `title` (text), `location` (text), `date` (text), `caption` (text), `photo` (text), `lat` (float8), `lng` (float8), `nodeType` (text), `created_at` (timestamp).

---

## 🚀 Completed Features & Customizations

### 1. Retro 8-Bit Design System & Console Bezel
- **Stepped Pixel Borders (`.bit-border`, `.btn-3d`):** Custom CSS polygon clip-paths with 8-bit stepped pixel corners, top-left highlight bevels, and dark bottom-right shadow bevels.
- **Chibi Spider-Man Avatar:** Idle breathing/squish keyframe animation in bottom-left ticker bar over a `#5a9cba` circle badge.
- **Scanline Overlays:** Custom linear gradient scanline overlays across screen container and cards.

### 2. Interactive Letter Modal (`components/letter-modal.tsx`)
- **Title Header:** `🕸️ HAPPY BIRTHDAY 🕸️` rendered in retro red pixel font (`#b83a3a`) with pixel spiderweb icons on both sides.
- **Letter Button (`app/page.tsx` & `components/pin-marker.tsx`):** Extra-large 8-bit pixel circular SVG badge (`h-16 w-16`) containing a centered envelope icon (`letter-transparent.png`).

### 3. Custom Node Symbols & Color Palettes (`components/add-memory-modal.tsx`)
- **MANAV:** Pixel-art Orca whale sprite (`public/assets/symbol-orca.png`) with deep magenta (`#8F2867`) 8-bit 3D pixel button and black text drop shadow.
- **FARHA:** Bunny sprite (`public/assets/symbol-bunny.png`) with soft pink (`#FFB5E6`) 8-bit 3D pixel button and black text drop shadow.
- **TWIN:** Spidey sprite (`public/assets/pin-spider-transparent.png`) with crimson (`#b85c5c`) 8-bit 3D pixel button and black text drop shadow.

### 4. Functional 2-Step Node Deletion (`components/memory-modal.tsx`)
- **Step 1:** User clicks **`🗑️ DELETE NODE`**.
- **Step 2:** Button expands into an urgent confirmation banner:
  - `⚠️ CONFIRM DELETE? THIS CANNOT BE UNDONE!`
  - `CANCEL` button (resets back to Step 1).
  - `YES, DELETE` button (deletes record from Supabase over HTTPS, updates local storage, plays audio feedback, and closes modal).

### 5. Mobile Image Compression (`components/add-memory-modal.tsx`)
- **Smartphone Camera Photos:** Automatically compressed using HTML5 Canvas to max 600px width/height (JPEG 70% quality, ~30KB).
- **Payload Safety:** Prevents high-resolution phone photos (5MB+) from hitting Supabase payload limits or failing to save over mobile data.

### 6. Real-Time Auto-Syncing (`app/page.tsx`)
- **4-Second Polling Loop:** `app/page.tsx` periodically polls `fetchSharedMemories()` every 4 seconds. Nodes added on mobile immediately appear on desktop browsers without requiring a manual refresh.

### 7. Site Metadata & Cleanup
- **Browser Tab Title:** Set to **`Spidey Tracker 🕷️`** in `app/layout.tsx`.
- **Codebase Cleaned:** Removed unused `songs/` root folder, duplicate audio files, root `assets/`, temporary node scripts, `public/team/` directory, and unused SVG files.

---

## 📁 Repository Structure & Key File Guide

```
spidey-bday/
├── app/
│   ├── globals.css           # 8-bit pixel border utilities & animations
│   ├── layout.tsx            # Metadata (Spidey Tracker 🕷️) & fonts
│   └── page.tsx              # Main console container, top bar, 4s sync loop, ticker
├── components/
│   ├── add-memory-modal.tsx  # Node creation modal, Nominatim geocoding & canvas compressor
│   ├── boot-sequence.tsx     # Intro animation (Spidey drop, emblem bloom, welcome text)
│   ├── letter-modal.tsx      # Retro birthday letter modal (HAPPY BIRTHDAY)
│   ├── memory-modal.tsx      # Memory node details & 2-step delete confirmation
│   ├── passcode-gate.tsx     # 8-bit keypad passcode gate (code: 2692006)
│   ├── pin-card.tsx          # Legacy info window component
│   ├── pin-marker.tsx        # Map pin markers (Orca, Bunny, Spidey, Pixel Circle Letter)
│   ├── radar.tsx             # Radar scan animation & distance tracker
│   └── tracker-map.tsx       # Google Maps integration
├── lib/
│   ├── sound.ts              # Audio engine & background music (oh-yeah.mp3)
│   ├── storage.ts            # Local storage preferences helpers
│   ├── supabase.ts           # Supabase client & DB query functions
│   └── tracker.ts            # Pin types & helper utilities
├── public/
│   ├── assets/               # Transparent pixel sprites (symbol-orca.png, letter-transparent.png, etc.)
│   └── sounds/               # Audio assets (oh-yeah.mp3, jingle.mp3, pin-click.mp3)
└── .env.local                # Local Supabase credentials
```

---

## 🛠️ Common Operations & Developer Commands

### Run Dev Server Locally
```bash
npm run dev
```
> **Local Dev URL (Includes `basePath`):**  
> 🔗 `http://localhost:3000/spidey-bday` (or `http://<network-ip>:3000/spidey-bday`)  
> *Note: Next.js uses `basePath: "/spidey-bday"` in `next.config.ts` for GitHub Pages routing.*

### Build & Validate Production Bundle
```bash
npm run build
```

### Deploy to GitHub Pages (When User Prompts "deploy")
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

---

## 📝 Notes & Roadmap for Next Session

1. **Audio Notes / Voice Messages:** Potential feature to record/attach 8-bit audio voice messages to memory nodes.
2. **Category / Country Filtering:** Option to filter nodes on the map by country or memory category.
3. **Admin Controls:** Quick button in settings to clear or export custom memories.
