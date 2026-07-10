import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createIcons,
  Phone,
  Mail,
  X,
  ArrowLeft,
  ArrowRight,
  Megaphone,
  CalendarDays,
  Trophy,
  MapPin,
  Clock,
  GraduationCap,
  Landmark,
  Scroll,
  Map,
  TrendingUp,
  Briefcase,
  BookOpen,
  Mountain,
  Compass,
  Mic,
  HeartHandshake,
  Building2,
  Sparkles,
  FileText,
  Bell,
} from "lucide";
import { translations } from "./translations.js";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only the icons actually used on the site — bundled locally (no external CDN).
const lucideIcons = {
  Phone,
  Mail,
  X,
  ArrowLeft,
  ArrowRight,
  Megaphone,
  CalendarDays,
  Trophy,
  MapPin,
  Clock,
  GraduationCap,
  Landmark,
  Scroll,
  Map,
  TrendingUp,
  Briefcase,
  BookOpen,
  Mountain,
  Compass,
  Mic,
  HeartHandshake,
  Building2,
  Sparkles,
  FileText,
  Bell,
};

function refreshIcons() {
  createIcons({ icons: lucideIcons });
}

function setLanguage(lang) {
  const nextLanguage = translations[lang] ? lang : "en";
  document.documentElement.lang = nextLanguage;
  localStorage.setItem("lamahatta-language", nextLanguage);

  document.querySelectorAll(".switch-lang").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === nextLanguage);
  });

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const path = element.dataset.i18n.split(".");
    let value = translations[nextLanguage];

    path.forEach((segment) => {
      value = value?.[segment];
    });

    if (typeof value === "string") {
      element.innerHTML = value;
    }
  });
}

function initLanguage() {
  const savedLanguage = localStorage.getItem("lamahatta-language") || "en";
  setLanguage(savedLanguage);

  document.querySelectorAll(".switch-lang").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });
}

function initMobileNav() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector(".main-nav");
  const header = document.querySelector(".site-header");

  if (!toggle || !nav) {
    return;
  }

  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) {
      return;
    }
    if (header?.contains(event.target)) {
      return;
    }
    setOpen(false);
  });
}

function initHero() {
  const hero = document.querySelector(".hero");
  const layers = document.querySelectorAll(".hero-media-layer");

  if (!hero || !layers.length) {
    return;
  }

  layers[0].classList.add("is-active");

  // Respect reduced-motion: hold the first slide, no animation.
  if (prefersReducedMotion) {
    return;
  }

  gsap.set(layers[0], { opacity: 1, scale: 1.02 });

  gsap.from(".hero-copy > *", {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
  });

  let activeIndex = 0;
  window.setInterval(() => {
    const currentLayer = layers[activeIndex];
    const nextIndex = (activeIndex + 1) % layers.length;
    const nextLayer = layers[nextIndex];

    currentLayer.classList.remove("is-active");
    nextLayer.classList.add("is-active");

    gsap.to(currentLayer, {
      opacity: 0,
      scale: 1.08,
      duration: 1.6,
      ease: "power2.inOut",
    });

    gsap.fromTo(
      nextLayer,
      { opacity: 0, scale: 1.12 },
      { opacity: 1, scale: 1.02, duration: 1.8, ease: "power2.out" }
    );

    activeIndex = nextIndex;
  }, 4800);
}

