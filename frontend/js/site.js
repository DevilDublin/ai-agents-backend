const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

(function twinkle(){
  const c = document.getElementById('stars');
  if(!c) return;
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  function size(){ c.width = innerWidth*dpr; c.height = innerHeight*dpr; draw(0); }
  addEventListener('resize', size); size();
  const stars = Array.from({length:160}, ()=>({x:Math.random(), y:Math.random(), r:Math.random()*1.6+0.2, p:Math.random()}));
  function draw(t){
    ctx.clearRect(0,0,c.width,c.height);
    for(const s of stars){
      const a = 0.35 + 0.65*Math.abs(Math.sin((t/1400)+s.p*6.28));
      ctx.fillStyle = `rgba(205,187,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x*c.width, s.y*c.height, s.r*dpr, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
})();
