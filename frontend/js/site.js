const S = document.getElementById('stars');
if (S) {
  const ctx = S.getContext('2d');
  let W, H, t = 0, stars = [], trails = [];
  function size() { W = S.width = innerWidth; H = S.height = innerHeight; }
  addEventListener('resize', size); size();

  function addStar() {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      tw: Math.random() * 0.02 + 0.006,
      ph: Math.random() * 6.28
    });
  }
  for (let i = 0; i < 220; i++) addStar();

  function maybeShoot() {
    if (Math.random() < 0.03) {
      const edge = Math.floor(Math.random() * 4);
      let x, y, ang;
      if (edge === 0) { x = Math.random() * W; y = -20; ang = Math.random() * Math.PI; }
      else if (edge === 1) { x = W + 20; y = Math.random() * H; ang = Math.PI / 2 + Math.random() * Math.PI; }
      else if (edge === 2) { x = Math.random() * W; y = H + 20; ang = Math.PI + Math.random() * Math.PI; }
      else { x = -20; y = Math.random() * H; ang = -Math.PI / 2 + Math.random() * Math.PI; }
      const speed = 3 + Math.random() * 2;
      trails.push({ x, y, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, life: 0.9, hue: Math.random() < 0.6 ? 'rgba(200,180,255' : 'rgba(160,120,255' });
const stars = document.getElementById('stars');
if (stars && stars.getContext) {
  const ctx = stars.getContext('2d');
  function fit(){ stars.width = innerWidth; stars.height = innerHeight; draw(); }
  addEventListener('resize', fit, { passive:true });
  function draw(){
    ctx.clearRect(0,0,stars.width,stars.height);
    for(let i=0;i<180;i++){
      const x=Math.random()*stars.width, y=Math.random()*stars.height;
      const r=Math.random()*1.2; ctx.fillStyle='rgba(200,200,255,'+(0.15+Math.random()*0.45)+')';
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
  }

  function draw() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      const tw = (Math.sin(s.ph + t * 2) * 0.5 + 0.5) * 0.6;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28);
      ctx.fillStyle = `rgba(200,190,255,${0.15 + tw})`;
      ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(185,138,255,.6)';
      ctx.fill();
    }

    trails = trails.filter(tr => tr.life > 0);
    for (const tr of trails) {
      tr.x += tr.vx; tr.y += tr.vy; tr.life -= 0.01;
      const grad = ctx.createLinearGradient(tr.x - tr.vx * 14, tr.y - tr.vy * 14, tr.x, tr.y);
      grad.addColorStop(0, `${tr.hue},0)`);
      grad.addColorStop(1, `${tr.hue},0.7)`);
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(tr.x - tr.vx * 14, tr.y - tr.vy * 14); ctx.lineTo(tr.x, tr.y); ctx.stroke();
    }

    maybeShoot();
    requestAnimationFrame(draw);
  }
  draw();
  fit();
}

document.querySelectorAll('#year').forEach(n => n.textContent = new Date().getFullYear());

// -------- Improved backend pre-warm (waits for config.js) --------
(function prewarm() {
  try {
    if (typeof window !== 'undefined' && window.BACKEND_URL) {
      fetch(`${window.BACKEND_URL}/health`, { mode: 'no-cors' })
        .then(() => console.log('[warm] backend pinged'))
        .catch(() => {/* ignore */});
    } else {
      // config.js not loaded yet — try again shortly
      setTimeout(prewarm, 400);
    }
  } catch (e) { /* ignore */ }
})();
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
