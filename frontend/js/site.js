// Intro (first visit + dev override), hidden-colour hover accent, modal niceties
(function(){
  // ---- 1) Intro logic ----
  const params = new URLSearchParams(location.search);
  const forceIntro = params.get('intro') === '1';   // dev: add ?intro=1 to preview

  try{
    const seen = localStorage.getItem('zypherIntroSeen') === '1';
    const intro = document.getElementById('zypher-intro');

    if(forceIntro){ localStorage.removeItem('zypherIntroSeen'); }

    const shouldHide = !forceIntro && seen;
    if(shouldHide){
      document.body.classList.add('no-intro');
      if(intro) intro.remove();
    }else if(intro){
      intro.addEventListener('animationend', (e)=>{
        if(e.animationName === 'intro-fade'){
          localStorage.setItem('zypherIntroSeen','1');
          intro.remove();
        }
      });
    }
  }catch(_e){ /* ignore storage issues */ }

  // ---- 2) Hidden colour codes: hover sets --accent (tints logo/halo/bg/cards) ----
  const root = document.documentElement;
  const defaultAccent = getComputedStyle(root).getPropertyValue('--mint').trim();
  function setAccent(hex){ root.style.setProperty('--accent', hex); }
  function resetAccent(){ root.style.setProperty('--accent', defaultAccent); }

  document.querySelectorAll('.card').forEach(card=>{
    const col = card.getAttribute('data-accent') || defaultAccent;
    card.addEventListener('mouseenter', ()=> setAccent(col));
    card.addEventListener('focusin', ()=> setAccent(col));
    card.addEventListener('mouseleave', resetAccent);
    card.addEventListener('focusout', resetAccent);
  });

  // Tint accent when a modal is opened via hash; reset when closed
  if(location.hash){
    const trigger = document.querySelector(`a[href="${location.hash}"]`);
    const col = trigger?.getAttribute('data-accent');
    if(col) setAccent(col);
  }
  window.addEventListener('hashchange', ()=>{
    if(!location.hash) resetAccent();
    else{
      const t = document.querySelector(`a[href="${location.hash}"]`);
      setAccent(t?.getAttribute('data-accent') || defaultAccent);
    }
  });

  // ---- 3) Modal close on ESC and backdrop click ----
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && location.hash){
      history.pushState("", document.title, location.pathname + location.search);
      resetAccent();
    }
  });
  document.addEventListener('click', (e)=>{
    const modal = e.target.closest('.modal');
    if(modal && e.target === modal){
      e.preventDefault();
      history.pushState("", document.title, location.pathname + location.search);
      resetAccent();
    }
  });
})();
