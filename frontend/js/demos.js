(function(){
  const wrap = document.querySelector('.orbit-wrap');
  const tooltip = document.getElementById('orbit-tooltip');
  const beam = document.getElementById('orbit-beam');
  const centre = { x: wrap.clientWidth/2, y: wrap.clientHeight/2 };

  function showTip(btn){
    const tip = btn.getAttribute('data-tip') || '';
    tooltip.textContent = tip;
    const r = btn.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    tooltip.style.display='block';

    if(btn.classList.contains('top')){
      tooltip.style.left = (r.left + r.width/2 - w.left - tooltip.offsetWidth/2)+'px';
      tooltip.style.top  = (r.bottom - w.top + 8)+'px';
    } else if(btn.classList.contains('right')){
      tooltip.style.left = (r.left - w.left - tooltip.offsetWidth - 8)+'px';
      tooltip.style.top  = (r.top + r.height/2 - w.top - tooltip.offsetHeight/2)+'px';
    } else if(btn.classList.contains('left')){
      tooltip.style.left = (r.right - w.left + 8)+'px';
      tooltip.style.top  = (r.top + r.height/2 - w.top - tooltip.offsetHeight/2)+'px';
    } else {
      tooltip.style.left = (r.left + r.width/2 - w.left - tooltip.offsetWidth/2)+'px';
      tooltip.style.top  = (r.top - w.top - tooltip.offsetHeight - 8)+'px';
    }
  }
  function hideTip(){ tooltip.style.display='none'; }

  function shootBeam(btn){
    const rb = btn.getBoundingClientRect();
    const rw = wrap.getBoundingClientRect();
    const bx = rb.left + rb.width/2 - rw.left;
    const by = rb.top + rb.height/2 - rw.top;
    const dx = centre.x - bx;
    const dy = centre.y - by;
    const len = Math.sqrt(dx*dx+dy*dy);
    const angle = Math.atan2(dy,dx)*180/Math.PI;

    beam.style.left = bx+'px';
    beam.style.top  = by+'px';
    beam.style.width = len+'px';
    beam.style.transform = `rotate(${angle}deg)`;
    beam.animate([{opacity:0},{opacity:1,offset:.2},{opacity:0}],{duration:900,fill:'forwards'});
  }

  wrap.querySelectorAll('.bot-pill').forEach(btn=>{
    btn.addEventListener('mouseenter',()=>{ showTip(btn); shootBeam(btn); });
    btn.addEventListener('mouseleave',hideTip);
    btn.addEventListener('click',()=>openDialog(btn.getAttribute('data-bot')));
  });

  const dlg = document.getElementById('dlg');
  const dlgTitle = document.getElementById('dlg-title');
  const dlgSub = document.getElementById('dlg-sub');
  const dlgChat = document.getElementById('dlg-chat');
  const dlgEx = document.getElementById('dlg-examples');
  const input = document.getElementById('dlg-input');
  const mic = document.getElementById('dlg-mic');
  const send = document.getElementById('dlg-send');
  document.getElementById('dlg-close').onclick=()=>{dlg.style.display='none';};

  function openDialog(key){
    const spec = window.DEMOS[key];
    dlgTitle.textContent = spec.title;
    dlgSub.textContent = spec.sub;
    dlgEx.innerHTML = '';
    spec.examples.forEach(e=>{
      const c = document.createElement('div');
      c.className='chip';
      c.textContent=e;
      c.onclick=()=>{input.value=e; send.click();};
      dlgEx.appendChild(c);
    });
    dlgChat.innerHTML='';
    addBubble('Hi — ask me about '+spec.title.toLowerCase()+'.','sys');
    addBubble(spec.replies[0],'bot');
    dlg.style.display='flex';
    dlg.setAttribute('data-key',key);
    input.focus();
  }

  function addBubble(text, who){
    const b = document.createElement('div');
    b.className='bubble';
    if(who==='me') b.classList.add('me');
    b.textContent=text;
    dlgChat.appendChild(b);
    dlgChat.scrollTop = dlgChat.scrollHeight;
  }

  send.onclick = ()=>{
    const t = input.value.trim();
    if(!t) return;
    addBubble(t,'me');
    const spec = window.DEMOS[dlg.getAttribute('data-key')];
    const reply = spec.replies[(Math.random()*spec.replies.length)|0];
    input.value='';
    setTimeout(()=>addBubble(reply,'bot'), 450);
  };

  window.__voiceWire = { input, mic, onSend: ()=>send.click() };
})();
