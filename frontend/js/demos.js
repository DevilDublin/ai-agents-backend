(function(){
  const $ = s => document.querySelector(s);
  const shell = () => $('.demos-shell');

  /* ----------------- INTRO SHAPE ----------------- */
  function buildIntro(){
    const b = document.createElement('button');
    b.id = 'starter';
    b.className = 'shape3d';
    b.innerHTML = `
      <span class="core"></span>
      <span class="halo"></span>
      <span class="shine"></span>
      <span class="label">Click me!</span>
    `;
    b.addEventListener('click', startSelector, {passive:true});
    shell().appendChild(b);
  }

  /* ----------------- SELECTOR + CHAT ----------------- */
  const BOTS = [
    { name:'Car Insurance', lines:[
      'Decrypting module…',
      'Agent: Car Insurance — Quick-qualify & quote',
      'Collect → name, phone, vehicle, NCB, claims',
      'Decision → instant quote / manual review',
      'Integrations → Calendar · CRM · Email',
      'Hint → say: "Get a quick quote"'
    ]},
    { name:'Appointly', lines:[
      'Loading scheduler…',
      'Agent: Appointly — Appointment Booking',
      'Collect → service, date & time, notes',
      'Confirm → SMS + calendar invite',
      'Links → reschedule / cancel',
      'Hint → say: "Book me Friday 3pm"'
    ]},
    { name:'Salon Booker', lines:[
      'Compiling treatments…',
      'Agent: Salon Booker — Services & add-ons',
      'Upsell → bundles, extras, deposits',
      'Remind → no-show sequences',
      'Ops → CRM summary',
      'Hint → say: "Cut + beard trim this weekend"'
    ]},
    { name:'Property Qualifier', lines:[
      'Scanning listings…',
      'Agent: Property Qualifier — Tenants & viewings',
      'Filter → budget, move-in, location, docs',
      'Book → viewing slots / agent call',
      'Sync → CRM with transcript',
      'Hint → say: "I want to view a 2-bed"'
    ]},
    { name:'Support Triage', lines:[
      'Routing engine online…',
      'Agent: Support Triage — Right fix, first time',
      'Identify → category · priority',
      'Resolve → guided steps / human handoff',
      'Ticket → context auto-logged',
      'Hint → say: "My order never arrived"'
    ]},
    { name:'Custom Bot', lines:[
      'Generating blueprint…',
      'Agent: Custom — Your use-case',
      'Modes → lead gen · bookings · support',
      'Connect → APIs · CRM · calendar',
      'Brand → tone, visuals, copy',
      'Hint → say: "Show me a tailored flow"'
    ]}
  ];

  let STATE='intro', current=0, frame;
  let split, twTitle, twBody, placeholder, chatBox, chatClose, msgWrap, input, send, micBtn;

  const glyphs='!<>-_\\/[]{}—=+*^?#________';
  function scramble(lines){
    cancelAnimationFrame(frame);
    const max=Math.max(...lines.map(l=>l.length));
    const queues = lines.map(line=>{
      const to=line.padEnd(max,' ');
      return Array.from({length:max},(_,n)=>({to:to[n],s:Math.random()*12|0,e:(Math.random()*18|0)+10,char:''}));
    });
    let t=0; (function loop(){
      const out=[];
      for(const q of queues){
        let line='';
        for(const it of q){
          if(t>=it.e) line+=it.to;
          else if(t>=it.s){ if(!it.char || Math.random()<.1) it.char=glyphs[(Math.random()*glyphs.length)|0]; line+=it.char; }
          else line+=' ';
        }
        out.push(line.replace(/\s+$/,''));
      }
      twBody.textContent=out.join('\n'); t++; if(t<32+max) frame=requestAnimationFrame(loop);
    })();
  }

  function buildSelector(){
    split = document.createElement('section');
    split.className='demo-split';
    split.innerHTML = `
      <aside class="typewriter" id="twPane">
        <div class="tw-header"><span class="tw-led"></span><span class="tw-title" id="twTitle">_</span></div>
        <pre class="tw-body" id="twBody"></pre>
        <div class="tw-controls">
          <button class="pill" id="prevBot">← Prev</button>
          <button class="pill" id="nextBot">Next →</button>
          <button class="pill" id="openNow">Open (Enter)</button>
        </div>
      </aside>
      <div class="chat-panel" id="chatPane">
        <button id="closeChat" class="chat-close hidden" aria-label="Close">×</button>
        <div id="chatContainer" class="chat-container hidden">
          <div id="chatMessages" class="chat-messages"></div>
          <div class="chat-input">
            <button id="micBtn" class="mic" aria-label="Voice">🎤</button>
            <input id="userInput" type="text" placeholder="Type a message or press the mic…" autocomplete="off"/>
            <button id="sendBtn" class="send" aria-label="Send">➤</button>
          </div>
        </div>
      </div>`;
    shell().appendChild(split);

    placeholder = document.createElement('div');
    placeholder.className='chat-placeholder';
    placeholder.innerHTML = `<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
    split.querySelector('#chatPane').appendChild(placeholder);

    twTitle = $('#twTitle'); twBody = $('#twBody');
    $('#prevBot').onclick=()=>show(current-1);
    $('#nextBot').onclick=()=>show(current+1);
    $('#openNow').onclick=openChat;

    chatClose = $('#closeChat'); chatBox = $('#chatContainer');
    msgWrap = $('#chatMessages'); input=$('#userInput'); send=$('#sendBtn'); micBtn=$('#micBtn');

    chatClose.onclick=closeChat;
    send.onclick=sendMsg;
    input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});

    initMicTypewriter();

    show(0,false);
  }

  function show(n, animate=true){
    current = (n+BOTS.length)%BOTS.length;
    const bot=BOTS[current];
    twTitle.textContent = `> ${bot.name}`;
    scramble(bot.lines);
    if(STATE==='selector'){
      chatBox.classList.add('hidden');
      chatClose.classList.add('hidden');
      if(!placeholder){
        placeholder=document.createElement('div');
        placeholder.className='chat-placeholder';
        placeholder.innerHTML=`<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
        split.querySelector('#chatPane').appendChild(placeholder);
      }
    }
  }

  function openChat(){
    if(STATE!=='selector') return;
    STATE='chat';
    if(placeholder){ placeholder.remove(); placeholder=null; }
    chatBox.classList.remove('hidden');
    chatClose.classList.remove('hidden');
    addMsg('assistant', `Opening demo: ${BOTS[current].name}`);
    input.focus();
  }

  function closeChat(){
    STATE='selector';
    if(!placeholder){
      placeholder=document.createElement('div');
      placeholder.className='chat-placeholder';
      placeholder.innerHTML=`<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
      split.querySelector('#chatPane').appendChild(placeholder);
    }
    chatBox.classList.add('hidden');
    chatClose.classList.add('hidden');
  }

  function addMsg(role,text){
    const row=document.createElement('div');
    row.className=`msg ${role}`;
    row.innerHTML=`<div class="bubble">${text}</div>`;
    msgWrap.appendChild(row);
    msgWrap.scrollTop=msgWrap.scrollHeight;
  }
  function sendMsg(){
    const v=input.value.trim(); if(!v) return;
    addMsg('user', v); input.value='';
    setTimeout(()=>addMsg('assistant','(Demo) Response from '+BOTS[current].name), 320);
  }

  /* ----------------- Mic: green typewriter while recording ----------------- */
  function initMicTypewriter(){
    if(!('webkitSpeechRecognition'in window || 'SpeechRecognition'in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR(); rec.lang='en-US'; rec.interimResults=true; rec.continuous=false;

    let typingTimer=null;
    function typeIntoInput(text){
      clearInterval(typingTimer);
      const full=text; let i=0; input.classList.add('input-typing');
      typingTimer=setInterval(()=>{
        input.value = full.slice(0, ++i);
        if(i>=full.length){ clearInterval(typingTimer); input.classList.remove('input-typing'); }
      }, 18);
    }

    micBtn.addEventListener('click', ()=>{
      input.value=''; input.classList.add('input-typing');
      rec.start();
    }, {passive:true});

    rec.onresult = e=>{
      let interim='', final='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const t = e.results[i][0].transcript;
        if(e.results[i].isFinal) final += t; else interim += t;
      }
      typeIntoInput(final || interim);
    };
    rec.onend = ()=> input.classList.remove('input-typing');
  }

  /* ----------------- State transitions ----------------- */
  function startSelector(){
    if(STATE!=='intro') return;
    STATE='selector';
    const s = $('#starter'); if(s) s.remove();
    buildSelector();
  }
  document.addEventListener('keydown', e=>{
    if(e.key==='Enter'){
      if(STATE==='intro'){ e.preventDefault(); startSelector(); }
      else if(STATE==='selector'){ e.preventDefault(); openChat(); }
    }else if(e.key==='Escape'){
      if(STATE==='selector'){ STATE='intro'; if(split){ split.remove(); split=null; } buildIntro(); }
      else if(STATE==='chat'){ closeChat(); }
    }else if(STATE==='selector'){
      const k=e.key.toLowerCase();
      if(k==='arrowright'||k==='d') show(current+1);
      if(k==='arrowleft'||k==='a') show(current-1);
    }
  });

  document.addEventListener('DOMContentLoaded', ()=>{
    buildIntro();
  });
})();
