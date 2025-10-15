const pills = [...document.querySelectorAll('.bot-pill')];
const tooltip = document.getElementById('orbit-tooltip');
const pointer = document.getElementById('pointer').querySelector('line');
const centre = {x: window.innerWidth/2, y: document.querySelector('.orbit-wrap').getBoundingClientRect().top + 310};

function placeTooltip(el){
  const rect = el.getBoundingClientRect();
  tooltip.textContent = el.dataset.tip || '';
  tooltip.style.display = 'block';
  const side = el.classList.contains('left') ? 'left' :
               el.classList.contains('right') ? 'right' :
               el.classList.contains('top') ? 'top' : 'bottom';
  const pad = 12;
  let x=0,y=0;
  if(side==='left'){ x = rect.left - tooltip.offsetWidth - pad; y = rect.top + rect.height/2 - tooltip.offsetHeight/2; }
  if(side==='right'){ x = rect.right + pad; y = rect.top + rect.height/2 - tooltip.offsetHeight/2; }
  if(side==='top'){ x = rect.left + rect.width/2 - tooltip.offsetWidth/2; y = rect.top - tooltip.offsetHeight - pad; }
  if(side==='bottom'){ x = rect.left + rect.width/2 - tooltip.offsetWidth/2; y = rect.bottom + pad; }
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;

  const end = {x: rect.left + rect.width/2, y: rect.top + rect.height/2};
  pointer.setAttribute('x1', centre.x);
  pointer.setAttribute('y1', centre.y);
  pointer.setAttribute('x2', end.x);
  pointer.setAttribute('y2', end.y);
  pointer.parentElement.style.display='block';
}
function hideTooltip(){
  tooltip.style.display='none';
  pointer.parentElement.style.display='none';
}

pills.forEach(p=>{
  p.addEventListener('mouseenter', ()=>placeTooltip(p));
  p.addEventListener('mouseleave', hideTooltip);
});

const overlay = document.getElementById('dlg');
const closeBtn = document.getElementById('dlg-close');
const chat = document.getElementById('dlg-chat');
const input = document.getElementById('dlg-input');
const sendBtn = document.getElementById('send');
const title = document.getElementById('dlg-title');
const sub = document.getElementById('dlg-sub');

const presets = {
  appoint:{title:'Appointment Setter', sub:'Books meetings from website or email'},
  support:{title:'Support Q&A', sub:'Answers from your policy and docs'},
  internal:{title:'Internal Knowledge', sub:'Answers HR and Sales questions'},
  planner:{title:'Automation Planner', sub:'Plans multi-step automations'}
};

function openDlg(key){
  title.textContent = presets[key].title;
  sub.textContent = presets[key].sub;
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
  input.focus();
}
function closeDlg(){
  overlay.style.display='none';
  document.body.style.overflow='';
}

pills.forEach(p=>{
  p.addEventListener('click', ()=>{
    openDlg(p.dataset.bot);
  });
});
closeBtn.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function appendBubble(text, me=false){
  const b = document.createElement('div');
  b.className = 'bubble' + (me?' me':'');
  b.textContent = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}
sendBtn.addEventListener('click', ()=>{
  const v = input.value.trim();
  if(!v) return;
  appendBubble(v, true);
  input.value='';
  setTimeout(()=>appendBubble('Thanks — this is a static demo. In your build this would call the agent’s API.'), 500);
});
input.addEventListener('keydown', e=>{
  if(e.key==='Enter'){ sendBtn.click(); }
});

initVoice('#mic', '#dlg-input', '#ghost', ()=>sendBtn.click());
