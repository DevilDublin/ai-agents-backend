// Config
let BACKEND=""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

// Canvas + orbit
const wrap = document.getElementById('orbit-wrap');
const orbits = document.getElementById('orbits');
const ctx = orbits.getContext('2d');
const tip = document.getElementById('orbit-tooltip');

let W,H,t=0, hover=-1, hoverSince=0;
function size(){ orbits.width = wrap.clientWidth; orbits.height = wrap.clientHeight; W=orbits.width; H=orbits.height; }
addEventListener('resize', size); size();

function metrics(){
  const base = Math.min(W,H);
  const outer = Math.max(260, base/2 - 40);
  const mid = outer - 70;
  const inner = outer - 140;
  return {outer, mid, inner};
}
const center = ()=>({x: W/2, y: H/2});

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Qualifies, proposes times, and books meetings end-to-end.', angle:-Math.PI/2, tipSide:'bottom'},
  {label:'Support Q&A', key:'support', desc:'Helps with returns, delivery and warranty.', angle:0, tipSide:'right'},
  {label:'Automation Planner', key:'automation', desc:'Describe a process → get a runnable workflow blueprint.', angle:Math.PI/2, tipSide:'top'},
  {label:'Internal Knowledge', key:'internal', desc:'Answers HR and Sales questions clearly.', angle:Math.PI, tipSide:'left'},
];

