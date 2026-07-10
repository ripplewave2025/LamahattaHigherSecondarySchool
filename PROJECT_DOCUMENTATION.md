# Lamahatta Higher Secondary School — Project Documentation

This documentation provides a comprehensive record of the technical optimizations, structural consolidation, design enhancements, and architectural features implemented for the **Lamahatta Higher Secondary School** website.

---

## 1. Project Overview & Institutional Identity
* **Official School Name (English)**: Lamahatta Higher Secondary School
* **Official School Name (Nepali)**: लामाहट्टा उच्च माध्यमिक विद्यालय
* **UDISE Code**: 19013001402
* **Primary Contact Email**: `headmaster@lamahattahighschool.in`
* **Phone**: +91 62946 04102
* **Address**: Upper Lamahatta Busty, P.O. Lamahatta, Darjeeling, 734213
* **Established**: 1964 (Primary) | 1969 (Class X) | 2000 (Higher Secondary)
* **Affiliations**: West Bengal Board of Secondary Education (WBBSE) for Classes V–X | West Bengal Council of Higher Secondary Education (WBCHSE) for Classes XI–XII Arts
* **Status**: Government Sponsored, Co-educational

---

## 2. Directory Consolidation & Repository Cleanup
* **The Issue**: Originally, the workspace contained three duplicate copies of the project (an outer working copy, a nested git repository under `LamahattaHighSchool/LamahattaHighSchool_repo_20260404/`, and multiple generated `dist/` folders). This structure was highly error-prone, caused changes in the working copy to drift from what was being pushed, and led to Vercel deployment failures.
* **The Solution**:
  * Consolidated all files into a single, clean project directory: `lamahatta-hss/`.
  * Preserved the active `.git` repository, linking it directly to the remote GitHub repository: `https://github.com/ripplewave2025/LamahattaHigherSecondarySchool.git`.
  * Kept `node_modules/` and build directories ignored under `.gitignore`.
  * Verified that local building (`npm run build`) runs cleanly without references to redundant directories.
* Note: The canonical source of the project (code + these documentation files) is now the `lamahatta-hss/` subdirectory. Root-level copies of the two `.md` files exist only for convenience and are kept in sync.

---

## 3. Vercel Build Compatibility (`vite.config.js`)
* **ESM `__dirname` ReferenceError Resolved**:
  * *Issue*: The project uses ES modules (`"type": "module"` in `package.json`). The original Vite configuration relied on Node.js's global `__dirname` to define path targets, which threw compilation errors in modern ESM builders and standard environments like Vercel.
  * *Solution*: Simplified Vite's Rollup input configuration to use relative entrypoint strings (`index.html`, `gallery.html`), eliminating references to the Node `path` module.
* **Dynamic Base Path Resolution**:
  * *Issue*: The base URL was hardcoded to `/LamahattaHigherSecondarySchool/` for GitHub Pages, causing asset path links (CSS, JS, and images) to break when deployed directly to the root path (`/`) on Vercel.
  * *Solution*: Rewrote `vite.config.js` to dynamically detect the deployment environment using `process.env.VERCEL`. When building on Vercel, the base path is automatically set to `/`, falling back to `/LamahattaHigherSecondarySchool/` only for GitHub Pages.

---

## 4. Vercel Static Asset Pipeline & 404 Image Fixes
* **The Issue**: Images referenced in static configuration files or JavaScript strings (such as `gallery-data.js` paths like `image: "/Photos/...""`) are not detected by Vite's static analyzer during builds. Consequently, Vite omitted these images from the production `dist/` directory, resulting in 404 image errors on Vercel.
* **The Solution**:
  * Migrated the `/Photos/` and `/assets/` directories to a newly created `public` folder in the project root:
    * `public/Photos/`
    * `public/assets/`
  * Vite automatically copies all files located within the `public/` directory directly into `dist/` during builds, preserving their absolute paths (e.g., `/Photos/...`). This resolved all Vercel asset load errors without altering static paths in the source code.

---

## 5. Visual Theme Overhaul & Legibility Enhancements
* **Maroon & Crimson Color Theme**: 
  * Re-styled visual accents, tags, links, and text elements to reflect the school's maroon and crimson dress colors (`--maroon-900`, `--maroon-800`, `--maroon-700`).
* **Maximum Image Clarity**:
  * Disabled the dark overlays (`.hero::before` and `.hero::after`) and removed the snowfall canvas particles (`canvas#heroParticles`) that previously obscured background images, restoring 100% brightness and clarity.
