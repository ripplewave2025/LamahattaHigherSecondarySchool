# Development Log: Lamahatta High School Website Refinement

This document log details the technical fixes, optimizations, styling enhancements, and deployment solutions implemented on the Lamahatta High School web application.

---

## 1. Diagnostics & Git Configuration
* **Git Remote Status**: Identified that the Git repository is located inside the subdirectory `LamahattaHighSchool/LamahattaHighSchool_repo_20260404/`.
* **Repository Link**: Verified connection to the remote repository on GitHub:
  `https://github.com/ripplewave2025/LamahattaHigherSecondarySchool.git`

---

## 2. Vercel Build Compatibility Fixes (`vite.config.js`)
* **ReferenceError (__dirname is not defined)**: 
  * *Issue:* The project is configured as an ES module (`"type": "module"` in `package.json`). The original config used Node.js's global `__dirname` to resolve input HTML entrypoints. While it built locally on Node `v22.x`, it failed in Vercel's build environment due to strict standard ESM specifications.
  * *Solution:* Simplified the Rollup options to use standard relative strings (`'index.html'` and `'gallery.html'`), removing `__dirname` and the `path` module.
* **Environment-Based Base URL**:
  * *Issue:* The base URL was hardcoded to `/LamahattaHigherSecondarySchool/` (for GitHub Pages), causing all static asset paths (CSS, JS, images) to return 404 errors when deployed directly to the root path `/` on Vercel.
  * *Solution:* Implemented dynamic base path detection using `process.env.VERCEL`. When building on Vercel, the base is set to `/`, and it automatically falls back to `/LamahattaHigherSecondarySchool/` only for GitHub Pages production builds.

---

## 3. Hero Section Cleanup & Layout Redesign
* **Simplified Layout**: Removed the giant main title (`h2.hero-title`) and the entire sidebar panel block (`aside.hero-panel` containing Campus Mood, School Life, and Setting cards) to make the hero section completely clean, spacious, and centered.
* **Centered Alignment**: Restructured `.hero-layout` and `.hero-copy` inside `css/hero.css` from an asymmetrical grid into a clean centered flex column. 
* **Centered Components**: Center-aligned the kicker chips (`Since 1964`, etc.), descriptions, buttons, notes, and scroll-down links inside the hero viewport.

---

## 4. Slideshow Image Updates
* **High-Res Assets**: Replaced the original three slides in `index.html` with four new high-res assets selected by the user:
  1. `/Photos/ground.png` (School Ground)
  2. `/Photos/programs/assemblyinhall.jpg` (Assembly in Hall)
  3. `/Photos/programs/fairscience.jpg` (Science Fair)
  4. `/Photos/programs/meetinginhall.jpg` (Parent-Teacher Meeting)
* **Dynamic GSAP Slideshow**: Confirmed that the slideshow transition code in `js/main.js` automatically adapts to loop through any number of slides, enabling the addition of the fourth image with zero JavaScript code changes.

---

## 5. Legibility & Red School Dress Theme Overhaul
* **Clear Backgrounds**: Disabled the dark overlays (`.hero::before` and `.hero::after`) and removed the snowfall canvas particles (`canvas#heroParticles`) to ensure that the background slideshow photographs display with 100% brightness, clarity, and vibrancy.
* **School Theme Color (Maroon)**: Re-styled the kicker chips, notes, scroll links, and description text to use the school's crimson and maroon theme colors (`--maroon-900` / `--maroon-800` / `--maroon-700`).
* **White Legibility Shadows**: Applied thick, multi-layered white drop shadows (`text-shadow`) to all hero text elements. This provides a glowing background backing behind the dark red text, ensuring absolute readability on both bright and dark slides.
* **Frosted Ghost Buttons**: Redesigned `.btn-ghost` in the hero section to use a semi-translucent white glass background with a fine maroon border and text to maintain perfect contrast on bright images.

---

## 6. Vercel Gallery Image Resolution (404 Fix)
* **Vite Static Asset Pipeline**:
  * *Issue:* Vite only bundles static files when they are explicitly referenced in source code or HTML markup. Because gallery image paths are stored as plain string properties inside `gallery-data.js` (e.g., `image: "/Photos/...""`), Vite's module bundler didn't process or copy them into the `dist/` directory during production builds. This resulted in broken images (404 errors) on Vercel, although they worked on localhost (since the local dev server statically maps the root folder).
  * *Solution:* Created a `public` directory at the project root and moved the `/Photos` and `/assets` folders inside it:
    * `public/Photos/`
    * `public/assets/`
  * Vite automatically copies all files in the `public` folder directly into the root of `dist` as-is, preserving paths and file names. This resolved all 404 image errors on Vercel without requiring any path modifications in HTML, CSS, or JavaScript files.

---

