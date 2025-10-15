(function(){
  const starEl = document.getElementById('stars');
  const dots = [];
  const count = 220;
  for(let i=0;i<count;i++){
    dots.push({
      x: Math.random()*100,
      y: Math.random()*100,
      s: Math.random()*1.2+0.3,
      v: Math.random()*0.02+0.005
    });
  }
  function draw(){
    const stars = dots.map(d=>`${d.x}vw ${d.y}vh rgba(255,255,255,0.85)`).join(',');
    starEl.style.boxShadow = stars;
  }
  function tick(){
    dots.forEach(d=>{
      d.y += d.v;
      if(d.y>100) d.y = -1;
    });
    draw();
    requestAnimationFrame(tick);
  }
  draw(); tick();

  setInterval(()=>{
    const s = document.createElement('span');
    s.className = 'shoot';
    s.style.position='fixed';
    s.style.top = Math.random()*60+'vh';
    s.style.left = Math.random()*100+'vw';
    s.style.width='120px';
    s.style.height='2px';
    s.style.background='linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0))';
    s.style.filter='blur(0.3px)';
    s.style.zIndex='0';
    s.style.transform='rotate('+(Math.random()*20-10)+'deg)';
    s.style.opacity='0.9';
    document.body.appendChild(s);
    s.animate([{transform:s.style.transform,opacity:0.9},{transform:`translateX(200px) ${s.style.transform}`,opacity:0}],{duration:1200,fill:'forwards'}).onfinish=()=>s.remove();
  }, 2200);
})();
