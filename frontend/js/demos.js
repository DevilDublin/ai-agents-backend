// Config
let BACKEND=""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

// Elements
const wrap = document.getElementById('orbit-wrap');
const orbits = document.getElementById('orbits');
const ctx = orbits.getContext('2d');
const tooltip = document.getElementById('orbit-tooltip');

let W,H,t=0, hoverIdx=-1, hoverSince=0, beamStart=0, beamActive=false;

// Resize
function size(){ orbits.width = wrap.clientWidth; orbits.height = wrap.clientHeight; W=orbits.width; H=orbits.height; }
addEventListener('resize', size); size();

// Rings computed from viewport; nodes at outer ring
function metrics(){
  const base = Math.min(W,H);
  const outer = Math.max(320, base/2 - 80);   // outer ring (node ring)
  const mid   = outer - 70;
  const inner = outer - 140;
  return {outer, mid, inner};
}
const center = () => ({x: W/2, y: H/2});

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Qualifies, proposes times, and books meetings end‑to‑end.', angle: -Math.PI/2},
  {label:'Support Q&A', key:'support', desc:'Answers from your policies with confidence and escalation.', angle: 0},
  {label:'Automation Planner', key:'automation', desc:'Describe a process → get a runnable workflow blueprint.', angle: Math.PI/2},
  {label:'Internal Knowledge', key:'internal', desc:'Auto‑routes HR vs Sales and answers from your handbook.', angle: Math.PI},
];

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function drawHoloCore(c, outer){
  // Pulsing glow and larger hex to fit title
  const pulse = 1 + Math.sin(t*2)*0.06;
  const glowR = Math.min(outer*0.55, 120) * pulse;
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,glowR);
  g.addColorStop(0,'rgba(185,138,255,0.55)');
  g.addColorStop(0.6,'rgba(185,138,255,0.14)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  // Hex
  const hexR = Math.min(outer*0.35, 95);
  ctx.strokeStyle='rgba(255,255,255,0.16)'; ctx.lineWidth=2;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i + 0.08*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  // Title text inside hex (non-selectable)
  ctx.save();
  ctx.fillStyle='#EDEBFF';
  ctx.font='600 20px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);
  ctx.restore();
}

