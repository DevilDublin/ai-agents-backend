/* Zypher animated background — stars + cyber shooting lines */
(function(){
  const id = 'zy-bg';
  let c = document.getElementById(id);
  if(!c){
    c = document.createElement('canvas');
    c.id = id;
    document.body.prepend(c); // ensure it’s behind everything
  }
  // add soft vignette overlay
  let vig = document.querySelector('.zy-vignette');
  if(!vig){ vig = document.createElement('div'); vig.className='zy-vignette'; document.body.appendChild(vig); }

  const x = c.getContext('2d');
  let stars=[], shots=[], ratio=window.devicePixelRatio||1;

  function resize(){
    c.width = innerWidth*ratio; c.height = innerHeight*ratio;
    x.setTransform(ratio,0,0,ratio,0,0);
    make();
  }
  function make(){
    stars = [];
    const n = Math.floor(innerWidth*innerHeight/2200);
    for(let i=0;i<n;i++){
      stars.push({x:Math.random()*innerWidth, y:Math.random()*innerHeight,
                  s:Math.random()*1.3+.2, a:.55*Math.random()+.25});
    }
  }
  function spawn(){
    const y = Math.random()*innerHeight*.8 + 10;
    shots.push({x:-80, y, vx:6+Math.random()*5, life:1});
  }
  setInterval(spawn, 1200);

  function step(){
    x.clearRect(0,0,innerWidth,innerHeight);
    for(const s of stars){
      x.globalAlpha = s.a;
      x.fillStyle = '#fff';
      x.fillRect(s.x, s.y, s.s, s.s);
      s.x += .03;
      if(s.x>innerWidth) s.x = 0;
    }
    x.globalAlpha = 1;
    for(const sh of shots){
      x.strokeStyle='rgba(0,212,255,.5)'; x.lineWidth=2; x.beginPath();
      x.moveTo(sh.x, sh.y); x.lineTo(sh.x+30, sh.y-6); x.stroke();
      x.strokeStyle='rgba(138,92,246,.45)'; x.beginPath();
      x.moveTo(sh.x-18, sh.y+4); x.lineTo(sh.x+8, sh.y-1); x.stroke();
      sh.x += sh.vx; sh.life -= .02;
    }
    shots = shots.filter(s=>s.x<innerWidth+70 && s.life>0);
    requestAnimationFrame(step);
  }

  addEventListener('resize', resize, {passive:true});
  resize(); step();
})();