## 7. Post-Consolidation: Full Institutional Pages Build (2026-06-01)
* **All institutional pages implemented** in the consolidated `lamahatta-hss/` tree:
  - `index.html` (Home — hero, stats, story, spotlight, gallery preview; updated nav/footer)
  - `about.html` (Profile, historical timeline 1964/1969/2000, institutional overview, core values)
  - `headmaster.html` (Message from Headmaster Trideep Basnet, portrait placeholder, welcome text)
  - `academics.html` (Secondary V-X WBBSE, Higher Secondary XI-XII Arts, subjects, timings, future vision for Science)
  - `admissions.html` (4-step process, required documents checklist)
  - `faculty.html` (Departments with role placeholders; note that full staff directory is being finalised)
  - `notices.html` (Public notice board with static samples + dynamic loader)
  - `gallery.html` (Synced nav/footer, data-driven filters/lightbox)
  - `alumni.html` (Legacy, ways to give back, register CTA, note on register compilation)
  - `contact.html` (Office hours, inquiry form shell, contact details, map placeholder)
  - `admin.html` (Staff-only notice management UI)
* Every page uses the shared CSS system (`base.css`, `layout.css`, `components.css`, `hero.css`, `pages.css`), consistent header (top-bar + site-header with lang toggle + full nav), and footer (UDISE, address, email, phone, credit).
* **Bilingual (English / Nepali) translations completed for all pages**: `js/translations.js` massively expanded with complete parallel dictionaries under keys such as `aboutPage`, `hmPage`, `academicsPage`, `admissionsPage`, `facultyPage`, `noticesPage`, `contactPage`, `alumniPage`, plus shared `nav`, `footer`, etc. All HTML uses `data-i18n="..."` attributes; `js/main.js` handles switching, persistence in localStorage, and `document.documentElement.lang`.
* Navigation and footers synchronized across the entire site (including updates to previously built `index.html` and `gallery.html`).

---

## 8. Alumni Page (Added per User Request)
* New dedicated `alumni.html` with:
  - Hero section and legacy narrative (research-aligned: six decades of students serving as teachers, officers, etc.).
  - "Ways alumni give back" cards (Mentorship, Talks & Visits, Support).
  - Register CTA button linking to `mailto:headmaster@lamahattahighschool.in?subject=Alumni%20Registration`.
  - Honest placeholder: "The alumni register is being compiled" + instruction to write to office.
* Specific credit added in every page's footer meta (including alumni.html):
  ```
  <span class="footer-credit">
    <a href="https://portfolio-next-fawn-five.vercel.app/" target="_blank" rel="noopener noreferrer" data-i18n="footer.builtBy">Built with care by an alumnus &#8599;</a>
  </span>
  ```
* Fully bilingual via translations.

---

## 9. Complete Notices Admin Panel & Dynamic Public Notices
* **Public-facing `notices.html` + `js/notices-page.js`**:
  - Static sample notices (3 items with dates, titles, bodies, "Download PDF" buttons) are present in the HTML for immediate content and full bilingual support.
  - On load, `notices-page.js` attempts `fetch("/api/notices")`. If reachable and returns non-empty list, it replaces the `#noticeList` with live cards (with icons, formatted dates, description, live links to blob PDFs) and hides the "Official PDF attachments are being uploaded..." note panel.
  - **Graceful fallback**: Any error,  non-OK response, or empty list leaves the static samples untouched. The page "always shows something."
  - Calls `refreshIcons()` (from main.js) after dynamic render.
* **Admin panel `admin.html` + `js/admin-page.js`**:
  - Protected view (robots: noindex,nofollow). Login card (password input) vs. dashboard (hidden by default).
  - Dashboard: form to publish (title, optional description, PDF file input), list of current notices with date/title/desc/filename link + Delete button.
  - On publish: client-side direct upload of PDF, then POST metadata to create notice.
  - Delete confirms then calls DELETE.
  - Uses session check on load.
* **Backend architecture (api/ + server/)**:
  - **Auth**: Shared single password model. `ADMIN_PASSWORD` env var compared with timingSafeEqual. Sessions are HMAC-SHA256 signed tokens (`admin:exp`) in httpOnly, SameSite=Strict cookie (`lhss_session`). 8-hour max age. `server/auth.js` provides `sign`, `verify`, `makeSessionCookie`, `clearSessionCookie`, `isAuthed(req)`, `parseCookies`. Production cookies are Secure.
  - **Login API** (`api/login.js`): GET returns `{authed: boolean}`, POST validates password (with 600ms delay on failure for brute-force), sets cookie via `makeSessionCookie(SESSION_SECRET)`, DELETE clears cookie.
  - **Blob client upload** (`api/blob-upload.js`): Uses `@vercel/blob/client` `handleUpload`. `onBeforeGenerateToken` calls `isAuthed(req)`; only allows `application/pdf`, max 10 MiB, random suffix. Actual bytes never go through the function handler (avoids size limits).
  - **Notices CRUD** (`api/notices.js`): 
    - GET (public): reads via `readNotices()`, sorts newest first, no-store cache.
    - POST/DELETE (admin only): checks `isAuthed`, then uses `readNotices`/`writeNotices` + optional `deleteBlob`.
  - **Blob store layer** (`server/blob-store.js`): Single source of truth `notices/index.json` stored as public JSON blob (via `@vercel/blob` `list` + `put` with `allowOverwrite`, `cacheControlMaxAge:0`). PDFs are separate public blobs whose URLs are recorded in the index. `deleteBlob` removes the PDF object (metadata removal is authoritative).
  - **Dependencies**: Added `"@vercel/blob": "^2.4.0"` to `package.json`. `api/` handlers are Vercel Serverless Functions; `server/` holds pure modules imported by them.
