// Smooth circuit-board background (Canvas 2D, no libs)
(function () {
  const idOptions = ['background', 'bg', 'stars'];
  let canvas = null;
  for (const id of idOptions) {
    const el = document.getElementById(id);
    if (el && el.tagName === 'CANVAS') { canvas = el; break; }
  }
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'background';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const LINES = 70;
  const SEGMENTS = 6;
  const lines = [];

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeLines() {
    lines.length = 0;
    for (let i = 0; i < LINES; i++) {
      const pts = [];
      const ox = rand(-0.1, 1.1) * w;
      const oy = rand(-0.1, 1.1) * h;
      let x = ox, y = oy;
      for (let j = 0; j < SEGMENTS; j++) {
        const dx = rand(-w * 0.12, w * 0.12);
        const dy = rand(-h * 0.07, h * 0.07);
        x = Math.max(-w * 0.2, Math.min(w * 1.2, x + dx));
        y = Math.max(-h * 0.2, Math.min(h * 1.2, y + dy));
        pts.push({ x, y });
      }
      lines.push({
        pts,
        speed: rand(0.04, 0.09),
        t: Math.random(),
        alpha: rand(0.08, 0.16)
      });
    }
  }
  makeLines();

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPt(p, q, t) { return { x: lerp(p.x, q.x, t), y: lerp(p.y, q.y, t) }; }

  function draw(time) {
    const t = time * 0.001;
    ctx.clearRect(0, 0, w, h);

    // faint grid
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#ffffff';
    const grid = 80 * dpr;
    for (let x = 0; x <= w; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // stars
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 120; i++) {
      const sx = (i * 971 + (t * 17 | 0) * 131) % w;
      const sy = (i * 593 + (t * 19 | 0) * 79) % h;
      ctx.fillRect(sx, sy, 1, 1);
    }

    // circuit traces + pulses
    lines.forEach((ln, idx) => {
      ctx.globalAlpha = ln.alpha;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(ln.pts[0].x, ln.pts[0].y);
      for (let i = 1; i < ln.pts.length; i++) ctx.lineTo(ln.pts[i].x, ln.pts[i].y);
      ctx.stroke();

      ln.t = (ln.t + ln.speed * 0.002) % 1;
      const seg = Math.floor(ln.t * (ln.pts.length - 1));
      const tt = (ln.t * (ln.pts.length - 1)) - seg;
      const p = lerpPt(ln.pts[seg], ln.pts[seg + 1], tt);

      const pulse = 2.5 + Math.sin(t * 2 + idx) * 1.5;
      ctx.globalAlpha = 0.25 + 0.25 * Math.sin(t * 2 + idx);
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || 'rgba(255,255,255,1)';
      ctx.fillStyle = accent.trim() || '#ffffff';
      ctx.beginPath(); ctx.arc(p.x, p.y, pulse * dpr, 0, Math.PI * 2); ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
