// src/scripts/lazy-swiper.js

let booted = false;

/* ---------------------------------------------
   KÉPEK KIEMELÉSE / HALVÁNYÍTÁSA PROGRESS ALAPJÁN
--------------------------------------------- */
function applyShade(sw) {
  if (!sw || !sw.slides) return;
  sw.slides.forEach((slide) => {
    slide.classList.remove(
      'pf-active','pf-near-1','pf-near-2',
      'active','near-1','near-2',
      'is-active','is-near-1','is-near-2'
    );
    const p = slide.progress; // require: watchSlidesProgress: true
    if (Math.abs(p) < 0.5) {
      slide.classList.add('pf-active','active','is-active');
    } else if (Math.abs(p) < 1.5) {
      slide.classList.add('pf-near-1','near-1','is-near-1');
    } else if (Math.abs(p) < 2.5) {
      slide.classList.add('pf-near-2','near-2','is-near-2');
    }
  });
}

/* ---------------------------------------------
   SWIPER INDÍTÁS
--------------------------------------------- */
async function start() {
  if (booted) return;

  const container =
    document.querySelector('.pf-swiper') ||
    document.querySelector('.portfolio .portfolio-swiper') ||
    document.querySelector('.portfolio-swiper') ||
    document.querySelector('.portfolio .swiper');

  if (!container) return;
  booted = true;

  // Swiper CSS betöltés
  const cssHref = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
  if (!document.querySelector(`link[rel="stylesheet"][href="${cssHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  // Swiper modul betöltés (CDN ESM)
  try {
    const { default: Swiper } = await import(
      'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'
    );

    const sw = new Swiper(container, {
      slidesPerView: 5,
      centeredSlides: true,
      spaceBetween: 16,
      loop: true,
      grabCursor: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true, // kell a progress alapú árnyaláshoz
      speed: 500,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        0:    { slidesPerView: 1, centeredSlides: true, spaceBetween: 12 },
        600:  { slidesPerView: 3, centeredSlides: true, spaceBetween: 16 },
        1024: { slidesPerView: 5, centeredSlides: true, spaceBetween: 16 },
      },
      on: {
        init(s){ applyShade(s); },
        setTranslate(s){ applyShade(s); },
        transitionEnd(s){ applyShade(s); },
        resize(s){ s.update(); applyShade(s); },
      },
    });
  } catch (e) {
    console.error('Swiper betöltési hiba:', e);
    booted = false; // engedjük újrapróbálni, ha gond volt
  }
}

/* ---------------------------------------------
   LAZY BOOT: csak kliensen, ha látszik a slider
--------------------------------------------- */
function setupObserver() {
  const target =
    document.querySelector('.pf-swiper') ||
    document.querySelector('.portfolio .portfolio-swiper') ||
    document.querySelector('.portfolio-swiper') ||
    document.querySelector('.portfolio .swiper');

  if (!target) return;

  const rect = target.getBoundingClientRect();
  if (rect.top < innerHeight && rect.bottom > 0) { start(); return; }

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); start(); }
  }, { threshold: 0.2 });
  io.observe(target);
}

/* ---------------------------------------------
   ÖNINDÍTÁS CSAK BÖNGÉSZŐBEN
--------------------------------------------- */
export function initLazySwiper() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupObserver, { once: true });
  } else {
    setupObserver();
  }
}

// csak kliensen futtassunk bármit
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initLazySwiper();
}

// default export (ha máshonnan hívnád)
export default initLazySwiper;
