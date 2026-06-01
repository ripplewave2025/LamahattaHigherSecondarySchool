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
