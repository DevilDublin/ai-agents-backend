import { initChat } from './chat.js';

const hero = document.getElementById('demo-hero');
const shape = document.getElementById('zy-shape');
const stage = document.getElementById('demo-stage');

const bots = [
  {
    name:'Car Insurance',
    lines:[
      'Decrypting module…',
      'Agent: Car Insurance — Quick-qualify & quote',
      'Collect → name, phone, vehicle, NCB, claims',
      'Decision → instant quote / manual review',
      'Integrations → Calendar · CRM · Email',
      'Hint → say: "Get a quick quote"',
    ],
  },
  {
    name:'Appointly',
    lines:[
      'Loading scheduler…',
      'Agent: Appointly — Appointment Booking',
      'Collect → service, date & time, notes',
      'Confirm → SMS + calendar invite',
      'Links → reschedule / cancel',
      'Hint → say: "Book me Friday 3pm"',
    ],
  },
  {
    name:'Property Qualifier',
    lines:[
      'Scanning listings…',
      'Agent: Property Qualifier — Tenants & viewings',
      'Filter → budget, move-in, location, docs',
      'Book → viewing slots / agent call',
      'Sync → CRM with transcript',
      'Hint → say: "I want to view a 2-bed"',
    ],
  },
];

const botTitle = document.getElementById('botTitle');
const botCrt   = document.getElementById('botCrt');
const prevBot  = document.getElementById('prevBot');
const nextBot  = document.getElementById('nextBot');
const openPrev = document.getElementById('openPreview');

const chatPlaceholder = document.getElementById('chatPlaceholder');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');

let idx = 0, previewOpen=false, chatOpen=false;

function setBot(i){
  idx = (i + bots.length) % bots.length;
  botTitle.textContent = '› ' + bots[idx].name;
  typeCRT(bots[idx].lines.join('\n'));
}
function typeCRT(text){
  botCrt.textContent = '';
  let i=0; const tick=()=>{ if(i<=text.length){ botCrt.textContent = text.slice(0,i); i++; setTimeout(tick, 12); } };
  tick();
}

// Intro -> Stage
shape?.addEventListener('click', ()=>{
  hero.classList.add('hidden');
  stage.classList.remove('hidden');
  setBot(idx);
});
window.addEventListener('keydown', (e)=>{
  if(hero.classList.contains('hidden')){
    if(e.key==='ArrowRight' || e.key.toLowerCase()==='d'){ if(!chatOpen){ setBot(idx+1); } }
    if(e.key==='ArrowLeft'  || e.key.toLowerCase()==='a'){ if(!chatOpen){ setBot(idx-1); } }
    if(e.key==='Enter'){
      if(!previewOpen){ previewOpen=true; chatPlaceholder.innerHTML='<p><strong>Press Enter again to open chat</strong></p>'; }
      else if(!chatOpen){ openChat(); }
    }
    if(e.key==='Escape'){ if(chatOpen){ closeChat.click(); } else { previewOpen=false; chatPlaceholder.innerHTML='<p><strong>Select a bot to open the chat</strong></p><small>Press <b>Enter</b> when ready</small>'; } }
  }
});
prevBot.addEventListener('click', ()=> !chatOpen && setBot(idx-1));
nextBot.addEventListener('click', ()=> !chatOpen && setBot(idx+1));
openPrev.addEventListener('click', ()=> { previewOpen=true; openChat(); });

function openChat(){
  chatPlaceholder.classList.add('hidden');
  chatBox.classList.remove('hidden');
  chatOpen = true;
  initChat();
  // Kick a greeting message
  setTimeout(()=>{
    const log = document.getElementById('chatLog');
    const m = document.createElement('div'); m.className='msg bot';
    m.textContent = `Opening demo: ${bots[idx].name}`;
    log.appendChild(m);
  }, 120);
}
closeChat.addEventListener('click', ()=>{
  chatOpen=false; previewOpen=false;
  chatBox.classList.add('hidden');
  chatPlaceholder.classList.remove('hidden');
});
