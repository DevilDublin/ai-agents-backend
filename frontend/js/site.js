/* Intro V2 (guaranteed first-run), neural background, stronger hover accent */
(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> [...el.querySelectorAll(s)];
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Neural particles ===== */
  const cnv = $('#bgParticles');
  if (cnv){
    const ctx = cnv.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio||1);
    let W=0,H=0,t=0,P=[];
    function resize(){
      W = cnv.width = cnv.clientWidth * DPR;
      H = cnv.height = cnv.clientHeight * DPR;
      P = [];
      const n = Math.floor((W*H)/(16000*DPR));
      for(let i=0;i<n;i++){
        P.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-0.5)*0.2*DPR, vy:(Math.random()-0.5)*0.2*DPR});
      }
    }
    window.addEventListener('resize', resize, {passive:true});
    resize();

    function frame(){
      t += 0.003;
      ctx.clearRect(0,0,W,H);
      for(const p of P){
        const a = Math.sin(p.x*0.001 + t*2.0) + Math.cos(p.y*0.0013 + t*1.6);
        p.vx += Math.cos(a)*0.004; p.vy += Math.sin(a)*0.004;
        p.x += p.vx; p.y += p.vy; p.vx*=0.985; p.vy*=0.985;
        if(p.x<0) p.x=W; else if(p.x>W) p.x=0;
        if(p.y<0) p.y=H; else if(p.y>H) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,1.6*DPR,0,Math.PI*2);
        ctx.fillStyle='rgba(102,247,209,0.95)'; ctx.fill();
      }
      ctx.strokeStyle='rgba(102,247,209,0.12)';
      for(let i=0;i<P.length;i++){
        for(let j=i+1;j<P.length;j++){
          const dx=P[i].x-P[j].x, dy=P[i].y-P[j].y;
          const d2=dx*dx+dy*dy, r=110*DPR;
          if(d2<r*r){ const a=1-(Math.sqrt(d2)/r); ctx.globalAlpha=a*0.35; ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ===== Intro control (versioned) ===== */
  const INTRO_VERSION = '2'; // bump to force one guaranteed play after update
  const boot = $('#boot');
  if (boot){
    const last = Number(localStorage.getItem('zypher_intro_v'+INTRO_VERSION) || 0);
    const now  = Date.now();
    const DAY  = 24*60*60*1000;
    const seenThisSession = sessionStorage.getItem('zypher_intro_session') === '1';
    const prefersReduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const force = new URLSearchParams(location.search).get('intro') === '1';
    const shouldPlay = (force || (!seenThisSession && (now - last) > DAY)) && !prefersReduced;

    const lines = $$('.boot-line, .boot-subline', boot);
    const skip  = $('#skipIntro');
    const footer= $('.site-footer');
    let cancelled=false;

    function typeLine(el, text){
      return new Promise(res=>{
        let i=0; el.textContent=''; const TYPE_MS=900, HOLD_MS=600;
        const iv=setInterval(()=>{
          if(cancelled){ clearInterval(iv); res(); return; }
          el.textContent=text.slice(0, i++);
          if(i>text.length){ clearInterval(iv); setTimeout(res, HOLD_MS); }
        }, Math.max(16, TYPE_MS/Math.max(10,text.length)));
      });
    }
    function end(){
      cancelled=true; boot.style.opacity='0'; boot.style.transition='opacity .9s ease';
      setTimeout(()=>{
        boot.remove(); document.body.classList.remove('no-scroll');
        footer?.setAttribute('data-visible','true');
        localStorage.setItem('zypher_intro_v'+INTRO_VERSION, String(Date.now()));
        sessionStorage.setItem('zypher_intro_session','1');
      },900);
    }
    skip?.addEventListener('click', end);

    if (!shouldPlay) end();
    else { (async()=>{ for(const el of lines){ const txt=el.getAttribute('data-text'); if(!txt) continue; await typeLine(el,txt); if(cancelled) return; } end(); })(); }
  } else {
    $('.site-footer')?.setAttribute('data-visible','true');
  }

  /* ===== Accent hover (more vivid) ===== */
  const tiles = $$('.tile'); const root = document.documentElement;
  tiles.forEach(t=>{
    const accent = t.getAttribute('data-accent') || '#66f7d1';
    t.addEventListener('mouseenter', ()=>{
      root.style.setProperty('--accent', accent);
    });
    t.addEventListener('mouseleave', ()=>{
      root.style.removeProperty('--accent');
    });
    t.addEventListener('click', ()=>{
      const go = t.getAttribute('data-go'); if (go) window.location.href = go;
    });
  });
})();
