const orbit = document.getElementById('orbit');
const tip = document.getElementById('tip');
const ray = document.getElementById('ray');
const nodes = [...orbit.querySelectorAll('.node')];

function showTip(node){
  const rect = node.getBoundingClientRect();
  const orect = orbit.getBoundingClientRect();
  tip.textContent = node.dataset.desc || '';
  tip.style.display = 'block';

  const cx = rect.left + rect.width/2 - orect.left;
  const cy = rect.top + rect.height/2 - orect.top;

  if (node.classList.contains('node--top')){
    tip.style.left = `${cx - tip.offsetWidth/2}px`;
    tip.style.top = `${rect.top - orect.top - tip.offsetHeight - 14}px`;
  } else if (node.classList.contains('node--bottom')){
    tip.style.left = `${cx - tip.offsetWidth/2}px`;
    tip.style.top = `${rect.bottom - orect.top + 14}px`;
  } else if (node.classList.contains('node--left')){
    tip.style.left = `${rect.left - orect.left - tip.offsetWidth - 12}px`;
    tip.style.top = `${cy - tip.offsetHeight/2}px`;
  } else {
    tip.style.left = `${rect.right - orect.left + 12}px`;
    tip.style.top = `${cy - tip.offsetHeight/2}px`;
  }

  const center = {
    x: orect.width/2, y: orect.height/2
  };
  ray.style.display='block';
  const dx = cx - center.x;
  const dy = cy - center.y;
  const length = Math.hypot(dx,dy);
  const angle = Math.atan2(dy,dx) * 180/Math.PI;
  ray.style.left = `${center.x}px`;
  ray.style.top = `${center.y}px`;
  ray.style.width = `${length-10}px`;
  ray.style.transform = `rotate(${angle}deg)`;
}

function hideTip(){
  tip.style.display='none';
  ray.style.display='none';
}

nodes.forEach(n=>{
  n.addEventListener('mouseenter',()=>showTip(n));
  n.addEventListener('mouseleave',hideTip);
  n.addEventListener('click',()=>openDialog(n));
});

/* Dialog */
const overlay = document.getElementById('overlay');
const dlgTitle = document.getElementById('dlg-title');
const dlgSub = document.getElementById('dlg-sub');
const dlgClose = document.getElementById('dlg-close');
const chat = document.getElementById('chat');
const chips = document.querySelectorAll('.chip');
const input = document.getElementById('msg');
const sendBtn = document.getElementById('send');

function openDialog(node){
  dlgTitle.textContent = node.textContent.trim();
  dlgSub.textContent = node.dataset.desc || 'Live demo';
  overlay.hidden = false;
  input.focus();
}

dlgClose.addEventListener('click',()=>overlay.hidden=true);
overlay.addEventListener('click',e=>{ if(e.target===overlay) overlay.hidden=true;});

chips.forEach(c=>c.addEventListener('click',()=>{
  send(c.textContent);
}));

sendBtn.addEventListener('click',()=>send(input.value));
input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); send(input.value);} });

function send(text){
  const t = (text||'').trim();
  if(!t) return;
  const me = document.createElement('div');
  me.className='bubble bubble--me';
  me.textContent = t;
  chat.appendChild(me);
  input.value='';
  chat.scrollTop = chat.scrollHeight;

  setTimeout(()=>{
    const bot = document.createElement('div');
    bot.className='bubble bubble--sys';
    bot.textContent = 'Thanks — this is a static demo. In your build this would call the agent’s API.';
    chat.appendChild(bot);
    chat.scrollTop = chat.scrollHeight;
  },500);
}
