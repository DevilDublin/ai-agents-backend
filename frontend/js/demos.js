/* ===== ZYPHER — Demos flow =====
   Landing shape -> Selector scene -> Chat
   Keys: Left/Right or A/D to switch, Enter to preview/open, Esc to go back
*/
const bots = [
  {
    name:'Car Insurance',
    script:[
      'Decrypting module…',
      'Agent: Car Insurance → Quick-qualify & quote',
      'Collect → name, phone, vehicle, NCB, claims',
      'Decision → instant quote / manual review',
      'Integrations → Calendar · CRM · Email',
      'Hint → say: "Get a quick quote"'
    ]
  },
  {
    name:'Appointly',
    script:[
      'Loading scheduler…',
      'Agent: Appointly → Appointment booking',
      'Collect → service, date & time, notes',
      'Confirm → SMS + calendar invite',
      'Links → reschedule / cancel',
      'Hint → say: "Book me Friday 3pm"'
    ]
  },
  {
    name:'Salon Booker',
    script:[
      'Compiling treatments…',
      'Agent: Salon Booker → Services & add-ons',
      'Upsell → bundles, extras, deposits',
      'Remind → no-show sequences',
      'Ops → CRM summary',
      'Hint → say: "Cut + beard trim this weekend"'
    ]
  },
  {
    name:'Property Qualifier',
    script:[
      'Scanning listings…',
      'Agent: Property Qualifier → Tenants & viewings',
      'Filter → budget, move-in, location, docs',
      'Book → viewing slots / agent call',
      'Sync → CRM with transcript',
      'Hint → say: "I want to view a 2-bed"'
    ]
  }
];

(function(){
  const landing = document.querySelector('.demo-landing');
  const selectorWrap = document.querySelector('.selector-wrap');
  const ttyTitle = document.querySelector('.tty-title .label');
  const tty = document.querySelector('.tty-screen');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');
  const openBtn = document.querySelector('[data-open]');
  const chat = document.querySelector('.chat');
  const chatX = document.querySelector('.chat .x');
  const chatLog = document.querySelector('.chatlog');
  const chatInput = document.querySelector('#chat-input');
  const chatSend = document.querySelector('#chat-send');
  const tip = document.querySelector('.hints');

  let i = 0;
  let inChat = false;

  function renderBot(idx){
    const bot = bots[idx];
    ttyTitle.textContent = bot.name;
    tty.innerHTML = '';
    typeLines(bot.script, 0);
  }

  function typeLines(lines, n){
    if (n >= lines.length) return;
    const line = document.createElement('div');
    tty.appendChild(line);
    typewriter(line, lines[n], ()=>typeLines(lines, n+1));
  }

  function typewriter(el, text, done){
    let k = 0;
    const blink = document.createElement('span'); blink.textContent = ' ▋'; blink.style.opacity='.7';
    const id = setInterval(()=>{
      el.textContent = text.slice(0, ++k);
      el.appendChild(blink);
      if (k >= text.length){ clearInterval(id); setTimeout(()=>{ blink.remove(); done&&done(); }, 120); }
    }, 16 + Math.random()*24);
  }

  /* landing -> selector */
  const shape = document.querySelector('.shape');
  if (shape){
    shape.addEventListener('click', openSelector);
    shape.addEventListener('keydown', (e)=>{ if(e.key==='Enter') openSelector(); });
  }
  function openSelector(){
    landing.classList.add('hidden');
    selectorWrap.classList.remove('hidden');
    tip.style.opacity = .95;
    renderBot(i);
    chat.classList.add('hidden');
  }

  function switchBot(step){
    i = (i + step + bots.length) % bots.length;
    renderBot(i);
  }

  function openChat(){
    if (inChat) return;
    inChat = true;
    chat.classList.remove('hidden');
    chatLog.innerHTML = '';
    const tag = document.createElement('div');
    tag.className = 'msg ai';
    tag.textContent = `Opening demo: ${bots[i].name}`;
    chatLog.appendChild(tag);
    chatInput.focus();
    tip.textContent = 'Chat open. Press Esc to go back.';
  }

  function closeChat(){
    if (!inChat) return;
    inChat = false;
    chat.classList.add('hidden');
    tip.textContent = 'Use ← → or A/D to switch · Enter to preview, then again to open chat.';
  }

  /* controls */
  prevBtn?.addEventListener('click',()=>switchBot(-1));
  nextBtn?.addEventListener('click',()=>switchBot(1));
  openBtn?.addEventListener('click', openChat);
  chatX?.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e)=>{
    if (selectorWrap.classList.contains('hidden')) return;
    if (inChat){
      if (e.key==='Escape') closeChat();
      return;
    }
    if (e.key==='ArrowLeft' || e.key==='a' || e.key==='A') switchBot(-1);
    if (e.key==='ArrowRight' || e.key==='d' || e.key==='D') switchBot(1);
    if (e.key==='Enter'){ 
      // first Enter previews (already rendered); second Enter opens chat
      openChat();
    }
    if (e.key==='Escape'){
      // back to landing
      selectorWrap.classList.add('hidden');
      landing.classList.remove('hidden');
      tip.style.opacity = 0;
    }
  });

  /* chat send + fake “smart” reply (hooked to voice.js typing effect) */
  function pushMsg(role, text){
    const m = document.createElement('div');
    m.className = 'msg ' + role;
    m.textContent = text;
    chatLog.appendChild(m);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  chatSend?.addEventListener('click', send);
  chatInput?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); }});

  function send(){
    const q = chatInput.value.trim();
    if(!q) return;
    chatInput.value='';
    pushMsg('you', q);

    // “futuristic” reply script – you can wire to backend later.
    const reply = aiReply(q, bots[i].name);
    typeReply(reply);
  }

  function aiReply(q, name){
    // lightweight on-device demo behavior
    const low = q.toLowerCase();
    if (low.includes('price')||low.includes('cost')) return `${name}: Pricing depends on configuration. I can collect a few details and generate a tailored quote in under 60s.`;
    if (low.includes('book')||low.includes('schedule')) return `${name}: Sure — what day works best? I can offer real-time slots and send an SMS confirmation.`;
    if (low.includes('help')||low.includes('support')) return `${name}: I triage and resolve most issues automatically, and hand off with full context when needed.`;
    return `${name}: Got it. I’ll capture that and continue.`;
  }

  function typeReply(text){
    const m = document.createElement('div');
    m.className = 'msg ai';
    chatLog.appendChild(m);
    // green “typewriter” draw
    let i=0;
    const id = setInterval(()=>{
      m.textContent = text.slice(0, ++i);
      m.style.color = '#cbffcb';
      m.style.textShadow = '0 0 6px rgba(156,255,156,.4)';
      if(i>=text.length){ clearInterval(id); m.style.color='#fff'; m.style.textShadow='none'; }
      chatLog.scrollTop = chatLog.scrollHeight;
    }, 14);
  }
})();
