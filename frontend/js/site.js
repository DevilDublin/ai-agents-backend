(function(){
  const c = document.getElementById('stars');
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  const ctx = c.getContext('2d');
  let w=0,h=0,stars=[],t=0;

  function resize(){
    w = c.width = Math.floor(innerWidth*dpr);
    h = c.height = Math.floor(innerHeight*dpr);
    c.style.width = innerWidth+'px';
    c.style.height = innerHeight+'px';
    const count = Math.floor((w*h)/(18000*dpr));
    stars = Array.from({length:count}).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.6*dpr+0.2,
      a: Math.random()*1
    }));
  }

  function tick(){
    t+=0.016;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#fff';
    for(const s of stars){
      const tw = 0.5+0.5*Math.sin(t*2 + s.x*0.001 + s.y*0.0015);
      ctx.globalAlpha = 0.25+0.6*tw;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    if(Math.random()<0.008){
      const sx = Math.random()*w, sy = Math.random()*h*0.8;
      shoot(sx,sy);
    }
    requestAnimationFrame(tick);
  }

  function shoot(x,y){
    const len = 120*dpr, life = 700;
    const t0 = performance.now();
    (function draw(now){
      const p = Math.min(1,(now-t0)/life);
      ctx.globalAlpha = 0.25*(1-p);
      ctx.strokeStyle = '#b98aff';
      ctx.lineWidth = 1.2*dpr;
      ctx.beginPath();
      ctx.moveTo(x - p*len, y - p*len*0.2);
      ctx.lineTo(x, y);
      ctx.stroke();
      if(p<1) requestAnimationFrame(draw);
    })(t0);
  }

  addEventListener('resize', resize, {passive:true});
  resize(); tick();
})();
