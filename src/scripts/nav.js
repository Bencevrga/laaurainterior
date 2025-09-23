export default function initNav() {
  if (window.matchMedia('(min-width: 1024px)').matches) return;

  const sideNav = document.getElementById('sideNav');
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
    // NINCS: document.body.style.overflow = 'hidden';
    // NINCS overlay – így a háttér görgethető marad
  }

  function closeMenu() {
    if (!open) return;
    open = false;
    sideNav.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    // ha korábbi verzióból maradt overlay, biztos ami biztos:
    document.getElementById('side-nav-overlay')?.remove();
    // NINCS: document.body.style.overflow = '';
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
  sideNav.querySelectorAll('.side-link').forEach((el) =>
    el.addEventListener('click', closeMenu)
  );

  // ESC → zár
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') closeMenu();
    },
    { passive: true }
  );

  // bárhová kattintás a panelen és a hamburgereken kívül → zár
  document.addEventListener('click', (e) => {
    if (!open) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(sideNav) && !path.includes(menuIcon)) closeMenu();
  });
}

// /src/scripts/nav-scroll.js
(() => {
  function smoothTo(target) {
    const header = document.querySelector('.top-bar');
    const headerH = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function handleClick(e) {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;               // nincs hash → hagyjuk
    const hash = href.slice(hashIndex + 1);     // pl. 'services'
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;                        // másik oldal hash-e → hagyjuk

    // saját oldalbeli hash link → mi kezeljük
    e.preventDefault();
    smoothTo(target);

    // URL tisztítása: ne maradjon #services stb.
    history.replaceState(null, '', window.location.pathname);

    // side-nav becsukása (ha nyitva volt)
    const sideNav = document.querySelector('.side-nav');
    if (sideNav && sideNav.classList.contains('active')) {
      sideNav.classList.remove('active');
    }
  }

  function run() {
    // Delegált eseménykezelő: működik a .main-nav és .side-nav linkekre is,
    // plusz később dinamikusan bekerülő linkekre is.
    document.addEventListener('click', handleClick, { passive: false });

    // Ha valaki hash-sel érkezik (pl. /#contact), scroll + hash takarítás
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        // instant pozicionálás a fixed header miatt
        const header = document.querySelector('.top-bar');
        const headerH = header ? header.offsetHeight : 0;
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - headerH);
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
document.querySelectorAll('a[href="/"]').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
