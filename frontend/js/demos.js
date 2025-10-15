(function(){
  const wrap = document.querySelector('.orbit-wrap');
  const tooltip = document.getElementById('orbit-tooltip');
  const lineSvg = document.getElementById('pulse-line');
  const dlg = document.getElementById('dlg');
  const close = dlg.querySelector('[data-close]');
  const chatBox = document.getElementById('dlg-chat');
  const input = document.getElementById('dlg-input');
  const sendBtn = document.getElementById('dlg-send');
  const exWrap = document.getElementById('dlg-examples');
  const title = document.getElementById('dlg-title');
  const sub = document.getElementById('dlg-sub');

  function centre(){
    const r = wrap.getBoundingClientRect();
    return {x: r.left + r.width/2, y: r.top + r.height/2};
  }

  function pulseTo(el){
    const c = centre();
    const r = el.getBoundingClientRect();
    const x1 = c.x, y1 = c.y;
    const x2 = r.left + r.width/2, y2 = r.top + r.height/2;
    const svgW = Math.abs(x2-x1), svgH = Math.abs(y2-y1);
    const left = Math.min(x1,x2), top = Math.min(y1,y2);
    lineSvg.setAttribute('width', svgW);
    lineSvg.setAttribute('height', svgH);
    lineSvg.style.left = left+'px';
    lineSvg.style.top = top+'px';
    lineSvg.innerHTML = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#b98aff" stop-opacity="0"/><stop offset="100%" stop-color="#b98aff" stop-opacity="1"/></linearGradient></defs>
      <path d="M ${x1< x2? 0:svgW} ${y1<y2?0:svgH} L ${x1<x2? svgW:0} ${y1<y2?svgH:0}" stroke="url(#g)" stroke-width="2" fill="none">
        <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur=".7s" fill="freeze"/>
      </path>`;
  }

  function showTip(el, text){
    tooltip.textContent = text;
    tooltip.style.display='block';
    const r = el.getBoundingClientRect();
    const t = tooltip.getBoundingClientRect();
    if(el.classList.contains('top')) tooltip.style.transform = `translate(${r.left + r.width/2 - t.width/2}px, ${r.bottom + 10}px)`;
    if(el.classList.contains('bottom')) tooltip.style.transform = `translate(${r.left + r.width/2 - t.width/2}px, ${r.top - t.height - 10}px)`;
    if(el.classList.contains('left')) tooltip.style.transform = `translate(${r.right + 12}px, ${r.top + r.height/2 - t.height/2}px)`;
    if(el.classList.contains('right')) tooltip.style.transform = `translate(${r.left - t.width - 12}px, ${r.top + r.height/2 - t.height/2}px)`;
  }
  function hideTip(){ tooltip.style.display='none'; }

  function openChat(key){
    const bot = window.BOTS[key];
    if(!bot) return;
    dlg.style.display='flex';
    title.textContent = bot.title;
    sub.textContent = bot.subtitle;
    chatBox.innerHTML = '';
    addBubble(bot.opening,false);
    addBubble(bot.persona,false);
    exWrap.innerHTML = '';
    bot.tips.forEach(t=>{
      const b = document.createElement('span');
      b.className='chip';
      b.textContent=t;
      b.addEventListener('click',()=> send(t));
      exWrap.appendChild(b);
    });
  }
  function closeChat(){ dlg.style.display='none'; }

  function addBubble(text, me){
    const b = document.createElement('div');
    b.className = 'bubble'+(me?' me':'');
    b.textContent = text;
    chatBox.appendChild(b);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function send(text){
    if(!text){ text = input.value.trim(); if(!text) return; input.value=''; }
    addBubble(text,true);
    setTimeout(()=>{
      const reply = craftReply(text);
      addBubble(reply,false);
    }, 450);
  }
  function craftReply(q){
    q = q.toLowerCase();
    if(q.includes('return')) return 'Returns are accepted within 30 days in unused condition. I can generate a label if you like.';
    if(q.includes('ship')) return 'We ship across the UK and most EU countries. Standard Royal Mail 48 or DPD Next Day are available.';
    if(q.includes('meeting')||q.includes('tuesday')||q.includes('schedule')) return 'I can offer Tue 14:30 or Wed 09:00. Which would you prefer? I’ll send a calendar invite.';
    if(q.includes('flow')||q.includes('workflow')) return 'I’d map it as: trigger → validate → enrich CRM → notify Slack → schedule task. Want the step-by-step?';
    return 'Noted. I’ll summarise and point you to the right place if needed.';
  }

  document.querySelectorAll('.bot-pill').forEach(el=>{
    const bot = el.dataset.bot;
    el.addEventListener('mouseenter',()=>{
      const tip = (window.BOTS[bot]||{}).subtitle || '';
      showTip(el, tip);
      pulseTo(el);
    });
    el.addEventListener('mouseleave',hideTip);
    el.addEventListener('click',()=>openChat(bot));
  });

  close.addEventListener('click', closeChat);
  dlg.addEventListener('click', e=>{ if(e.target===dlg) closeChat(); });

  sendBtn.addEventListener('click', ()=> send());
  window.addEventListener('chat:send', e=> send(e.detail));
})();
