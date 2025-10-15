(function () {
  const starsHost = document.getElementById("stars");
  if (!starsHost) return;
  const c = document.createElement("canvas");
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.position = "absolute";
  c.style.inset = "0";
  c.style.zIndex = "0";
  starsHost.appendChild(c);
  const ctx = c.getContext("2d");
  let w, h, dpr, stars, meteors;
  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = c.clientWidth;
    h = c.clientHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!stars) makeStars();
    if (!meteors) makeMeteors();
  }
  function rnd(a = 1) {
    return Math.random() * a;
  }
  function makeStars() {
    const count = Math.floor((w * h) / 14000);
    stars = Array.from({ length: count }).map(() => ({
      x: rnd(w),
      y: rnd(h),
      r: rnd(1.2) + 0.3,
      t: rnd(6.28),
      s: 0.2 + rnd(0.4)
    }));
  }
  function makeMeteors() {
    meteors = Array.from({ length: 4 }).map(() => ({
      x: rnd(w),
      y: rnd(h * 0.6),
      vx: 1.4 + rnd(1.1),
      vy: -0.2 - rnd(0.2),
      life: -rnd(4000)
    }));
  }
  function drawStars(dt) {
    for (const s of stars) {
      s.t += dt * 0.002 * s.s;
      const a = 0.35 + Math.sin(s.t) * 0.35;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#cbb6ff";
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawMeteors(dt) {
    const now = performance.now();
    for (const m of meteors) {
      if (now - m.life < 0) continue;
      m.x += m.vx * (dt / 16.6);
      m.y += m.vy * (dt / 16.6);
      ctx.beginPath();
      const len = 80;
      const tx = m.x - len;
      const ty = m.y + len * 0.25;
      const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
      grad.addColorStop(0, "rgba(185,138,255,0)");
      grad.addColorStop(1, "rgba(185,138,255,.9)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
      if (m.x > w + 100 || m.y < -100) {
        m.x = -rnd(200);
        m.y = h * 0.2 + rnd(h * 0.6);
        m.life = now + rnd(3000);
      }
    }
  }
  let prev = performance.now();
  function frame(t) {
    const dt = t - prev;
    prev = t;
    ctx.clearRect(0, 0, w, h);
    drawStars(dt);
    drawMeteors(dt);
    requestAnimationFrame(frame);
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(frame);
})();