function roundRect(ctx, x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

function draw(){
  t+=0.016;
  ctx.clearRect(0,0,W,H);
  const c = center();
  const M = metrics();

  [M.inner, M.mid, M.outer].forEach((Rr,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,Rr,0,Math.PI*2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i*0.02})`; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });

  nodes.forEach(n=>{
    n.r = M.outer; n.x = c.x + Math.cos(n.angle)*n.r; n.y = c.y + Math.sin(n.angle)*n.r;
  });

  // hex + glow
  const glowR = 86 + Math.sin(t*2)*4;
  const grd = ctx.createRadialGradient(c.x,c.y,12,c.x,c.y,glowR);
  grd.addColorStop(0,'rgba(185,138,255,.6)'); grd.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  ctx.strokeStyle='rgba(255,255,255,.16)'; ctx.lineWidth=2;
  ctx.beginPath();
  const R=62;
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i + 0.05*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*R, y=c.y+Math.sin(a)*R;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  ctx.fillStyle='#EDEBFF';
  ctx.font='700 18px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);

  nodes.forEach((n,i)=>{
    const dim = (hover>-1 && hover!==i);
    ctx.globalAlpha = dim?0.55:1;
    const w=240,h=44;
    const x=n.x - w/2, y=n.y - h/2;
    ctx.fillStyle = 'rgba(26,22,44,.85)';
    ctx.strokeStyle='rgba(255,255,255,.12)';
    roundRect(ctx,x,y,w,h,12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ECECFF';
    ctx.font='600 15px Inter, system-ui';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  requestAnimationFrame(draw);
}
draw();

// hover + tooltip positioning off-label
orbits.addEventListener('mousemove', e=>{
  const rect = orbits.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  let idx = -1;
  nodes.forEach((n,i)=>{ if(Math.abs(mx-n.x) < 130 && Math.abs(my-n.y) < 28) idx = i; });
  if(idx !== hover){ hover = idx; hoverSince = performance.now(); tip.style.display='none'; }
  else if(hover>-1 && performance.now()-hoverSince > 280){
    const n = nodes[hover];
    tip.textContent = n.desc;
    const pad=12;
    if(n.tipSide==='left'){ tip.style.left = (n.x - tip.offsetWidth - pad) + 'px'; tip.style.top = (n.y - 20) + 'px'; }
    if(n.tipSide==='right'){ tip.style.left = (n.x + pad) + 'px'; tip.style.top = (n.y - 20) + 'px'; }
    if(n.tipSide==='top'){ tip.style.left = (n.x - tip.offsetWidth/2) + 'px'; tip.style.top = (n.y - pad - 34) + 'px'; }
    if(n.tipSide==='bottom'){ tip.style.left = (n.x - tip.offsetWidth/2) + 'px'; tip.style.top = (n.y + pad) + 'px'; }
    tip.style.display='block';
  }
  orbits.style.cursor = hover>-1 ? 'pointer' : 'default';
});
orbits.addEventListener('mouseleave', ()=>{ hover=-1; tip.style.display='none'; });
orbits.addEventListener('click', ()=>{ if(hover>-1) openAgent(nodes[hover].key); });

// modal chat
const overlay = document.getElementById('overlay');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgExamples = document.getElementById('dlg-examples');
const dlgGhost = document.getElementById('dlg-ghost');
const dlgMic = document.getElementById('dlg-mic');

const examples = {
  appointment: [
    ["Intro + budget","Hello, I’d like a 30-minute intro next week. Budget is £2k per month."],
    ["Propose time","Could you do Tuesday 2–4pm?"],
    ["Contact","Use alex@example.com for the invite."],
    ["Confirm","yes"]
  ],
  support: [
    ["Nuanced returns","What is your returns policy for opened but unused items?"],
    ["Shipping speed","How fast is expedited shipping to London?"],
    ["Weekend cover","When is support available on weekends?"]
  ],
  automation: [
    ["Lead flow","When a lead completes a form, enrich, score, push to CRM, then post to Slack."],
    ["Weekly summary","Create a weekly ops summary from Airtable and e-mail it to the team."]
  ],
  internal: [
    ["HR holiday","What is the holiday policy?"],
    ["Sales stages","What are the sales stages?"]
  ]
};

let current=null, sessionId=null, rec=null, recOn=false;

function bubble(parent, text, me=false, intro=false){
  const div=document.createElement('div');
  div.className='bubble'+(me?' me':'')+(intro?' intro':'');
  div.textContent=text;
  parent.appendChild(div);
  parent.scrollTop=parent.scrollHeight;
}

function openAgent(key){
  current=key; sessionId='web-'+Math.random().toString(36).slice(2,8);
  dlgTitle.textContent = ({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key] || 'Agent';
  dlgChat.innerHTML='';
  dlgExamples.innerHTML='';
  document.getElementById('examples-title').textContent = 'Try these';
  (examples[key]||[]).forEach(([label, fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });
  const intro = {
    appointment:"Hello! I can help schedule a meeting. I can answer a couple of general questions too, but my main role is booking your call. What’s your budget or target scope to start with?",
    support:"Hi, how can I help today? I can answer questions about returns, delivery and warranty.",
    automation:"Hello! Tell me what you’d like to automate and I’ll sketch a clear, step-by-step workflow.",
    internal:"Hello! Ask me an HR or Sales question and I’ll route it to the right knowledge."
  }[key] || "Hello!";
  bubble(dlgChat,intro,false,true);
  overlay.style.display='flex';
  dlgInput.focus();
}
function closeDlg(){
  overlay.style.display='none'; current=null;
  stopRec();
}
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function postJSON(url, body){
  const ctl = new AbortController(); const t=setTimeout(()=>ctl.abort(), 20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}

function sendMsg(){
  const msg=(dlgInput.value||'').trim(); if(!msg || !current) return;
  bubble(dlgChat, msg, true);
  dlgInput.value=''; dlgGhost.textContent='';
  stopRec();
  const route = current === 'appointment' ? '/appointment'
              : current === 'support' ? '/support'
              : current === 'automation' ? '/automation'
              : '/internal';
  const payload = current==='appointment' ? {message:msg, sessionId} : {message:msg};
  postJSON(`${BACKEND}${route}`, payload)
    .then(r=> bubble(dlgChat, r.reply || '…'))
    .catch(()=> bubble(dlgChat,'Sorry — I couldn’t reach the backend.'));
}
dlgSend.addEventListener('click', sendMsg);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); } });

// speech-to-text with ghost animation
function supportSpeech(){
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}
function startRec(){
  if(!supportSpeech()) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  rec = new SR();
  rec.lang = 'en-GB';
  rec.interimResults = true;
  rec.continuous = true;

  dlgGhost.style.display='block';
  recOn = true; dlgMic.setAttribute('aria-pressed','true');

  let finalText='';
  rec.onresult = (e)=>{
    let interim='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      const tr=e.results[i][0].transcript;
      if(e.results[i].isFinal){ finalText += tr + ' '; }
      else { interim += tr; }
    }
    dlgInput.value = (finalText + interim).trimStart();
    dlgGhost.textContent = interim ? interim : '';
  };
  rec.onerror = ()=> stopRec();
  rec.onend = ()=> { recOn=false; dlgMic.setAttribute('aria-pressed','false'); dlgGhost.textContent=''; };
  rec.start();
}
function stopRec(){
  if(rec && recOn){ try{ rec.stop(); }catch{} }
  recOn=false; dlgMic.setAttribute('aria-pressed','false'); dlgGhost.textContent='';
}
dlgMic.addEventListener('click', ()=> recOn ? stopRec() : startRec());
