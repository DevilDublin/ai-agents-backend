/* Intro (24h replay), neural particle bg, 3D selector interactions */
(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> [...el.querySelectorAll(s)];
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Neural particle background (no grid) ===== */
  const cnv = $('#bgParticles');
  if (cnv){
    const ctx = cnv.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio||1);
    let W=0,H=0,t=0, P=[];
    function resize(){
      W = cnv.width = cnv.clientWidth * DPR;
      H = cnv.height = cnv.clientHeight * DPR;
      P = [];
      const n = Math.floor((W*H)/(16000*DPR)); // density
      for(let i=0;i<n;i++){
        P.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-0.5)*0.2*DPR, vy:(Math.random()-0.5)*0.2*DPR});
      }
    }
    window.addEventListener('resize', resize, {passive:true});
    resize();

    function frame(){
      t += 0.003;
      ctx.clearRect(0,0,W,H);

      // particles
      for(const p of P){
        const a = Math.sin(p.x*0.001 + t*2.0) + Math.cos(p.y*0.0013 + t*1.6);
        p.vx += Math.cos(a)*0.004; p.vy += Math.sin(a)*0.004;
        p.x += p.vx; p.y += p.vy; p.vx*=0.985; p.vy*=0.985;
        if(p.x<0) p.x=W; else if(p.x>W) p.x=0;
        if(p.y<0) p.y=H; else if(p.y>H) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,1.6*DPR,0,Math.PI*2);
        ctx.fillStyle='rgba(102,247,209,0.95)'; ctx.fill();
      }

      // links
      ctx.strokeStyle='rgba(102,247,209,0.12)';
      for(let i=0;i<P.length;i++){
        for(let j=i+1;j<P.length;j++){
          const dx=P[i].x-P[j].x, dy=P[i].y-P[j].y;
          const d2=dx*dx+dy*dy; const r=110*DPR;
          if(d2<r*r){ const a=1-(Math.sqrt(d2)/r); ctx.globalAlpha=a*0.35; ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ===== Intro control (play once per 24h) ===== */
  const boot = $('#boot');
  if (boot){
    const last = Number(localStorage.getItem('zypher_intro_last')||0);
    const now = Date.now();
    const DAY = 24*60*60*1000;
    const shouldPlay = (now - last) > DAY;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lines = $$('.boot-line, .boot-subline', boot);
    const skip = $('#skipIntro');
    const footer = $('.site-footer');
    let cancelled = false;

    function typeLine(el, text){
      return new Promise(res=>{
        let i=0; el.textContent='';
        const TYPE_MS=900, HOLD_MS=600;
        const iv=setInterval(()=>{
          if(cancelled){ clearInterval(iv); res(); return; }
          el.textContent = text.slice(0, i++);
          if(i>text.length){ clearInterval(iv); setTimeout(res, HOLD_MS); }
        }, Math.max(16, TYPE_MS/Math.max(10,text.length)));
      });
    }
    function end(){
      cancelled=true;
      boot.style.opacity='0';
      boot.style.transition='opacity .8s ease';
      setTimeout(()=>{
        boot.remove();
        document.body.classList.remove('no-scroll');
        footer?.setAttribute('data-visible','true');
        localStorage.setItem('zypher_intro_last', String(Date.now()));
      },820);
    }
    skip?.addEventListener('click', end);

    if (!shouldPlay || prefersReduced){ end(); }
    else {
      (async()=>{
        for(const el of lines){
          const text=el.getAttribute('data-text'); if(!text) continue;
          await typeLine(el,text); if(cancelled) return;
        }
        end();
      })();
    }
  } else {
    $('.site-footer')?.setAttribute('data-visible','true');
  }

  /* ===== 3D selector interactions (center card focus) ===== */
  const selector = $('.selector');
  if (selector){
    const cards = $$('.card3d', selector);
    let center = Math.floor(cards.length/2);

    function layout(){
      cards.forEach((c, i)=>{
        const offset = i - center;
        const depth = -Math.abs(offset)*80; // z translation
        const rotate = offset * -12;        // y rotation
        const shift = offset * 42;          // x shift
        c.style.setProperty('--ry', rotate+'deg');
        c.style.transform = `translateX(${shift}px) translateZ(${depth}px) rotateY(${rotate}deg) scale(${i===center?1.08:0.94})`;
        c.classList.toggle('is-center', i===center);
      });
    }
    layout();

    // click to center / navigate
    cards.forEach((c, i)=>{
      c.addEventListener('click', ()=>{
        if (i === center){
          const go = c.getAttribute('data-go'); if (go) window.location.href = go;
        } else {
          center = i; layout();
        }
      });
    });

    // wheel/trackpad
    selector.addEventListener('wheel', (e)=>{
      e.preventDefault();
      if (e.deltaY > 0 || e.deltaX > 0) center = Math.min(center+1, cards.length-1);
      else center = Math.max(center-1, 0);
      layout();
    }, {passive:false});

    // keyboard arrows
    window.addEventListener('keydown',(e)=>{
      if (e.key === 'ArrowRight') { center = Math.min(center+1, cards.length-1); layout(); }
      if (e.key === 'ArrowLeft') { center = Math.max(center-1, 0); layout(); }
      if (e.key === 'Enter') { cards[center]?.click(); }
    });
  }
})();
