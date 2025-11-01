// /frontend/js/intro.js
(function(){
  const intro = document.getElementById('zypher-intro');
  if(!intro) return;

  const img = intro.querySelector('img');
  const skip = document.getElementById('intro-skip');
  const lines = Array.from(intro.querySelectorAll('.status .line'));

  // Inline the SVG so we can animate strokes
  async function inlineSVG(imgEl){
    const res = await fetch(imgEl.src);
    const txt = await res.text();
    const wrap = document.createElement('div'); wrap.innerHTML = txt.trim();
    const svg = wrap.firstChild;
    imgEl.replaceWith(svg);
    return svg;
  }

  (async function start(){
    let svg = await inlineSVG(img);

    const paths = svg.querySelectorAll('path');
    paths.forEach(p=>{
      const L = p.getTotalLength();
      p.style.strokeDasharray = L;
      p.style.strokeDashoffset = L;
    });

    svg.classList.add('draw');

    const drawMs = 2800;            // line strokes
    const glowUpDelay = 2200;       // subtle glow intensifies near end
    const totalIntro = 4700;        // fade after complete
    const lineBase = 1500, lineStep = 320;

    const t0 = performance.now();
    function tick(t){
      const k = Math.min(1, (t - t0)/drawMs);
      paths.forEach(p=>{
        const L = p.getTotalLength();
        p.style.strokeDashoffset = (1 - k) * L;
      });
      if(k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    lines.forEach((el,i)=> setTimeout(()=> el.classList.add('show'), lineBase + i*lineStep));

    setTimeout(()=>{ svg.style.filter = 'drop-shadow(0 0 18px rgba(121,246,218,.55))'; }, glowUpDelay);

    const finish = ()=>{
      if(intro.classList.contains('hidden')) return;
      intro.classList.add('hidden');
      setTimeout(()=> intro.remove(), 900);
    };
    skip.addEventListener('click', finish);
    setTimeout(finish, totalIntro);
  })();
})();
