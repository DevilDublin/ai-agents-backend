// year
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

// starfield
(function stars() {
  const c = document.getElementById('stars');
  if (!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize); resize();
  const S = Array.from({length: 220}, ()=>({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    r: Math.random()*1.1 + .2,
    a: Math.random()*1
  }));
  function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    S.forEach(s=>{
      s.a += 0.015;
      const glow = 0.4 + Math.sin(s.a)*0.35;
      ctx.beginPath();
      ctx.fillStyle = `rgba(185,138,255,${0.14+glow*0.2})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();
