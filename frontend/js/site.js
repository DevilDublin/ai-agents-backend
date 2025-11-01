// Hide intro after first visit; keep page snappy on subsequent loads
(function(){
  try{
    const seen = localStorage.getItem('zypherIntroSeen') === '1';
    if(seen) document.body.classList.add('no-intro');

    const intro = document.getElementById('zypher-intro');
    if(!seen && intro){
      // when the CSS fade finishes, mark as seen and remove from DOM
      intro.addEventListener('animationend', (e)=>{
        if(e.animationName === 'intro-fade'){
          localStorage.setItem('zypherIntroSeen','1');
          intro.remove();
        }
      });
    } else if(intro){
      intro.remove();
    }
  }catch(e){ /* if storage blocked, intro will still play once per session */ }

  // Smooth scroll for in-page anchors (if you add any later)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
})();
