// projects.js – modal + galéria (animáció + swipe/drag + auto-play)
export default function initProjects() {
  const grid  = document.querySelector('.projects-grid');
  const modal = document.getElementById('project-modal');
  if (!grid || !modal || modal.dataset.inited === '1') return;
  modal.dataset.inited = '1';

  const titleEl = modal.querySelector('#pm-title');
  const descEl  = modal.querySelector('#pm-desc');
  const imgEl   = modal.querySelector('#pm-image');
  const dotsEl  = modal.querySelector('.pm-dots');
  const prevBtn = modal.querySelector('.pm-prev');
  const nextBtn = modal.querySelector('.pm-next');
  const stage   = modal.querySelector('.pm-stage');

  let current   = { title:'', long:'', images:[], index:0 };
  let animating = false;

  // --- Autoplay ---
  let autoTimer   = null;
  let resumeTimer = null;
  const AUTO_MS   = 3000;
  const RESUME_MS = 5000;

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => next(), AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function pauseAndScheduleResume() {
    stopAuto();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => startAuto(), RESUME_MS);
  }

  // --- Render ---
  function renderImage(dir = 0) {
    if (!current.images.length) return;
    const nextSrc = current.images[current.index];
    const nextAlt = `${current.title} – ${current.index + 1}/${current.images.length}`;

    if (dir === 0) {
      imgEl.src = nextSrc;
      imgEl.alt = nextAlt;
      updateDots();
      return;
    }

    if (animating) return;
    animating = true;

    imgEl.classList.remove('in-left','in-right','out-left','out-right');
    void imgEl.offsetWidth;
    imgEl.classList.add(dir === 1 ? 'out-left' : 'out-right');

    setTimeout(() => {
      imgEl.classList.remove('out-left','out-right');
      imgEl.src = nextSrc;
      imgEl.alt = nextAlt;
      void imgEl.offsetWidth;
      imgEl.classList.add(dir === 1 ? 'in-right' : 'in-left');
      updateDots();

      setTimeout(() => {
        imgEl.classList.remove('in-left','in-right');
        animating = false;
      }, 420);
    }, 200);
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    current.images.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pm-dot' + (i === current.index ? ' active' : '');
      b.addEventListener('click', () => {
        if (animating || i === current.index) return;
        const dir = i > current.index ? 1 : -1;
        current.index = i;
        renderImage(dir);
        pauseAndScheduleResume();
      });
      dotsEl.appendChild(b);
    });
  }

  // --- Modal open/close ---
  function openModalFromCard(card) {
    const images = JSON.parse(card.dataset.images || '[]');
    const title  = card.dataset.title || 'Project';
    const long   = card.dataset.long  || '';
    if (!images.length) return;

    current = { title, long, images, index: 0 };
    titleEl.textContent = title;
    descEl.textContent  = long;

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    renderImage(0);
    startAuto(); // autoplay indulás mindig
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    imgEl.src = '';
    if (dotsEl) dotsEl.innerHTML = '';
    stopAuto();
    if (resumeTimer) clearTimeout(resumeTimer);
  }

  function next() {
    if (animating || !current.images.length) return;
    current.index = (current.index + 1) % current.images.length;
    renderImage(1);
  }
  function prev() {
    if (animating || !current.images.length) return;
    current.index = (current.index - 1 + current.images.length) % current.images.length;
    renderImage(-1);
  }

  // --- Events ---
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (card) openModalFromCard(card);
  });

  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === '1' || e.target.classList.contains('pm-close')) {
      closeModal();
    }
  });

  nextBtn?.addEventListener('click', () => { next(); pauseAndScheduleResume(); });
  prevBtn?.addEventListener('click', () => { prev(); pauseAndScheduleResume(); });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') { next(); pauseAndScheduleResume(); }
    if (e.key === 'ArrowLeft')  { prev(); pauseAndScheduleResume(); }
  });

  // Swipe/drag
  let isDown = false, startX = 0, dx = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (animating) return;
    isDown = true; startX = e.clientX; dx = 0;
    stage.setPointerCapture(e.pointerId);
    pauseAndScheduleResume();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!isDown || animating) return;
    dx = e.clientX - startX;
    imgEl.style.transform = `translateX(${dx}px)`;
    imgEl.style.opacity = String(Math.max(0.5, 1 - Math.abs(dx)/300));
  });
  function endPointer(e) {
    if (!isDown) return; isDown = false;
    try { stage.releasePointerCapture(e.pointerId); } catch {}
    const TH = 60;
    if (dx < -TH) next();
    else if (dx > TH) prev();
    imgEl.style.transition = 'transform .25s, opacity .25s';
    imgEl.style.transform = ''; imgEl.style.opacity = '1';
    setTimeout(()=> imgEl.style.transition='', 300);
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  imgEl.addEventListener('dragstart', e => e.preventDefault());
}
