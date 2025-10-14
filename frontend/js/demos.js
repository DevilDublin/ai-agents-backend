let BACKEND=""; setTimeout(()=> BACKEND = window.BACKEND_URL || "", 0);

const wrap = document.getElementById('orbit-wrap');
const cvs = document.getElementById('orbits');
const ctx = cvs.getContext('2d');
const tip = document.getElementById('orbit-tooltip');

let W=0,H=0,t=0, hover=-1, beamStart=0, beamOn=false;

function size(){
  cvs.width = wrap.clientWidth; cvs.height = wrap.clientHeight;
  W=cvs.width; H=cvs.height;
}
addEventListener('resize', size); size();

function metrics(){
  const base = Math.min(W,H);
  const outer = Math.max(280, base/2 - 40);
  const mid   = outer - 70;
  const inner = outer - 140;
  return {outer, mid, inner};
}
const center = ()=>({x:W/2, y:H/2});

const nodes = [
  {label:'Appointment Setter', key:'appointment', desc:'Books introductions and qualifies politely.', angle:-Math.PI/2},
  {label:'Support Q&A',        key:'support',     desc:'Helps with returns, delivery and warranty.', angle:0},
  {label:'Automation Planner', key:'automation',  desc:'Describe a process → get a runnable plan.', angle: Math.PI/2},
  {label:'Internal Knowledge', key:'internal',    desc:'Answers HR and Sales questions clearly.', angle: Math.PI},
];

function rrect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

function drawCore(c, outer){
  const pulse = 1 + Math.sin(t*2)*0.06;
  const glowR = Math.min(outer*0.36, 120) * pulse;
  const g = ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,glowR);
  g.addColorStop(0,'rgba(185,138,255,0.55)');
  g.addColorStop(0.6,'rgba(185,138,255,0.14)');
  g.addColorStop(1,'rgba(185,138,255,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,glowR,0,Math.PI*2); ctx.fill();

  const hexR = Math.min(outer*0.22, 86);
  ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=2;
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i + 0.08*Math.sin(t*0.6);
    const x=c.x+Math.cos(a)*hexR, y=c.y+Math.sin(a)*hexR;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath(); ctx.stroke();

  ctx.save();
  ctx.fillStyle='#EDEBFF'; ctx.font='600 18px "Space Grotesk", Inter, system-ui';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Select your demo', c.x, c.y);
  ctx.restore();
}

