// src/scripts/accordion.js
export function initAccordion() {
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
