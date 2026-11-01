# Krish · Portfolio

Interactive retro-desk portfolio: BIOS boot → 3D office desk (three.js) → a live Win9x-style "Krish OS" on the monitor.

```bash
npm install
npm run dev      # http://localhost:5173  (OS alone: /os.html)
npm run build    # outputs dist/ (static, deploy anywhere e.g. Vercel)
```

## Editing content
All text, links, projects, skills, awards etc. live in **`src/data/portfolio.ts`**.
- Project links: `projects[].links.github / .live` (empty string = hidden). BACK2U has none yet.
- Socials: `socials.github / .linkedin`.
- Résumé: replace `public/resume/Krish_Resume.pdf` (used by every View/Download link via `profile.resume`). Rename the folder/file if you want to bust CDN caches, and update `profile.resume`.

## Structure
- `index.html` + `src/outer/`: boot screen, HUD, sounds (synthesised), 3D scene (`scene/models.ts` is the desk, built in code, with no model files).
- `os.html` + `src/os/`: the desktop OS (windows, taskbar, start menu) and the Showcase site (`showcase/pages/*`).
