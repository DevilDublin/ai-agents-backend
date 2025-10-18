(function () {
  const PRESETS = [
    { a: 155, b: 315, name: 'Neon Mint + Magenta' },
    { a: 210, b: 40,  name: 'Electric Blue + Orange' },
    { a: 265, b: 320, name: 'Ultraviolet + Hot Pink' },
    { a: 140, b: 200, name: 'Aqua + Sky' },
    { a: 55,  b: 330, name: 'Lime + Fuchsia' }
  ];
  const KEY = 'zypher-dual-index';
  const AUTO = 'zypher-dual-auto';

  let idx = parseInt(localStorage.getItem(KEY) || '0', 10) % PRESETS.length;
  let autoplay = localStorage.getItem(AUTO) === '1';

  const root = document.documentElement;
  const toggle = () => document.getElementById('colorToggle');

  function applyPreset(i) {
    const { a, b } = PRESETS[i];
    root.style.setProperty('--accentA', `hsl(${a},100%,70%)`);
    root.style.setProperty('--accentB', `hsl(${b},100%,70%)`);
    root.style.setProperty('--glowA', `hsla(${a},100%,70%,.45)`);
    root.style.setProperty('--glowB', `hsla(${b},100%,70%,.45)`);
    const t = toggle();
    if (t) t.style.background = `linear-gradient(135deg,hsl(${a},100%,70%),hsl(${b},100%,70%))`;
  }

  function step(n=1) {
    idx = (idx + n + PRESETS.length) % PRESETS.length;
    localStorage.setItem(KEY, String(idx));
    applyPreset(idx);
  }

  function autoTick() {
    if (!autoplay) return;
    // smoothly rotate both hues
    const { a, b } = PRESETS[idx];
    PRESETS[idx] = { a: (a + 1) % 360, b: (b + 1.4) % 360, name: PRESETS[idx].name };
    applyPreset(idx);
    requestAnimationFrame(autoTick);
  }

  function init() {
    applyPreset(idx);
    const t = toggle();
    if (!t) return;

    t.title = 'Theme — click to switch, right-click to auto-cycle';
    t.addEventListener('click', (e) => { e.preventDefault(); autoplay = false; localStorage.setItem(AUTO,'0'); step(1); });
    t.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      autoplay = !autoplay;
      localStorage.setItem(AUTO, autoplay ? '1' : '0');
      if (autoplay) requestAnimationFrame(autoTick);
    });

    if (autoplay) requestAnimationFrame(autoTick);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
