(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const x = c.getContext("2d");
  let d = Math.min(2, devicePixelRatio || 1);

  function size(){ c.width=innerWidth*d; c.height=innerHeight*d; x.setTransform(d,0,0,d,0,0) }
  size(); addEventListener("resize", size);

  let t = 0;
  function beam(cx, cy, w, hue){
    const g = x.createLinearGradient(cx-w, cy, cx+w, cy);
    g.addColorStop(0, `hsla(${hue},95%,62%,0)`);
    g.addColorStop(.5, `hsla(${hue},95%,62%,.35)`);
    g.addColorStop(1, `hsla(${hue},95%,62%,0)`);
    x.strokeStyle = g; x.lineWidth = 2;
    x.beginPath();
    for(let i=-2;i<=2;i++){
      const y = cy + Math.sin(t*2 + i)*22;
      x.moveTo(cx-w, y);
      x.bezierCurveTo(cx-w*.4, y-90, cx+w*.4, y+90, cx+w, y);
    }
    x.stroke();
  }
  function arcs(y){
    const w=innerWidth, h=innerHeight, rows=8;
    for(let i=0;i<rows;i++){
      const k=i/rows, y0 = y + i*18 + Math.sin(t*1.2+i)*3;
      const g = x.createLinearGradient(0,y0,w,y0);
      g.addColorStop(0, "rgba(9, 120, 90, 0)");
      g.addColorStop(.4, "rgba(10,229,161,.22)");
      g.addColorStop(.6, "rgba(10,229,161,.22)");
      g.addColorStop(1, "rgba(9, 120, 90, 0)");
      x.strokeStyle=g; x.lineWidth=2;
      x.beginPath(); x.moveTo(-20,y0); x.lineTo(w+20,y0); x.stroke();
    }
  }
  function loop(){
    const w=innerWidth, h=innerHeight;
    const base=x.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.max(w,h)*.85);
    base.addColorStop(0,"#05090e"); base.addColorStop(1,"#010407");
    x.fillStyle=base; x.fillRect(0,0,w,h);

    beam(w*.5, h*.45, w*.42, 155);
    beam(w*.5, h*.58, w*.48, 165);
    beam(w*.5, h*.52, w*.44, 140);
    arcs(h*.88);

    t+=0.01; requestAnimationFrame(loop);
  }
  loop();
})();
