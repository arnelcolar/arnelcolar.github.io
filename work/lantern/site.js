/* Lantern — scroll choreography. Reads scroll, writes CSS vars. No dependencies. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = () => innerWidth > 760;
  const fx = !reduce && wide();
  root.classList.toggle('fx', fx);
  root.classList.toggle('no-fx', !fx);

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const out = (t) => 1 - Math.pow(1 - t, 3);

  /* ---- split headings into words that rise ---- */
  const splitTargets = [...document.querySelectorAll('[data-split]')];
  const split = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part.trim()) return frag.appendChild(document.createTextNode(' '));
            const w = document.createElement('span');
            w.className = 'w';
            const i = document.createElement('i');
            i.textContent = part;
            w.appendChild(i);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
      });
    };
    walk(el);
    [...el.querySelectorAll('.w')].forEach((w, k) => w.style.setProperty('--d', k * 50));
  };
  splitTargets.forEach(split);

  /* ---- reveals ---- */
  if (fx) {
    document.querySelectorAll('.head .lede, .spec, .col, .card, .price, .node, .nope-wrap, .faq-head, .faq-cta, .gallery .shot, .stays .head .lede, .install .head .lede, .join-copy .eyebrow, .book')
      .forEach((el) => { if (!el.hasAttribute('data-split')) el.setAttribute('data-reveal', ''); });
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
  document.querySelectorAll('[data-split], [data-reveal], .compare, .route').forEach((el) => io.observe(el));

  /* ---- number counter ---- */
  const counter = document.querySelector('[data-count]');
  const ghost = document.querySelector('.counter .ghost');
  if (counter) {
    counter.textContent = fx ? counter.dataset.from : counter.dataset.count;
    counter._v = fx ? +counter.dataset.from : +counter.dataset.count;
  }

  /* ---- chapter indicator ---- */
  const chapter = document.querySelector('.chapter');
  const bar = document.querySelector('.progress span');
  const scenes = [...document.querySelectorAll('[data-scene]')];

  /* ---- per-frame ---- */
  const hero = document.querySelector('.hero');
  const apps = document.querySelector('.apps');
  const cost = document.querySelector('.cost');
  const screens = [...document.querySelectorAll('.tour .screen')];
  const tourItems = [...document.querySelectorAll('.tour-list li')];
  const films = [];

  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${clamp01(scrollY / Math.max(1, docH))})`;

    if (fx && hero) {
      const r = hero.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh));
      hero.style.setProperty('--t-intro', (1 - smooth(0.1, 0.34, p)).toFixed(3));
      hero.style.setProperty('--t-intro-d', smooth(0, 0.4, p).toFixed(3));
      const fade = 1 - smooth(0.46, 0.62, p);
      hero.style.setProperty('--t-copy', (smooth(0.22, 0.36, p) * fade).toFixed(3));
      hero.style.setProperty('--t-strip', (smooth(0.34, 0.48, p) * fade).toFixed(3));
      hero.style.setProperty('--t-shot', out(smooth(0.58, 0.9, p)).toFixed(3));
    }

    if (fx && apps) {
      const r = apps.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh));
      apps.style.setProperty('--t-a', out(smooth(0.06, 0.44, p)).toFixed(3));
    }

    const t = document.querySelector('.tour');
    if (t && screens.length) {
      const r = t.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh));
      const i = Math.min(screens.length - 1, Math.floor(p * screens.length * 0.999));
      screens.forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('past', k < i); });
      tourItems.forEach((s, k) => s.classList.toggle('on', k === i));
    }

    if (fx && cost && counter) {
      const r = cost.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - vh));
      const t = out(smooth(0.18, 0.72, p));
      const from = +counter.dataset.from, to = +counter.dataset.count;
      const value = Math.round(from + (to - from) * t);
      if (value !== counter._v) { counter._v = value; counter.textContent = value; }
      if (ghost) ghost.style.setProperty('--tg', String(Math.max(0, 1 - t * 1.15)));
    }

    // chapter label
    if (chapter) {
      let cur = scenes[0];
      for (const s of scenes) if (s.getBoundingClientRect().top <= vh * 0.5) cur = s;
      if (cur._c !== cur.dataset.chapter) {
        cur._c = cur.dataset.chapter;
        chapter.querySelector('b').textContent = cur.dataset.chapter;
        chapter.querySelector('span').textContent = cur.dataset.label;
        const i = chapter.querySelector('i');
        if (i) i.textContent = cur.dataset.chapter + ' / 06';
      }
    }
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { root.classList.toggle('fx', !reduce && wide()); onScroll(); });
  frame();

  /* ---- pointer tilt on the big shots ---- */
  if (!reduce) {
    document.querySelectorAll('.shot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1100px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
        el.style.transition = 'transform .1s linear';
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
      });
    });
  }

  /* ---- zoom ---- */
  const zoom = document.querySelector('.zoom');
  if (zoom) {
    document.querySelectorAll('.shot').forEach((fig) => {
      fig.style.cursor = 'zoom-in';
      fig.addEventListener('click', () => {
        const inside = fig.querySelector('.ui, img');
        if (!inside) return;
        zoom.innerHTML = '';
        const clone = inside.cloneNode(true);
        clone.removeAttribute('style');
        const close = document.createElement('form');
        close.method = 'dialog';
        close.innerHTML = '<button class="zoom-close" aria-label="Close">×</button>';
        zoom.append(clone, close);
        zoom.showModal();
      });
    });
  }

  /* ---- reserve button feedback (no checkout wired yet) ---- */
  document.querySelectorAll('.book .btn').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = document.querySelector('.book-msg');
      if (msg) msg.textContent = 'Checkout is not connected on this demo. In production this opens Stripe.';
    });
  });
})();
