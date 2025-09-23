export default function initTopbar() {
  const topBar = document.querySelector('.top-bar');
  if (!topBar) return;
  const onScroll = () => {
    if (window.scrollY > 10) topBar.classList.add('scrolled');
    else topBar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