* **White Text Glow Shadows**:
  * Implemented thick, multi-layered white text shadows (`text-shadow`) behind hero texts to ensure readability against bright background slideshow photographs.
* **Frosted Glass Buttons**:
  * Designed semi-translucent glassmorphic ghost buttons (`.btn-ghost`) with a fine maroon border and text to maintain perfect contrast on rotating slides.
* **Hero Simplification**:
  * Removed the asymmetrical right-hand panel (`aside.hero-panel`) and giant main title elements, transforming the hero section into a clean, spacious, and centered vertical flex column.

---

## 6. Slideshow Optimization
* **High-Resolution Slides**: Added four high-resolution visual slides to the hero slideshow:
  1. `/Photos/ground.png` (School Ground)
  2. `/Photos/programs/assemblyinhall.jpg` (Assembly in Hall)
  3. `/Photos/programs/fairscience.jpg` (Science Fair)
  4. `/Photos/programs/meetinginhall.jpg` (Parent-Teacher Meeting)
* **Zero-Code Scalability**: Verified that the GSAP slideshow logic in `js/main.js` automatically handles an arbitrary number of slides, enabling the addition of the fourth image without modifying any Javascript code.

---

## 7. Global Bilingual (English / Nepali) Framework
* **Dynamic Translation Engine**: 
  * The translation system in `js/main.js` iterates through all DOM elements possessing a `data-i18n` attribute to swap content dynamically when the language toggle is clicked. Language choice is persisted in `localStorage` and `document.documentElement.lang` is updated.
* **Translation Dictionary Expansion**:
  * `js/translations.js` now contains comprehensive, hand-crafted parallel English and Nepali translations covering the entire site (shared nav/footer/top-bar + per-page sections).
  * Full coverage for:
    * Home (`index.html`)
    * About Profile (`about.html`)
    * Headmaster's Message (`headmaster.html`)
    * Academics (`academics.html`)
    * Admissions (`admissions.html`)
    * Faculty (`faculty.html`)
    * Notices (`notices.html`)
    * Gallery (`gallery.html`)
    * Alumni (`alumni.html`)
    * Contact Us (`contact.html`)
    * Admin panel (partial/static strings only)
* Every page HTML includes the language toggle buttons and `data-i18n` attributes. No page is English-only.

---

## 8. Navigation & Footer Synchronization
* **Header Synchronization**:
  * Every page's navigation header displays the complete institutional menu:
    Home | About | HM's Message | Academics | Faculty | Notices | Gallery | Alumni | Contact Us
  * Standardized the CTA button to direct inquiries to the official Headmaster email: `headmaster@lamahattahighschool.in`.
