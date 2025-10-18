(function(){
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

  const starter = ()=>document.getElementById('starter');
  const shell   = ()=>document.querySelector('.demos-shell');

  // dynamic nodes (built after intro)
  let split, hud, twTitle, twBody, prevBtn, nextBtn, openBtn,
      chatHolder, chatClose, chatBox, msgWrap, input, send, micBtn,
      placeholder;
  let idx=0, locked=false, frame;

  // --- Scramble type effect
  const glyphs='!<>-_\\/[]{}—=+*^?#________';
  function scrambleTo(lines){
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
    // HUD
    hud = document.createElement('div');
    hud.className='demo-hud';
    hud.innerHTML = `<span class="hud-dot"></span><span id="hudText">Use <b>← →</b> / <b>A D</b> to switch · <b>Enter</b> to open · <b>Esc</b> back</span>`;
    shell().appendChild(hud);

    // Split
    split = document.createElement('section');
    split.className = 'demo-split';
    split.innerHTML = `
      <aside class="typewriter neon-green" id="twPane">
        <div class="tw-header"><span class="tw-led"></span><span class="tw-title" id="twTitle">_</span></div>
        <pre class="tw-body" id="twBody"></pre>
        <div class="tw-controls">
          <button id="prevBot" class="pill-btn">← Prev</button>
          <button id="nextBot" class="pill-btn">Next →</button>
          <button id="openNow" class="pill-link" type="button">Open (Enter)</button>
        </div>
      </aside>
      <div class="chat-panel" id="chatPane">
        <button id="closeChat" class="chat-close hidden" aria-label="Close">×</button>
        <div id="chatContainer" class="chat-container chat-bright hidden">
          <div id="chatMessages" class="chat-messages"></div>
          <div class="chat-input">
            <button id="micBtn" class="mic" aria-label="Voice">🎤</button>
            <input id="userInput" type="text" placeholder="Type a message or press the mic…" autocomplete="off"/>
            <button id="sendBtn" class="send" aria-label="Send">➤</button>
          </div>
        </div>
      </div>`;
    shell().appendChild(split);

    // Placeholder is created (and later destroyed) so no residual blur
    placeholder = document.createElement('div');
    placeholder.className='chat-placeholder';
    placeholder.innerHTML = `<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
    split.querySelector('#chatPane').appendChild(placeholder);

    // refs
    twTitle   = split.querySelector('#twTitle');
    twBody    = split.querySelector('#twBody');
    prevBtn   = split.querySelector('#prevBot');
    nextBtn   = split.querySelector('#nextBot');
    openBtn   = split.querySelector('#openNow');
    chatClose = split.querySelector('#closeChat');
    chatBox   = split.querySelector('#chatContainer');
    msgWrap   = split.querySelector('#chatMessages');
    input     = split.querySelector('#userInput');
    send      = split.querySelector('#sendBtn');
    micBtn    = split.querySelector('#micBtn');

    // events
    prevBtn.onclick=()=>{ if(!locked) show(idx-1) };
    nextBtn.onclick=()=>{ if(!locked) show(idx+1) };
    openBtn.onclick=()=>{ if(!locked) openChat() };
    chatClose.onclick=closeToSelector;
    send.onclick=sendMsg;
    input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMsg(); }});
    initMic();

    // first bot
    show(0,false);
  }

  function parallax(dir){
    const panes = split.querySelectorAll('#twPane, #chatPane');
    panes.forEach(p=>p.animate([{transform:`translateX(${8*dir}px)`},{transform:'translateX(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'}));
  }

  function show(next, animate=true){
    idx=(next+BOTS.length)%BOTS.length;
    const bot=BOTS[idx];
    twTitle.textContent = `> ${bot.name}`;
    scrambleTo(bot.lines);
    if(animate) parallax(1);

    // reset chat visuals if user is just browsing
    if(!locked){
      if(placeholder==null){
        placeholder=document.createElement('div');
        placeholder.className='chat-placeholder';
        placeholder.innerHTML=`<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
        split.querySelector('#chatPane').appendChild(placeholder);
      }
      chatBox.classList.add('hidden');
      chatClose.classList.add('hidden');
    }
  }

  function openChat(){
    if(locked) return;
    locked=true;
    // DESTROY blur placeholder so no ghost remains
    if(placeholder){ placeholder.remove(); placeholder=null; }
    chatBox.classList.remove('hidden');
    chatClose.classList.remove('hidden');
    addMsg('assistant', `Opening demo: ${BOTS[idx].name}`);
    input.focus();
    chatBox.animate([{transform:'translateY(10px)',opacity:.85},{transform:'translateY(0)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'});
  }

  function closeToSelector(){
    locked=false;
    // Recreate placeholder (fresh element with blur) for selector state
    if(!placeholder){
      placeholder=document.createElement('div');
      placeholder.className='chat-placeholder';
      placeholder.innerHTML = `<div class="cp-wrap"><div class="cp-title">Select a bot to open the chat</div><div class="cp-sub">Press <b>Enter</b> when ready</div></div>`;
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
    setTimeout(()=>addMsg('assistant','(Demo) Response from '+BOTS[idx].name), 350);
  }

  function initMic(){
    if(!('webkitSpeechRecognition'in window || 'SpeechRecognition'in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR(); rec.lang='en-US'; rec.interimResults=false;
    micBtn.addEventListener('click', ()=>{ micBtn.classList.add('listening'); rec.start(); });
    rec.onresult = e=>{ input.value=e.results[0][0].transcript; micBtn.classList.remove('listening'); sendMsg(); };
    rec.onend    = ()=> micBtn.classList.remove('listening');
  }

  function begin(){
    if(!starter()) return;
    // ENTER also begins
    document.addEventListener('keydown', e=>{
      if(e.key==='Enter' && document.body.contains(starter())) {
        e.preventDefault(); starter().click();
      }else if(split){
        if(e.key==='Escape' && !document.body.contains(starter())) {
          if(locked) return; // when chat open, use × button
          // back to intro
          shell().removeChild(split); split=null;
          shell().removeChild(hud);   hud=null;
          document.querySelector('.demos-shell').appendChild(starter());
          starter().classList.remove('hidden');
        }else if(!locked){
          const k=e.key.toLowerCase();
          if(k==='enter'){ openChat(); }
          if(k==='arrowright'||k==='d') show(idx+1);
          if(k==='arrowleft'||k==='a')  show(idx-1);
        }
      }
    });

    starter().addEventListener('click', ()=>{
      starter().classList.add('hidden');
      buildSelector();
    });
  }

  document.addEventListener('DOMContentLoaded', begin);
})();
