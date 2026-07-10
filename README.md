# Lamahatta Higher Secondary School

**Live site:** [lamahattahighschool.in](https://lamahattahighschool.in)  
**Repo:** [github.com/ripplewave2025/LamahattaHigherSecondarySchool](https://github.com/ripplewave2025/LamahattaHigherSecondarySchool)

> Rooted in the hills. Ready for the future.

A bilingual (English / नेपाली), institutional website for **Lamahatta Higher Secondary School** (UDISE: `19013001402`) — a government-sponsored co-educational school in the Darjeeling hills serving Classes V–XII since 1964.

This is a **pro-bono alumni project**. It is also intentionally designed as a **template and bridge**: something other underserved schools can fork, brand, and grow into a simple school operating layer — notices, contact, gallery, alumni, and (next) data + automation.

---

## Why this exists

Many schools in the hills (and across India) invent every day — culture, discipline, care, community — but still drown in **paperwork, scattered WhatsApp notices, and missing public presence**.

This website is the first brick:

| Today | Tomorrow |
| --- | --- |
| A beautiful public face for families & alumni | A reusable open school site kit |
| Notices the office can publish without a developer | Attendance, circulars, and parent updates that write themselves |
| Contact / inquiry form that actually stores data | Google for Education + NEP-aligned workflows |
| English + Nepali for the community that lives here | Students as inventors; teachers as validators |

The long arc (see [ROADMAP.md](./ROADMAP.md)):

1. **Presence** — every school online with dignity  
2. **Data** — Google Workspace for Education so records stop living only on paper  
3. **Automation** — boring tasks (notices, forms, directories) handled by simple tools  
4. **Invention** — NEP 2020 spirit: students pick real questions; AI helps execute; humans keep values  
5. **Bridge** — Lamahatta as the first node; other schools join the same open pattern  

Related experiment: [aiforstudents.online](https://aiforstudents.online)

---

## Quick start (build this yourself)

```bash
git clone https://github.com/ripplewave2025/LamahattaHigherSecondarySchool.git
cd LamahattaHigherSecondarySchool
npm install
npm run dev
```

Open **http://localhost:5173**

```bash
npm run build     # production build → ./dist
npm run preview   # preview the built site
```

### Requirements

- Node.js 18+ (20+ recommended)
- npm 9+

### Deploy on Vercel (what this site uses)

1. Import the GitHub repo into [Vercel](https://vercel.com)
2. Framework preset: **Vite** (see `vercel.json`)
3. Create a **Blob** store and connect it to the project
4. Set environment variables (Production + Preview):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Shared office password for the notices admin |
| `SESSION_SECRET` | Long random string for signed session cookies (`openssl rand -base64 32`) |
| `BLOB_READ_WRITE_TOKEN` | Usually auto-injected when Blob is connected |

5. Point your domain (e.g. `yourschool.in`) at the Vercel project  
6. Push to `main` → auto-deploy

Template env file: [`.env.example`](./.env.example)

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Vanilla HTML + CSS tokens + light JS | Fast, teachable, low lock-in for schools |
| Build | Vite (multi-page) | Simple multi-HTML institutional sites |
| Motion | GSAP + ScrollTrigger | Tasteful; respects `prefers-reduced-motion` |
| Icons | Lucide (bundled) | No CDN dependency |
| Hosting | Vercel | Free tier friendly; static + serverless |
| Storage | Vercel Blob | Notices & inquiries without a full database |
| Auth | Shared password + HMAC httpOnly cookie | Office-usable; no OAuth required on day one |
| Languages | EN + नेपाली via `js/translations.js` | Community-first |

---

## Project structure

```text
lamahatta-hss/
├── index.html, about.html, headmaster.html, academics.html, ...
├── admin.html                 # Staff-only notice manager (noindex)
├── css/                       # base, layout, components, hero, pages
├── js/
│   ├── main.js                # nav, language, GSAP, icons, admin entry
│   ├── translations.js        # full EN + नेपाली dictionary
│   ├── notices-page.js        # public notices (live + static fallback)
│   ├── admin-page.js          # login + upload + CRUD
│   └── gallery-*.js
├── api/                       # Vercel serverless functions
│   ├── notices.js
│   ├── login.js
│   ├── blob-upload.js
│   ├── contact.js
│   └── inquiries.js
├── server/                    # auth + blob helpers
├── public/                    # Photos, logo, robots, sitemap, 404, PWA manifest
├── vercel.json
├── vite.config.js
├── ROADMAP.md                 # where this is going
└── README.md                  # you are here
```

---

## Site map (public)

| Page | Purpose |
| --- | --- |
| Home | Hero, stats, campus story, gallery preview |
| About | History (1964 → 1969 → 2000), values |
| HM's Message | Headmaster welcome |
| Academics | WBBSE V–X, WBCHSE XI–XII Arts |
| Admissions | Process + documents (footer / deep link) |
| Faculty | Departments (directory placeholders until real data) |
| Notices | Live board from Blob + graceful fallback |
| Gallery | Filterable campus life photos |
| Alumni | Legacy + ways to give back |
| Contact | Real inquiry form → `/api/contact` |

---

## Notices admin (school office)

The public never needs to know this exists. Staff can open it from any public page:

**Desktop**

- `Ctrl + Shift + A` (Windows/Linux) or `Cmd + Shift + A` (Mac)
- Konami sequence: ↑ ↑ ↓ ↓ ← → ← → B A

**Phone**

- Long-press the crest (~1.8s)
- Triple-tap the logo
- Tap the footer UDISE line 5 times quickly
- Shake the device (bonus)

Then sign in with the password set in Vercel (`ADMIN_PASSWORD`).

**Local tip:** `npm run dev` uses a safe **dev bypass** so you can exercise the dashboard without real secrets. For the real login + Blob path locally, use `vercel dev`.

> Never commit real passwords. Rotate `ADMIN_PASSWORD` and `SESSION_SECRET` in Vercel if they were ever shared in chat or docs.

---

## Contact / inquiries

The form on `/contact.html`:

1. POSTs to `/api/contact`
2. Stores JSON under the Blob prefix `inquiries/`
3. Falls back to `mailto:` if the API is down
4. Protected listing available later via `/api/inquiries` (admin cookie)

---

## Design notes

- **Maroon / mist** palette matched to school identity
- **Sticky header** + early collapse breakpoint so long menus never overflow
- **Hero slideshow** with legible type on bright campus photos
- **Bilingual toggle** persisted in `localStorage`
- Static assets live in `public/` so Vite copies them to `dist/` (fixes Vercel 404s for gallery paths)

### Content placeholders (intentional)

Until the school supplies final data:

- Faculty full staff directory  
- Alumni register  
- Headmaster portrait (replace placeholder)

---

## Fork this for another school

You can treat this repo as a **starter kit**:

1. Fork / clone  
2. Replace school name, UDISE, address, phone, email in HTML + `js/translations.js`  
3. Swap `public/assets/logo/` and `public/Photos/`  
4. Update `public/sitemap.xml`, `robots.txt`, and JSON-LD on `index.html`  
5. Deploy on Vercel with your own domain + Blob store  
6. Set strong `ADMIN_PASSWORD` / `SESSION_SECRET`  

Keep the structure. Change the story. Share improvements back via PR so the next hill school starts further ahead.

---

## Contributing

We welcome:

- Accessibility and mobile fixes  
- Nepali copy improvements from native speakers  
- Photo optimization / new gallery categories  
- Safer admin UX  
- Google Workspace / education automation prototypes (see roadmap)  
- Docs for non-developer school staff  

```bash
# branch → change → test → PR
git checkout -b fix/your-change
npm run dev
npm run build
```

Please do **not** open PRs that include secrets, production credentials, or private student data.

---

## Roadmap (short)

Full story → **[ROADMAP.md](./ROADMAP.md)**

| Phase | Focus |
| --- | --- |
| **0 — Live** | Site online at lamahattahighschool.in ✅ |
| **1 — Reliable office** | Notices + inquiries the staff trust |
| **2 — Data foundation** | Google for Education, shared drives, simple schemas |
| **3 — Automate the boring** | Forms → sheets → notices; less typing |
| **4 — NEP inventors** | Student projects, peer review, teacher as validator |
| **5 — Multi-school bridge** | Template + playbook other underserved schools can run |

---

## Credits

Built with care by an **alumnus** for Lamahatta Higher Secondary School and the wider community of schools that deserve the same digital dignity.

All content respects the school’s official identity and the people it serves.

For code or deployment questions: open a GitHub issue on this repository.

---

**Status:** Ready for the school office to publish real notices. Ready for other builders to fork. Pointing toward a future where a student in Lamahatta invents something a classroom in Kenya needs — and the tools get out of the way.
