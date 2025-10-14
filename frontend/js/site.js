(function(){
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  const c = document.getElementById('stars');
  if(!c) return;
  const ctx = c.getContext('2d'); let W,H,stars=[];
  function size(){ c.width = window.innerWidth; c.height = window.innerHeight; W=c.width; H=c.height; stars = Array.from({length:120},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+0.2, a:Math.random()*1}));}
  function draw(){ ctx.clearRect(0,0,W,H); ctx.fillStyle='#ffffff';
    stars.forEach(s=>{ s.a += 0.02; const o = 0.5+Math.sin(s.a)*0.5; ctx.globalAlpha = o*0.6; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', size); size(); draw();
})();
