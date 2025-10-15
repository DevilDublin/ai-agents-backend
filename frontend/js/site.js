// Starfield + shooting stars
const sky = (() => {
  const c = document.getElementById('sky');
  const s = document.getElementById('shooting');
  if (!c || !s) return;
  const ctx = c.getContext('2d');
  const sctx = s.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = c.width = s.width = window.innerWidth;
    h = c.height = s.height = window.innerHeight;
    stars = Array.from({ length: Math.round((w*h)/14000) }, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      z: 0.6 + Math.random()*0.6,
      tw: Math.random()*2*Math.PI
    }));
  }

  function paintStars(t) {
    ctx.clearRect(0,0,w,h);
    for (const st of stars) {
      st.tw += 0.02;
      const alpha = 0.35 + Math.sin(st.tw)*0.25;
      ctx.fillStyle = `rgba(215,205,255,${alpha})`;
      ctx.fillRect(st.x, st.y, st.z, st.z);
    }
  }

  // simple shooting star every few seconds
  let shots = [];
  function spawnShot() {
    const y = Math.random()*h*0.8 + 40;
    shots.push({ x: -80, y, vx: 6+Math.random()*3, life: 1 });
    setTimeout(spawnShot, 2500 + Math.random()*3500);
  }

  function paintShots() {
    sctx.clearRect(0,0,w,h);
    shots = shots.filter(sh => sh.life > 0 && sh.x < w+120);
    for (const sh of shots) {
      sh.x += sh.vx; sh.life -= 0.006;
      const grd = sctx.createLinearGradient(sh.x-80, sh.y-10, sh.x, sh.y);
      grd.addColorStop(0, `rgba(155,114,255,0)`);
      grd.addColorStop(1, `rgba(155,114,255,${sh.life})`);
      sctx.strokeStyle = grd; sctx.lineWidth = 2;
      sctx.beginPath(); sctx.moveTo(sh.x-80, sh.y-10); sctx.lineTo(sh.x, sh.y); sctx.stroke();
    }
  }

  function loop(t) { paintStars(t); paintShots(); requestAnimationFrame(loop) }
  window.addEventListener('resize', resize);
  resize(); spawnShot(); requestAnimationFrame(loop);
})();

// Smooth scroll for hero buttons
document.addEventListener('click', e => {
  const a = e.target.closest('[data-scroll]');
  if (!a) return;
  const id = a.getAttribute('data-scroll');
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior:'smooth', block:'start' });
  }
});
