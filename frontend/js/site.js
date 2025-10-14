/* ---------- Global site niceties (shared across pages) ---------- */
(() => {
  // Mark active nav link
  const links = document.querySelectorAll('.links .link-chip');
  links.forEach(a => {
    const same = a.getAttribute('href') && location.pathname.endsWith(a.getAttribute('href'));
    if (same) a.classList.add('active');
  });

  // Lightweight starfield (uses #stars if present)
  const ensureStars = () => {
    if (document.getElementById('stars')) return;
    const s = document.createElement('canvas');
    s.id = 'stars';
    document.body.prepend(s);
    const ctx = s.getContext('2d');

    const resize = () => {
      s.width = innerWidth;
      s.height = innerHeight;
      draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, s.width, s.height);
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * s.width;
        const y = Math.random() * s.height;
        const r = Math.random() * 1.1 + 0.2;
        ctx.fillStyle = `rgba(200,180,255,${0.25 + Math.random() * 0.5})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // a couple of subtle shooting stars
      for (let i = 0; i < 3; i++) {
        const y = Math.random() * s.height * 0.8;
        ctx.strokeStyle = 'rgba(185,138,255,.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const x1 = Math.random() * s.width;
        ctx.moveTo(x1, y);
        ctx.lineTo(x1 + 80 + Math.random() * 80, y - 12 - Math.random() * 10);
        ctx.stroke();
      }
    };

    addEventListener('resize', resize);
    resize();
  };

  ensureStars();
})();
