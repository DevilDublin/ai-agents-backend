const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars = [], streaks = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function spawnStars() {
  stars = Array.from({length: 280}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    z: Math.random()*0.6 + 0.4,
    tw: Math.random()*0.5 + 0.5
  }));
}
function spawnStreak() {
  const a = Math.random()*Math.PI*2;
  streaks.push({
    x: Math.random()*W, y: Math.random()*H,
    vx: Math.cos(a)*4, vy: Math.sin(a)*4, life: 80
  });
}
spawnStars();
setInterval(spawnStreak, 900);

function draw() {
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#ffffff';
  stars.forEach(s=>{
    const b = Math.sin((Date.now()/900)*s.tw)*0.5+0.5;
    ctx.globalAlpha = 0.25*b*s.z;
    ctx.fillRect(s.x, s.y, 1.2*s.z, 1.2*s.z);
  });
  ctx.globalAlpha = 1;

  streaks = streaks.filter(s=>s.life>0);
  streaks.forEach(s=>{
    ctx.strokeStyle = 'rgba(169,135,255,.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx*8, s.y - s.vy*8);
    ctx.stroke();
    s.x += s.vx; s.y += s.vy; s.life--;
  });
  requestAnimationFrame(draw);
}
draw();
