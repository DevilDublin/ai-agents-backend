let BACKEND=""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

const wrap = document.getElementById('orbit-wrap');
const canvas = document.getElementById('orbits');
const tip = document.getElementById('orbit-tooltip');
const ctx = canvas.getContext('2d');

let W,H,t=0, hover=-1;

function size(){
  canvas.width = wrap.clientWidth;
  canvas.height = Math.max(540, wrap.clientWidth * 0.45);
  W=canvas.width; H=canvas.height;
}
addEventListener('resize', size); size();

function center(){ return {x: W/2, y:H/2}; }
function metrics(){
  const R = Math.min(W,H)*0.36;
  return {outer:R, mid:R*0.76, inner:R*0.52, core:R*0.22};
}

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Books qualified meetings and handles dates cleanly.', where:'top'},
  {label:'Support Q&A', key:'support', desc:'Helps with returns, delivery and warranty.', where:'right'},
  {label:'Automation Planner', key:'automation', desc:'Turns rough ideas into clear workflows.', where:'bottom'},
  {label:'Internal Knowledge', key:'internal', desc:'Answers HR and Sales questions clearly.', where:'left'}
];

function layout(){
  const c = center(); const m = metrics();
  const angles = [-Math.PI/2, 0, Math.PI/2, Math.PI];
  nodes.forEach((n,i)=>{
    n.r = m.outer;
    n.x = c.x + Math.cos(angles[i])*n.r;
    n.y = c.y + Math.sin(angles[i])*n.r;
  });
}

function drawRings(){
  const c=center(), m=metrics();
  const rings=[m.outer,m.mid,m.inner];
  ctx.setLineDash([6,8]); ctx.lineWidth=1.2;
  rings.forEach((R,i)=>{ ctx.strokeStyle=`rgba(185,138,255,${0.06 + i*0.04})`; ctx.beginPath(); ctx.arc(c.x,c.y,R,0,Math.PI*2); ctx.stroke(); });
  ctx.setLineDash([]);
}

function drawCore(){
  const c=center(), m=metrics();
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,m.core*2.1);
  g.addColorStop(0,'rgba(185,138,255,.9)'); g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,m.core*1.2,0,Math.PI*2); ctx.fill();
  const hexR = m.core*0.9; ctx.strokeStyle='rgba(255,255,255,.28)'; ctx.lineWidth=2;
  ctx.beginPath(); for(let i=0;i<6;i++){ const a=(Math.PI/3)*i+0.1; const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.stroke();
  ctx.fillStyle='#f2ecff'; ctx.font='700 18px Inter,system-ui'; ctx.textAlign='center'; ctx.fillText('Select your demo', c.x, c.y+6);
}

function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

