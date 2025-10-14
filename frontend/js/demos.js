// Config
let BACKEND = ""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

// Elements
const wrap = document.getElementById('orbit-wrap');
const canvas = document.getElementById('orbits');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('orbit-tooltip');
let W,H,t=0, hoverIdx=-1, beamStart=0;

// Resize & metrics
function size(){ canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; W=canvas.width; H=canvas.height; }
addEventListener('resize', size); size();
function center(){ return {x: W/2, y: H/2}; }
function metrics(){
  const base = Math.min(W,H);
  const ringOuter = Math.max(280, base/2 - 40);
  const ringMid = ringOuter - 70;
  const ringInner = ringOuter - 140;
  return {outer:ringOuter, mid:ringMid, inner:ringInner};
}

// Nodes + tooltip side
const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Books qualified meetings end-to-end.', side:'top', angle:-Math.PI/2},
  {label:'Support Q&A', key:'support', desc:'Helps with returns, delivery and warranty.', side:'right', angle:0},
  {label:'Automation Planner', key:'automation', desc:'Describe a process → get a runnable plan.', side:'bottom', angle:Math.PI/2},
  {label:'Internal Knowledge', key:'internal', desc:'Answers HR and Sales questions clearly.', side:'left', angle:Math.PI},
];

// UI primitives
function roundRect(c, x, y, w, h, r){
  c.beginPath();
  c.moveTo(x+r, y);
  c.arcTo(x+w, y, x+w, y+h, r);
  c.arcTo(x+w, y+h, x, y+h, r);
  c.arcTo(x, y+h, x, y, r);
  c.arcTo(x, y, x+w, y, r);
  c.closePath();
}

