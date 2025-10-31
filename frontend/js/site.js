/* zypher runtime: boot (once), neural background, hub nav */
(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> [...el.querySelectorAll(s)];
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Mesmerising background (particles + links) ===== */
  const canvas = $('#gridCanvas');
  if (canvas){
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const P = []; // particles
    let W=0,H=0,t=0;

    function resize(){
      W = canvas.width = canvas.clientWidth * DPR;
      H = canvas.height = canvas.clientHeight * DPR;
      P.length = 0;
      const count = Math.floor((W*H)/(14000*DPR)); // density
      for(let i=0;i<count;i++){
        P.push({
          x: Math.random()*W, y: Math.random()*H,
          vx: (Math.random()-0.5)*0.25*DPR,
          vy: (Math.random()-0.5)*0.25*DPR
        });
      }
    }
    window.addEventListener('resize', resize, {passive:true});
    resize();

    function step(){
      t += 0.003;
      ctx.clearRect(0,0,W,H);

      // faint grid
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = 'rgba(90,184,255,0.18)';
      ctx.lineWidth = 1;
      const grid = 52 * DPR;
      for (let x=0;x<W;x+=grid){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y=0;y<H;y+=grid){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // particles + links
      ctx.globalAlpha = 0.9;
      for (const p of P){
        // subtle flow field
        const a = Math.sin(p.x*0.0009 + t*2.2) + Math.cos(p.y*0.0007 + t*1.7);
        p.vx += Math.cos(a)*0.005; p.vy += Math.sin(a)*0.005;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.98; p.vy *= 0.98;

        // wrap
        if (p.x<0) p.x=W; else if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; else if (p.y>H) p.y=0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8*DPR, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(102,247,209,0.95)';
        ctx.fill();
      }

      // links by distance
      ctx.strokeStyle = 'rgba(102,247,209,0.12)';
      for(let i=0;i<P.length;i++){
        for(let j=i+1;j<P.length;j++){
          const dx=P[i].x-P[j].x, dy=P[i].y-P[j].y;
          const d2=dx*dx+dy*dy; const r=120*DPR; // link radius
          if (d2<r*r){
            const a = 1 - (Math.sqrt(d2)/r);
            ctx.globalAlpha = a*0.35;
            ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y); ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ===== Boot sequence (HOME only) – plays once ===== */
  const boot = $('#boot');
  const seen = localStorage.getItem('zypher_intro_seen') === '1';
  if (boot){
    const lines = $$('.boot-line, .boot-subline', boot);
    const skip = $('#skipIntro');
    const footer = $('.site-footer');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;

    function typeLine(el, text){
      return new Promise(res=>{
        let i=0; el.textContent='';
        const TYPE_MS = 900, HOLD_MS = 600;
        const iv = setInterval(()=>{
          if (cancelled){ clearInterval(iv); res(); return; }
          el.textContent = text.slice(0, i++);
          if (i>text.length){ clearInterval(iv); setTimeout(res, HOLD_MS); }
        }, Math.max(16, TYPE_MS/Math.max(10,text.length)));
      });
    }

    function end(){
      cancelled = true;
      boot.style.opacity = '0';
      boot.style.transition = 'opacity .8s ease';
      setTimeout(()=>{
        boot.remove(); document.body.classList.remove('no-scroll');
        footer?.setAttribute('data-visible','true');
        localStorage.setItem('zypher_intro_seen','1');
      }, 820);
    }

    skip?.addEventListener('click', end);

    // If seen or reduced motion user → skip immediately
    if (seen || prefersReduced){ end(); }
    else{
      (async ()=>{
        for (const el of lines){
          const text = el.getAttribute('data-text'); if (!text) continue;
          await typeLine(el, text); if (cancelled) return;
        }
        end();
      })();
    }
  } else {
    $('.site-footer')?.setAttribute('data-visible','true');
  }

  /* ===== HUB navigation (central) ===== */
  const orbit = $('.hub-orbit');
  if (orbit){
    // gentle auto spin
    let spin=0, raf;
    function tick(){ spin += 0.25; orbit.style.setProperty('--spin', spin+'deg'); raf = requestAnimationFrame(tick); }
    // position buttons with rotate using CSS var --spin
    $$('.hex', orbit).forEach(el=>{
      const base = parseFloat(getComputedStyle(el).getPropertyValue('--a'))||0;
      el.style.transform = `rotateZ(${base}deg) translateY(var(--r)) rotateZ(${-base}deg)`;
      el.addEventListener('click', ()=>{
        const go = el.getAttribute('data-go'); if (!go) return;
        window.location.href = go;
      });
    });
    raf = requestAnimationFrame(tick);
    orbit.addEventListener('pointerenter', ()=> cancelAnimationFrame(raf));
    orbit.addEventListener('pointerleave', ()=> raf = requestAnimationFrame(tick));
  }
})();
