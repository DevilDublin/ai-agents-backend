const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars = [], trails = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function seed() {
  stars = Array.from({length: 180}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()*1.2 + .2, s: Math.random()*.4+.15
  }));
  trails = Array.from({length: 8}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*1.2, vy: (Math.random()-.5)*1.2,
    life: Math.random()*220+120
  }));
}
seed();

function step() {
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#bdb6ff';
  stars.forEach(st => {
    st.x += st.s*0.2; if (st.x>W) st.x=0;
    ctx.globalAlpha = .55;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fill();
  });

  trails.forEach(t=>{
    t.x+=t.vx; t.y+=t.vy; t.life-=1;
    if (t.x<0||t.x>W||t.y<0||t.y>H||t.life<0){
      t.x=Math.random()*W; t.y=Math.random()*H;
      t.vx=(Math.random()-.5)*1.2; t.vy=(Math.random()-.5)*1.2; t.life=Math.random()*220+120;
    }
    const len = 28;
    ctx.strokeStyle = 'rgba(155,125,255,.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t.x,t.y);
    ctx.lineTo(t.x-t.vx*len,t.y-t.vy*len);
    ctx.stroke();
  });

  requestAnimationFrame(step);
}
step();
