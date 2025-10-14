let BACKEND=""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

const wrap = document.getElementById('orbit-wrap');
const canvas = document.getElementById('orbits');
const ctx = canvas.getContext('2d');
const tip = document.getElementById('orbit-tooltip');

let W,H,t=0, hover=-1, beamStart=0, beamActive=false;
function size(){ canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; W=canvas.width; H=canvas.height; }
addEventListener('resize', size); size();

function metrics(){
  const base = Math.min(W,H);
  const outer = Math.max(280, base/2 - 80);
  return {outer, mid: outer-70, inner: outer-140};
}
const center = ()=>({x:W/2, y:H/2});

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Books intros; gathers budget, time and e-mail cleanly.', angle:-Math.PI/2, tipDir:'top'},
  {label:'Support Q&A',       key:'support',     desc:'Helps with returns, delivery and warranty.',          angle: 0,              tipDir:'right'},
  {label:'Automation Planner',key:'automation',  desc:'Sketches a step-by-step workflow you can run.',       angle: Math.PI/2,      tipDir:'bottom'},
  {label:'Internal Knowledge',key:'internal',    desc:'Answers HR and Sales questions clearly.',             angle: Math.PI,        tipDir:'left'}
];

function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function drawCore(c, outer){
  const pulse = 1 + Math.sin(t*2)*0.06;
  const glowR = Math.min(outer*0.55, 110) * pulse;
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,glowR);
  g.addColorStop(0,'rgba(185,138,255,0.55)');
  g.addColorStop(0.6,'rgba(185,138,255,0.14)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  const hexR = Math.min(outer*0.22, 60);
  ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=2;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i + 0.08*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  ctx.save();
  ctx.fillStyle='#EDEBFF';
  ctx.font='700 18px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);
  ctx.restore();
}

