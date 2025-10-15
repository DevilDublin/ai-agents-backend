const stars = (() => {
  const s = document.getElementById('stars');
  const sh = document.getElementById('shooters');
  if(!s || !sh) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const ctx = s.getContext('2d');
  const ctx2 = sh.getContext('2d');

  function size() {
    s.width = innerWidth * dpr;
    s.height = innerHeight * dpr;
    sh.width = innerWidth * dpr;
    sh.height = innerHeight * dpr;
  }
  size();
  addEventListener('resize', size);

  const stars = Array.from({length: 180}, () => ({
    x: Math.random()*s.width,
    y: Math.random()*s.height,
    r: Math.random()*1.6+0.2,
    tw: Math.random()*0.8+0.2,
    ph: Math.random()*Math.PI*2
  }));

  const trails = [];

  function spawnShooter() {
    const edge = Math.floor(Math.random()*4);
    let x,y,vx,vy;
    const speed = 2.2*dpr;
    if(edge===0){x=Math.random()*sh.width;y=0;vx=(Math.random()-.5)*speed;vy=speed}
    if(edge===1){x=sh.width;y=Math.random()*sh.height;vx=-speed;vy=(Math.random()-.5)*speed}
    if(edge===2){x=Math.random()*sh.width;y=sh.height;vx=(Math.random()-.5)*speed;vy=-speed}
    if(edge===3){x=0;y=Math.random()*sh.height;vx=speed;vy=(Math.random()-.5)*speed}
    trails.push({x,y,vx,vy,life:0});
  }

  setInterval(()=>{ if(Math.random()<0.35) spawnShooter() }, 900);

  function tick(t) {
    ctx.clearRect(0,0,s.width,s.height);
    stars.forEach(st=>{
      const a = 0.35 + Math.sin(t/900 + st.ph)*0.35;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
      st.x += Math.sin(st.ph)*0.02;
      st.y += Math.cos(st.ph)*0.02;
    });

    ctx2.clearRect(0,0,sh.width,sh.height);
    trails.forEach(tr=>{
      tr.x += tr.vx;
      tr.y += tr.vy;
      tr.life += 1;
      ctx2.globalAlpha = 1;
      const g = ctx2.createLinearGradient(tr.x,tr.y,tr.x-tr.vx*10,tr.y-tr.vy*10);
      g.addColorStop(0,'rgba(200,163,255,.0)');
      g.addColorStop(0.5,'rgba(200,163,255,.7)');
      g.addColorStop(1,'rgba(200,163,255,.0)');
      ctx2.strokeStyle = g;
      ctx2.lineWidth = 2*dpr;
      ctx2.beginPath();
      ctx2.moveTo(tr.x-tr.vx*10,tr.y-tr.vy*10);
      ctx2.lineTo(tr.x,tr.y);
      ctx2.stroke();
    });
    for(let i=trails.length-1;i>=0;i--){
      if(trails[i].life>160) trails.splice(i,1);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
