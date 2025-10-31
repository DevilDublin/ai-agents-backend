/* Intro (24h replay + session suppression), neural background, connector line + tiles */
(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> [...el.querySelectorAll(s)];
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Neural particle background ===== */
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

  /* ===== Intro control ===== */
  const boot = $('#boot');
  if (boot){
    const last = Number(localStorage.getItem('zypher_intro_last')||0);
    const now = Date.now();
    const DAY = 24*60*60*1000;
    const sessionSeen = sessionStorage.getItem('zypher_intro_session') === '1';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldPlay = !sessionSeen && (now - last) > DAY && !prefersReduced;

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
        sessionStorage.setItem('zypher_intro_session','1'); // suppress flicker for this session
      },820);
    }
    skip?.addEventListener('click', end);

    if (!shouldPlay){ end(); }
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

  /* ===== Tiles: connector line + dimming + navigation ===== */
  const hubWord = $('#hubWord');
  const connector = $('#connector');
  const tiles = $$('.tile');
  if (hubWord && connector && tiles.length){
    const svgNS = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill','none');
    path.setAttribute('stroke','#66f7d1');
    path.setAttribute('stroke-opacity','0.9');
    path.setAttribute('stroke-width','2');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-linejoin','round');
    path.style.transition = 'opacity .2s ease';
    path.style.opacity = '0';
    connector.appendChild(path);

    function updateLine(toEl){
      const src = hubWord.getBoundingClientRect();
      const dst = toEl.getBoundingClientRect();
      const svg = connector.getBoundingClientRect();

      // source = center bottom of "ZYPHER" word
      const sx = (src.left + src.width/2) - svg.left;
      const sy = (src.bottom) - svg.top + 6;

      // target = top center of tile
      const tx = (dst.left + dst.width/2) - svg.left;
      const ty = (dst.top) - svg.top - 8;

      const cx1 = sx, cy1 = sy + (ty - sy)*0.25;
      const cx2 = tx, cy2 = sy + (ty - sy)*0.70;

      connector.setAttribute('viewBox', `0 0 ${svg.width} ${svg.height}`);
      connector.setAttribute('width', svg.width);
      connector.setAttribute('height', svg.height);

      const d = `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
      path.setAttribute('d', d);
      path.style.opacity = '1';

      // animate dash
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.getBoundingClientRect(); // reflow
      path.style.transition = 'stroke-dashoffset .45s ease';
      path.style.strokeDashoffset = '0';
    }

    function clearLine(){
      path.style.opacity = '0';
      path.style.transition = 'opacity .25s ease';
      tiles.forEach(t => t.classList.remove('dim'));
    }

    tiles.forEach(t=>{
      t.addEventListener('mouseenter', ()=>{
        tiles.forEach(o => { if (o!==t) o.classList.add('dim'); });
        updateLine(t);
      });
      t.addEventListener('mouseleave', clearLine);
      t.addEventListener('click', ()=>{
        const go = t.getAttribute('data-go'); if (go) window.location.href = go;
      });
    });

    // handle resize to keep line accurate while hovering
    window.addEventListener('resize', ()=>{
      const hovered = tiles.find(el => el.matches(':hover'));
      if (hovered) updateLine(hovered);
    }, {passive:true});
  }
})();
