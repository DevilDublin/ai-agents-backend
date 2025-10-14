/* ... everything above draw() stays as in your working file ... */
const DEFAULT_BACKEND = "https://ai-agents-backend-pejo.onrender.com";
let BACKEND = DEFAULT_BACKEND;
setTimeout(() => { BACKEND = window.BACKEND_URL || DEFAULT_BACKEND; }, 0);

function drawPulseAtNode(n){
  const r = 68 + 6*Math.sin(t*2);
  const g = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r);
  g.addColorStop(0,'rgba(185,138,255,.35)');
// ===== Canvas + layout =====
const wrap   = document.getElementById("orbit-wrap");
const orbits = document.getElementById("orbits");
const ctx    = orbits.getContext("2d");
const tooltip = document.getElementById("orbit-tooltip");

let W=0, H=0, t=0;
let hoverIdx = -1, hoverCandidate = -1, hoverTimer = null;
let beamStart = 0, beamActive = false;

function sizeOnce(){
  if(!wrap) return;
  const w = wrap.clientWidth  || window.innerWidth;
  const h = wrap.clientHeight || Math.min(640, window.innerHeight - 160);
  orbits.width  = w;
  orbits.height = h;
  W=w; H=h;
}
function size(){ sizeOnce(); }
addEventListener("resize", size);
if (document.readyState === "complete") size();
else window.addEventListener("load", size);

function metrics(){ const base=Math.min(W,H); const outer=Math.max(280, base/2 - 90); return{ outer, mid: outer-70, inner: outer-140 }; }
const centre = () => ({ x: W/2, y: H/2 });

const NODE_W = 240, NODE_H = 48, NODE_R = 14;

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Arranges meetings and keeps things on track.', angle:-Math.PI/2, factor:0.92},
  {label:'Support Q&A',        key:'support',     desc:'Helps with returns, delivery and warranty.',   angle:0,               factor:1.00},
  {label:'Automation Planner', key:'automation',  desc:'Designs practical workflow blueprints.',       angle: Math.PI/2,      factor:0.92},
  {label:'Internal Knowledge', key:'internal',    desc:'Answers HR and Sales questions clearly.',      angle: Math.PI,        factor:1.00},
];

function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

function drawHoloCore(c, outer){
  const pulse = 1 + Math.sin(t*2)*0.06;
  const glowR = Math.min(outer*0.52,108)*pulse;
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,glowR);
  g.addColorStop(0,'rgba(185,138,255,0.55)');
  g.addColorStop(0.6,'rgba(185,138,255,0.14)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  const hexR = Math.min(outer*0.32,86);
  ctx.strokeStyle='rgba(255,255,255,0.16)'; ctx.lineWidth=2; ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i+0.08*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  ctx.save();
  ctx.fillStyle='#EDEBFF';
  ctx.font='600 20px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);
  ctx.restore();
}

