/* ===== ZYPHER — shared site logic (bg, theme, nav) ===== */
(function(){
  const themes = [
    {a:'#b388ff', b:'#ff7ab6'}, // purple/pink
    {a:'#66ffaa', b:'#00e0b5'}, // green/teal
    {a:'#67b2ff', b:'#00dcff'}, // blue/cyan
    {a:'#ffb84d', b:'#ff5a26'}  // orange/yellow
  ];
  let idx = +localStorage.getItem('zy_theme_idx') || 0;

  function applyTheme(i){
    idx = (i+themes.length)%themes.length;
    const t = themes[idx];
    document.documentElement.style.setProperty('--glow-a', t.a);
    document.documentElement.style.setProperty('--glow-b', t.b);
    localStorage.setItem('zy_theme_idx', idx);
    const swatch = document.querySelector('.theme-swatch');
    if (swatch) swatch.style.background = `linear-gradient(90deg, ${t.a}, ${t.b})`;
  }

  /* nav active */
  document.querySelectorAll('.menu a').forEach(a=>{
    if (a.getAttribute('href') && location.pathname.endsWith(a.getAttribute('href'))) a.classList.add('active');
  });

  /* theme */
  const pill = document.querySelector('.theme-swatch');
  if (pill){ pill.addEventListener('click', ()=>applyTheme(idx+1)); }
  applyTheme(idx);

  /* grid + network canvas across all pages */
  const canvas = document.getElementById('net-canvas');
  if (canvas){
    const ctx = canvas.getContext('2d');
    let W,H,points=[];
    function resize(){
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      points = Array.from({length: 70},()=>({
        x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25
      }));
    }
    resize(); window.addEventListener('resize', resize);

    function tick(){
      ctx.clearRect(0,0,W,H);
      // nodes
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      points.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
        ctx.globalAlpha = .25;
        ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,6.283); ctx.fill();
      });
      // lines
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth = 1;
      for(let i=0;i<points.length;i++){
        for(let j=i+1;j<points.length;j++){
          const dx=points[i].x-points[j].x, dy=points[i].y-points[j].y;
          const d2=dx*dx+dy*dy;
          if (d2<120*120){
            ctx.globalAlpha = .06;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* footer pin */
  const wrapper = document.querySelector('.wrapper');
  if (wrapper){
    const footer = document.querySelector('.footer');
    const main = document.querySelector('.main');
    const adjust = ()=>{ 
      const fh = footer?.offsetHeight || 0;
      main.style.minHeight = `calc(100svh - ${fh + 72}px)`; 
    };
    adjust(); addEventListener('resize', adjust);
  }
})();