function draw(){
  t += 0.016; ctx.clearRect(0,0,W,H);
  const c = center();
  const M = metrics();

  // Rings
  [M.inner, M.mid, M.outer].forEach((Rr,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,Rr,0,Math.PI*2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i*0.02})`; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });

  // Node positions on outer ring
  nodes.forEach(n=>{
    n.r = M.outer;
    n.x = c.x + Math.cos(n.angle)*n.r;
    n.y = c.y + Math.sin(n.angle)*n.r;
  });

  // Beam animation
  if(hoverIdx>-1){
    if(!beamActive){ beamActive=true; beamStart=performance.now(); }
    const n = nodes[hoverIdx];
    const elapsed = (performance.now() - beamStart)/600;
    const len = Math.min(1, elapsed);
    const bx = c.x + (n.x - c.x)*len;
    const by = c.y + (n.y - c.y)*len;
    const grad = ctx.createLinearGradient(c.x, c.y, bx, by);
    grad.addColorStop(0,'rgba(185,138,255,0)'); grad.addColorStop(1,'rgba(185,138,255,0.85)');
    ctx.strokeStyle = grad; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  } else { beamActive=false; }

  // Nodes (dim siblings when hovering)
  nodes.forEach((n,i)=>{
    const dim = (hoverIdx>-1 && hoverIdx!==i);
    ctx.globalAlpha = dim?0.5:1;
    ctx.fillStyle = dim? 'rgba(26,22,44,.55)' : 'rgba(26,22,44,.9)';
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    roundRect(ctx, n.x-120, n.y-24, 240, 48, 14); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = dim?0.6:1;
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  // Centre core & text
  drawHoloCore(c, M.outer);

  requestAnimationFrame(draw);
}
draw();

// Hover / tooltip / click
orbits.addEventListener('mousemove', e=>{
  const rect = orbits.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  let idx = -1;
  nodes.forEach((n,i)=>{ if(Math.abs(mx-n.x) < 130 && Math.abs(my-n.y) < 34) idx = i; });
  if(idx !== hoverIdx){ hoverIdx = idx; hoverSince = performance.now(); tooltip.style.display='none'; }
  else {
    if(hoverIdx>-1 && performance.now() - hoverSince > 550){
      const n = nodes[hoverIdx];
      tooltip.textContent = n.desc;
      tooltip.style.left = (n.x + 16) + 'px';
      tooltip.style.top = (n.y - 16) + 'px';
      tooltip.style.display = 'block';
    }
  }
  orbits.style.cursor = hoverIdx>-1 ? 'pointer' : 'default';
});
orbits.addEventListener('mouseleave', ()=>{ hoverIdx=-1; tooltip.style.display='none'; });
orbits.addEventListener('click', ()=>{ if(hoverIdx>-1) openAgent(nodes[hoverIdx].key); });

// Modal chat
const overlay = document.getElementById('overlay');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgExamples = document.getElementById('dlg-examples');

const intros = {
  appointment: "Hello! 👋 I can help schedule a meeting. What’s your budget or target scope to start with?",
  support: "Hi — ask me about returns, shipping, warranty or support hours and I’ll answer from policy.",
  automation: "Hello! Tell me what you’d like to automate and I’ll sketch a clear, step‑by‑step workflow.",
  internal: "Hello! Ask me an HR or Sales question; I’ll route it to the right knowledge automatically."
};
const examples = {
  appointment: [
    ["Try: intro + budget","Hello, I’d like a 30‑minute intro next week. Budget is £2k per month."],
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
    ["Try: lead flow","When a lead completes a form, enrich with Clearbit, score in GHL, push to CRM, then post to Slack and e‑mail."],
    ["Try: weekly summary","Create a weekly ops summary from Airtable and e‑mail it to the team with KPIs."]
  ],
  internal: [
    ["HR: holiday policy","What is the holiday policy?"],
    ["Sales: stages","What are the sales stages?"]
  ]
};
let current=null, sessionId=null;

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent = ({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key] || 'Agent';
  dlgChat.innerHTML=''; dlgExamples.innerHTML='';
  (examples[key]||[]).forEach(([label, fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });
  bubble(dlgChat, intros[key]||'Hello!');
  overlay.style.display='flex'; dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function bubble(parent, text, me=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':''); div.textContent=text; parent.appendChild(div); parent.scrollTop=parent.scrollHeight;
}
function onEnter(input, fn){ input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); fn(); } }); }
function postJSON(url, body){
  const ctl = new AbortController(); const t=setTimeout(()=>ctl.abort(), 20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}
function sendMsg(){
  const msg=(dlgInput.value||'').trim(); if(!msg || !current) return;
  bubble(dlgChat, msg, true); dlgInput.value='';
  if(current==='appointment') return postJSON(`${BACKEND}/appointment`, {message:msg, sessionId}).then(r=> bubble(dlgChat, r.reply||'…')).catch(()=> bubble(dlgChat,'Cannot reach backend.'));
  if(current==='support') return postJSON(`${BACKEND}/support`, {message:msg}).then(r=> bubble(dlgChat, r.reply||'…')).catch(()=> bubble(dlgChat,'Cannot reach backend.'));
  if(current==='automation') return postJSON(`${BACKEND}/automation`, {message:msg}).then(r=> bubble(dlgChat, r.reply||'…')).catch(()=> bubble(dlgChat,'Cannot reach backend.'));
  if(current==='internal') return postJSON(`${BACKEND}/internal`, {message:msg}).then(r=> bubble(dlgChat, r.reply||'…')).catch(()=> bubble(dlgChat,'Cannot reach backend.'));
}
dlgSend.addEventListener('click', sendMsg); onEnter(dlgInput, sendMsg);