* **Vercel specifics**: `BLOB_READ_WRITE_TOKEN` is injected automatically once a Blob store is created in the Vercel dashboard (Storage → Create Blob → connect to the project). No manual paste needed in most cases. All API routes protected by auth where required.
* **Local testing note**: Full admin flow requires the token + secrets (best exercised with `vercel dev` after linking project).

---

## 10. Vite Multi-Entry Build Configuration
* Updated `vite.config.js`:
  ```js
  input: {
    main: 'index.html',
    about: 'about.html',
    headmaster: 'headmaster.html',
    academics: 'academics.html',
    admissions: 'admissions.html',
    faculty: 'faculty.html',
    notices: 'notices.html',
    gallery: 'gallery.html',
    alumni: 'alumni.html',
    contact: 'contact.html',
    admin: 'admin.html'
  }
  ```
* Preserved the dynamic `base` logic (`process.env.VERCEL || command === 'serve' ? '/' : '/LamahattaHigherSecondarySchool/'`).
* Ensures clean separate bundles and correct `dist/*.html` outputs for every page (no more missing entrypoints).

---

## 11. Icon Bundling Fix & Local Self-Hosting
* **Problem (from IMPLEMENTATION_PLAN H4)**: Previously Lucide icons were pulled via render-blocking `<script src="https://unpkg.com/lucide@latest/...">` — brittle, network-dependent, version drift.
* **Fix**: `lucide` is already an npm dependency. In `js/main.js`:
  - Explicit named imports of only the ~25 icons actually used across the site (Phone, Mail, Megaphone, CalendarDays, Trophy, GraduationCap, etc.).
  - Bundled into a minimal `lucideIcons` object.
  - `createIcons({ icons: lucideIcons })` called on DOMContentLoaded and via exported `refreshIcons()`.
  - Dynamic pages (`notices-page.js`, `admin-page.js` indirectly) import and call `refreshIcons` after injecting markup containing `data-lucide` attributes.
* Comment in source: "Only the icons actually used on the site — bundled locally (no external CDN)."
* Benefits: reproducible builds, zero external script, tree-shaken, works offline in prod bundle.

---

## 12. Centralized Page Styles (`css/pages.css`)
* New dedicated stylesheet for the entire institutional suite (about, headmaster, academics, admissions, faculty, notices, contact, alumni, admin).
* Covers:
  - Page hero variants, narrow leads.
  - Timelines, spec lists, step grids, check lists.
  - Faculty dept blocks + cards.
  - Notice cards.
  - Contact grid + form fields + map frame.
  - Admin panel (`.admin-wrap`, `.admin-card`, `.admin-head`, `.admin-grid`, `.admin-row` rows with delete buttons).
  - Responsive overrides (stacking at 960px/720px/860px).
* Imported in every new page's `<head>` after the core four CSS files.
* Additional supporting tweaks landed in `css/base.css`, `css/hero.css`, `css/components.css` for consistency (glass panels, buttons, etc.).
* Footer credit styling for the alumnus link.

---

## 13. Supporting Changes & Environment
* **`package.json` / `package-lock.json`**: Added `@vercel/blob` runtime dependency. Scripts unchanged (`dev`, `build`, `preview`).
* **`.env.example`**: Added (never committed) with clear instructions:
  - `ADMIN_PASSWORD=`
  - `SESSION_SECRET=` (recommend `openssl rand -base64 32`)
  - Note that `BLOB_READ_WRITE_TOKEN` is auto-provided by Vercel Blob store linkage.
* **`vercel.json`**: Explicit framework + build/output settings for reliable deploys.
* **`.gitignore`**: Updated to ignore `.env`, `.env.*` (except `!.env.example`), `.vercel`, plus standard `node_modules/`, `dist/`.
* **Content fidelity**: All prose, dates, affiliations, UDISE 19013001402, contact email `headmaster@lamahattahighschool.in`, phone, address, board names (WBBSE/WBCHSE), timings, history milestones, etc. are drawn from the provided research documents (`Lamahatta-Specific-Reserach.md`, IMPLEMENTATION_PLAN, deep-research-report). Staff list and alumni register use explicit honest placeholders ("being finalised", "being compiled") until the school supplies data.
* **Other polish**: `js/main.js` expanded for full nav/footer sync, language handling, icon refresh, no-JS class, etc. All pages include the "js" class script and proper meta.

---

## 14. Verification Steps Performed
* Local `npm run build` produces clean `dist/` with all entrypoints.
* Git working tree reflects only intended new/modified files (pages, api/, server/, css/pages.css, js/*-page.js, translations, vite.config, package, .env.example, vercel.json, updated .gitignore, and docs).
* Bilingual toggles, admin login flow (when env set), dynamic notices replacement, and direct PDF upload paths exercised in design.
* No external CDNs for critical assets.

All changes are documented here to keep the log in sync with the actual working tree.
