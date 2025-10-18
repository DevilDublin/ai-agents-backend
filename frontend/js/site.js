/* Zypher site chrome + Theme cycler */
import { ZYPHER_CONFIG, THEMES } from './config.js';

const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

const store = {
  get k(){ return 'zypher_theme_idx'; },
  get(){ const x = localStorage.getItem(this.k); return (x===null)? 0 : (+x||0); },
  set(i){ localStorage.setItem(this.k, String(i)); }
};

function applyTheme(idx) {
  const t = THEMES[idx % THEMES.length];
  const root = document.documentElement;
  root.style.setProperty('--accent-1', t.a1);
  root.style.setProperty('--accent-2', t.a2);
  // refresh glow variables (for browsers w/o color-mix precision)
  root.style.setProperty('--glow-1', `0 0 40px 6px ${t.a1}55`);
  root.style.setProperty('--glow-2', `0 0 40px 6px ${t.a2}55`);
  // highlight current nav accent if present
  const themePill = qs('[data-theme-pill]') || qs('.theme-pill');
  if (themePill) themePill.style.background = `linear-gradient(90deg, ${t.a1}, ${t.a2})`;
}

function cycleTheme() {
  const idx = (store.get() + 1) % THEMES.length;
  store.set(idx);
  applyTheme(idx);
}

function bindThemePill() {
  // Match navbar fonts/feel: we just wire to the pill (gradient circle) next to “Theme”
  const pill = qs('[data-theme-pill]') || qs('.theme-pill') || qs('.theme-toggle');
  if (pill) pill.addEventListener('click', cycleTheme);

  // Also allow clicking the “Theme” label (match header font)
  const label = qs('[data-theme-label]') || qsa('nav a, nav span').find(n => /theme/i.test(n?.textContent||''));
  if (label && !label._bound) { label._bound = true; label.addEventListener('click', cycleTheme); }
}

function ready(fn){
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', fn); }
  else fn();
}

ready(() => {
  applyTheme(store.get());
  bindThemePill();
});

export { applyTheme, cycleTheme };
