import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { translations } from "./translations.js";

gsap.registerPlugin(ScrollTrigger);

const iconFactory = window.lucide;

function refreshIcons() {
  if (iconFactory) {
    iconFactory.createIcons();
  }
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

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHero() {
  const hero = document.querySelector(".hero");
  const layers = document.querySelectorAll(".hero-media-layer");
  const particleCanvas = document.getElementById("heroParticles");

  if (!hero || !layers.length) {
    return;
  }

  gsap.set(layers[0], { opacity: 1, scale: 1.02 });
  layers[0].classList.add("is-active");

  gsap.from(".hero-copy > *", {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out"
  });

  gsap.from(".hero-panel", {
    x: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.25
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
      ease: "power2.inOut"
    });

    gsap.fromTo(
      nextLayer,
      { opacity: 0, scale: 1.12 },
      { opacity: 1, scale: 1.02, duration: 1.8, ease: "power2.out" }
    );

    activeIndex = nextIndex;
  }, 4800);

  gsap.to(".hero-mist", {
    yPercent: -8,
    xPercent: 4,
    repeat: -1,
    yoyo: true,
    duration: 8,
    ease: "sine.inOut"
  });

  if (!particleCanvas) {
    return;
  }

  const context = particleCanvas.getContext("2d");
  const particles = [];
  const particleCount = 44;

  function resizeCanvas() {
    particleCanvas.width = hero.offsetWidth;
    particleCanvas.height = hero.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: Math.random() * 0.22 + 0.08,
      alpha: Math.random() * 0.45 + 0.12
    };
  }

  resizeCanvas();

  for (let index = 0; index < particleCount; index += 1) {
    particles.push(makeParticle());
  }

  window.addEventListener("resize", resizeCanvas);

  function drawParticles() {
    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.y > particleCanvas.height + 20) {
        particle.y = -10;
        particle.x = Math.random() * particleCanvas.width;
      }

      if (particle.x < -20 || particle.x > particleCanvas.width + 20) {
        particle.x = Math.random() * particleCanvas.width;
      }

      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  gsap.ticker.add(drawParticles);
}

function initScrollAnimations() {
  gsap.utils.toArray("[data-animate]").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%"
      }
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
        scrub: true
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  refreshIcons();
  initLanguage();
  initMobileNav();
  initHero();
  initScrollAnimations();
});

export { refreshIcons, setLanguage };
