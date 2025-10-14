const orbit = document.getElementById('orbits');
const wrap = document.getElementById('orbit-wrap');
const tip = document.getElementById('orbit-tooltip');

const agents = [
  {key:'setter', label:'Appointment Setter', side:'top', desc:'Qualifies quickly and books the call.'},
  {key:'internal', label:'Internal Knowledge', side:'left', desc:'Answers HR and Sales questions clearly.'},
  {key:'support', label:'Support Q&A', side:'right', desc:'Helps with returns, delivery and warranty.'},
  {key:'planner', label:'Automation Planner', side:'bottom', desc:'Sketches a clean step-by-step workflow.'}
];

function drawOrbit() {
  const ctx = orbit.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  orbit.width = wrap.clientWidth * DPR;
  orbit.height = wrap.clientHeight * DPR;
  ctx.clearRect(0,0,orbit.width,orbit.height);

  const cx = orbit.width/2;
  const cy = orbit.height/2 + 8*DPR;
  const rings = [120, 220, 320].map(r => r*DPR);

  ctx.strokeStyle = 'rgba(185,138,255,.15)';
  ctx.lineWidth = 2*DPR;
  rings.forEach(r => {
    ctx.beginPath();
    ctx.setLineDash([8*DPR, 10*DPR]);
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.stroke();
  });

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140*DPR);
  grad.addColorStop(0, 'rgba(185,138,255,.45)');
  grad.addColorStop(1, 'rgba(185,138,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 140*DPR, 0, Math.PI*2);
  ctx.fill();

  drawHub(cx, cy, DPR);
  placeChips(cx/DPR, cy/DPR);
}

function drawHub(cx, cy, DPR) {
  const ctx = orbit.getContext('2d');
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = 2*DPR;
  const r = 52*DPR;
  ctx.beginPath();
  for (let i=0;i<6;i++){
    const a = (Math.PI*2/6)*i;
    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
  }
  ctx.closePath(); ctx.stroke(); ctx.restore();
}

function placeChips(cx, cy) {
  wrap.querySelectorAll('.chip-node').forEach(n => n.remove());
  const offsets = {
    top:    {x:0, y:-250, align:'center'},
    left:   {x:-310, y:-10, align:'left'},
    right:  {x:310, y:-10, align:'right'},
    bottom: {x:0, y:260, align:'center'}
  };
  agents.forEach(a=>{
    const n = document.createElement('div');
    n.className = 'chip-node';
    n.textContent = a.label;
    n.dataset.key = a.key;
    n.dataset.side = a.side;
    n.style.position = 'absolute';
    n.style.padding = '12px 18px';
    n.style.borderRadius = '18px';
    n.style.background = 'rgba(31,28,48,.8)';
    n.style.border = '1px solid rgba(255,255,255,.12)';
    n.style.backdropFilter = 'blur(6px)';
    n.style.userSelect = 'none';
    n.style.cursor = 'pointer';

    const o = offsets[a.side];
    n.style.left = `${cx + o.x}px`;
    n.style.top = `${cy + o.y}px`;
    n.style.transform = 'translate(-50%,-50%)';

    n.addEventListener('mouseenter', () => showTip(n, a.desc, a.side));
    n.addEventListener('mouseleave', hideTip);
    n.addEventListener('click', () => openDialog(a));
    wrap.appendChild(n);
  });

  const centre = document.createElement('div');
  centre.className = 'chip-centre';
  centre.textContent = 'Select your demo';
  centre.style.position = 'absolute';
  centre.style.left = `${cx}px`;
  centre.style.top = `${cy}px`;
  centre.style.transform = 'translate(-50%,-50%)';
  centre.style.padding = '12px 18px';
  centre.style.borderRadius = '18px';
  centre.style.background = 'rgba(31,28,48,.72)';
  centre.style.border = '1px solid rgba(255,255,255,.12)';
  centre.style.userSelect = 'none';
  wrap.appendChild(centre);
}
function showTip(node, text, side){
  tip.className = '';
  tip.textContent = text;
  tip.style.display = 'block';
  const rect = node.getBoundingClientRect();
  const wr = wrap.getBoundingClientRect();
  const x = rect.left - wr.left + rect.width/2;
  const y = rect.top - wr.top + rect.height/2;
  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
  const cls = side==='left'?'tt-left':side==='right'?'tt-right':side==='top'?'tt-top':'tt-bottom';
  tip.classList.add('show', cls);
}
function hideTip(){ tip.className=''; tip.style.display='none'; }

