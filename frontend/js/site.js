(function(){
  const c = document.getElementById('stars');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w,h,stars=[];
  function resize(){ w=c.width=window.innerWidth; h=c.height=window.innerHeight; stars=Array.from({length:180},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.2,s:Math.random()*0.6+0.2})) }
  function tick(){
    ctx.clearRect(0,0,w,h);
    const g=ctx.createRadialGradient(w/2,h,0,h/2,h,Math.max(w,h));
    g.addColorStop(0,"#0b0921"); g.addColorStop(1,"#000");
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle="rgba(233,236,255,.9)";
    stars.forEach(s=>{s.x+=s.s*0.2; if(s.x>w){s.x=0; s.y=Math.random()*h} ctx.globalAlpha=0.6; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill()});
    ctx.globalAlpha=1;
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize',resize); resize(); tick();
})();
