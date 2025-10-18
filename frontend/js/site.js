// Theme cycler + navbar logic
import { THEMES } from './config.js';

const qs = (s, r=document)=>r.querySelector(s);
let themeIndex = parseInt(localStorage.getItem('zypher-theme')||0);

function applyTheme(){
  const t = THEMES[themeIndex % THEMES.length];
  document.documentElement.style.setProperty('--accent-1', t.a1);
  document.documentElement.style.setProperty('--accent-2', t.a2);
  const pill = qs('[data-theme-pill]');
  if(pill) pill.style.background = `linear-gradient(90deg, ${t.a1}, ${t.a2})`;
}

function nextTheme(){
  themeIndex = (themeIndex + 1) % THEMES.length;
  localStorage.setItem('zypher-theme', themeIndex);
  applyTheme();
}

document.addEventListener('DOMContentLoaded', ()=>{
  applyTheme();
  const pill = qs('[data-theme-pill]');
  const label = qs('[data-theme-label]');
  if(pill) pill.addEventListener('click', nextTheme);
  if(label) label.addEventListener('click', nextTheme);
});
