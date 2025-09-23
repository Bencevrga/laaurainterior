// /src/scripts/messenger-deeplink.js
(function () {
  const btn = document.getElementById('btn-messenger');
  if (!btn) return;

  // Saját azonosítók
  const pageUsername = 'laaurainteriors'; // ← cseréld a sajátodra
  const pageId = '123456789012345';       // ← opcionális: numerikus Page ID, ha van

  // App deep link (ha tudod a Page ID-t, használhatod ezt is):
  // const appLink = `fb-messenger://user-thread/${pageId}`;
  // Sok esetben a sima m.me link appban is megpróbál nyílni:
  const appLink = `fb-messenger://share/?link=https%3A%2F%2Fm.me%2F${pageUsername}`;

  // Web fallback
  const webLink = `https://m.me/${pageUsername}`;

  btn.addEventListener('click', () => {
    // próbáljuk megnyitni az appot; ha nem megy, pár száz ms múlva fallback
    const now = Date.now();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appLink;
    document.body.appendChild(iframe);

    setTimeout(() => {
      // ha nem startolt el az app (tipikus böngésző viselkedés), megyünk webre
      if (Date.now() - now < 1600) {
        window.open(webLink, '_blank', 'noopener');
      }
      // takarítás
      setTimeout(() => iframe.remove(), 1000);
    }, 1200);
  });
})();
