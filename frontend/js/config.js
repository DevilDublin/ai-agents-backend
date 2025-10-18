(function () {
  const PRESETS = [
    { a: 155, b: 315, name: 'Neon Mint + Magenta' },
    { a: 210, b: 40,  name: 'Electric Blue + Orange' },
    { a: 265, b: 320, name: 'Ultraviolet + Hot Pink' },
    { a: 140, b: 200, name: 'Aqua + Sky' },
    { a: 55,  b: 330, name: 'Lime + Fuchsia' },
    { a: 285, b: 35,  name: 'Royal Violet + Peach' },
    { a: 175, b: 55,  name: 'Teal + Neon Lemon' },
    { a: 195, b: 345, name: 'Cyan + Raspberry' },
    { a: 20,  b: 200, name: 'Sunset + Azure' },
    { a: 95,  b: 285, name: 'Neon Green + Purple' }
  ];
  const KEY = 'zypher-dual-index';
  const AUTO = 'zypher-dual-auto';

  let idx = parseInt(localStorage.getItem(KEY) || '0', 10) % PRESETS.length;
  let autoplay = localStorage.getItem(AUTO) === '1';

  const root = document.documentElement;
  const toggle = () => document.getElementById('colorToggle');

  function apply({ a, b }) {
    root.style.setProperty('--accentA', `hsl(${a},100%,70%)`);
    root.style.setProperty('--accentB', `hsl(${b},100%,70%)`);
    root.style.setProperty('--glowA', `hsla(${a},100%,70%,.45)`);
    root.style.setProperty('--glowB', `hsla(${b},100%,70%,.45)`);
    const t = toggle();
    if (t) t.style.background = `linear-gradient(135deg,hsl(${a},100%,70%),hsl(${b},100%,70%))`;
  }

  function select(i) {
    idx = (i + PRESETS.length) % PRESETS.length;
    localStorage.setItem(KEY, String(idx));
    apply(PRESETS[idx]);
  }

  function autoTick() {
    if (!autoplay) return;
    const p = PRESETS[idx];
    p.a = (p.a + 0.6) % 360;
    p.b = (p.b + 0.9) % 360;
    apply(p);
    requestAnimationFrame(autoTick);
  }

  function buildPalette() {
    const t = toggle();
    if (!t || t.querySelector('.palette')) return;
    const pop = document.createElement('div');
    pop.className = 'palette';
    PRESETS.forEach((p, i) => {
      const s = document.createElement('button');
      s.className = 'swatch';
      s.style.background = `linear-gradient(135deg,hsl(${p.a},100%,70%),hsl(${p.b},100%,70%))`;
      s.title = p.name;
      s.onclick = (e) => { e.stopPropagation(); autoplay = false; localStorage.setItem(AUTO,'0'); select(i); pop.remove(); };
      pop.appendChild(s);
    });
    t.appendChild(pop);
    const close = (e) => { if (!t.contains(e.target)) pop.remove(); document.removeEventListener('click', close); };
    setTimeout(() => document.addEventListener('click', close), 0);
  }

  function init() {
    apply(PRESETS[idx]);
    const t = toggle();
    if (!t) return;

    t.addEventListener('click', (e) => { e.preventDefault(); buildPalette(); });
    t.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      autoplay = !autoplay; localStorage.setItem(AUTO, autoplay ? '1' : '0');
      if (autoplay) requestAnimationFrame(autoTick);
    });

    if (autoplay) requestAnimationFrame(autoTick);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
(function () {
  const PRESETS = [
    { a: 155, b: 315, name: 'Neon Mint + Magenta' },
    { a: 210, b: 40,  name: 'Electric Blue + Orange' },
    { a: 265, b: 320, name: 'Ultraviolet + Hot Pink' },
    { a: 140, b: 200, name: 'Aqua + Sky' },
    { a: 55,  b: 330, name: 'Lime + Fuchsia' },
    { a: 285, b: 35,  name: 'Royal Violet + Peach' },
    { a: 175, b: 55,  name: 'Teal + Neon Lemon' },
    { a: 195, b: 345, name: 'Cyan + Raspberry' },
    { a: 20,  b: 200, name: 'Sunset + Azure' },
    { a: 95,  b: 285, name: 'Neon Green + Purple' }
  ];
  const KEY = 'zypher-dual-index';
  const AUTO = 'zypher-dual-auto';

  let idx = parseInt(localStorage.getItem(KEY) || '0', 10) % PRESETS.length;
  let autoplay = localStorage.getItem(AUTO) === '1';

  const root = document.documentElement;
  const toggle = () => document.getElementById('colorToggle');

  function apply({ a, b }) {
    root.style.setProperty('--accentA', `hsl(${a},100%,70%)`);
    root.style.setProperty('--accentB', `hsl(${b},100%,70%)`);
    root.style.setProperty('--glowA', `hsla(${a},100%,70%,.45)`);
    root.style.setProperty('--glowB', `hsla(${b},100%,70%,.45)`);
    const t = toggle();
    if (t) t.style.background = `linear-gradient(135deg,hsl(${a},100%,70%),hsl(${b},100%,70%))`;
  }

  function select(i) {
    idx = (i + PRESETS.length) % PRESETS.length;
    localStorage.setItem(KEY, String(idx));
    apply(PRESETS[idx]);
  }

  function autoTick() {
    if (!autoplay) return;
    const p = PRESETS[idx];
    p.a = (p.a + 0.6) % 360;
    p.b = (p.b + 0.9) % 360;
    apply(p);
    requestAnimationFrame(autoTick);
  }

  function buildPalette() {
    const t = toggle();
    if (!t || t.querySelector('.palette')) return;
    const pop = document.createElement('div');
    pop.className = 'palette';
    PRESETS.forEach((p, i) => {
      const s = document.createElement('button');
      s.className = 'swatch';
      s.style.background = `linear-gradient(135deg,hsl(${p.a},100%,70%),hsl(${p.b},100%,70%))`;
      s.title = p.name;
      s.onclick = (e) => { e.stopPropagation(); autoplay = false; localStorage.setItem(AUTO,'0'); select(i); pop.remove(); };
      pop.appendChild(s);
    });
    t.appendChild(pop);
    const close = (e) => { if (!t.contains(e.target)) pop.remove(); document.removeEventListener('click', close); };
    setTimeout(() => document.addEventListener('click', close), 0);
  }

  function init() {
    apply(PRESETS[idx]);
    const t = toggle();
    if (!t) return;

    t.addEventListener('click', (e) => { e.preventDefault(); buildPalette(); });
    t.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      autoplay = !autoplay; localStorage.setItem(AUTO, autoplay ? '1' : '0');
      if (autoplay) requestAnimationFrame(autoTick);
    });

    if (autoplay) requestAnimationFrame(autoTick);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
