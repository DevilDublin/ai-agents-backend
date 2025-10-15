const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars, shooters;
function resize(){
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  stars = Array.from({length: Math.min(300, Math.floor(w*h/8000))}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    z: Math.random()*0.6 + 0.4,
    a: Math.random()*Math.PI*2
  }));
  shooters = [];
}
resize();
addEventListener('resize', resize);
function spawnShooter(){
  const speed = Math.random()*1.5+0.6;
  const angle = Math.random()*Math.PI*2;
  shooters.push({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: Math.cos(angle)*speed*6,
    vy: Math.sin(angle)*speed*6,
    life: 0,
    max: 60
  });
}
setInterval(()=>spawnShooter(), 900);

function tick(){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = '#ffffff';
  stars.forEach(s=>{
    s.a += 0.002;
    const twinkle = (Math.sin(s.a)+1)/2*0.6+0.4;
    ctx.globalAlpha = 0.35*s.z*twinkle;
    ctx.fillRect(s.x, s.y, 1.2*s.z, 1.2*s.z);
    if(Math.random()<0.0008) s.x = Math.random()*w, s.y = Math.random()*h;
  });
  shooters = shooters.filter(s=>{
    s.x += s.vx; s.y += s.vy; s.life++;
    ctx.globalAlpha = 0.75*(1 - s.life/s.max);
    ctx.strokeStyle = 'rgba(185,138,255,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx*4, s.y - s.vy*4);
    ctx.stroke();
    return s.life<s.max;
  });
  requestAnimationFrame(tick);
}
tick();
