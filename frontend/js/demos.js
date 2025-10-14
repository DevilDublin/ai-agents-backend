const DEFAULT_BACKEND = "https://ai-agents-backend-pejo.onrender.com";
let BACKEND = DEFAULT_BACKEND;
setTimeout(() => { BACKEND = window.BACKEND_URL || DEFAULT_BACKEND; }, 0);

const wrap = document.getElementById("orbit-wrap");
const orbits = document.getElementById("orbits");
const ctx = orbits.getContext("2d");
const tooltip = document.getElementById("orbit-tooltip");

let W, H, t = 0;
let hoverIdx = -1, hoverCandidate = -1, hoverTimer = null;
let beamStart = 0, beamActive = false;

function size(){ orbits.width = wrap.clientWidth; orbits.height = wrap.clientHeight; W=orbits.width; H=orbits.height; }
addEventListener("resize", size); size();

function metrics(){ const base=Math.min(W,H); const outer=Math.max(280, base/2 - 90); const mid=outer-70; const inner=outer-140; return{outer,mid,inner}; }
const centre = () => ({x: W/2, y: H/2});

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
  g.addColorStop(0,'rgba(185,138,255,0.55)'); g.addColorStop(0.6,'rgba(185,138,255,0.14)'); g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  const hexR = Math.min(outer*0.32,86);
  ctx.strokeStyle='rgba(255,255,255,0.16)'; ctx.lineWidth=2; ctx.beginPath();
  for(let i=0;i<6;i++){ const a=(Math.PI/3)*i+0.08*Math.sin(t*0.6); const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
  ctx.closePath(); ctx.stroke();

  ctx.save(); ctx.fillStyle='#EDEBFF'; ctx.font='600 20px "Space Grotesk", Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y); ctx.restore();
}

function draw(){
  t+=0.016; ctx.clearRect(0,0,W,H);
  const c=centre(); const M=metrics();

  [M.inner,M.mid,M.outer].forEach((Rr,i)=>{ ctx.beginPath(); ctx.arc(c.x,c.y,Rr,0,Math.PI*2); ctx.strokeStyle=`rgba(185,138,255,${0.05+i*0.02})`; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]); });

  nodes.forEach(n=>{ n.r=M.outer*(n.factor||1); n.x=c.x+Math.cos(n.angle)*n.r; n.y=c.y+Math.sin(n.angle)*n.r; });

  ctx.save(); ctx.strokeStyle='rgba(185,138,255,0.10)'; ctx.lineWidth=1;
  nodes.forEach(n=>{ ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(n.x,n.y); ctx.stroke(); });
  ctx.restore();

  if(hoverIdx>-1){
    if(!beamActive){ beamActive=true; beamStart=performance.now(); }
    const n=nodes[hoverIdx]; const elapsed=(performance.now()-beamStart)/500; const len=Math.min(1,elapsed);
    const bx=c.x+(n.x-c.x)*len, by=c.y+(n.y-c.y)*len;
    const grad=ctx.createLinearGradient(c.x,c.y,bx,by); grad.addColorStop(0,'rgba(185,138,255,0)'); grad.addColorStop(1,'rgba(185,138,255,0.85)');
    ctx.strokeStyle=grad; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  } else { beamActive=false; }

  nodes.forEach((n,i)=>{ const dim=(hoverIdx>-1 && hoverIdx!==i);
    ctx.globalAlpha=dim?0.52:1; ctx.fillStyle=dim?'rgba(26,22,44,.55)':'rgba(26,22,44,.9)'; ctx.strokeStyle='rgba(255,255,255,.10)';
    roundRect(ctx, n.x-120, n.y-24, 240, 48, 14); ctx.fill(); ctx.stroke();
    ctx.globalAlpha=dim?0.7:1; ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(n.label, n.x, n.y); ctx.globalAlpha=1;
  });

  drawHoloCore(c, M.outer);
  requestAnimationFrame(draw);
}
draw();

/* HOVER + TOOLTIP */
orbits.addEventListener('mousemove', e=>{
  const rect=orbits.getBoundingClientRect(); const mx=e.clientX-rect.left, my=e.clientY-rect.top;
  const R_HIT=150, R_STICKY=170;
  let idx=-1, bestD=Infinity;
  nodes.forEach((n,i)=>{ const dx=mx-n.x, dy=my-n.y; const d=Math.hypot(dx,dy); const limit=(i===hoverIdx?R_STICKY:R_HIT); if(d<limit && d<bestD){ bestD=d; idx=i; } });
  if(idx!==hoverCandidate){
    if(hoverTimer) clearTimeout(hoverTimer);
    hoverCandidate=idx;
    if(idx>-1){
      hoverTimer=setTimeout(()=>{ hoverIdx=hoverCandidate; const n=nodes[hoverIdx];
        tooltip.textContent=n.desc; tooltip.style.left=(n.x+16)+'px'; tooltip.style.top=(n.y-16)+'px'; tooltip.style.display='block';
      },140);
    } else { hoverIdx=-1; tooltip.style.display='none'; }
  } else if(idx>-1){ const n=nodes[idx]; tooltip.style.left=(n.x+16)+'px'; tooltip.style.top=(n.y-16)+'px'; }
});
orbits.addEventListener('mouseleave', ()=>{ if(hoverTimer) clearTimeout(hoverTimer); hoverCandidate=-1; hoverIdx=-1; tooltip.style.display='none'; });
orbits.addEventListener('click', ()=>{ if(hoverIdx>-1) openAgent(nodes[hoverIdx].key); });

