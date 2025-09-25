// src/scripts/nav.js

export default function initNav() {
  // csak mobilon legyen aktív (mint az eredetiben)
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(min-width: 1024px)').matches) return;

  const sideNav = document.getElementById('sideNav') || document.querySelector('.side-nav');
  const menuIcon =
    document.getElementById('global-menu-icon') ||
    document.querySelector('.menu-icon');

  if (!sideNav || !menuIcon) return;

  const HAMBURGER = '☰';
  menuIcon.textContent = HAMBURGER;
  menuIcon.setAttribute('aria-expanded', 'false');

  let open = false;

  function openMenu() {
    if (open) return;
    open = true;
    sideNav.classList.add('active');
    menuIcon.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!open) return;
    open = false;
    sideNav.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    document.getElementById('side-nav-overlay')?.remove();
  }
  function toggleMenu() {
    open ? closeMenu() : openMenu();
  }

  // ☰ nyit/zár
  menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // menüpontokra katt → zár
  sideNav.querySelectorAll('.side-link, a').forEach((el) =>
    el.addEventListener('click', closeMenu)
  );

  // ESC → zár
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // bárhová katt, ha nem a panel/ikon → zár
  document.addEventListener('click', (e) => {
    if (!open) return;
    const path = e.composedPath?.() ?? [];
    if (!(path.includes(sideNav) || path.includes(menuIcon))) closeMenu();
  });
}

/* önindítás csak kliensen */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initNav(), { once: true });
  } else {
    initNav();
  }
}
// src/scripts/nav-scroll.js

function basePath() {
  // Vite/Astro build ide cseréli a BASE_URL-t, Pages alatt pl. "/laaurainterior/"
  const b = (import.meta?.env?.BASE_URL ?? '/');
  // egységesítés: mindig perrel végződjön
  return b.endsWith('/') ? b : (b + '/');
}

function normalizePath(p) {
  if (!p) return '/';
  // biztosan leading slash
  if (!p.startsWith('/')) p = '/' + p;
  // duplaper-ek és trailing slash egységesítés
  return p.replace(/\/{2,}/g, '/').replace(/\/+$/, '/') || '/';
}

function smoothTo(target) {
  const header = document.querySelector('.top-bar');
  const headerH = header ? header.offsetHeight : 0;
  const y = target.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function handleDocumentClick(e) {
  const a = e.target.closest('a');
  if (!a) return;

  const href = a.getAttribute('href');
  if (!href) return;

  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return;           // nincs hash → hagyjuk

  const hash = href.slice(hashIndex + 1);
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;                    // másik oldal hash-e → hagyjuk

  // saját oldalbeli hash link → mi kezeljük
  e.preventDefault();
  smoothTo(target);

  // URL tisztítása: ne maradjon #services, stb.
  history.replaceState(null, '', window.location.pathname);

  // side-nav becsukása (ha nyitva volt)
  const sideNav = document.querySelector('.side-nav,#sideNav');
  if (sideNav && sideNav.classList.contains('active')) {
    sideNav.classList.remove('active');
  }
}

function attachRootScrollUp() {
  const BASE = normalizePath(basePath());

  document.querySelectorAll('a[href]').forEach((link) => {
    try {
      const url = new URL(link.href, window.location.origin);
      const path = normalizePath(url.pathname);

      // akkor tekintjük "kezdőlap" hivatkozásnak, ha a path == BASE
      if (path === BASE) {
        link.addEventListener('click', (e) => {
          const current = normalizePath(window.location.pathname);
          if (current === BASE) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }
    } catch {
      /* no-op invalid URL */
    }
  });
}

function run() {
  document.addEventListener('click', handleDocumentClick, { passive: false });

  // Ha hash-sel érkezett a user (pl. /#contact): scroll + hash takarítás
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      const header = document.querySelector('.top-bar');
      const headerH = header ? header.offsetHeight : 0;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - headerH);
      history.replaceState(null, '', window.location.pathname);
    }
  }

  attachRootScrollUp();
}

/* önindítás csak kliensen */
export default function initNavScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initNavScroll();
}
