// src/scripts/messenger-deeplink.js

/**
 * Messenger deeplink inicializáló
 * @param {Object} opts
 * @param {string} opts.buttonSelector - gomb szelektor (alap: #btn-messenger)
 * @param {string} opts.pageUsername   - m.me felhasználónév
 * @param {string|null} opts.pageId    - opcionális numerikus Page ID (ha tudod)
 * @param {number} opts.fallbackDelay  - ms, ami után webes fallbackre váltunk
 */
export function initMessengerDeeplink(opts = {}) {
  const {
    buttonSelector = '#btn-messenger',
    pageUsername   = 'laaurainteriors',   // <-- ÁLLÍTSD SAJÁTodra
    pageId         = null,                // pl. '123456789012345'
    fallbackDelay  = 1200,
  } = opts;

  const btn = document.querySelector(buttonSelector);
  if (!btn) return;

  // App deeplink
  // Ha van pageId-d: const appLink = `fb-messenger://user-thread/${pageId}`;
  const appLink = pageId
    ? `fb-messenger://user-thread/${pageId}`
    : `fb-messenger://share/?link=${encodeURIComponent(`https://m.me/${pageUsername}`)}`;

  // Web fallback
  const webLink = `https://m.me/${pageUsername}`;

  // Kattintásra próbáljuk az appot, különben fallback
  btn.addEventListener('click', () => {
    // Láthatóság figyelés: ha app nyílik és az oldal háttérbe kerül, töröljük a fallbacket
    const onVisibility = () => {
      if (document.hidden) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    document.addEventListener('visibilitychange', onVisibility, { once: true });

    // Fallback időzítő
    const timer = setTimeout(() => {
      // ha nem váltott appra, nyissuk a webet
      window.open(webLink, '_blank', 'noopener');
    }, fallbackDelay);

    // App megnyitási kísérlet (user gesture-ben)
    // iOS/Android böngészők ezt preferálják az iframe helyett
    try {
      window.location.href = appLink;
    } catch {
      // ha exception lenne, az időzítő elintézi a fallbacket
    }
  });
}

/* 🔹 Öninicializálás csak böngészőben */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initMessengerDeeplink(), { once: true });
  } else {
    initMessengerDeeplink();
  }
}

export default initMessengerDeeplink;
