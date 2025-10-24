(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const x = c.getContext("2d");
  let d = Math.min(2, devicePixelRatio || 1);

  function size() {
    c.width = innerWidth * d;
    c.height = innerHeight * d;
    x.setTransform(d, 0, 0, d, 0, 0);
  }
  size();
  addEventListener("resize", size);

  let t = 0;
  function beam(cx, cy, w, h, hue) {
    const grad = x.createLinearGradient(cx - w, cy - h, cx + w, cy + h);
    grad.addColorStop(0, `hsla(${hue}, 100%, 60%, 0)`);
    grad.addColorStop(0.5, `hsla(${hue}, 90%, 65%, 0.25)`);
    grad.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
    x.strokeStyle = grad;
    x.lineWidth = 2;
    x.beginPath();
    for (let i = -3; i <= 3; i++) {
      const y = cy + Math.sin(t * 2 + i) * 20;
      x.moveTo(cx - w, y);
      x.bezierCurveTo(cx - w / 2, y - 80, cx + w / 2, y + 80, cx + w, y);
    }
    x.stroke();
  }

  function loop() {
    const w = innerWidth;
    const h = innerHeight;
    const grad = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
    grad.addColorStop(0, "#05080b");
    grad.addColorStop(1, "#000");
    x.fillStyle = grad;
    x.fillRect(0, 0, w, h);

    beam(w * 0.5, h * 0.4, w * 0.4, 140, 155);
    beam(w * 0.5, h * 0.6, w * 0.45, 120, 170);
    beam(w * 0.5, h * 0.5, w * 0.42, 100, 140);

    t += 0.01;
    requestAnimationFrame(loop);
  }
  loop();
})();
