(function(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let W, H, stars=[];
  function size(){ c.width = W = innerWidth; c.height = H = innerHeight; stars = Array.from({length: 180}, ()=>({
    x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.2+0.2, a: Math.random()*1
  })); }
  addEventListener('resize', size); size();
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0b0921'; ctx.fillRect(0,0,W,H);
    stars.forEach(s=>{
      s.a += 0.02;
      ctx.globalAlpha = 0.3 + Math.sin(s.a)*0.2;
      ctx.fillStyle = '#cfc9ff';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
