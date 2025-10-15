const starCanvas = document.getElementById('stars');
if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let w, h, stars;

  const gen = () => {
    w = starCanvas.width = window.innerWidth;
    h = starCanvas.height = window.innerHeight;
    const count = Math.min(250, Math.floor((w * h) / 12000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      tw: Math.random() * 0.8 + 0.2
    }));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0b0816';
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      const size = s.z * 1.4;
      const alpha = 0.35 + Math.sin((t * 0.001 + s.tw) * 6.283) * 0.25;
      ctx.fillStyle = `rgba(233,236,255,${alpha})`;
      ctx.fillRect(s.x, s.y, size, size);
      s.x -= 0.02 * s.z;
      if (s.x < -2) s.x = w + 2;
    }

    // occasional shooting star
    if (Math.random() < 0.005) {
      const sy = Math.random() * h * 0.9;
      ctx.strokeStyle = 'rgba(185,138,255,0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(w, sy);
      ctx.lineTo(w - 120, sy + 6);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', gen);
  gen();
  requestAnimationFrame(draw);
}
