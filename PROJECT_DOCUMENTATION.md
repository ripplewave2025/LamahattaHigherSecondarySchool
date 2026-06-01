# Lamahatta Higher Secondary School — Project Documentation

This documentation provides a comprehensive record of the technical optimizations, structural consolidation, design enhancements, and architectural features implemented for the **Lamahatta Higher Secondary School** website.

---

## 1. Project Overview & Institutional Identity
* **Official School Name (English)**: Lamahatta Higher Secondary School
* **Official School Name (Nepali)**: लामाहट्टा उच्च माध्यमिक विद्यालय
* **UDISE Code**: 19013001402
* **Primary Contact Email**: `headmaster@lamahattahighschool.in`
* **Established**: 1964 (Primary) | 1969 (Class X) | 2000 (Higher Secondary)
* **Affiliations**: West Bengal Board of Secondary Education (WBBSE) for Classes V–X | West Bengal Council of Higher Secondary Education (WBCHSE) for Classes XI–XII Arts

---

## 2. Directory Consolidation & Repository Cleanup
* **The Issue**: Originally, the workspace contained three duplicate copies of the project (an outer working copy, a nested git repository under `LamahattaHighSchool/LamahattaHighSchool_repo_20260404/`, and multiple generated `dist/` folders). This structure was highly error-prone, caused changes in the working copy to drift from what was being pushed, and led to Vercel deployment failures.
* **The Solution**:
  * Consolidated all files into a single, clean project directory: `lamahatta-hss/`.
  * Preserved the active `.git` repository, linking it directly to the remote GitHub repository: `https://github.com/ripplewave2025/LamahattaHigherSecondarySchool.git`.
  * Kept `node_modules/` and build directories ignored under `.gitignore`.
  * Verified that local building (`npm run build`) runs cleanly without references to redundant directories.

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
  * Re-verified the translation system in `js/main.js` which iterates through all DOM elements possessing a `data-i18n` attribute to swap content dynamically when the language toggle is clicked.
* **Translation Dictionary Expansion**:
  * Expanded `js/translations.js` with comprehensive English and Nepali translations for all **9 planned institutional pages**.
  * Hand-crafted realistic content for:
    * **Home** (`index.html`)
    * **About Profile** (`about.html`)
    * **Headmaster's Message** (`headmaster.html`)
    * **Academics** (`academics.html`)
    * **Admissions** (`admissions.html`)
    * **Faculty** (`faculty.html`)
    * **Notices** (`notices.html`)
    * **Gallery** (`gallery.html`)
    * **Contact Us** (`contact.html`)

---

## 8. Navigation & Footer Synchronization
* **Header Synchronization**:
  * Updated the navigation header in `index.html` to display all 9 institutional pages.
  * Standardized the CTA button to direct inquiries to the official Headmaster email: `headmaster@lamahattahighschool.in`.
* **Footer Standarization**:
  * Updated the footer block in `index.html` to reference **Lamahatta Higher Secondary School**.
  * Synchronized the navigation link list, contact block, and meta strip to display correct UDISE records, email, and telephone contacts.

---

## 9. Current Project Structure
The consolidated project directory `lamahatta-hss/` is structured as follows:

```text
lamahatta-hss/
├─ .git/                        # Active local Git repository
├─ .gitignore                   # Ignores node_modules/ and dist/
├─ package.json                 # Project dependencies & build scripts
├─ package-lock.json
├─ vite.config.js               # ES module Vite builder configuration
├─ index.html                   # Main landing page (Header, Hero, Stats, Story, Spotlight, Footer)
├─ gallery.html                 # Media gallery page (Filters, dynamic lightbox)
├─ DEVELOPMENT_LOG.md           # Step-by-step developer log
├─ PROJECT_DOCUMENTATION.md     # This comprehensive documentation file
├─ css/
│  ├─ base.css                  # Core CSS variables, typography, and utility classes
│  ├─ layout.css                # Grid & layout configurations
│  ├─ components.css            # Navigation, buttons, cards, and modal components
│  └─ hero.css                  # Hero layout, animations, and slideshow styles
├─ js/
│  ├─ main.js                   # Navigation toggle, language switcher, GSAP animations
│  ├─ translations.js           # Extended parallel English & Nepali translations
│  ├─ gallery-data.js           # Metadata arrays for all gallery assets
│  └─ gallery-page.js           # Dynamic gallery rendering, filtering, and lightbox logic
└─ public/                      # Static assets copied directly to build outputs
   ├─ assets/
   │  └─ logo/
   │     └─ school-crest-banner.jpg
   └─ Photos/                   # All school, student, and campus photographs
```

---

## 10. Future Milestones & Next Steps
1. **Upgrade Gallery Layout**: Sync `gallery.html` header navigation and footer blocks to match the new 9-page institutional framework.
2. **Build Out 7 Dedicated Pages**: Create the remaining 7 HTML pages utilizing the base styling templates (`css/base.css`, `css/layout.css`, `css/components.css`) and binding them to the dynamic `js/main.js` script for automatic bilingual rendering:
   * `about.html` (School timelines, establishment milestones, timings grid)
   * `headmaster.html` (Headmaster's message block, portrait frame)
   * `academics.html` (Course selections, timings, future vision banner)
   * `admissions.html` (Application steps, necessary checklist documents)
   * `faculty.html` (Staff departments and directories)
   * `notices.html` (Printable schedules, bulletins)
   * `contact.html` (Inquiry form, office operational hours, maps)
3. **Verify Build Stability**: Execute `npm run build` locally to confirm all entrypoints compile flawlessly.
4. **Push & Deploy**: Commit files and push changes to `origin/main` to trigger Vercel's automated redeployment.