function draw(){
@@ -36,20 +92,15 @@
    ctx.strokeStyle=grad; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  } else beamActive=false;

  /* NEW: soft pulse behind the active bot while the chat is open */
  if(current){
    const active = nodes.find(n=> n.key===current);
    if(active) drawPulseAtNode(active);
  }

  nodes.forEach((n,i)=>{
    const dim=(hoverIdx>-1 && hoverIdx!==i);
    ctx.globalAlpha=dim?0.52:1;
    ctx.fillStyle=dim?'rgba(26,22,44,.55)':'rgba(26,22,44,.9)';
    ctx.strokeStyle='rgba(255,255,255,.10)';
    roundRect(ctx, n.x-120, n.y-24, 240, 48, 14); ctx.fill(); ctx.stroke();
    roundRect(ctx, n.x-NODE_W/2, n.y-NODE_H/2, NODE_W, NODE_H, NODE_R); ctx.fill(); ctx.stroke();
    ctx.globalAlpha=dim?0.7:1;
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui';
    ctx.fillStyle='#ECECFF';
    ctx.font='600 15px Inter, system-ui';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
@@ -60,66 +111,153 @@
}
requestAnimationFrame(draw);

/* ... tooltip code stays the same ... */
// ===== Tooltip logic =====
function placeTooltipForNode(n){
  tooltip.style.display='block';
  const pad = 16;
  const w = tooltip.offsetWidth || 220;
  const h = tooltip.offsetHeight || 36;
  const leftEdge  = n.x - NODE_W/2;
  const rightEdge = n.x + NODE_W/2;

/* -------- Modal + chat ---------- */
  if(n.key==='appointment'){ tooltip.style.left=(n.x - w/2)+'px'; tooltip.style.top =(n.y + NODE_H/2 + pad)+'px'; return; }
  if(n.key==='automation'){  tooltip.style.left=(n.x - w/2)+'px'; tooltip.style.top =(n.y - NODE_H/2 - h - pad)+'px'; return; }
  if(n.key==='internal'){    tooltip.style.left=(leftEdge - w - pad)+'px'; tooltip.style.top=(n.y - h/2)+'px'; return; }
  if(n.key==='support'){     tooltip.style.left=(rightEdge + pad)+'px'; tooltip.style.top=(n.y - h/2)+'px'; return; }
}
function clearTooltip(){ tooltip.style.display='none'; tooltip.textContent=''; }

orbits.addEventListener('mousemove', e=>{
  const rect=orbits.getBoundingClientRect();
  const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  const R_HIT=150, R_STICKY=170;

  let idx=-1, best=Infinity;
  nodes.forEach((n,i)=>{
    const d=Math.hypot(mx-n.x, my-n.y);
    const lim=(i===hoverIdx?R_STICKY:R_HIT);
    if(d<lim && d<best){ best=d; idx=i; }
  });

  if(idx!==hoverCandidate){
    if(hoverTimer) clearTimeout(hoverTimer);
    hoverCandidate=idx; clearTooltip();
    if(idx>-1){
      hoverTimer=setTimeout(()=>{
        hoverIdx=hoverCandidate;
        const n=nodes[hoverIdx];
        tooltip.textContent=n.desc;
        placeTooltipForNode(n);
      },110);
    } else hoverIdx=-1;
  } else if(idx>-1) placeTooltipForNode(nodes[idx]);
});
orbits.addEventListener('mouseleave', ()=>{ if(hoverTimer) clearTimeout(hoverTimer); hoverCandidate=-1; hoverIdx=-1; clearTooltip(); });
orbits.addEventListener('click', ()=>{ if(hoverIdx>-1) openAgent(nodes[hoverIdx].key); });

// ===== Modal chat, examples, speech etc. (unchanged UI IDs) =====
const overlay=document.getElementById('overlay');
const dlgClose=document.getElementById('dlg-close');
const dlgTitle=document.getElementById('dlg-title');
const dlgChat=document.getElementById('dlg-chat');
const dlgInput=document.getElementById('dlg-input');
const dlgSend=document.getElementById('dlg-send');
const dlgExamples=document.getElementById('dlg-examples');
const micBtn=document.getElementById('mic-btn');
const ghost=document.getElementById('dlg-ghost');
const micBtn=document.getElementById('mic-btn');       // <— single declaration
const ghost=document.getElementById('dlg-ghost');      // <— single declaration

const intros={
  appointment:"Hello there 👋 I can get a meeting in the diary. Share a budget, a time, or your e-mail and I’ll take it from there.",
  support:"Hi, how can I help today? I can answer questions about returns, delivery and warranty.",
  automation:"Hello! Tell me what you’d like to automate and I’ll sketch a clear, step-by-step plan.",
  internal:"Hi! Ask me an HR or Sales question and I’ll fetch the answer for you."
};
const examples={
  appointment:[["Intro + budget","I’d like a 30-minute intro next week. Budget is £2k per month."],["Propose time","Could you do Tuesday 2–4pm?"],["Invite e-mail","Use alex@example.com for the invite."],["Confirm","yes"]],
  support:[["Nuanced returns","What’s your returns policy for opened but unused items?"],["Shipping speed","How fast is expedited shipping to London?"],["Weekend cover","When is support available on weekends?"]],
  automation:[["Lead flow","When a lead completes a form, enrich, score, push to CRM, then post to Slack and e-mail sales."],["Ops summary","Create a weekly ops summary from Airtable and e-mail it to the team with KPIs."]],
  internal:[["HR: holiday","What’s the holiday policy?"],["Sales: stages","What are the sales stages?"]]
};

/* fade-in + type-in greeting */
function typeIntro(text){
  const div=document.createElement('div');
  div.className='bubble intro';
  dlgChat.appendChild(div);
  let i=0, step=Math.max(1, Math.round(text.length/60));
  function tick(){
    i = Math.min(text.length, i+step);
    div.textContent = text.slice(0,i);
    dlgChat.scrollTop=dlgChat.scrollHeight;
    if(i<text.length) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
function md(html){
  return html.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/(?:^|\n)[-\u2022]\s+(.*)/g,(m,a)=>`<li>${a}</li>`)
    .replace(/(<li>.*<\/li>)(?![\s\S]*<li>)/g,"<ul>$1</ul>")
    .replace(/\n{2,}/g,"<br><br>").replace(/\n/g,"<br>");
}

function bubble(text, me=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':''); div.innerHTML=text;
  div.className='bubble'+(me?' me':'');
  div.innerHTML=md(text);
  dlgChat.appendChild(div); dlgChat.scrollTop=dlgChat.scrollHeight;
}
function showThinking(){
  const think=document.createElement('div'); think.className='orbit-thinking';
  dlgChat.appendChild(think); dlgChat.scrollTop=dlgChat.scrollHeight; return think;
}

let current=null, sessionId=null;
function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent=({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key]||'Agent';
  dlgChat.innerHTML='';

  dlgExamples.innerHTML='';
  const title=document.createElement('div'); title.className='examples-title'; title.textContent='Try these prompts';
  dlgExamples.appendChild(title);
  (examples[key]||[]).forEach(([label,fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click',()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });

  /* NEW: animated greeting */
  typeIntro(intros[key]||'Hello!');
  bubble(intros[key]||'Hello!');
  overlay.style.display='flex'; dlgInput.focus();
}

function closeDlg(){ overlay.style.display='none'; current=null; }
function closeDlg(){ overlay.style.display='none'; current=null; clearTooltip(); }
dlgClose.addEventListener('click', closeDlg);
/* ... rest of your file (sendMsg, ASR, etc.) unchanged ... */
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function postJSON(url, body){
  const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}
function sendMsg(){
  const msg=dlgInput.value.trim(); if(!msg || !current) return;
  if(listening && rec) rec.stop();
  bubble(msg,true); dlgInput.value=''; ghost.style.display='none'; dlgInput.classList.remove('asr-mode');
  const think=showThinking();
  const endpoints={appointment:'/appointment',support:'/support',automation:'/automation',internal:'/internal'};
  setTimeout(()=>{ postJSON(`${BACKEND}${endpoints[current]}`,{message:msg, sessionId})
    .then(r=>{ think.remove(); bubble(r.reply||'All set.'); })
    .catch(()=>{ think.remove(); bubble("Sorry, I’m having a little trouble connecting. Let’s try that again in a moment."); });
  },600);
}
dlgSend.addEventListener('click', sendMsg);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); } });

// ===== Speech recognition (single declarations) =====
let rec=null, listening=false, micAccum="";
function setupASR(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR) return null;
  rec=new SR(); rec.lang='en-GB'; rec.interimResults=true; rec.continuous=true;
  rec.onstart=()=>{ listening=true; micAccum=''; setMicUI(true); ghost.textContent=''; ghost.style.display='block'; dlgInput.classList.add('asr-mode'); };
  rec.onresult=e=>{
    let interim=''; for(let i=e.resultIndex;i<e.results.length;i++){
      const r=e.results[i]; if(r.isFinal) micAccum+=r[0].transcript+' '; else interim+=r[0].transcript;
    }
    const text=(micAccum+interim).trim();
    ghost.textContent=text; dlgInput.value=text;
  };
  rec.onerror=()=>{ listening=false; setMicUI(false); ghost.style.display='none'; dlgInput.classList.remove('asr-mode'); };
  rec.onend=()=>{ listening=false; setMicUI(false); ghost.style.display='none'; dlgInput.classList.remove('asr-mode'); };
  return rec;
}
function setMicUI(on){ if(!micBtn) return; micBtn.setAttribute('aria-pressed', on?'true':'false'); micBtn.classList.toggle('recording', !!on); }
function toggleMic(){
  if(!rec && !setupASR()){ alert('Speech recognition isn’t available in this browser.'); return; }
  try{ if(!listening) rec.start(); else rec.stop(); }catch{}
}
micBtn?.addEventListener('click', toggleMic);