/* MODAL + CHAT */
const overlay=document.getElementById('overlay');
const dlgClose=document.getElementById('dlg-close');
const dlgTitle=document.getElementById('dlg-title');
const dlgChat=document.getElementById('dlg-chat');
const dlgInput=document.getElementById('dlg-input');
const dlgSend=document.getElementById('dlg-send');
const dlgExamples=document.getElementById('dlg-examples');
const micBtn=document.getElementById('mic-btn');
const ghost=document.getElementById('dlg-ghost');

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
let current=null, sessionId=null;

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent=({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key]||'Agent';
  dlgChat.innerHTML='';
  const title=document.createElement('div'); title.className='examples-title'; title.textContent='Try these prompts';
  dlgExamples.innerHTML=''; dlgExamples.appendChild(title);
  (examples[key]||[]).forEach(([label,fill])=>{ const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill; sp.addEventListener('click',()=>{ dlgInput.value=fill; dlgInput.focus(); }); dlgExamples.appendChild(sp); });
  bubble(intros[key]||'Hello!');
  overlay.style.display='flex';
  dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function md(html){
  return html.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/(?:^|\n)[-\u2022]\s+(.*)/g,(m,a)=>`<li>${a}</li>`).replace(/(<li>.*<\/li>)(?![\s\S]*<li>)/g,"<ul>$1</ul>")
    .replace(/\n{2,}/g,"<br><br>").replace(/\n/g,"<br>");
}
function bubble(text, me=false){ const div=document.createElement('div'); div.className='bubble'+(me?' me':''); div.innerHTML=md(text); dlgChat.appendChild(div); dlgChat.scrollTop=dlgChat.scrollHeight; }
function showThinking(){ const think=document.createElement('div'); think.className='orbit-thinking'; dlgChat.appendChild(think); dlgChat.scrollTop=dlgChat.scrollHeight; return think; }

function postJSON(url, body){
  const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}

/* SEND */
function sendMsg(){
  const msg=dlgInput.value.trim(); if(!msg || !current) return;
  if(listening && rec) rec.stop();  // stop mic on send
  bubble(msg,true); dlgInput.value=''; ghost.style.display='none'; dlgInput.classList.remove('asr-mode');
  const think=showThinking();
  const endpoints={appointment:'/appointment',support:'/support',automation:'/automation',internal:'/internal'};
  setTimeout(()=>{ postJSON(`${BACKEND}${endpoints[current]}`,{message:msg, sessionId})
    .then(r=>{ think.remove(); bubble(r.reply||'All set.'); })
    .catch(()=>{ think.remove(); bubble("Sorry, I’m having a little trouble connecting. Let’s try that again in a moment."); });
  },600);
}
document.getElementById('dlg-send').addEventListener('click', sendMsg);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); } });

/* SPEECH RECOGNITION */
let rec=null, listening=false, micAccum="";
function setupASR(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR) return null;
  rec=new SR(); rec.lang='en-GB'; rec.interimResults=true; rec.continuous=true;

  rec.onstart=()=>{ listening=true; micAccum=''; setMicUI(true);
    ghost.textContent=''; ghost.style.display='block'; dlgInput.classList.add('asr-mode');
  };
  rec.onresult=e=>{
    let interim=''; for(let i=e.resultIndex;i<e.results.length;i++){ const res=e.results[i]; if(res.isFinal) micAccum+=res[0].transcript+' '; else interim+=res[0].transcript; }
    const text=(micAccum+interim).trim();
    ghost.textContent=text;   // fancy overlay
    dlgInput.value=text;      // real value kept in sync
  };
  rec.onerror=()=>{ listening=false; setMicUI(false); ghost.style.display='none'; dlgInput.classList.remove('asr-mode'); };
  rec.onend=()=>{ listening=false; setMicUI(false); ghost.style.display='none'; dlgInput.classList.remove('asr-mode'); };
  return rec;
}
function setMicUI(on){
  micBtn?.setAttribute('aria-pressed', on?'true':'false');
  if(!micBtn) return;
  micBtn.classList.toggle('recording', !!on);
}
function toggleMic(){
  if(!micBtn) return;
  if(!rec && !setupASR()){ alert('Speech recognition isn’t available in this browser.'); return; }
  try{ if(!listening) rec.start(); else rec.stop(); }catch{}
}
micBtn?.addEventListener('click', toggleMic);
