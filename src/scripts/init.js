import initTopbar from './topbar-scroll.js';
import initNav from './nav.js';
import initAccordion from './services-accordion.js';
import initSwiper from './lazy-swiper.js';
import initContact from './contact-form.js';


(() => {
  const topBar = document.querySelector('.top-bar');
  if (!topBar) return;

  const SHRINK_AT = 10; // px
  const onScroll = () => {
    if (window.scrollY > SHRINK_AT) {
      topBar.setAttribute('data-shrink', '1');
    } else {
      topBar.removeAttribute('data-shrink');
    }
  };

  // induláskor is állapotba tesszük
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


