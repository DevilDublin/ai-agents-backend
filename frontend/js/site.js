(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const cvs = document.getElementById('stars');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w, h, stars = [], comets = [];

  function resize() {
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
    stars = Array.from({length: Math.min(240, Math.floor((w*h)/12000))}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.2+0.2,
      a: Math.random()
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnComet() {
    comets.push({
      x: Math.random()*w, y: Math.random()*h*0.6, vx: (Math.random()<.5?-1:1)*(2+Math.random()*1.5),
      vy: 0.6+Math.random()*0.8, life: 0, max: 120
    });
  }
  setInterval(spawnComet, 2200);

  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#fff';
    for (const s of stars) {
      s.a += 0.02;
      const op = 0.3 + Math.sin(s.a)*0.3;
      ctx.globalAlpha = op;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const c of comets) {
      c.x += c.vx; c.y += c.vy; c.life++;
      const len = 80;
      const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*len, c.y - c.vy*len);
      grad.addColorStop(0,'rgba(185,138,255,.9)');
      grad.addColorStop(1,'rgba(185,138,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(c.x - c.vx*len, c.y - c.vy*len); ctx.lineTo(c.x, c.y); ctx.stroke();
    }
    comets = comets.filter(c => c.life < c.max);
    requestAnimationFrame(draw);
  }
  draw();
})();
