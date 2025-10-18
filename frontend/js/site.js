// Theme + background net + shared helpers
const qs = (s, r=document)=>r.querySelector(s);

let themeIndex = +localStorage.getItem('zy_theme_idx') || 0;
function applyTheme(){
  const t = window.ZYPHER_THEMES[themeIndex % window.ZYPHER_THEMES.length];
  document.documentElement.style.setProperty('--a1', t.a1);
  document.documentElement.style.setProperty('--a2', t.a2);
  const pill = qs('#theme-pill'); if (pill) pill.style.background = `linear-gradient(90deg, ${t.a1}, ${t.a2})`;
}
function nextTheme(){
  themeIndex = (themeIndex + 1) % window.ZYPHER_THEMES.length;
  localStorage.setItem('zy_theme_idx', themeIndex);
  applyTheme();
}
document.addEventListener('DOMContentLoaded', ()=>{
  applyTheme();
  qs('#theme-pill')?.addEventListener('click', nextTheme);
  qs('#theme-label')?.addEventListener('click', nextTheme);
  drawNet();
  window.addEventListener('resize', drawNet);
});

// simple constellation lines
function drawNet(){
  const c = qs('#net'); if (!c) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; c.style.width = innerWidth+'px'; c.style.height = innerHeight+'px';
  const ctx = c.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1;
  const pts = Array.from({length: 48}, ()=>({x: Math.random()*innerWidth, y: Math.random()*innerHeight}));
  pts.forEach((p,i)=>{
    for(let j=i+1;j<pts.length;j++){
      const q = pts[j]; const dx=p.x-q.x, dy=p.y-q.y; const dist=Math.hypot(dx,dy);
      if(dist<220){ ctx.globalAlpha = 1 - (dist/220); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
    }
  });
}