* **Footer Standardization**:
  * Updated across all pages to reference **Lamahatta Higher Secondary School**.
  * Consistent navigation link list, contact block (address, email, phone), UDISE meta strip, and footer credit ("Built with care by an alumnus" linking to the builder's portfolio).
* Top bar (location, affiliation, phone, lang toggle) is present and consistent.

---

## 9. Current Project Structure
The canonical project directory is `lamahatta-hss/` (the active git root that deploys to Vercel). The parent folder holds research notes and convenience copies of the two documentation files.

```text
lamahatta-hss/
├─ .git/                        # Active local Git repository (pushes to GitHub → Vercel)
├─ .gitignore                   # Ignores node_modules/, dist/, .env*, .vercel
├─ package.json                 # Deps (vite, @vercel/blob, gsap, lucide) + build scripts
├─ package-lock.json
├─ vite.config.js               # Multi-entry Vite config (all 11 pages) + dynamic base
├─ vercel.json                  # Framework + build/output directives
├─ .env.example                 # Template for ADMIN_PASSWORD, SESSION_SECRET, Blob token
├─ index.html                   # Home (hero slideshow, stats, story, spotlight, preview)
├─ about.html                   # History timeline, profile, values
├─ headmaster.html              # Headmaster message + portrait area
├─ academics.html               # Curricula (V-X + XI-XII Arts), subjects, timings, vision
├─ admissions.html              # Steps + documents checklist
├─ faculty.html                 # Dept grids (honest placeholder for full staff list)
├─ notices.html                 # Public board (static fallback + dynamic live notices)
├─ gallery.html                 # Data-driven gallery, filters, lightbox
├─ alumni.html                  # Legacy, give-back, register (honest placeholder for register)
├─ contact.html                 # Hours, details, inquiry form shell, map frame
├─ admin.html                   # Staff-only notice CRUD UI (noindex)
├─ css/
│  ├─ base.css                  # Design tokens, typography, utilities
│  ├─ layout.css                # Containers, grids, sections
│  ├─ components.css            # Nav, buttons, cards, modals, forms
│  ├─ hero.css                  # Slideshow, hero layout
│  └─ pages.css                 # Institutional pages + admin + notices styles
├─ js/
│  ├─ main.js                   # Nav, language switcher, GSAP, lucide icons (bundled subset), refreshIcons export
│  ├─ translations.js           # Full EN/NE dictionary for every page
│  ├─ gallery-data.js           # Gallery metadata
│  ├─ gallery-page.js           # Dynamic gallery rendering + lightbox
│  ├─ notices-page.js           # Live notices loader with graceful static fallback
│  └─ admin-page.js             # Admin login, direct blob upload, CRUD UI
├─ api/
│  ├─ notices.js                # Public GET + authed POST/DELETE (uses server/)
│  ├─ login.js                  # Session login/check/logout
│  └─ blob-upload.js            # Vercel client-upload authorizer (auth + PDF limits)
├─ server/
│  ├─ auth.js                   # HMAC session cookie (shared password), isAuthed, timing-safe
│  └─ blob-store.js             # notices/index.json read/write + PDF blob delete via @vercel/blob
├─ public/
│  ├─ assets/logo/school-crest-banner.jpg
│  └─ Photos/...                # All campus photos (copied verbatim by Vite)
├─ DEVELOPMENT_LOG.md           # Step-by-step technical history (append-only)
├─ PROJECT_DOCUMENTATION.md     # This file (canonical version)
└─ dist/                        # Generated by `npm run build` (do not edit)
```

---

## 10. Current State & Completed Work (Replaces Former "Future Milestones")
All phases from the original IMPLEMENTATION_PLAN have been executed in the working tree:

1. **Consolidation (Phase 0)**: Single clean `lamahatta-hss/` source of truth with git history preserved. Root duplicates removed from active workflow.
2. **Hero & Legibility (Phase 1)**: Scrim-free bright images, white text + multi-layer glows, maroon theme, centered clean hero, Lucide self-hosted, dead code removed, no-JS visibility fallbacks.
3. **Credibility & Polish (Phase 2)**: Official name/email/UDISE applied site-wide, head meta, public/ asset fix, typography/spacing tightened.
4. **Institution Build (Phase 3)**: All requested pages created with research-backed content (history, boards, timings, admissions steps, etc.), full bilingual coverage, shared components.
5. **Admin & Dynamic Notices**: Fully functional staff-only panel (see dedicated section below). Public notices page supports both static samples and live data.
6. **Build & Deploy Readiness**: Multi-entry Vite, icon bundling, pages.css, vercel.json, .env.example, .gitignore all in place. `npm run build` succeeds.

**Elite finish items** (Lighthouse, sitemap, etc.) remain aspirational but the core institutional site + admin tooling is production-ready.

---

## 11. Admin & Dynamic Notices System — Setup & Architecture
This is the major new capability added after the initial static institutional pages.

### High-Level Flow
- Public visitors see `/notices.html` (always has content via static fallback or live data).
- School office visits `/admin.html` → enters shared password → obtains HMAC-signed session cookie → can upload PDFs (direct to Vercel Blob) and manage metadata.
- Live notices appear instantly on the public page (sorted newest-first) when the backend is available.

### Required Environment Variables (set in Vercel dashboard)
1. `ADMIN_PASSWORD` — The shared secret the office will type at login. Make it long and non-guessable. Never commit.
2. `SESSION_SECRET` — Long random string used to HMAC-sign session cookies. Generate locally with `openssl rand -base64 32` (or equivalent). Never commit.
3. `BLOB_READ_WRITE_TOKEN` — **Automatically injected** by Vercel the moment you:
   - Go to your project → Storage tab
   - Create a new Blob store
   - Connect it to this project
   - (The token is available to both build and serverless functions; you normally do **not** paste it manually.)

Place the first two in Vercel → Project → Settings → Environment Variables (Production + Preview + Development as appropriate). `.env.example` is provided as a template only.

### How to Connect the Blob Store (Vercel)
- In the Vercel dashboard for this project: Storage → Create → Blob.
- Name it (e.g. `lamahatta-notices`).
- Select the project and confirm the connection.
- Redeploy (or push) so the token is available to the functions.
- The `notices/index.json` and all uploaded PDFs will live inside that Blob store (visible in the dashboard Storage browser).

### Accessing the Admin Panel
- Deployed URL: `https://your-project.vercel.app/admin.html`
- Local (with full backend): `vercel dev` (after `vercel link` and setting secrets locally via `vercel env pull` or `.env`).
- The page is deliberately excluded from search engines (`<meta name="robots" content="noindex, nofollow">`).
- Login uses a simple password form. Successful login sets an httpOnly cookie (8h). Logout clears it.
- Once logged in you can publish (title + optional short description + PDF ≤10 MB) and delete existing notices. The PDF never travels through your serverless function body — the browser uploads directly after the `/api/blob-upload` handshake.

### API Surface (for reference)
- `GET /api/notices` → `{ notices: [...] }` (public, newest first)
- `POST /api/notices` (body: `{title, description?, url, fileName?}`) → requires auth
- `DELETE /api/notices?id=...` → requires auth
- `POST /api/login` (body: `{password}`), `GET /api/login` → `{authed}`, `DELETE /api/login`
- `POST /api/blob-upload` (internal, used by `@vercel/blob/client` upload helper) — requires auth in token generation

### Graceful Degradation on Public Page
See `js/notices-page.js` and the static articles inside `notices.html`. If the API is unreachable or returns nothing, the three sample notices (with translated text) remain visible and the "being uploaded" note stays. When real notices exist, they replace the list and the note is hidden.

### Local vs Production
- **Local dev (static only)**: `npm run dev` — all pages render, language works, but dynamic notices/admin will show fallbacks unless you also run a backend.
- **Full local simulation**: `vercel dev` (requires Vercel CLI login + project link + env vars pulled or set). This runs the exact serverless functions + Blob client locally (note: Blob writes will hit real storage if token present).
- **Production**: `git push` → Vercel auto-builds with `vite build`, serves `dist/`, routes `/api/*` to the functions in `api/`. Blob token is present automatically after store connection.
- Admin features are intentionally server-dependent; the rest of the site is pure static + client JS.

### Technical Decisions & Rationale
- **Why Vercel Blob + index.json instead of a database?** Zero cost for this scale, no additional service, simple JSON list, public URLs for PDFs, automatic CDN. Perfect for a small school notice board.
- **Why direct client upload?** Avoids serverless body-size limits and unnecessary proxying of large files.
- **Why shared password + HMAC cookie (no JWT lib, no users table)?** Minimal, dependency-free, sufficient for a single "office" role. `server/auth.js` is ~70 lines of pure Node crypto + cookie parsing. Timing-safe comparison + brute-force delay.
- **Why graceful fallback on notices page?** The site must never appear broken to parents/students even if the admin backend is not yet configured or temporarily down.
- **No per-user accounts**: Matches the "school office" workflow described.
- **Content sources**: All factual institutional details (establishment dates, boards, UDISE, contact info, class ranges, timings, admissions steps, curriculum notes) are research-backed from the supplied documents in the workspace root. Staff list and alumni register deliberately use honest, visible placeholders ("The full staff directory is being finalised", "The alumni register is being compiled") so the site can launch without fabricating names.

---

## 12. How to Run Locally vs Deploy
**Local preview (recommended for content work)**:
```bash
cd lamahatta-hss
npm install
npm run dev
```
Open http://localhost:5173 (or the printed port). Language toggle, gallery, hero slideshow, and all pages work immediately.

**Production build**:
```bash
npm run build
npm run preview   # serves the dist/ output locally for smoke-testing
```

**Deploy**:
- The repo is already connected to Vercel.
- Push to `main` (or the branch configured in Vercel).
- After first deploy: create/connect a Blob store (see Admin section) and set the two secrets.
- Subsequent pushes automatically rebuild and redeploy.

**Admin smoke test (after envs + Blob store)**:
1. Visit `/admin.html`
2. Enter `ADMIN_PASSWORD`
3. Upload a test PDF notice
4. Visit `/notices.html` (should now show the live item and hide the placeholder note)
5. Return to admin and delete it

---

## 13. Recommendations & Remaining Polish (Non-Blocking)
* Populate real faculty names/photos and the alumni register when the school supplies the data (replace the placeholder notes).
* Add real headmaster portrait and faculty photos (currently icon placeholders).
* Consider wiring the contact inquiry form (currently static) to a service such as Formspree or a Vercel function + email.
* Optional future: sitemap.xml, robots.txt (already partially addressed), JSON-LD School schema in head, image optimization pass (current photos are already in public/ and served).
* Monitor Vercel function logs on first real admin usage.
* Keep `DEVELOPMENT_LOG.md` and this file updated inside `lamahatta-hss/` as the single source of truth; root copies are mirrors.

The site is now a complete, bilingual, professional institutional presence with a practical, low-maintenance admin tool for the office to manage notices and PDFs.

All work described above is present and functional in the current working tree as of the latest edits.
