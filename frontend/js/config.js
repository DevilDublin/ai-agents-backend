// Click-to-cycle neon palettes (Purple, Green, Blue, Orange, Yellow)
(function () {
  const PRESETS = [
    { a: 265, b: 325, name: 'Neon Purple + Pink' },
    { a: 140, b: 95,  name: 'Neon Green + Lime' },
    { a: 205, b: 195, name: 'Neon Blue + Cyan' },
    { a: 30,  b: 45,  name: 'Neon Orange + Peach' },
    { a: 55,  b: 50,  name: 'Neon Yellow + Gold' }
  ];
  const KEY = 'zypher-dual-index';
  let idx = parseInt(localStorage.getItem(KEY) || '0', 10) % PRESETS.length;

  const root = document.documentElement;
  const btn  = () => document.getElementById('colorToggle');

  function apply({ a, b }) {
    root.style.setProperty('--accentA', `hsl(${a},100%,70%)`);
    root.style.setProperty('--accentB', `hsl(${b},100%,70%)`);
    root.style.setProperty('--glowA', `hsla(${a},100%,70%,.45)`);
    root.style.setProperty('--glowB', `hsla(${b},100%,70%,.45)`);
    const t = btn(); if (t) t.style.background = `linear-gradient(135deg,hsl(${a},100%,70%),hsl(${b},100%,70%))`;
  }
  function next(){ idx=(idx+1)%PRESETS.length; localStorage.setItem(KEY,String(idx)); apply(PRESETS[idx]); }

  document.addEventListener('DOMContentLoaded', () => {
    apply(PRESETS[idx]);
    btn()?.addEventListener('click', next);
  });
})();
