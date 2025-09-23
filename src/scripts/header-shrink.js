// Fejléc zsugorodás görgetésre – működik akár .scrolled, akár data-shrink móddal
(() => {
  const topBar = document.querySelector('.top-bar');
  if (!topBar) return;

  const onScroll = () => {
    if (window.scrollY > 10) {
      topBar.classList.add('scrolled');           // ha régi CSS erre figyel
      topBar.setAttribute('data-shrink', '1');    // ha új CSS erre figyel
    } else {
      topBar.classList.remove('scrolled');
      topBar.removeAttribute('data-shrink');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
