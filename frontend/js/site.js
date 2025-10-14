const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

const stars = document.getElementById('stars');
if (stars) {
  const ctx = stars.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    stars.width = innerWidth * DPR;
    stars.height = innerHeight * DPR;
    draw();
  }
  const points = Array.from({length: 140}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.2 + .2,
    a: Math.random()
  }));
  const streaks = Array.from({length: 4}, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight * .9,
    v: 2 + Math.random() * 2
  }));
  function draw() {
    ctx.clearRect(0,0,stars.width,stars.height);
    ctx.fillStyle = '#ffffff';
    points.forEach(p=>{
      p.a += 0.02;
      const a = (Math.sin(p.a)+1)/2 * 0.6 + 0.2;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(p.x*DPR, p.y*DPR, p.r*DPR, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = .7;
    ctx.strokeStyle = 'rgba(185,138,255,.6)';
    ctx.lineWidth = 2*DPR;
    streaks.forEach(s=>{
      s.x += s.v;
      s.y -= s.v*.15;
      if (s.x > innerWidth+60 || s.y < -60){
        s.x = -40; s.y = Math.random()*innerHeight*.9; s.v = 2+Math.random()*2;
      }
      ctx.beginPath();
      ctx.moveTo((s.x-40)*DPR,(s.y+10)*DPR);
      ctx.lineTo(s.x*DPR,s.y*DPR);
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  size();
  addEventListener('resize', size);
}
