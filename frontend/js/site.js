(function(){
  const $ = s => document.querySelector(s);
  const bg = () => $('#background');

  function applyPalette(p){
    const root = document.documentElement.style;
    root.setProperty('--accentA', p.a);
    root.setProperty('--accentB', p.b);
    root.setProperty('--glowA', hexToRgba(p.a,.45));
    root.setProperty('--glowB', hexToRgba(p.b,.45));
  }
  function hexToRgba(hex,a){
    const h = hex.replace('#','');
    const bigint = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
    const r = (bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
    return `rgba(${r},${g},${b},${a})`;
  }

  function initTheme(){
    const saved = localStorage.getItem('zypher_theme_index');
    let index = saved ? +saved : 0;

    // Page defaults: Home/Contact → Purple (0), Demos → Green (1)
    const isDemos = location.pathname.toLowerCase().includes('demos');
    if(!saved) index = isDemos ? 1 : 0;

    const palettes = window.ZYPHER_PALETTES || [];
    const btn = $('#colorToggle');
    const label = $('.theme-label');
    function set(i){
      index = (i + palettes.length) % palettes.length;
      applyPalette(palettes[index]);
      if(label) label.textContent = 'Theme';
      localStorage.setItem('zypher_theme_index', index);
    }
    set(index);

    if(btn){
      btn.addEventListener('click', ()=> set(index+1));
      btn.title = 'Click to switch neon palette';
    }
  }

  /* Simple page nav activation */
  function markActive(){
    const links = document.querySelectorAll('.nav a[href]');
    links.forEach(a=>{
      if(location.pathname.endsWith(a.getAttribute('href'))) a.classList.add('active');
    });
  }

  /* Background circuit animation (existing bg.js will draw on #background) */
  function ensureCanvas(){
    if(!bg()){
      const c = document.createElement('canvas'); c.id='background';
      document.body.prepend(c);
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    ensureCanvas();
    initTheme();
    markActive();
  });
})();
