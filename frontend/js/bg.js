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

  let t = 0, hue = 195;
  function blob(x, y, r, h, a) {
    const g = ctx.createRadialGradient(x, y, r*0.1, x, y, r);
    g.addColorStop(0, `hsla(${h}, 85%, 65%, ${a*0.55})`);
    g.addColorStop(1, `hsla(${h}, 85%, 55%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
  }

  function frame() {
    const w = innerWidth, h = innerHeight;
    const base = ctx.createRadialGradient(w*.5, h*.5, 0, w*.5, h*.5, Math.max(w,h)*.75);
    base.addColorStop(0, "rgba(6,10,14,0.96)");
    base.addColorStop(1, "rgba(4,6,10,1)");
    ctx.fillStyle = base; ctx.fillRect(0,0,w,h);

    const n = 5;
    for (let i=0;i<n;i++) {
      const r = 220 + i*90 + Math.sin(t*0.7 + i)*40;
      const x = w*(.5 + Math.sin(t*0.25 + i*0.8)*.35);
      const y = h*(.5 + Math.cos(t*0.22 + i*0.6)*.3);
      blob(x, y, r, (hue + i*40)%360, 0.9);
    }

    hue += 0.06; t += 0.006;
    requestAnimationFrame(frame);
  }
  frame();
})();
