const API_BASE = (window.AGENT_API_BASE || 'https://ai-agents-backend-pejo.onrender.com').replace(/\/$/,'');
const wrap = document.getElementById('orbit-wrap');
const canvas = document.getElementById('orbits');
const tip = document.getElementById('orbit-tooltip');
const ctx = canvas.getContext('2d');

function layout() {
  const rect = wrap.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const cx = rect.width/2, cy = rect.height/2;
  const R1 = Math.min(rect.width, rect.height) * 0.23;
  const R2 = R1*1.55;
  const R3 = R1*2.1;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  [R1,R2,R3].forEach((r,i)=>{
    ctx.setLineDash([6,10]);
    ctx.strokeStyle = 'rgba(185,138,255,.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.strokeStyle = 'rgba(185,138,255,.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

  const nodes = [...wrap.querySelectorAll('.node')];
  const ring = R3; // snap to outer ring axis positions
  const pos = {
    setter:   { x: cx,       y: cy - ring,  place:'top'    },
    support:  { x: cx + ring,y: cy,         place:'right'  },
    internal: { x: cx - ring,y: cy,         place:'left'   },
    planner:  { x: cx,       y: cy + ring,  place:'bottom' }
  };

  nodes.forEach(n=>{
    const id = n.dataset.id;
    const p = pos[id];
    n.style.left = `${p.x}px`;
    n.style.top  = `${p.y}px`;
    n.dataset.place = p.place;
  });
}
window.addEventListener('resize', layout);
layout();

/* tooltips pinned away from labels */
function showTip(n) {
  const place = n.dataset.place;
  tip.textContent = n.dataset.tip;
  tip.style.display = 'block';
  const r = n.getBoundingClientRect();
  const pr = wrap.getBoundingClientRect();
  let x = r.left - pr.left, y = r.top - pr.top;

  if (place === 'left')  { x -= tip.offsetWidth + 16; y += r.height/2; tip.className = 'tip-left'; }
  if (place === 'right') { x += r.width + 16;         y += r.height/2; tip.className = 'tip-right'; }
  if (place === 'top')   { x += r.width/2;           y -= tip.offsetHeight + 16; tip.className = 'tip-top'; }
  if (place === 'bottom'){ x += r.width/2;           y += r.height + 16; tip.className = 'tip-bottom'; }

  tip.style.left = `${x}px`; tip.style.top = `${y}px`;
}
function hideTip(){ tip.style.display = 'none'; }
wrap.querySelectorAll('.node').forEach(n=>{
  n.addEventListener('mouseenter', ()=>showTip(n));
  n.addEventListener('mouseleave', hideTip);
  n.addEventListener('click', ()=>openDialog(n.dataset.id, n.textContent.trim()));
});

/* dialog + chat */
const overlay = document.getElementById('overlay');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat  = document.getElementById('dlg-chat');
const dlgInp   = document.getElementById('dlg-input');
const dlgGhost = document.getElementById('dlg-ghost');
const dlgSend  = document.getElementById('dlg-send');
const dlgMic   = document.getElementById('dlg-mic');
document.getElementById('dlg-close').onclick=()=>overlay.style.display='none';

const EXAMPLES = {
  setter: [
    'Hello, I’d like a 30-minute intro next week. Budget is £2k per month.',
    'Could you do Tuesday 2–4pm?',
    'Use alex@example.com for the invite.'
  ],
  support: ['Try: nuanced returns','Try: shipping speed','Try: weekend hours'],
  internal:['What’s our holiday policy?','Who approves £5k spend?','How do I request a laptop?'],
  planner: ['Draft a weekly ops summary from Airtable with KPIs',
            'Build a handover flow from chat to HubSpot',
            'Escalate VIP tickets and notify Slack']
};
const exWrap = document.getElementById('dlg-examples');

function openDialog(id, title){
  dlgTitle.textContent = title;
  exWrap.innerHTML = '';
  (EXAMPLES[id]||[]).forEach(t=>{
    const b = document.createElement('span'); b.className='chip'; b.textContent=t;
    b.onclick=()=>{ dlgInp.value=t; dlgInp.focus(); };
    exWrap.appendChild(b);
  });
  dlgChat.innerHTML = '';
  addBubble(`Hi — ask me about ${title.toLowerCase()}.`, false, true);
  overlay.style.display='flex';
  dlgInp.value=''; dlgGhost.textContent='';
}

function addBubble(text, me=false, intro=false){
  const div = document.createElement('div');
  div.className = 'bubble' + (me?' me':'') + (intro?' intro':'');
  div.textContent = text;
  dlgChat.appendChild(div);
  dlgChat.scrollTop = dlgChat.scrollHeight;
}

/* Voice input with “ink-flow” ghost */
let rec=null, active=false;
function startRec(){
  if (active) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('Speech recognition not supported in this browser.'); return; }
  rec = new SR(); rec.lang='en-GB'; rec.interimResults=true; rec.continuous=true;
  dlgMic.setAttribute('aria-pressed','true'); active=true;

  let latest = '';
  rec.onresult = e=>{
    let interim='', final='';
    for (const r of e.results){
      if (r.isFinal) final += r[0].transcript;
      else interim += r[0].transcript;
    }
    const text = (latest + final + interim).trimStart();
    dlgInp.value = (latest + final).trimStart();
    dlgGhost.textContent = interim;
  };
  rec.onend = ()=>{ stopRec(); };
  rec.start();
}
function stopRec(){
  if (!active) return;
  try{ rec && rec.stop(); }catch{}
  dlgMic.setAttribute('aria-pressed','false'); active=false;
  dlgGhost.textContent='';
}
dlgMic.onclick=()=> active ? stopRec() : startRec();

dlgSend.onclick = async ()=>{
  stopRec();
  const text = dlgInp.value.trim();
  if (!text) return;
  addBubble(text, true);
  dlgInp.value=''; dlgGhost.textContent='';

  // basic echo to keep the demo snappy; wire to your backend if needed
  try{
    const r = await fetch(`${API_BASE}/echo`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})});
    const j = await r.json().catch(()=>({text:""}));
    addBubble(j.text || "Thanks — noted. How else can I help?");
  }catch{
    addBubble("Thanks — noted. How else can I help?");
  }
};

/* keep tooltips correct after fonts render */
setTimeout(layout, 100);
