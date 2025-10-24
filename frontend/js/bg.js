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
    const g = ctx.createRadialGradient(w*.5, h*.5, 0, w*.5, h*.5, Math.max(w,h)*.75);
    g.addColorStop(0, "rgba(8,12,16,0.95)");
    g.addColorStop(1, "rgba(5,7,10,1)");
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    for (let i=0;i<3;i++){
      const r = 220 + i*140 + Math.sin(t*.6 + i)*50;
      const x = w*(.5 + Math.sin(t*.35 + i)*.26);
      const y = h*(.5 + Math.cos(t*.28 + i)*.22);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${(hue+i*60)%360}, 90%, 60%, 0.055)`;
      ctx.fill();
    }
    hue += .08; t += .006;
    requestAnimationFrame(frame);
  }
  frame();
})();
