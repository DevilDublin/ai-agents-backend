/* ===== Theme, background, and shared helpers ===== */
(() => {
  const PALETTES = {
    neonPurple: ['#7a5cff', '#ff4fd8'],
    neonGreen:  ['#00ffa3', '#36f3ff'],
    neonBlue:   ['#5cc2ff', '#7a5cff'],
    neonOrange: ['#ff7a34', '#ff4fd8'],
    neonLime:   ['#41ff8a', '#d3ff3a']
  };

  // Apply palette to CSS variables
  function applyTheme(name){
    const [a,b] = PALETTES[name] || PALETTES.neonPurple;
    document.documentElement.style.setProperty('--neonA', a);
    document.documentElement.style.setProperty('--neonB', b);
    localStorage.setItem('zypher_theme', name);
  }

  // Theme pill
  function initThemePill(){
    const pill = document.querySelector('.theme-pill');
    if(!pill) return;
    const menu = document.querySelector('#themeMenu');
    const saved = localStorage.getItem('zypher_theme') || 'neonPurple';
    applyTheme(saved);

    pill.addEventListener('click', () => {
      menu?.classList.toggle('open');
    });

    menu?.addEventListener('click', (e) => {
      const li = e.target.closest('button[data-theme]');
      if(!li) return;
      applyTheme(li.dataset.theme);
      menu.classList.remove('open');
    });
  }

  // Animated network background
  function initBackground(){
    const canvas = document.getElementById('bg-net');
    if(!canvas) return;
    const ctx = canvas.getContext('2d', { alpha:true });
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    function resize(){
      canvas.width = Math.floor(canvas.clientWidth * DPR);
      canvas.height = Math.floor(canvas.clientHeight * DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    resize();
    window.addEventListener('resize', resize, { passive:true });

    const dots = Array.from({length: 68}, () => ({
      x: Math.random()*canvas.clientWidth,
      y: Math.random()*canvas.clientHeight,
      vx:(Math.random()-.5)*0.6,
      vy:(Math.random()-.5)*0.6
    }));

    function step(){
      ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);

      // Lines
      ctx.strokeStyle = 'rgba(255,255,255,.08)';
      ctx.lineWidth = 1;
      for(let i=0;i<dots.length;i++){
        for(let j=i+1;j<dots.length;j++){
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d2 = dx*dx + dy*dy;
          if(d2 < 170*170){
            ctx.globalAlpha = 1 - (Math.sqrt(d2)/170);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Nodes
      for(const p of dots){
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>canvas.clientWidth) p.vx*=-1;
        if(p.y<0||p.y>canvas.clientHeight) p.vy*=-1;
        ctx.fillStyle='rgba(255,255,255,.5)';
        ctx.fillRect(p.x, p.y, 1, 1);
      }
      requestAnimationFrame(step);
    }
    step();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemePill();
    initBackground();
  });

  // Expose a small API used by demos/voice
  window.ZypherTheme = { applyTheme };
})();