function draw(){
  t += 0.016; ctx.clearRect(0,0,W,H);
  const c = center();
  const M = metrics();

  [M.inner, M.mid, M.outer].forEach((R,i)=>{
    ctx.beginPath(); ctx.arc(c.x,c.y,R,0,Math.PI*2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i*0.02})`;
    ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  });

  nodes.forEach(n=>{
    n.r = M.outer;
    n.x = c.x + Math.cos(n.angle)*n.r;
    n.y = c.y + Math.sin(n.angle)*n.r;
  });

  ctx.strokeStyle='rgba(185,138,255,.28)';
  ctx.lineWidth=1.5;
  nodes.forEach(n=>{ ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(n.x,n.y); ctx.stroke(); });

  if(hover>-1){
    if(!beamOn){ beamOn=true; beamStart=performance.now(); }
    const n = nodes[hover];
    const elapsed = (performance.now() - beamStart)/600;
    const len = Math.min(1, elapsed);
    const bx = c.x + (n.x - c.x)*len;
    const by = c.y + (n.y - c.y)*len;
    const grad = ctx.createLinearGradient(c.x, c.y, bx, by);
    grad.addColorStop(0,'rgba(185,138,255,0)'); grad.addColorStop(1,'rgba(185,138,255,0.85)');
    ctx.strokeStyle = grad; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(bx,by); ctx.stroke();
  } else { beamOn=false; }

  nodes.forEach((n,i)=>{
    const dim = (hover>-1 && hover!==i);
    ctx.globalAlpha = dim?0.55:1;
    ctx.fillStyle = 'rgba(26,22,44,.9)';
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    rrect(n.x-130, n.y-22, 260, 44, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#ECECFF'; ctx.font='600 15px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha=1;
  });

  drawCore(c, M.outer);
  requestAnimationFrame(draw);
}
draw();

function toolPosFor(i){
  const n = nodes[i]; const c = center();
  const dx = n.x - c.x; const dy = n.y - c.y;
  if(i===0) return {x:n.x-90, y:n.y-50};           // top → show above
  if(i===2) return {x:n.x-110, y:n.y+18};          // bottom → show below
  if(dx<0)  return {x:n.x-260, y:n.y-26};          // left node → show left
  return {x:n.x+20,  y:n.y-26};                    // right node → show right
}

cvs.addEventListener('mousemove', e=>{
  const r = cvs.getBoundingClientRect(); const mx=e.clientX-r.left, my=e.clientY-r.top;
  let idx=-1;
  nodes.forEach((n,i)=>{ if(Math.abs(mx-n.x)<140 && Math.abs(my-n.y)<32) idx=i; });
  if(idx!==hover){ hover=idx; tip.style.display='none'; }
  if(hover>-1){
    const n=nodes[hover]; const p=toolPosFor(hover);
    tip.textContent=n.desc; tip.style.left=p.x+'px'; tip.style.top=p.y+'px'; tip.style.display='block';
  }
  cvs.style.cursor = hover>-1 ? 'pointer' : 'default';
});
cvs.addEventListener('mouseleave', ()=>{ hover=-1; tip.style.display='none'; });
cvs.addEventListener('click', ()=>{ if(hover>-1) openAgent(nodes[hover].key); });

const overlay = document.getElementById('overlay');
const dlgClose = document.getElementById('dlg-close');
const dlgTitle = document.getElementById('dlg-title');
const dlgChat = document.getElementById('dlg-chat');
const dlgInput = document.getElementById('dlg-input');
const dlgSend = document.getElementById('dlg-send');
const dlgExamples = document.getElementById('dlg-examples');
const exTitle = document.getElementById('examples-title');
const micBtn = document.getElementById('dlg-mic');
const ghost = document.getElementById('dlg-ghost');

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
    ["Lead flow","When a lead completes a form, enrich, score, push to CRM, then post to Slack and e-mail."],
    ["Weekly summary","Create a weekly ops summary from Airtable and e-mail it to the team with KPIs."]
  ],
  internal: [
    ["HR: holiday policy","What is the holiday policy?"],
    ["Sales: stages","What are the sales stages?"]
  ]
};

let current=null;
function openAgent(key){
  current=key;
  dlgTitle.textContent = ({appointment:'Appointment Setter',support:'Support Q&A',automation:'Automation Planner',internal:'Internal Knowledge'})[key] || 'Agent';
  dlgChat.innerHTML=''; dlgExamples.innerHTML=''; ghost.textContent=''; ghost.classList.remove('reveal');
  exTitle.textContent="You can try:";
  (examples[key]||[]).forEach(([label, fill])=>{
    const sp=document.createElement('span'); sp.className='chip'; sp.textContent=label; sp.dataset.fill=fill;
    sp.addEventListener('click', ()=>{ dlgInput.value=fill; dlgInput.focus(); });
    dlgExamples.appendChild(sp);
  });
  addBubble("Hello! I can help here. I’ll answer a couple of general questions too, then bring us back on track.", false, true);
  overlay.style.display='flex'; dlgInput.focus();
}
function closeDlg(){ overlay.style.display='none'; current=null; }
dlgClose.addEventListener('click', closeDlg);
overlay.addEventListener('click', e=>{ if(e.target===overlay) closeDlg(); });

function addBubble(text, me=false, intro=false){
  const div=document.createElement('div'); div.className='bubble'+(me?' me':'')+(intro?' intro':''); div.textContent=text; dlgChat.appendChild(div); dlgChat.scrollTop=dlgChat.scrollHeight;
}

function postJSON(url, body){
  const ctl = new AbortController(); const tm=setTimeout(()=>ctl.abort(), 20000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal})
    .then(async r=>{ clearTimeout(tm); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
}
function send(){
  const msg=(dlgInput.value||'').trim(); if(!msg || !current) return;
  addBubble(msg,true); dlgInput.value='';
  ghost.textContent=''; ghost.classList.remove('reveal'); stopMic();
  const route = current==='appointment'?'/appointment':current==='support'?'/support':current==='automation'?'/automation':'/internal';
  postJSON(`${BACKEND}${route}`, {message:msg})
    .then(r=> addBubble(r.reply||'…'))
    .catch(()=> addBubble('Sorry — I can’t reach the server just now.'));
}
dlgSend.addEventListener('click', send);
dlgInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } });

let rec=null, recOn=false;
function startMic(){
  if(recOn) return; if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){ addBubble('Voice input is not supported in this browser.'); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  rec = new SR(); rec.lang='en-GB'; rec.continuous=true; rec.interimResults=true;
  rec.onresult = (e)=>{
    let final='', interim='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      const tx=e.results[i][0].transcript;
      if(e.results[i].isFinal) final += tx; else interim += tx;
    }
    if(interim){ ghost.textContent=interim; ghost.classList.add('reveal'); dlgInput.placeholder=''; }
    if(final){ dlgInput.value = (dlgInput.value+' '+final).trim(); ghost.textContent=''; }
  };
  rec.onend = ()=>{ micBtn.classList.remove('active'); recOn=false; ghost.textContent=''; ghost.classList.remove('reveal'); };
  rec.onerror = ()=>{ micBtn.classList.remove('active'); recOn=false; ghost.textContent=''; };
  rec.start(); recOn=true; micBtn.classList.add('active');
}
function stopMic(){ if(rec && recOn){ rec.stop(); } }
micBtn.addEventListener('click', ()=> recOn ? stopMic() : startMic());
