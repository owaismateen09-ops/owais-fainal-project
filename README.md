# Flow AI Studio — Professional AI Image & Video SaaS Platform

**Flow AI Studio** is a unified, production-oriented creative platform enabling users to generate high-fidelity AI imagery, animate videos, and perform non-destructive photo and video edits in a single modern web application.

![Flow AI Studio Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

- **AI Image Generation**: Multi-aspect ratio selection (1:1, 16:9, 9:16, 4:3), prompt presets, negative prompts, and preview lightbox.
- **AI Video Generation**: Text-to-Video and Image-to-Video synthesis with motion controls.
- **In-Browser Photo Editor**: Non-destructive canvas editing: crop, rotate, flip, zoom, brightness, contrast, saturation, sepia, invert, and undo/redo history.
- **In-Browser Video Editor**: HTML5 timeline trimmer with start/end markers, customizable text overlays, playback rate, and audio muting.
- **My Creations Library**: Persistent storage with search, filters (Images/Videos/Edited), renaming, and secure deletion.
- **Free Quota Ledger**: 20 image generation credits and 3 video generation credits provided upon registration with atomic balance checks.
- **Multi-Tier Role Governance**: Secure User, Admin, and Super Admin dashboards with system health metrics and audit logs.
- **Dark Futuristic Design**: Deep obsidian and navy palettes, subtle glassmorphic glow effects, and responsive mobile-first navigation.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase credentials (or test in interactive local sandbox mode):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Run Automated Tests
```bash
npm run test
```

### 6. Build for Production
```bash
npm run build
```

---

## 📚 Complete Documentation

- [Entity Relationship Diagram (ERD)](docs/ERD.md)
- [Final Project Academic & Technical Report](docs/FINAL_PROJECT_REPORT.md)
- [Final 10-Slide Presentation](docs/PRESENTATION.md)
- [AI Provider Setup & Architecture](docs/AI_PROVIDER_SETUP.md)
- [Netlify & Supabase Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

---

## 🛡️ License

Academic Project — Created by Owais for Final Project Evaluation.
