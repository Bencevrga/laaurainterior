// src/scripts/main.js

import initTopbar from './topbar-scroll.js';
import initNav from './nav.js';
import initAccordion from './accordion.js';
import initSwiper from './lazy-swiper.js';
import initContact from './contact-form.js';

function initHeaderShrink() {
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
}

// 🔹 Öninicializálás csak kliensoldalon
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTopbar?.();
      initNav?.();
      initAccordion?.();
      initSwiper?.();
      initContact?.();
      initHeaderShrink();
    });
  } else {
    initTopbar?.();
    initNav?.();
    initAccordion?.();
    initSwiper?.();
    initContact?.();
    initHeaderShrink();
  }
}

// src/scripts/accordion.js
export default function initAccordion() {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  const closeOthers = (current) => {
    items.forEach(it => { if (it !== current) it.classList.remove('active'); });
  };

  items.forEach(item => {
    const header = item.querySelector('.service-header');
    if (!header) return;

    const toggle = () => {
      const willOpen = !item.classList.contains('active');
      closeOthers(item);
      item.classList.toggle('active', willOpen);
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
    });
  });
}