function drawNodes(){
  nodes.forEach((n,i)=>{
    const dim = (hover>-1 && hover!==i);
    ctx.globalAlpha = dim?0.55:1;
    const w=240,h=44,r=14;
    roundRect(n.x-w/2, n.y-h/2, w, h, r);
    ctx.fillStyle='rgba(26,22,44,.86)'; ctx.fill();
    ctx.lineWidth=1; ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.stroke();
    ctx.fillStyle='#EDEBFF'; ctx.font='600 15px Inter,system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });
}

function draw(){
  t+=0.016; ctx.clearRect(0,0,W,H); layout(); drawRings(); drawCore(); drawNodes(); requestAnimationFrame(draw);
}
draw();

function hit(mx,my){ for(let i=0;i<nodes.length;i++){ const n=nodes[i]; if(Math.abs(mx-n.x)<=120 && Math.abs(my-n.y)<=22) return i; } return -1; }

canvas.addEventListener('mousemove', e=>{
  const r = canvas.getBoundingClientRect(); const mx=e.clientX-r.left, my=e.clientY-r.top;
  const idx=hit(mx,my);
  if(idx!==hover){ hover=idx; if(idx>-1){ showTip(nodes[idx]); } else { tip.style.display='none'; } }
  canvas.style.cursor = hover>-1 ? 'pointer' : 'default';
});

function showTip(n){
  tip.textContent = n.desc;
  const offset=16;
  let left=n.x, top=n.y;
  if(n.where==='left'){ left = n.x-240; top = n.y-28; }
  if(n.where==='right'){ left = n.x+20; top = n.y-28; }
  if(n.where==='top'){ left = n.x-100; top = n.y-62; }
  if(n.where==='bottom'){ left = n.x-110; top = n.y+32; }
  tip.style.left = left+'px'; tip.style.top = top+'px'; tip.style.display='block';
}

canvas.addEventListener('mouseleave', ()=>{ hover=-1; tip.style.display='none'; });
canvas.addEventListener('click', ()=>{ if(hover>-1) openAgent(nodes[hover].key); });

/* Modal chat behaviour (no change to your backend) */
const overlay = document.getElementById('overlay');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgClose = document.getElementById('dlg-close');
const exTitle = document.getElementById('dlg-examples-title');
const exWrap = document.getElementById('dlg-examples');
const micBtn = document.getElementById('dlg-mic');
const ghost = document.getElementById('dlg-ghost');

const EXAMPLES = {
  appointment: [
    ["Intro + budget", "Hello, I’d like a 30-minute intro next week. Budget is £2k per month."],
    ["Propose time", "Could you do Tuesday 2–4pm?"],
    ["Contact", "Use alex@example.com for the invite."]
  ],
  support: [
    ["Nuanced returns", "What is your returns policy for opened but unused items?"],
    ["Shipping speed", "How fast is expedited shipping to London?"],
    ["Weekend hours", "When is support available on weekends?"]
  ],
  automation: [
    ["Lead flow", "When a lead completes a form, enrich with Clearbit, score, push to CRM, then post to Slack and e-mail."],
    ["Weekly summary", "Create a weekly ops summary from Airtable and e-mail it to the team with KPIs."]
  ],
  internal: [
    ["HR policy", "What is the holiday policy?"],
    ["Sales stages", "What are the sales stages?"]
  ]
};
const TITLES = {appointment:'Appointment Setter', support:'Support Q&A', automation:'Automation Planner', internal:'Internal Knowledge'};
const GREET = {
  appointment:"Hello! I can help schedule a meeting. What’s your budget or target scope to start with?",
  support:"Hi — ask me about returns, shipping, warranty or support hours.",
  automation:"Tell me what you’d like to automate and I’ll sketch a clear, step-by-step workflow.",
  internal:"Ask me an HR or Sales question; I’ll route it to the right knowledge automatically."
};
let current=null, sessionId=null, rec=null, listening=false;

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent = TITLES[key] || 'Agent';
  dlgChat.innerHTML='';
  exWrap.innerHTML=''; exTitle.textContent='Try these';
  (EXAMPLES[key]||[]).forEach(([label,fill])=>{
    const s=document.createElement('span'); s.className='chip'; s.textContent=label; s.dataset.fill=fill;
    s.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    exWrap.appendChild(s);
  });
  bubble(GREET[key]||'Hello!', false, true);
  overlay.style.display='flex'; dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; tip.style.display='none'; }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function bubble(text, me=false, intro=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':'')+(intro?' intro':'');
  div.textContent=text;
  dlgChat.appendChild(div); dlgChat.scrollTop=dlgChat.scrollHeight;
}

function postJSON(url, body){ return fetch(url,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)}).then(r=>r.json()); }

function sendMsg(){
  const msg=(dlgInput.value||'').trim(); if(!msg||!current) return;
  bubble(msg,true); dlgInput.value=''; ghost.textContent='';
  let path = current; const body = {message:msg}; if(current==='appointment') body.sessionId=sessionId;
  postJSON(`${BACKEND}/${path}`, body).then(r=> bubble(r.reply || '…')).catch(()=> bubble('Cannot reach backend right now.'));
}
dlgSend.addEventListener('click', sendMsg);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); } });

/* Speech-to-text with ghost shimmer */
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  rec = new SR(); rec.lang='en-GB'; rec.interimResults=true; rec.continuous=true;

  rec.onresult = (e)=>{
    let interim = '', final = dlgInput.value;
    for(let i=e.resultIndex;i<e.results.length;i++){
      const txt = e.results[i][0].transcript;
      if(e.results[i].isFinal) final += (final?' ':'') + txt.trim();
      else interim += txt;
    }
    dlgInput.value = final.trim();
    ghost.textContent = interim.trim();
    ghost.className = interim ? 'typing-ghost' : '';
  };
  rec.onend = ()=>{ listening=false; micBtn.textContent='🎤'; ghost.textContent=''; ghost.className=''; };
  rec.onerror = ()=>{ listening=false; micBtn.textContent='🎤'; ghost.textContent=''; ghost.className=''; };
  micBtn.addEventListener('click', ()=>{
    if(listening){ rec.stop(); return; }
    if(!current) return;
    try{ rec.start(); listening=true; micBtn.textContent='⏹'; }catch{}
  });
} else {
  micBtn.style.display='none';
}
