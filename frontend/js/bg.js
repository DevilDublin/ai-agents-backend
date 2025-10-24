(() => {
  const c = document.getElementById("bg");
  if (!c) return;
  const x = c.getContext("2d");
  let d = Math.min(2, devicePixelRatio || 1);
  function size(){ c.width=innerWidth*d; c.height=innerHeight*d; x.setTransform(d,0,0,d,0,0) }
  size(); addEventListener("resize", size);
  let t=0, h=195;
  function blob(cx,cy,r,hh,a){ const g=x.createRadialGradient(cx,cy,r*.1,cx,cy,r); g.addColorStop(0,`hsla(${hh},85%,65%,${a*.55})`); g.addColorStop(1,`hsla(${hh},85%,55%,0)`); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill() }
  function frame(){
    const w=innerWidth, hgt=innerHeight;
    const base=x.createRadialGradient(w*.5,hgt*.5,0,w*.5,hgt*.5,Math.max(w,hgt)*.78);
    base.addColorStop(0,"rgba(6,10,14,.97)"); base.addColorStop(1,"rgba(4,6,10,1)");
    x.fillStyle=base; x.fillRect(0,0,w,hgt);
    for(let i=0;i<4;i++){ const r=260+i*120+Math.sin(t*.6+i)*46; const cx=w*(.5+Math.sin(t*.25+i*.7)*.34); const cy=hgt*(.55+Math.cos(t*.22+i*.6)*.28); blob(cx,cy,r,(h+i*48)%360,.9) }
    h+=.06; t+=.006; requestAnimationFrame(frame)
  }
  frame();
})();
