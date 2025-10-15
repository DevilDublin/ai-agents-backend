const orbit = document.querySelector('.orbit');
const tip = document.getElementById('orbit-tip');
const beam = document.querySelector('.beam');

function placeTooltip(btn) {
  const rect = btn.getBoundingClientRect();
  const orect = orbit.getBoundingClientRect();
  const text = btn.dataset.tip || '';
  tip.textContent = text;
  tip.style.display = 'block';

  if (btn.classList.contains('b-left')) {
    tip.style.left = (rect.left - orect.left - tip.offsetWidth - 14) + 'px';
    tip.style.top = (rect.top - orect.top - 6) + 'px';
  } else if (btn.classList.contains('b-right')) {
    tip.style.left = (rect.right - orect.left + 14) + 'px';
    tip.style.top = (rect.top - orect.top - 6) + 'px';
  } else if (btn.classList.contains('b-top')) {
    tip.style.left = (rect.left - orect.left + rect.width/2 - tip.offsetWidth/2) + 'px';
    tip.style.top = (rect.top - orect.top - tip.offsetHeight - 10) + 'px';
  } else {
    tip.style.left = (rect.left - orect.left + rect.width/2 - tip.offsetWidth/2) + 'px';
    tip.style.top = (rect.bottom - orect.top + 10) + 'px';
  }
}

function drawBeam(btn){
  const orect = orbit.getBoundingClientRect();
  const cx = orect.left + orect.width/2;
  const cy = orect.top + orect.height/2;
  const b = btn.getBoundingClientRect();
  const bx = b.left + b.width/2;
  const by = b.top + b.height/2;
  const dx = bx - cx;
  const dy = by - cy;
  const len = Math.hypot(dx,dy);
  const ang = Math.atan2(dy,dx);
  beam.style.left = (cx - orect.left) + 'px';
  beam.style.top = (cy - orect.top) + 'px';
  beam.style.width = len + 'px';
  beam.style.transform = `rotate(${ang}rad)`;
  beam.style.opacity = 1;
}

function clearHover(){
  tip.style.display = 'none';
  beam.style.opacity = 0;
}

document.querySelectorAll('.bot').forEach(btn=>{
  btn.addEventListener('mouseenter',()=>{ placeTooltip(btn); drawBeam(btn); });
  btn.addEventListener('mouseleave', clearHover);
  btn.addEventListener('click',()=>openDialog(btn));
});

/* dialog */
const dlg = document.getElementById('dlg');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgSub = document.getElementById('dlg-sub');
const dlgEx = document.getElementById('dlg-ex');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgMic = document.getElementById('dlg-mic');

const presets = {
  booker:{
    title:'Appointment Setter',
    sub:'Books meetings from website or email',
    chips:['What’s your budget?','Can you do Tuesday 2–4pm?','Use alex@example.com for the invite.'],
    hello:'Hi — ask me about appointment setter.'
  },
  internal:{
    title:'Internal Knowledge',
    sub:'Answers from policies and internal docs',
    chips:['Holiday policy','New starter checklist','Expenses limit'],
    hello:'Hi — ask about internal knowledge.'
  },
  support:{
    title:'Support Q&A',
    sub:'Links answers to policy pages',
    chips:['What’s the returns window?','Do you ship to the UK?','Are weekend deliveries available?'],
    hello:'Hi — ask about returns, shipping or hours.'
  },
  planner:{
    title:'Automation Planner',
    sub:'Plans automations and hands them to your stack',
    chips:['Draft a handover flow','Sync Zendesk tags','Escalation rule'],
    hello:'Hi — ask me to design an automation.'
  }
};

function openDialog(btn){
  clearHover();
  const id = btn.dataset.id;
  const p = presets[id];
  dlgTitle.textContent = p.title;
  dlgSub.textContent = p.sub;
  dlgEx.innerHTML = '';
  p.chips.forEach(c=>{
    const el = document.createElement('button');
    el.className='chip';
    el.textContent=c;
    el.onclick=()=>{ send(c); };
    dlgEx.appendChild(el);
  });
  dlgChat.innerHTML='';
  dlgChat.appendChild(bubble(p.hello,false));
  dlg.style.display='flex';
  dlgInput.value='';
  dlgInput.focus();
}

dlgClose.onclick = ()=> dlg.style.display='none';

function bubble(text, me){
  const b = document.createElement('div');
  b.className='bubble'+(me?' me':'');
  b.textContent = text;
  return b;
}

function send(text){
  const t = text || dlgInput.value.trim();
  if(!t) return;
  dlgChat.appendChild(bubble(t,true));
  dlgInput.value='';
  setTimeout(()=>{
    dlgChat.appendChild(bubble('Thanks — this is a static demo. In your build this would call the agent’s API.',false));
    dlgChat.scrollTop = dlgChat.scrollHeight;
  },500);
}

dlgSend.onclick = ()=>send();

dlgMic.onclick = ()=>{
  dlgMic.setAttribute('aria-pressed','true');
  Voice.useMic(dlgInput, (finalText)=>{
    dlgMic.setAttribute('aria-pressed','false');
    dlgInput.style.backgroundImage='none';
    send(finalText);
  });
};
