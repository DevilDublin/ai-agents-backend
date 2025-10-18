(function(){
  const c = document.getElementById('background');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w,h,t=0; const dots=[];
  function resize(){ w= c.width = innerWidth; h = c.height = innerHeight; }
  addEventListener('resize', resize,{passive:true}); resize();

  for(let i=0;i<120;i++){
    dots.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2})
  }
  function grid(){
    ctx.strokeStyle='rgba(255,255,255,.04)';
    const s=64;
    for(let x=0;x<w;x+=s){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for(let y=0;y<h;y+=s){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  }
  function loop(){
    ctx.clearRect(0,0,w,h);
    grid();
    // drifting wires
    ctx.strokeStyle='rgba(255,255,255,.08)';
    ctx.beginPath();
    for(let i=0;i<dots.length;i++){
      const d=dots[i]; d.x+=d.vx; d.y+=d.vy;
      if(d.x<0||d.x>w) d.vx*=-1; if(d.y<0||d.y>h) d.vy*=-1;
      ctx[i?'lineTo':'moveTo'](d.x,d.y);
    }
    ctx.stroke();

    // soft stars
    for(const d of dots){
      ctx.fillStyle='rgba(255,255,255,.7)';
      ctx.beginPath(); ctx.arc(d.x,d.y,1.2,0,6.283); ctx.fill();
    }
    t+=.01; requestAnimationFrame(loop);
  }
  loop();
})();