// Draw
function draw(){
  t += 0.016; ctx.clearRect(0,0,W,H);
  const c = center(), M = metrics();

  // rings + axes
  [M.inner, M.mid, M.outer].forEach((r,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,r,0,Math.PI*2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i*0.02})`; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });
  ctx.strokeStyle='rgba(185,138,255,.08)';
  ctx.beginPath(); ctx.moveTo(c.x, c.y - M.outer); ctx.lineTo(c.x, c.y + M.outer); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c.x - M.outer, c.y); ctx.lineTo(c.x + M.outer, c.y); ctx.stroke();

  // Node positions
  nodes.forEach(n=>{
    n.r=M.outer; n.x=c.x + Math.cos(n.angle)*n.r; n.y=c.y + Math.sin(n.angle)*n.r;
  });

  // Beam
  if(hoverIdx>-1){
    const n = nodes[hoverIdx];
    const elapsed = Math.min(1, (performance.now()-beamStart)/600);
    const bx = c.x + (n.x - c.x)*elapsed;
    const by = c.y + (n.y - c.y)*elapsed;
    const g = ctx.createLinearGradient(c.x, c.y, bx, by);
    g.addColorStop(0,'rgba(185,138,255,0)'); g.addColorStop(1,'rgba(185,138,255,.85)');
    ctx.strokeStyle=g; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  }

  // Nodes
  nodes.forEach((n,i)=>{
    const dim = (hoverIdx>-1 && hoverIdx!==i);
    ctx.globalAlpha = dim?0.55:1;
    ctx.fillStyle = 'rgba(26,22,44,.9)'; ctx.strokeStyle='rgba(255,255,255,.08)';
    roundRect(ctx,n.x-120,n.y-24,240,48,14); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  // Centre hex glow
  const glowR = Math.min(M.outer*0.25, 110);
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,glowR);
  g.addColorStop(0,'rgba(185,138,255,.55)');
  g.addColorStop(0.6,'rgba(185,138,255,.14)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  // Hex
  const hexR = Math.min(M.outer*0.18, 64);
  ctx.strokeStyle='rgba(255,255,255,.16)'; ctx.lineWidth=2; ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i + 0.08*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  // Title in hex
  ctx.fillStyle='#EDEBFF'; ctx.font='700 18px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);

  requestAnimationFrame(draw);
}
draw();

// Hover → tooltip
canvas.addEventListener('mousemove', e=>{
  const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  let idx=-1;
  nodes.forEach((n,i)=>{ if(Math.abs(mx-n.x)<130 && Math.abs(my-n.y)<34) idx=i; });
  if(idx!==hoverIdx){
    hoverIdx=idx;
    if(idx>-1){
      beamStart=performance.now();
      const n=nodes[idx];
      tooltip.textContent=n.desc;
      tooltip.className=''; // reset
      tooltip.classList.add('show','arrow');
      if(n.side==='top'){ tooltip.classList.add('tip-top'); tooltip.style.left = `${n.x}px`; tooltip.style.top = `${n.y-56}px`; }
      if(n.side==='right'){ tooltip.classList.add('tip-right'); tooltip.style.left = `${n.x+140}px`; tooltip.style.top = `${n.y}px`; }
      if(n.side==='left'){ tooltip.classList.add('tip-left'); tooltip.style.left = `${n.x-140}px`; tooltip.style.top = `${n.y}px`; }
      if(n.side==='bottom'){ tooltip.classList.add('tip-bottom'); tooltip.style.left = `${n.x}px`; tooltip.style.top = `${n.y+56}px`; }
    } else {
      tooltip.className=''; tooltip.style.left='-9999px';
    }
  }
});
canvas.addEventListener('mouseleave',()=>{ hoverIdx=-1; tooltip.className=''; });

// Click → open agent
canvas.addEventListener('click', ()=>{
  if(hoverIdx>-1) openAgent(nodes[hoverIdx].key);
});

// Modal chat
const overlay = document.getElementById('overlay');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgExamples = document.getElementById('dlg-examples');

const intros = {
  appointment: "Hello! 👋 I can help schedule a meeting. I can handle a couple of general questions too, but my main job is booking your call. What’s your budget or target scope to start with?",
  support: "Hi — ask me about returns, shipping, warranty or support hours and I’ll answer from policy.",
  automation: "Hello! Tell me what you’d like to automate and I’ll sketch a clear, step-by-step workflow.",
  internal: "Hello! Ask me an HR or Sales question; I’ll route it to the right knowledge automatically."
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
    ["Try: lead flow","When a lead completes a form, enrich with Clearbit, score in GHL, push to CRM, then post to Slack and e-mail."],
    ["Try: weekly summary","Create a weekly ops summary from Airtable and e-mail it to the team with KPIs."]
  ],
  internal: [
    ["HR: holiday policy","What is the holiday policy?"],
    ["Sales: stages","What are the sales stages?"]
  ]
};

let current=null, sessionId=null;
function bubble(parent,text,me=false,cls=""){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':'')+(cls?(' '+cls):''); div.textContent=text;
  parent.appendChild(div); parent.scrollTop=parent.scrollHeight;
}

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent = ({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key] || 'Agent';
  dlgChat.innerHTML=''; dlgExamples.innerHTML='';
  const hint=document.createElement('span'); hint.className='hint'; hint.textContent='Tip: click a chip to paste';
  (examples[key]||[]).forEach(([label, fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });
  dlgExamples.appendChild(hint);
  bubble(dlgChat, intros[key]||'Hello!', false, 'intro');
  overlay.style.display='flex'; dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; stopListening(); dlgGhost.textContent=""; }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

// Send
function postJSON(url, body){
  const ctl=new AbortController(); const to=setTimeout(()=>ctl.abort(),20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(to); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}

function sendMsg(){
  const msg=(dlgInput.value||'').trim(); if(!msg || !current) return;
  bubble(dlgChat,msg,true); dlgInput.value=''; dlgGhost.textContent=''; stopListening();
  const path = current==='appointment'? '/appointment' :
               current==='support'? '/support' :
               current==='automation'? '/automation' : '/internal';
  const payload = current==='appointment' ? {message:msg, sessionId} : {message:msg};
  postJSON(`${BACKEND}${path}`, payload)
    .then(r=> bubble(dlgChat, (r.reply||'…')))
    .catch(()=> bubble(dlgChat,'Cannot reach backend.'));
}
dlgSend.addEventListener('click', sendMsg);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});

// Mic (Web Speech API) – glow, live ghost line, auto stop on Send
const micBtn = document.getElementById('dlg-mic');
const dlgGhost = document.getElementById('dlg-ghost');
let recog=null, listening=false, interimCache="";
function ensureRecog(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return null;
  if(!recog){ recog = new SR(); recog.lang='en-GB'; recog.continuous=true; recog.interimResults=true; }
  return recog;
}
function startListening(){
  const r=ensureRecog(); if(!r || listening) return;
  listening=true; micBtn.classList.add('listening'); dlgGhost.innerHTML='<span class="pulse"></span>';
  interimCache="";
  r.onresult = (ev)=>{
    let finalText="", interim="";
    for(let i=ev.resultIndex;i<ev.results.length;i++){
      const res=ev.results[i];
      if(res.isFinal){ finalText += res[0].transcript; }
      else { interim += res[0].transcript; }
    }
    if(interim){ dlgGhost.textContent = (dlgInput.value? dlgInput.value+" " : "") + interim; dlgGhost.innerHTML += '<span class="pulse"></span>'; }
    if(finalText){
      const merged = (dlgInput.value+" "+finalText).replace(/\s+/g,' ').trim();
      dlgInput.value = merged;
      dlgGhost.textContent = ""; dlgGhost.innerHTML='<span class="pulse"></span>';
    }
  };
  r.onend = ()=>{ if(listening) r.start(); };
  try{ r.start(); }catch{}
}
function stopListening(){
  if(!recog || !listening) return;
  listening=false; micBtn.classList.remove('listening'); try{ recog.stop(); }catch{}
}
micBtn.addEventListener('click', ()=> listening? stopListening(): startListening());