function draw(){
  t += 0.016; ctx.clearRect(0,0,W,H);
  const c = center(); const M = metrics();

  [M.inner, M.mid, M.outer].forEach((Rr,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,Rr,0,Math.PI*2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i*0.02})`; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });

  nodes.forEach(n=>{
    n.r = M.outer;
    n.x = c.x + Math.cos(n.angle)*n.r;
    n.y = c.y + Math.sin(n.angle)*n.r;
  });

  if(hover>-1){
    if(!beamActive){ beamActive=true; beamStart=performance.now(); }
    const n = nodes[hover];
    const elapsed = (performance.now() - beamStart)/550;
    const len = Math.min(1, elapsed);
    const bx = c.x + (n.x - c.x)*len;
    const by = c.y + (n.y - c.y)*len;
    const grad = ctx.createLinearGradient(c.x, c.y, bx, by);
    grad.addColorStop(0,'rgba(185,138,255,0)'); grad.addColorStop(1,'rgba(185,138,255,0.85)');
    ctx.strokeStyle = grad; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  } else { beamActive=false; }

  nodes.forEach((n,i)=>{
    const dim = (hover>-1 && hover!==i);
    ctx.globalAlpha = dim?0.5:1;
    ctx.fillStyle = dim? 'rgba(26,22,44,.55)' : 'rgba(26,22,44,.9)';
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    roundRect(n.x-120, n.y-24, 240, 48, 14); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = dim?0.6:1;
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  drawCore(c, M.outer);
  requestAnimationFrame(draw);
}
draw();

function showTip(n){
  tip.textContent = n.desc; tip.style.display='block';
  const pad=16;
  if(n.tipDir==='left'){
    tip.style.left = (n.x - tip.offsetWidth - pad) + 'px';
    tip.style.top  = (n.y - tip.offsetHeight/2) + 'px';
  } else if(n.tipDir==='right'){
    tip.style.left = (n.x + pad) + 'px';
    tip.style.top  = (n.y - tip.offsetHeight/2) + 'px';
  } else if(n.tipDir==='top'){
    tip.style.left = (n.x - tip.offsetWidth/2) + 'px';
    tip.style.top  = (n.y - tip.offsetHeight - pad) + 'px';
  } else {
    tip.style.left = (n.x - tip.offsetWidth/2) + 'px';
    tip.style.top  = (n.y + pad) + 'px';
  }
}

canvas.addEventListener('mousemove', e=>{
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  let idx = -1;
  nodes.forEach((n,i)=>{ if(Math.abs(mx-n.x) < 130 && Math.abs(my-n.y) < 34) idx = i; });
  if(idx !== hover){ hover = idx; tip.style.display='none'; }
  if(hover>-1) showTip(nodes[hover]);
  canvas.style.cursor = hover>-1 ? 'pointer' : 'default';
});
canvas.addEventListener('mouseleave', ()=>{ hover=-1; tip.style.display='none'; });
canvas.addEventListener('click', ()=>{ if(hover>-1) openAgent(nodes[hover].key); });

const overlay = document.getElementById('overlay');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgExamples = document.getElementById('dlg-examples');
const exTitle = document.getElementById('dlg-examples-title');
const micBtn = document.getElementById('dlg-mic');

const intros = {
  appointment: "Hello! I can book a meeting for you. I can answer one or two general questions as well, but my main job is scheduling. What’s your budget or scope to start with?",
  support: "Hi — ask me about returns, shipping, warranty or support hours and I’ll answer from policy.",
  automation: "Tell me what you’d like to automate and I’ll sketch a clear, step-by-step workflow.",
  internal: "Ask me an HR or Sales question; I’ll route it to the right knowledge automatically."
};
const examples = {
  appointment: [
    ["Try: intro + budget","Hello, I’d like a 30-minute intro next week. Budget is £2k per month."],
    ["Try: propose time","Could you do Tuesday 2–4pm?"],
    ["Try: contact","Use alex@example.com for the invite."],
    ["Try: confirm","yes"]
  ],
  support: [
    ["Try: nuanced returns","What is your returns policy for opened but unused items?"],
    ["Try: shipping speed","How fast is expedited shipping to London?"],
    ["Try: weekend hours","When is your support team available on weekends?"]
  ],
  automation: [
    ["Try: lead flow","When a lead completes a form, enrich with Clearbit, score, push to CRM, post to Slack and e-mail."],
    ["Try: weekly summary","Create a weekly ops summary from Airtable and e-mail it to the team with KPIs."]
  ],
  internal: [
    ["HR: holiday policy","What is the holiday policy?"],
    ["Sales: stages","What are the sales stages?"]
  ]
};
let current=null, sessionId=null;

function bubble(text, me=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':'');
  div.textContent=text;
  dlgChat.appendChild(div);
  dlgChat.scrollTop=dlgChat.scrollHeight;
}

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent = ({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key] || 'Agent';
  dlgChat.innerHTML=''; dlgExamples.innerHTML=''; exTitle.textContent='Try these:';
  (examples[key]||[]).forEach(([label, fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });
  bubble(intros[key]||'Hello!');
  overlay.style.display='flex'; dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; stopSTT(); }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function postJSON(url, body){
  const ctl = new AbortController(); const t=setTimeout(()=>ctl.abort(), 20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}

function send(){
  const msg=(dlgInput.value||'').trim(); if(!msg || !current) return;
  bubble(msg, true); dlgInput.value='';
  stopSTT();
  const path = current==='appointment' ? '/appointment'
            : current==='support' ? '/support'
            : current==='automation' ? '/automation'
            : '/internal';
  const payload = current==='appointment' ? {message:msg, sessionId} : {message:msg};
  postJSON(`${BACKEND}${path}`, payload)
    .then(r=> bubble(r.reply||'…'))
    .catch(()=> bubble('Cannot reach backend.'));
}
dlgSend.addEventListener('click', send);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } });

/* Speech to text — simple toggle, interim into the input */
let rec=null, sttOn=false, finalText="", interimText="";
function initSTT(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return null;
  const r = new SR(); r.continuous=true; r.interimResults=true; r.lang='en-GB';
  r.onresult = (ev)=>{
    interimText=''; finalText='';
    for(let i=ev.resultIndex;i<ev.results.length;i++){
      const t = ev.results[i][0].transcript;
      if(ev.results[i].isFinal) finalText += t;
      else interimText += t;
    }
    dlgInput.value = (dlgInput.value.trim() ? dlgInput.value + ' ' : '') + (finalText || interimText);
  };
  r.onend = ()=> { if(sttOn) r.start(); };
  return r;
}
function startSTT(){ if(sttOn) return; if(!rec) rec = initSTT(); if(!rec) return; sttOn=true; micBtn.classList.add('active'); rec.start(); }
function stopSTT(){ if(!sttOn) return; sttOn=false; micBtn.classList.remove('active'); if(rec) try{rec.stop();}catch{} }
micBtn.addEventListener('click', ()=> sttOn ? stopSTT() : startSTT());
