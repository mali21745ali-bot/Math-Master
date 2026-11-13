# MATH MASTER – ریاضی کی دنیا

Complete bilingual (English LTR & Urdu RTL) 3D wooden mathematics learning and educational gaming platform covering **Nursery through Class 12 & University Level**.

## Features
- **15 Grade Levels**: Nursery, KG, Class 1–12, and University Level
- **13+ Interactive Playable Games**:
  - Addition (+), Subtraction (−), Multiplication (×), Division (÷)
  - Mixed Mathematics, Algebra & Equations, Missing Numbers, Number Sequence
  - Times Tables (1–20), Fractions, Mental Math Challenge, Mathematics Quiz
  - Memory Match Card Game
  - **3D Wooden Number Sliding Puzzle** (3×3, 4×4, and 5×5 solvable boards with move counter, timer, pause/resume, hint, restart, and victory screen)
- **10-Level Campaign per Class**: 20 tailored questions per level, 70% pass threshold to unlock next level, 1–3 golden stars, and wrong-answer review with step-by-step explanations in English & Urdu.
- **Bilingual (English & Urdu)**: Instant switching with full RTL/LTR layout adaptation.
- **Persistent Progress**: Saved locally in `localStorage` with achievements, daily challenge streak, and local leaderboard.

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deploy to Cloudflare Pages
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Package manager**: `npm` (`npm ci` and `npm run build` are synced via `package-lock.json`)
- Uses `public/_redirects` for seamless SPA routing.

## Deploy to Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Configured via `netlify.toml` and `public/_redirects` for seamless SPA routing.
