// /src/scripts/nav.js
if (!window.__la_nav_boot) {
  window.__la_nav_boot = true;

  const qs  = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  function mountNav() {
  const sideNav = document.querySelector('.side-nav');
  const topBar  = document.querySelector('.top-bar');
  const toggles = [
    document.querySelector('#menuIcon'),
    document.querySelector('.menu-icon'),
    ...Array.from(document.querySelectorAll('[data-menu-toggle]'))
  ].filter(Boolean);

  if (!sideNav || !topBar || toggles.length === 0) return;

  let overlay = null;

  const ensureOverlay = () => {
    if (overlay && document.body.contains(overlay)) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'side-overlay';
    overlay.addEventListener('click', close, { passive: true });
    document.body.appendChild(overlay);
    return overlay;
  };

  const removeOverlay = () => {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
  };

  const syncPaddingTop = () => {
    const h = Math.round(topBar.getBoundingClientRect().height || 0);
    sideNav.style.paddingTop = `${h}px`;
  };

  const open = () => {
    // topbar magassághoz igazítjuk a side-nav belső tetejét
    syncPaddingTop();

    document.documentElement.classList.add('nav-open');
    sideNav.classList.add('is-open');
    sideNav.setAttribute('aria-hidden', 'false');

    ensureOverlay();
    requestAnimationFrame(() => {
      overlay && overlay.classList.add('visible');
    });

    // görgetés tiltása a háttéren
    document.body.style.overflow = 'hidden';

    toggles.forEach(t => t.setAttribute('aria-expanded', 'true'));
  };

  const close = () => {
    document.documentElement.classList.remove('nav-open');
    sideNav.classList.remove('is-open');
    sideNav.setAttribute('aria-hidden', 'true');

    overlay && overlay.classList.remove('visible');
    // animáció után eltávolítjuk
    setTimeout(removeOverlay, 220);

    document.body.style.overflow = '';
    sideNav.style.paddingTop = '';

    toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  };

  const toggle = (e) => {
    e?.preventDefault?.();
    if (sideNav.classList.contains('is-open')) close();
    else open();
  };

  // események
  toggles.forEach(btn => btn.addEventListener('click', toggle));
  sideNav.querySelector('.close-btn')?.addEventListener('click', (e) => {
    e.preventDefault(); close();
  });
  sideNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideNav.classList.contains('is-open')) close();
  });

  // ha a top-bar összemegy/nő scrollra: nyitva tartás közben is igazítsuk a padding-topot
  window.addEventListener('scroll', () => {
    if (sideNav.classList.contains('is-open')) syncPaddingTop();
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (sideNav.classList.contains('is-open')) syncPaddingTop();
  });

  console.log('[nav] mounted');
}


  const boot = () => {
    mountNav();
    document.addEventListener('astro:page-load', () => mountNav());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
