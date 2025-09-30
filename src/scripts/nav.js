// /src/scripts/nav.js
if (!window.__la_nav_boot) {
  window.__la_nav_boot = true;

  const qs  = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ===== Side-nav Services dropdown toggle =====
(function attachSideNavDropdown(){
  const sideNav = document.querySelector('.side-nav');
  if (!sideNav) return;

  // Kattintás a "Services" gombra -> nyit/zár
  sideNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.sn-toggle');
    if (!btn) return;

    e.preventDefault();
    const item = btn.closest('.sn-item');
    const submenu = item?.querySelector('.sn-submenu');
    if (!item || !submenu) return;

    const willOpen = !item.classList.contains('open');
    // zárjuk a többi lenyílót (ha csak egy lehet nyitva)
    sideNav.querySelectorAll('.sn-item.open').forEach(it => {
      if (it !== item) {
        it.classList.remove('open');
        const sm = it.querySelector('.sn-submenu');
        if (sm) sm.hidden = true;
        const t = it.querySelector('.sn-toggle');
        if (t) t.setAttribute('aria-expanded','false');
      }
    });

    item.classList.toggle('open', willOpen);
    submenu.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
  });

  // Billentyűzet támogatás (Enter/Space)
  sideNav.addEventListener('keydown', (e) => {
    const btn = e.target.closest('.sn-toggle');
    if (!btn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();


  function mountNav() {
    const sideNav = qs('.side-nav');
    const topBar  = qs('.top-bar');
    // FONTOS: ha lehet, add hozzá a hamburger ikonhoz is: data-menu-toggle
    const toggles = [
      qs('#menuIcon'),
      qs('.menu-icon'),
      ...qsa('[data-menu-toggle]')
    ].filter(Boolean);

    if (!sideNav || toggles.length === 0) return;

    // Backdrop létrehozása, ha nincs
    let backdrop = qs('.side-nav-backdrop');
    const ensureBackdrop = () => {
      if (backdrop && document.body.contains(backdrop)) return backdrop;
      const el = document.createElement('div');
      el.className = 'side-nav-backdrop';
      document.body.appendChild(el);
      backdrop = el;
      return el;
    };

    // Igazítás a top-bar magasságához (egybemosódás)
    function syncPanelTop() {
      if (!topBar) return;
      const h = topBar.getBoundingClientRect().height || 0;
      sideNav.style.paddingTop = `${h}px`;
    }
    syncPanelTop();

    const isOpen = () => sideNav.classList.contains('is-open');

    const open = () => {
      ensureBackdrop();
      sideNav.classList.add('is-open');
      sideNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      toggles.forEach(t => t.setAttribute('aria-expanded', 'true'));
      syncPanelTop();
      backdrop.classList.add('is-visible');
    };

    const close = () => {
      sideNav.classList.remove('is-open');
      sideNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
      backdrop?.classList.remove('is-visible');
    };

    const toggle = (e) => {
      e?.preventDefault?.();
      isOpen() ? close() : open();
    };

    // Események – minden mountkor ÚJRA kötjük, de duplikáció elkerüléséhez jelölünk
    toggles.forEach(btn => {
      if (btn.dataset.boundNav === '1') return;
      btn.addEventListener('click', toggle);
      btn.dataset.boundNav = '1';
    });

    // Backdrop kattintás → zárás (delegálva, hogy új elemnél is működjön)
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('side-nav-backdrop')) {
        close();
      }
    });

    // Linkre kattintás a panelben → zárás
    sideNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });

    // ESC → zárás
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // Kezdő állapot
    sideNav.setAttribute('aria-hidden', 'true');
  }

  function boot() {
    mountNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // 🔁 Astro client-side navigáció után ÚJRA mountolunk (különben leesnek a handlerek)
  document.addEventListener('astro:page-load', () => {
    mountNav();
  });
}
