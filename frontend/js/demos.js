/* ... everything above draw() stays as in your working file ... */

function drawPulseAtNode(n){
  const r = 68 + 6*Math.sin(t*2);
  const g = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r);
  g.addColorStop(0,'rgba(185,138,255,.35)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
}

function draw(){
  if(!W || !H) { requestAnimationFrame(draw); return; }
  t+=0.016; ctx.clearRect(0,0,W,H);
  const c=centre(); const M=metrics();

  [M.inner,M.mid,M.outer].forEach((Rr,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,Rr,0,Math.PI*2);
    ctx.strokeStyle=`rgba(185,138,255,${0.05+i*0.02})`;
    ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });

  nodes.forEach(n=>{ n.r=M.outer*(n.factor||1); n.x=c.x+Math.cos(n.angle)*n.r; n.y=c.y+Math.sin(n.angle)*n.r; });

  ctx.save(); ctx.strokeStyle='rgba(185,138,255,0.10)'; ctx.lineWidth=1;
  nodes.forEach(n=>{ ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(n.x,n.y); ctx.stroke(); });
  ctx.restore();

  if(hoverIdx>-1){
    if(!beamActive){ beamActive=true; beamStart=performance.now(); }
    const n=nodes[hoverIdx];
    const len=Math.min(1,(performance.now()-beamStart)/500);
    const bx=c.x+(n.x-c.x)*len, by=c.y+(n.y-c.y)*len;
    const grad=ctx.createLinearGradient(c.x,c.y,bx,by);
    grad.addColorStop(0,'rgba(185,138,255,0)'); grad.addColorStop(1,'rgba(185,138,255,0.85)');
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
    ctx.globalAlpha=dim?0.7:1;
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  drawHoloCore(c, M.outer);
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* ... tooltip code stays the same ... */

/* -------- Modal + chat ---------- */
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
}

function bubble(text, me=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':''); div.innerHTML=text;
  dlgChat.appendChild(div); dlgChat.scrollTop=dlgChat.scrollHeight;
}

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
  overlay.style.display='flex'; dlgInput.focus();
}

function closeDlg(){ overlay.style.display='none'; current=null; }
dlgClose.addEventListener('click', closeDlg);
/* ... rest of your file (sendMsg, ASR, etc.) unchanged ... */