addEventListener('resize', drawOrbit);
if (orbit) drawOrbit();

/* Dialog + voice */
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('dlg-close');
const sendBtn = document.getElementById('dlg-send');
const micBtn = document.getElementById('dlg-mic');
const input = document.getElementById('dlg-input');
const ghost = document.getElementById('dlg-ghost');
const chat = document.getElementById('dlg-chat');
const title = document.getElementById('dlg-title');
const examples = document.getElementById('dlg-examples');

let currentAgent = null;

function openDialog(a){
  currentAgent = a;
  title.textContent = a.label;
  examples.innerHTML = '';
  const presets = a.key==='support'
    ? ['Nuanced returns','Shipping speed','Weekend cover']
    : a.key==='internal'
    ? ['Holiday policy','Sales deck link','New starter steps']
    : a.key==='planner'
    ? ['Try: lead flow','Try: weekly summary']
    : ['Quick budget check','Pick a slot','Share brief'];
  presets.forEach(p=>{
    const c = document.createElement('div');
    c.className = 'chip'; c.textContent = p;
    c.addEventListener('click', ()=>addBubble('me', p));
    examples.appendChild(c);
  });
  chat.innerHTML = '';
  addBubble('bot', greeting(a.key));
  overlay.style.display = 'flex';
}

function greeting(key){
  if (key==='support') return 'Hi — ask me about returns, shipping, warranty or support hours and I’ll answer from policy.';
  if (key==='internal') return 'Hi — ask me anything from HR and Sales docs. I’ll point you to the source when useful.';
  if (key==='planner') return 'Hello! Tell me what you’d like to automate and I’ll sketch a clear, step-by-step workflow.';
  return 'Hello! I can help schedule a meeting. What’s your budget or target scope to start with?';
}

function addBubble(who, text){
  const b = document.createElement('div');
  b.className = 'bubble' + (who==='me'?' me':'');
  b.textContent = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

closeBtn.addEventListener('click', ()=> overlay.style.display='none');
sendBtn.addEventListener('click', ()=>{
  if (!input.value.trim()) return;
  stopVoice();
  addBubble('me', input.value.trim());
  input.value=''; ghost.textContent='';
  // Your fetch to backend goes here if needed
});

input.addEventListener('keydown', e=>{
  if (e.key==='Enter'){ e.preventDefault(); sendBtn.click(); }
});

/* Voice capture (Web Speech) */
let rec = null, listening = false;
function startVoice(){
  if (listening) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-GB';
  listening = true;
  micBtn.classList.add('live');
  rec.onresult = (ev)=>{
    let final = '', interim = '';
    for (let i=ev.resultIndex;i<ev.results.length;i++){
      const t = ev.results[i][0].transcript;
      if (ev.results[i].isFinal) final += t; else interim += t;
    }
    if (final) input.value = (input.value + ' ' + final).trim();
    ghost.textContent = interim;
  };
  rec.onend = ()=>{ if (listening) rec.start(); };
  rec.start();
}
function stopVoice(){
  if (!listening) return;
  listening = false;
  micBtn.classList.remove('live');
  ghost.textContent = '';
  try{ rec.onend=null; rec.stop(); }catch(e){}
}
micBtn.addEventListener('click', ()=> listening ? stopVoice() : startVoice());
