/* zypher site runtime: boot sequence, grid background, ring motion, theme */
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

  // Year stamp
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Animated grid background (lightweight canvas) =====
  const canvas = $('#gridCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    function resize(){ canvas.width = canvas.clientWidth * DPR; canvas.height = canvas.clientHeight * DPR; }
    window.addEventListener('resize', resize, {passive:true});
    resize();

    let t = 0;
    function draw(){
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = 'rgba(90,184,255,0.22)';
      ctx.lineWidth = 1;
      const grid = 46 * DPR; // slower, futuristic spacing
      for (let x = 0; x < w; x += grid){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += grid){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // drifting nodes
      const nodes = 24;
      for (let i=0;i<nodes;i++){
        const nx = (w/2) + Math.cos((i*0.5)+t*0.15) * (w*0.25);
        const ny = (h/2) + Math.sin((i*0.7)+t*0.12) * (h*0.18);
        ctx.beginPath();
        ctx.arc(nx, ny, 2*DPR, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(102,247,209,0.9)';
        ctx.fill();
      }
      t += 0.5; // slow overall motion
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // ===== Boot sequence (homepage only) =====
  const boot = $('#boot');
  if (boot) {
    const lines = $$('.boot-line, .boot-subline', boot);
    const skip = $('#skipIntro');
    const header = $('.site-header');
    const footer = $('.site-footer');

    const TYPE_MS = 900; // per line
    const HOLD_MS = 600;
    let cancelled = false;

    function typeLine(el, text){
      return new Promise(res => {
        let i = 0; el.textContent = '';
        const iv = setInterval(() => {
          if (cancelled) { clearInterval(iv); res(); return; }
          el.textContent = text.slice(0, i++);
          if (i > text.length){ clearInterval(iv); setTimeout(res, HOLD_MS); }
        }, Math.max(16, TYPE_MS / Math.max(10, text.length)));
      });
    }

    async function run(){
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return end();
      for (const el of lines){
        const text = el.getAttribute('data-text');
        if (!text) continue;
        await typeLine(el, text);
        if (cancelled) return;
      }
      end();
    }

    function end(){
      cancelled = true;
      boot.style.opacity = '0';
      boot.style.transition = 'opacity .8s ease';
      setTimeout(()=>{
        boot.remove();
        document.body.classList.remove('no-scroll');
        header && header.setAttribute('data-visible','true');
        footer && footer.setAttribute('data-visible','true');
      }, 820);
    }

    skip?.addEventListener('click', end);
    run();
  } else {
    // Non-home pages: header/footer visible immediately
    $('.site-header')?.setAttribute('data-visible','true');
    $('.site-footer')?.setAttribute('data-visible','true');
  }

  // ===== Ring auto spin + navigation (homepage) =====
  const ring = $('.ring');
  if (ring){
    let spin = 0; let rafId;
    function tick(){ spin += 0.25; ring.style.setProperty('--spin', spin + 'deg'); rafId = requestAnimationFrame(tick); }
    rafId = requestAnimationFrame(tick);
    ring.addEventListener('pointerenter', ()=> cancelAnimationFrame(rafId));
    ring.addEventListener('pointerleave', ()=> rafId = requestAnimationFrame(tick));
    $$('.ring-item', ring).forEach(item => {
      item.addEventListener('click', () => {
        const go = item.getAttribute('data-go');
        if (!go) return;
        if (go.startsWith('#')) {
          const target = document.querySelector(go);
          target?.scrollIntoView({behavior:'smooth', block:'start'});
        } else {
          window.location.href = go;
        }
      });
    });
  }

  // ===== Theme toggle (light/dark accent) =====
  const toggle = $('#themeToggle');
  if (toggle){
    toggle.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme !== 'light';
      if (dark){
        document.documentElement.dataset.theme = 'light';
        document.documentElement.style.setProperty('--bg', '#f7fbff');
        document.documentElement.style.setProperty('--text', '#0b1620');
        document.documentElement.style.setProperty('--muted', '#3b556f');
        document.documentElement.style.setProperty('--glass', 'rgba(6,16,26,0.06)');
        document.documentElement.style.setProperty('--stroke', 'rgba(0,0,0,0.10)');
      } else {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.style.removeProperty('--bg');
        document.documentElement.style.removeProperty('--text');
        document.documentElement.style.removeProperty('--muted');
        document.documentElement.style.removeProperty('--glass');
        document.documentElement.style.removeProperty('--stroke');
      }
    });
  }
})();