function initScrollAnimations() {
  // Reduced-motion users get the content revealed immediately via CSS; skip JS animation.
  if (prefersReducedMotion) {
    return;
  }

  gsap.utils.toArray("[data-animate]").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
      },
    });
  });

  gsap.utils.toArray(".memory-tile img, .gallery-item img").forEach((image) => {
    gsap.to(image, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: image.closest(".memory-tile, .gallery-item"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/* ============================================================
   HIDDEN ADMIN ACCESS (secret triggers)
   - Computer: Ctrl/Cmd + Shift + A   OR   classic Konami code
   - Phone: Long-press the school logo/brand (1.8s)  OR  triple-tap logo (mobile)
            OR  tap the footer UDISE line 5 times quickly
            OR  shake the device (motion)
   Once triggered: shows a clean login modal (prefilled username).
   Successful login sets the httpOnly session cookie and redirects to /admin.html
   (the full admin dashboard reuses the existing auth + cookie check).
   ============================================================ */

function showSecretLoginModal() {
  let modal = document.getElementById('secret-admin-modal');
  if (modal) {
    modal.style.display = 'flex';
    const pw = modal.querySelector('#secretPassword');
    if (pw) setTimeout(() => pw.focus(), 60);
    return;
  }

  modal = document.createElement('div');
  modal.id = 'secret-admin-modal';
  modal.innerHTML = `
    <div class="modal-backdrop" aria-hidden="true"></div>
    <div class="modal-content glass-panel" role="dialog" aria-modal="true" aria-labelledby="secret-admin-title">
      <button class="modal-close" aria-label="Close admin login">×</button>
      <span class="eyebrow">Staff Only</span>
      <h2 class="card-title" id="secret-admin-title">Admin Access</h2>
      <p class="section-lead">Sign in to upload notices, PDFs and messages.</p>
      <form id="secretLoginForm" class="stack-lg" autocomplete="off">
        <div class="field">
          <label for="secretUsername">Username</label>
          <input id="secretUsername" type="email" value="admin@lamahattahighschool.in" required />
        </div>
        <div class="field">
          <label for="secretPassword">Password</label>
          <input id="secretPassword" type="password" required placeholder="Enter password" />
        </div>
        <p class="form-status" id="secretLoginStatus" role="status" aria-live="polite"></p>
        <div style="display:flex; gap:.65rem; flex-wrap:wrap;">
          <button class="btn btn-primary" type="submit" style="flex:1 1 auto;">Sign in</button>
          <button type="button" class="btn btn-secondary" id="secretCancelBtn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#secretLoginForm');
  const statusEl = modal.querySelector('#secretLoginStatus');
  const close = () => { modal.style.display = 'none'; };

  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.querySelector('#secretCancelBtn').addEventListener('click', close);
  modal.querySelector('.modal-backdrop').addEventListener('click', close);

  // ESC to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler, { once: true });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    statusEl.textContent = 'Signing in…';

    // Dev bypass for easy local testing of the admin UI (no need for vercel dev)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      statusEl.textContent = 'Dev mode — opening admin…';
      setTimeout(() => {
        window.location.href = './admin.html';
      }, 300);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: modal.querySelector('#secretUsername').value.trim(),
          password: modal.querySelector('#secretPassword').value.trim()
        })
      });
      if (res.ok) {
        statusEl.textContent = 'Success — opening admin…';
        setTimeout(() => {
          window.location.href = './admin.html';
        }, 380);
      } else {
        const data = await res.json().catch(() => ({}));
        statusEl.textContent = data.error || 'Login failed. (If running locally, use `vercel dev` or the admin page will auto-unlock in dev mode.)';
        await new Promise(r => setTimeout(r, 450));
      }
    } catch {
      statusEl.textContent = 'Network error. (Try `vercel dev` for full local API support.)';
    }
  });

  // Focus password field
  setTimeout(() => {
    const pwField = modal.querySelector('#secretPassword');
    if (pwField) pwField.focus();
  }, 80);
}

function initSecretAdminAccess() {
  // --- Desktop: Ctrl/Cmd + Shift + A  (works on all pages) ---
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'a')) {
      e.preventDefault();
      showSecretLoginModal();
    }
  });

  // --- Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) - classic trick, works with keyboard ---
  const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let kIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[kIndex]) {
      kIndex++;
      if (kIndex === konami.length) {
        kIndex = 0;
        showSecretLoginModal();
      }
    } else {
      kIndex = 0;
    }
  });

  // --- Phone / Touch tricks ---
  const logo = document.querySelector('.brand-lockup');
  if (logo) {
    // Long press on logo (works great on mobile)
    let longPressTimer = null;
    const LONG_PRESS_MS = 1750;

    const startLongPress = () => {
      clearTimeout(longPressTimer);
      longPressTimer = setTimeout(() => {
        showSecretLoginModal();
      }, LONG_PRESS_MS);
    };
    const cancelLongPress = () => clearTimeout(longPressTimer);

    logo.addEventListener('touchstart', startLongPress, { passive: true });
    logo.addEventListener('touchend', cancelLongPress);
    logo.addEventListener('touchcancel', cancelLongPress);
    logo.addEventListener('touchmove', cancelLongPress);

    // Triple tap on logo (mobile only)
    let tapCount = 0;
    let tapTimer = null;
    logo.addEventListener('click', () => {
      if (window.innerWidth > 820) return; // desktop skip
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 650);
      if (tapCount >= 3) {
        tapCount = 0;
        showSecretLoginModal();
      }
    });
  }

  // Tap the footer UDISE/meta line 5 times quickly (nice hidden trick on phone)
  const footerMeta = document.querySelector('.footer-meta');
  if (footerMeta) {
    let metaTaps = 0;
    footerMeta.addEventListener('click', () => {
      if (window.innerWidth > 820) return;
      metaTaps++;
      setTimeout(() => { metaTaps = 0; }, 1100);
      if (metaTaps >= 5) {
        metaTaps = 0;
        showSecretLoginModal();
      }
    });
  }

  // Shake device (many Androids + some iOS) - fun phone trick
  if (window.DeviceMotionEvent) {
    let shakeCount = 0;
    let lastShakeTime = 0;
    window.addEventListener('devicemotion', (ev) => {
      const acc = ev.accelerationIncludingGravity;
      if (!acc) return;
      const force = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
      if (force > 28) { // reasonably strong shake
        const now = Date.now();
        if (now - lastShakeTime > 650) {
          shakeCount++;
          lastShakeTime = now;
          if (shakeCount >= 2) {
            shakeCount = 0;
            showSecretLoginModal();
          }
        }
      }
    }, { passive: true });
  }
}

// Initialize the secret triggers on every public page
document.addEventListener("DOMContentLoaded", () => {
  refreshIcons();
  initLanguage();
  initMobileNav();
  initHero();
  initScrollAnimations();
  initSecretAdminAccess();   // <--- hidden admin entry
});

export { refreshIcons, setLanguage };
