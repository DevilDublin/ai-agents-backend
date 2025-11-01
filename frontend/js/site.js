// Intro: play once; Hidden-color hover: tint logo + background; Modal niceties
(function(){
  // 1) First-visit-only intro
  try{
    const seen = localStorage.getItem('zypherIntroSeen') === '1';
    if(seen) document.body.classList.add('no-intro');

    const intro = document.getElementById('zypher-intro');
    if(!seen && intro){
      intro.addEventListener('animationend', (e)=>{
        if(e.animationName === 'intro-fade'){
          localStorage.setItem('zypherIntroSeen','1');
          intro.remove();
        }
      });
    } else if(intro){
      intro.remove();
    }
  }catch(e){ /* ignore storage issues */ }

  // 2) Hidden color codes — on hover set CSS variable --accent
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

  // 3) Close modals on ESC or backdrop click
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

  // 4) When opening a modal via hash, tint accent to the card color
  if(location.hash){
    const trigger = document.querySelector(`a[href="${location.hash}"]`);
    if(trigger){
      const col = trigger.getAttribute('data-accent');
      if(col) setAccent(col);
    }
  }
  window.addEventListener('hashchange', ()=>{
    if(!location.hash) resetAccent();
    else{
      const trigger = document.querySelector(`a[href="${location.hash}"]`);
      const col = trigger?.getAttribute('data-accent') || defaultAccent;
      setAccent(col);
    }
  });
})();
