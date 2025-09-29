// src/scripts/topbar-scroll.js

function smoothToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector('.top-bar');
  const h = header ? header.offsetHeight : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - h;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export default function initTopbarScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Fejléc "scrolled" állapota + hamburger shrink támogatás
const topBar = document.querySelector('.top-bar');
if (topBar) {
  const onScroll = () => {
    const shrink = window.scrollY > 10;

    // fejléc osztályozása
    if (shrink) topBar.classList.add('scrolled');
    else topBar.classList.remove('scrolled');

    // body attribútum a hamburgerhez
    if (shrink) {
      document.body.setAttribute('data-shrink', '1');
    } else {
      document.body.removeAttribute('data-shrink');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // azonnali futtatás, ha nem a tetején nyílik meg az oldal
}
  

  // 🔹 Hash-es linkek: csak akkor fogjuk meg, ha a cél ID itt is létezik
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    const i = href.indexOf('#');
    if (i === -1) return;

    const id = href.slice(i + 1).trim();
    if (!id) return;

    // Ha a cél ID megtalálható a JELENLEGI oldalon → mi intézzük a smooth scrollt
    if (document.getElementById(id)) {
      e.preventDefault();
      smoothToId(id);
      // szebb URL, hash nélkül:
      history.replaceState(null, '', window.location.pathname);
    }
    // Ha nincs ilyen elem ezen az oldalon → NEM interceptálunk,
    // a böngésző a href szerint átmegy (pl. BASE_URL#id), és érkezéskor lásd alább.
  }, { passive: false });

  // 🔹 Ha hash-sel érkezünk (pl. BASE_URL#services), smooth scroll + hash takarítás
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    if (document.getElementById(id)) {
      requestAnimationFrame(() => {
        smoothToId(id);
        history.replaceState(null, '', window.location.pathname);
      });
    }
  }
}

// önindítás
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initTopbarScroll(), { once: true });
  } else {
    initTopbarScroll();
  }
}
