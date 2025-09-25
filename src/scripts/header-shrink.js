// src/scripts/header-shrink.js

function initHeaderShrink() {
  const topBar = document.querySelector('.top-bar');
  if (!topBar) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      topBar.classList.add('scrolled');           // régi CSS-hez
      topBar.setAttribute('data-shrink', '1');    // új CSS-hez
    } else {
      topBar.classList.remove('scrolled');
      topBar.removeAttribute('data-shrink');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// 🔹 Öninicializálás a böngészőben
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderShrink);
  } else {
    initHeaderShrink();
  }
}

export default initHeaderShrink;
