// Lightweight animated background (GPU-friendly). Replaces older bg.js safely.
(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const ctx = c.getContext("2d");
  let dpr = Math.min(2, window.devicePixelRatio || 1);

  function size() {
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener("resize", size);

  let t = 0, hue = 190;
  function frame() {
    const w = innerWidth, h = innerHeight;
    // Deep vignette base
    const g = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, Math.max(w,h)*0.7);
    g.addColorStop(0, "rgba(7,12,16,0.95)");
    g.addColorStop(1, "rgba(5,7,9,1)");
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    // Moving light arcs
    for (let i=0;i<3;i++){
      const r = 200 + i*120 + Math.sin(t*0.6 + i)*40;
      const x = w*(0.5 + Math.sin(t*0.4 + i)*0.25);
      const y = h*(0.5 + Math.cos(t*0.3 + i)*0.25);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${(hue+i*40)%360}, 90%, 60%, 0.06)`;
      ctx.fill();
    }
    hue += 0.08; t += 0.006;
    requestAnimationFrame(frame);
  }
  frame();
})();
