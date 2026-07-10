# Roadmap — From a school website to a bridge

> *Stories are blueprints.*  
> Lamahatta, 1964 → online 2026 → inventors 2035.

This is not a feature dump. It is a **road** other people can walk with us: alumni, teachers, students, and engineers who care about underserved schools.

**Live node today:** [lamahattahighschool.in](https://lamahattahighschool.in)  
**Related:** [aiforstudents.online](https://aiforstudents.online)  
**Policy compass:** [NEP 2020](https://www.education.gov.in/nep/about-nep) — multidisciplinary learning, local context, teacher as guide, technology as enabler (not replacement of human values).

---

## North star

A student in Lamahatta picks a real question (village springs, tea-leaf chemistry, hill ecology).  
AI helps with research, drafts, and simulation.  
A teacher validates rigor and values.  
A peer classroom far away can use what they invent.

The website is the **public square**.  
Google for Education is the **data floor**.  
Automation is the **janitor**.  
Humans keep **direction, curiosity, and care**.

---

## Phase 0 — Presence (done / shipping)

**Goal:** The school has a dignified, fast, bilingual public face.

- [x] Multi-page institutional site (Home → Contact)
- [x] English / नेपाली toggle
- [x] Gallery with real campus photography
- [x] Vercel hosting + custom domain
- [x] Notices backend (Blob) + hidden admin
- [x] Contact form that stores inquiries
- [x] SEO basics (sitemap, robots, structured data, 404)
- [ ] Navbar production hardening (in this release)
- [ ] README + roadmap for open builders (in this release)
- [ ] Replace faculty / alumni / HM photo placeholders when school provides data

**Success looks like:** Parents find the school. Alumni feel proud. Staff can publish a notice without calling a developer.

---

## Phase 1 — Reliable office tools (0–3 months)

**Goal:** Paper + WhatsApp are not the only systems of record for public information.

| Work item | Why it matters |
| --- | --- |
| Office training card (1 page) for admin login + notice upload | Tools fail if only the builder knows them |
| Inquiry inbox view inside admin (list Blob inquiries) | Stop digging in the Vercel dashboard |
| Notice categories + PDF preview polish | Match how schools actually announce things |
| Password rotation checklist | Security for a shared office account |
| WhatsApp “share this notice” deep link on each notice | Meet families where they already are |

**Out of scope for Phase 1:** Full SIS, fees, or exam software.

---

## Phase 2 — Data foundation with Google for Education (1–6 months)

**Goal:** Signing up the school (or a pilot cluster) for **Google Workspace for Education** so identity, files, and forms live in one place.

Why Google first (pragmatic, not religious):

- Free / low-cost education tier for eligible institutions  
- Gmail, Drive, Forms, Classroom, Sheets teachers already recognize  
- Clean foundation for later automation and analytics  
- Aligns with “create data once, reuse everywhere”

### Concrete steps

1. **Eligibility & signup** — help headmaster / SMC with domain verification for `lamahattahighschool.in` (or school-owned domain)
2. **Account model**
   - Staff: `name@…`  
   - Optional student OUs later (privacy-first; no oversharing)
3. **Shared Drive structure**
   ```text
   /Admin
   /Academics
   /Notices-Archive
   /Gallery-Approved
   /Alumni
   /Automation
   ```
4. **Canonical sheets (simple schemas)**
   - Faculty directory  
   - Alumni register  
   - Notice log  
   - Inquiry CRM (status: new / contacted / closed)
5. **Forms that write to Sheets**
   - Contact already works on site → optionally mirror to Sheet  
   - Alumni “update my details” form  
   - Event volunteer form  

**NEP link:** Digital infrastructure for school processes so teachers spend more time on *teaching and mentoring*, less on retyping circulars.

**Success looks like:** One source of truth for staff list and notices archive; new volunteer can be onboarded with a shared Drive link, not a USB stick.

---

## Phase 3 — Automate the boring (3–9 months)

**Goal:** Repetitive work becomes a button or a nightly job.

Ideas ranked by school impact:

| Automation | Input | Output |
| --- | --- | --- |
| Notice publisher | Sheet row or Drive PDF | Live site notice via API |
| Inquiry triage | Contact form | Email/WhatsApp alert to office |
| Gallery approval | Drive folder of photos | Site gallery JSON or Blob |
| Circular → bilingual draft | Office English note | EN + नेपाली draft for human edit |
| Attendance / leave stubs | Classroom or Form | Sheet dashboard (pilot class only) |

Principles:

- **Human in the loop** for anything public or student-facing  
- **No dark patterns** with student data  
- Prefer open scripts (Apps Script, Vercel cron, small Python) that schools can own  

**Success looks like:** Headmaster says “the notice is up” without emailing the alumnus who built the site.

---

## Phase 4 — NEP inventors layer (6–18 months)

**Goal:** The school website and tools support the *spirit* of NEP 2020 — multidisciplinary, local, curiosity-driven — without pretending to replace teachers.

### Classroom loop (product sketch)

1. Student picks an **unsolved / local** question  
2. AI tools (including aiforstudents.online and later school-scoped agents) help research & prototype  
3. Teacher **validates** method, ethics, and clarity  
4. Optional **peer review** with partner schools  
5. Publish a **project card** (with consent) on the school site or a shared inventors board  

### Teacher job of the future (as design requirements)

- Validate + peer review  
- Break ideas into invention categories  
- Ingest curiosity and human values  
- Encourage risk/reward  
- Connect students with overlapping interests  

Technology should make *that* easier — not turn teachers into data entry clerks.

### Privacy & ethics

- Parental consent for any student work published  
- No training public models on private school chats without clear policy  
- Prefer local / school-controlled data where possible  

**Success looks like:** A Lamahatta project page that another school can actually use (water filter design, local history archive, language kit).

---

## Phase 5 — Multi-school bridge (12–24 months)

**Goal:** Lamahatta is the **first open node**, not the only one.

Deliverables:

1. **School Site Kit** — this repo generalized (`school-kit` template)  
2. **Playbook PDF** — “Launch your school site + Google Edu in one weekend”  
3. **Shared components** — notices schema, alumni schema, bilingual patterns  
4. **Network board** (optional) — cross-school inventions, teacher forums  
5. **Alumni superpower** — each school’s alumni can fund hosting + mentor one automation  

Fork targets: other hill schools, government-sponsored schools, any institution that invents with care and lacks digital infrastructure.

---

## How this connects to the longer imagination

From the Lamahatta 2035–2050 vision work:

- Students become **inventors**; AI does heavy lifting  
- Teachers become **validators of truth and values**  
- Parents keep **human feeling** in the loop  
- Hyper-personalized agents are a long horizon; **school systems that free time for curiosity** start now  

We do not need wormholes to ship Phase 1.  
We do need a road that does not abandon the hills.

---

## What you can build on right now

| If you are… | Start here |
| --- | --- |
| Frontend friend | Accessibility, mobile nav, photo compression |
| Nepali speaker | Review `js/translations.js` for natural phrasing |
| Teacher / office | List the top 10 weekly paperwork pains |
| Google Workspace person | Draft OU + Shared Drive plan for Phase 2 |
| AI / education person | Prototype “project card” + consent flow for Phase 4 |
| Another school | Fork the repo, open an issue with your UDISE + needs |

---

## Decision log (keep short, keep honest)

| Decision | Choice | Reason |
| --- | --- | --- |
| Stack | Vanilla + Vite | Maintainable by volunteers; no heavy CMS |
| Hosting | Vercel | Fast CDN, serverless, Blob without DB day-one |
| Auth | Shared office password | Matches real staffing; upgrade later |
| i18n | Custom dictionary | Full control for Nepali institutional tone |
| Data next | Google for Education | Ubiquitous, free tier path, Forms→Sheets |
| North star | NEP + inventor students | Policy-aligned and human-aligned |

---

## Versioning the road

- Update this file when a phase item ships or is abandoned  
- Link PRs to phase IDs (`Phase1-inquiry-inbox`)  
- Celebrate small wins publicly — schools need morale as much as code  

---

**Last updated:** 2026-07-10  
**Maintainer:** Alumni builder + open contributors  
**Invitation:** If you can make one school’s week lighter, open a PR.
