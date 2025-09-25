// src/scripts/accordion.js

export function initAccordion() {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  // opcionális: ARIA alapséma
  items.forEach((item, idx) => {
    const header = item.querySelector('.service-header');
    const panel  = item.querySelector('.service-panel, .service-content');
    if (!header || !panel) return;

    const hid = header.id || `svc-h-${idx}`;
    const pid = panel.id  || `svc-p-${idx}`;
    header.id = hid;
    panel.id  = pid;

    header.setAttribute('role', 'button');
    header.setAttribute('aria-controls', pid);
    header.setAttribute('tabindex', header.getAttribute('tabindex') || '0');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', hid);

    // szinkronizáljuk a kiinduló állapotot
    const open = item.classList.contains('active');
    header.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });

  const closeOthers = (current) => {
    items.forEach(it => {
      if (it === current) return;
      it.classList.remove('active');
      const h = it.querySelector('.service-header');
      const p = it.querySelector('.service-panel, .service-content');
      if (h) h.setAttribute('aria-expanded', 'false');
      if (p) p.hidden = true;
    });
  };

  items.forEach(item => {
    const header = item.querySelector('.service-header');
    const panel  = item.querySelector('.service-panel, .service-content');
    if (!header || !panel) return;

    const toggle = () => {
      const willOpen = !item.classList.contains('active');
      closeOthers(item);
      item.classList.toggle('active', willOpen);
      header.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
    };

    header.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
      // opcionális: nyilakkal navigáció
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const headers = [...document.querySelectorAll('.service-header')];
        const i = headers.indexOf(header);
        if (i !== -1) {
          const next = headers[(i + (e.key === 'ArrowDown' ? 1 : headers.length - 1)) % headers.length];
          next?.focus();
        }
      }
    });
  });
}

/* 🔹 önindítás csak böngészőben */
export default function autoInitAccordion() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAccordion(), { once: true });
  } else {
    initAccordion();
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  autoInitAccordion();
}
