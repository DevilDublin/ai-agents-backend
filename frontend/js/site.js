// 1) First-visit-only intro
(function(){
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
  }catch(e){ /* ignore storage errors */ }

  // 2) Close modals on ESC or backdrop click
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && location.hash){
      history.pushState("", document.title, location.pathname + location.search);
    }
  });
  document.addEventListener('click', (e)=>{
    const modal = e.target.closest('.modal');
    if(modal && e.target === modal){
      e.preventDefault();
      history.pushState("", document.title, location.pathname + location.search);
    }
  });
})();
