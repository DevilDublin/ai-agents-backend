(() => {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let w, h, stars, shoots;

  function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
  function init() {
    stars = Array.from({length: 220}, () => ({
      x: Math.random()*w, y: Math.random()*h, z: Math.random()*0.6+0.4, s: Math.random()*1.2+0.2
    }));
    shoots = [];
  }
  function shoot() {
    const speed = Math.random()*1.5+1;
    const angle = Math.random()*Math.PI*2;
    shoots.push({
      x: Math.random()*w, y: Math.random()*h, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 0
    });
  }
  function tick() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#ffffff';
    for (const st of stars) {
      st.x += 0.05*st.z; st.y += 0.02*st.z;
      if (st.x > w) st.x = 0;
      if (st.y > h) st.y = 0;
      ctx.globalAlpha = 0.6*st.z;
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    if (Math.random() < 0.02) shoot();
    for (let i=shoots.length-1;i>=0;i--) {
      const s = shoots[i];
      s.x += s.vx; s.y += s.vy; s.life += 1;
      ctx.globalAlpha = Math.max(0, 1 - s.life/90);
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*12, s.y - s.vy*12);
      ctx.strokeStyle = 'rgba(155,114,255,.8)'; ctx.lineWidth = 2; ctx.stroke();
      if (s.life > 90) shoots.splice(i,1);
    }
    requestAnimationFrame(tick);
  }

  resize(); init(); tick();
  window.addEventListener('resize', () => { resize(); init(); });
})();
