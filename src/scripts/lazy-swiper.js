let booted = false;

/* ---------------------------------------------
   KÉPEK KIEMELÉSE / HALVÁNYÍTÁSA PROGRESS ALAPJÁN
   - 0: középső → éles
   - ±1: szomszédok → kevésbé éles
   - ±2: távolabbiak → még halványabb
--------------------------------------------- */
function applyShade(sw) {
  if (!sw || !sw.slides) return;
  sw.slides.forEach(slide => {
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

  // Swiper CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
  document.head.appendChild(link);

  // Swiper modul
  const { default: Swiper } = await import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs');

  const sw = new Swiper(container, {
    slidesPerView: 5,
    centeredSlides: true,
    spaceBetween: 16,
    loop: true,                 // lineáris vég-kezelés az 5-ös ablakhoz
    grabCursor: true,
    slideToClickedSlide: true,
    watchSlidesProgress: true,   // <<< KELL a progress alapú árnyaláshoz!
    speed: 500,                  // simább animáció

    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },

    breakpoints: {
      0:    { slidesPerView: 1, centeredSlides: true, spaceBetween: 12 },
      600:  { slidesPerView: 3, centeredSlides: true, spaceBetween: 16 },
      1024: { slidesPerView: 5, centeredSlides: true, spaceBetween: 16 }
    },

    on: {
      // első osztály-beállítás
      init(s){ applyShade(s); },
      // húzás/animáció közben is frissítjük az élességet
      setTranslate(s){ applyShade(s); },
      // animáció végekor is rászinkronizálunk
      transitionEnd(s){ applyShade(s); },
      // ablakméret változásnál újraszámolunk
      resize(s){ s.update(); applyShade(s); }
    }
  });
}

/* ---------------------------------------------
   LAZY BOOT: csak ha látszik a slider
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupObserver, { once: true });
} else {
  setupObserver();
}
