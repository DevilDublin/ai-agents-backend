(function () {
  // --- Bot definitions -------------------------------------------------------
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

  // --- Helpers ---------------------------------------------------------------
  const $ = id => document.getElementById(id);
  const starter=()=>$('starter'), split=()=>$('demoSplit'), hud=()=>$('demoHUD'), hudText=()=>$('hudText');
  const twTitle=()=>$('twTitle'), twBody=()=>$('twBody'), prev=()=>$('prevBot'), next=()=>$('nextBot'), openNow=()=>$('openNow');
  const chat=()=>$('chatContainer'), ghost=()=>$('chatPlaceholder'), closeChat=()=>$('closeChat');
  const input=()=>$('userInput'), send=()=>$('sendBtn'), mic=()=>$('micBtn');
  const twPane=()=>$('twPane'), chatPane=()=>$('chatPane');

  let i=0, locked=false, frame;

  // Scramble type effect (clean + fast)
  const glyphs='!<>-_\\/[]{}—=+*^?#________';
  function scrambleTo(lines){
    cancelAnimationFrame(frame);
    const el=twBody(); const max=Math.max(...lines.map(l=>l.length));
    const queues = lines.map(line=>{
      const from=''.padEnd(max,' '), to=line.padEnd(max,' ');
      return Array.from({length:max},(_,n)=>({from:from[n],to:to[n],s:Math.random()*12|0,e:(Math.random()*18|0)+10,char:''}));
    });
    let t=0; (function loop(){
      let out=[];
      for(let li=0; li<queues.length; li++){
        let q=queues[li], line='';
        for(let k=0;k<q.length;k++){
          const it=q[k]; if(t>=it.e) line+=it.to;
          else if(t>=it.s){ if(!it.char || Math.random()<.1) it.char=glyphs[(Math.random()*glyphs.length)|0]; line+=it.char; }
          else line+=it.from;
        }
        out.push(line.replace(/\s+$/,''));
      }
      el.textContent=out.join('\n'); t++; if(t<32+max) frame=requestAnimationFrame(loop);
    })();
  }

  function parallax(dir){
    [twPane(), chatPane()].forEach(p=>p && p.animate([{transform:`translateX(${8*dir}px)`},{transform:'translateX(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'}));
  }

  // --- Selector / Chat flow --------------------------------------------------
  function showBot(idx, anim=true){
    i=(idx+BOTS.length)%BOTS.length;
    const bot=BOTS[i];
    twTitle().textContent=`> ${bot.name}`;
    scrambleTo(bot.lines);
    if(anim) parallax(1);
    // Reset chat side visuals when switching
    ghost().classList.remove('hidden');
    chat().classList.add('hidden');
    closeChat().classList.add('hidden');
  }

  function openSelector(){
    starter().classList.add('hidden');
    split().classList.remove('hidden');
    hud().classList.remove('hidden');
    hudText().innerHTML = 'Use <b>← →</b> / <b>A D</b> to switch · <b>Enter</b> to open · <b>Esc</b> back';
    locked=false;
    showBot(0,false);
  }

  function openChat(){
    if(locked) return;
    locked=true;
    hudText().innerHTML='<b>Chat open.</b> Press <b>×</b> to go back.';
    ghost().classList.add('hidden');         // remove placeholder completely
    chat().classList.remove('hidden');       // reveal chat
    closeChat().classList.remove('hidden');  // show close control

    // Seed the first line so it looks alive
    addMsg('assistant', `Opening demo: ${BOTS[i].name}`);
    // Optional: auto-focus
    $('userInput').focus();
    // Micro animation
    chat().animate([{transform:'translateY(10px)',opacity:.85},{transform:'translateY(0)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'});
  }

  function closeToSelector(){
    locked=false;
    ghost().classList.remove('hidden');
    chat().classList.add('hidden');
    closeChat().classList.add('hidden');
    hudText().innerHTML='Use <b>← →</b> / <b>A D</b> to switch · <b>Enter</b> to open · <b>Esc</b> back';
  }

  // --- Minimal chat scaffold (pretty + works with your IDs) -----------------
  function addMsg(role,text){
    const box=$('chatMessages');
    const row=document.createElement('div');
    row.className=`msg ${role}`;
    row.innerHTML=`<div class="bubble">${text}</div>`;
    box.appendChild(row);
    box.scrollTop=box.scrollHeight;
  }

  function handleSend(){
    const v=input().value.trim(); if(!v) return;
    addMsg('user', v);
    input().value='';
    setTimeout(()=>addMsg('assistant','(Demo) Response from '+BOTS[i].name), 350);
  }

  function initMic(){
    if(!('webkitSpeechRecognition'in window || 'SpeechRecognition'in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR(); rec.lang='en-US'; rec.interimResults=false;
    mic().addEventListener('click', ()=>{
      mic().classList.add('listening'); rec.start();
    });
    rec.onresult = (e)=>{ input().value=e.results[0][0].transcript; mic().classList.remove('listening'); handleSend(); };
    rec.onend    = ()=> mic().classList.remove('listening');
  }

  // --- Wire up ---------------------------------------------------------------
  function init(){
    if(!starter()) return;

    // Only the shape visible initially (split + hud hidden by HTML 'hidden' class)
    starter().addEventListener('click', openSelector);

    prev().addEventListener('click', ()=>{ if(!locked) showBot(i-1); });
    next().addEventListener('click', ()=>{ if(!locked) showBot(i+1); });
    openNow().addEventListener('click', ()=>{ if(!locked) openChat(); });

    closeChat().addEventListener('click', closeToSelector);
    $('sendBtn').addEventListener('click', handleSend);
    $('userInput').addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSend(); }});
    initMic();

    document.addEventListener('keydown',(e)=>{
      // Enter on intro → open selector
      if(!starter().classList.contains('hidden') && e.key==='Enter'){ openSelector(); return; }

      if(e.key==='Escape'){
        if(locked){ /* ignore to prevent relock flicker */ }
        else { // go back to intro
          split().classList.add('hidden'); hud().classList.add('hidden'); starter().classList.remove('hidden');
        }
      }
      if(locked) return; // when chat is open, selector is locked
      if(e.key==='Enter'){ openChat(); return; }
      const k=e.key.toLowerCase();
      if(k==='arrowright'||k==='d') showBot(i+1);
      if(k==='arrowleft'||k==='a')  showBot(i-1);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
