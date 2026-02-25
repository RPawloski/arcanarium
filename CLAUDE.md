# Arcanarium — Claude Instructions

## What This Project Is
arcanarium.me is a personal web app hosting site. It's a Vite + React single-page application deployed on Netlify. The landing page lists available apps; each app lives at a `/path` route.

## Stack
- Vite + React (functional components, hooks)
- React Router for routing
- Inline styles throughout (no CSS framework, no Tailwind)
- Netlify for hosting (auto-deploys on push to main)
- Domain: arcanarium.me (DNS managed by Netlify)

## Project Structure
```
src/
├── pages/
│   ├── Landing.jsx              # Landing page at /
│   └── calculator/
│       ├── Calculator.jsx       # 8-minute rule calculator at /calculator
│       └── logic/
│           ├── calculate.js     # Core billing math (exported functions)
│           └── calculate.test.js # Vitest tests — 13 passing
├── App.jsx                      # Router — add new routes here
├── index.css                    # Global styles + Google Fonts import
└── main.jsx                     # Entry point (don't touch)
```

## Adding a New App
1. Create `src/pages/your-app/YourApp.jsx`
2. Add a route in `App.jsx`: `<Route path="/your-app" element={<YourApp />} />`
3. Add an entry to the `APPS` array in `Landing.jsx` with id, name, glyph, description, path, and accent colors

## Design System
- Background: `#07090f`
- Timed/tech accent: `#38bdf8` (cyan)
- Magic accent: `#a78bfa` (violet)
- Results/success: `#34d399` (green)
- Fonts: Cinzel (headings), DM Sans (body), JetBrains Mono (numbers/code)
- All styling is inline — keep that consistent, don't introduce CSS modules or Tailwind

## Dev Commands
```bash
npm run dev      # local preview at localhost:5173
npm run build    # production build to dist/
npm test         # run Vitest test suite
git push         # triggers auto-deploy on Netlify
```

## Key Files
- `netlify.toml` — SPA fallback redirect (required for routing to work on Netlify)
- `src/pages/Landing.jsx` — APPS array controls what shows on the landing page

## User Context
Ryan is a physical therapist, not a professional developer. Keep explanations plain. No assumed coding knowledge.
