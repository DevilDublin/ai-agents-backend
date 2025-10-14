// year
const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

// starfield + shooting stars
const stars = document.getElementById('stars');
const sctx = stars.getContext('2d');
let SW, SH, starT=0;
function sSize(){ stars.width = SW = window.innerWidth; stars.height = SH = window.innerHeight; }
addEventListener('resize', sSize); sSize();

const dots = Array.from({length:220}, ()=>({
  x: Math.random()*SW,
  y: Math.random()*SH,
  r: Math.random()*1.4+0.2,
  a: Math.random()*0.6+0.2,
  tw: Math.random()*2*Math.PI
}));
let trails = [];

function spawnTrail(){
  if(trails.length>5) return;
  const fromLeft = Math.random() > .5;
  trails.push({
    x: fromLeft? -50 : SW+50,
    y: Math.random()*SH*0.8,
    vx: fromLeft? (3+Math.random()*2) : -(3+Math.random()*2),
    vy: 1+Math.random()*1.2,
    life: 0, max: 180+Math.random()*120
  });
}
function stepStars(){
  starT+=0.016;
  sctx.clearRect(0,0,SW,SH);
  dots.forEach(d=>{
    const tw = (Math.sin(starT*1.6 + d.tw)+1)/2;
    sctx.globalAlpha = d.a*(0.5+tw*0.5);
    sctx.fillStyle='#cfd3ff';
    sctx.beginPath(); sctx.arc(d.x,d.y,d.r,0,Math.PI*2); sctx.fill();
  });
  // trails
  sctx.globalAlpha=1;
  trails = trails.filter(tr=>{
    tr.x += tr.vx; tr.y += tr.vy; tr.life++;
    const grd = sctx.createLinearGradient(tr.x- tr.vx*12, tr.y- tr.vy*12, tr.x, tr.y);
    grd.addColorStop(0,'rgba(185,138,255,0)');
    grd.addColorStop(1,'rgba(185,138,255,.8)');
    sctx.strokeStyle = grd; sctx.lineWidth=2;
    sctx.beginPath(); sctx.moveTo(tr.x- tr.vx*12, tr.y- tr.vy*12); sctx.lineTo(tr.x,tr.y); sctx.stroke();
    return tr.life < tr.max && tr.x>-100 && tr.x<SW+100;
  });
  if(Math.random()<0.015) spawnTrail();
  requestAnimationFrame(stepStars);
}
stepStars();
