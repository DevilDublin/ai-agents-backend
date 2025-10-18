(function () {
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

  const $ = id => document.getElementById(id);

  // Elements
  const btn=()=>$('selectDemoBtn'), split=()=>$('demoSplit'), hud=()=>$('demoHUD'), hudText=()=>$('hudText');
  const twTitle=()=>$('twTitle'), twBody=()=>$('twBody'), prev=()=>$('prevBot'), next=()=>$('nextBot'), openNow=()=>$('openNow');
  const chat=()=>$('chatContainer'), ghost=()=>$('chatPlaceholder'), closeChat=()=>$('closeChat');
  const input=()=>$('userInput'), send=()=>$('sendBtn');
  const twPane=()=>$('twPane'), chatPane=()=>$('chatPane');

  // State
  let i=0, frame;
  let locked = false; // when true: selector is locked, keys won’t switch
  const glyphs='!<>-_\\/[]{}—=+*^?#________';

  // Scramble -> reveal text (typewriter hacker vibe)
  function scrambleTo(target){
    cancelAnimationFrame(frame);
    const el=twBody(), lines=target.slice(); let queue=[], output=lines.map(()=>''), maxLen=Math.max(...lines.map(l=>l.length));
    for (let li=0; li<lines.length; li++){
      const from=''.padEnd(maxLen,' '), to=lines[li].padEnd(maxLen,' '), q=[];
      for (let n=0; n<maxLen; n++){
        const s=Math.floor(Math.random()*14), e=s+Math.floor(Math.random()*18)+8;
        q.push({from:from[n],to:to[n],start:s,end:e,char:''});
      }
      queue.push(q);
    }
    let t=0; (function update(){
      let done=0;
      for (let li=0; li<queue.length; li++){
        const q=queue[li]; let line='';
        for (let n=0; n<q.length; n++){
          let {from,to,start,end,char}=q[n];
          if (t>=end){ done++; line+=to; }
          else if (t>=start){ if(!char||Math.random()<.09) char=glyphs[Math.floor(Math.random()*glyphs.length)]; q[n].char=char; line+=char; }
          else line+=from;
        }
        output[li]=line.replace(/\s+$/,'');
      }
      el.textContent=output.join('\n'); t++; if (done>=queue.length*maxLen) return; frame=requestAnimationFrame(update);
    })();
  }

  function parallax(dir){
    [twPane(), chatPane()].forEach(p=>p && p.animate([{transform:`translateX(${8*dir}px)`},{transform:'translateX(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'}));
  }

  function showBot(idx, animate=true){
    i=(idx+BOTS.length)%BOTS.length;
    const bot=BOTS[i];
    twTitle().textContent=`> ${bot.name}`;
    scrambleTo(bot.lines);
    if(animate) parallax(1);
  }

  function openSelector(){
    btn().classList.add('hidden');
    split().classList.remove('hidden');
    hud().classList.remove('hidden');
    hudText().innerHTML = 'Use <b>← →</b> / <b>A D</b> to switch · <b>Enter</b> to open';
    locked = false;
    ghost().classList.remove('hidden');
    chat().classList.add('hidden');
    closeChat().classList.add('hidden');
    showBot(0,false);
  }

  function openChat(){
    // Lock selector; reveal chat; prevent further Enter cycling
    locked = true;
    hudText().innerHTML = '<b>Chat open.</b> Press <b>×</b> to go back.';
    ghost().classList.add('hidden');
    chat().classList.remove('hidden');
    closeChat().classList.remove('hidden');

    input().value = `Open demo: ${BOTS[i].name}`;
    setTimeout(()=>send().click(), 80);
    chat().animate([{transform:'translateY(10px)',opacity:.9},{transform:'translateY(0)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.7,.1,1)'});
  }

  function closeToSelector(){
    locked = false;
    ghost().classList.remove('hidden');
    chat().classList.add('hidden');
    closeChat().classList.add('hidden');
    hudText().innerHTML = 'Use <b>← →</b> / <b>A D</b> to switch · <b>Enter</b> to open';
  }

  function init(){
    if(!btn()) return;

    btn().addEventListener('click', openSelector);

    prev().addEventListener('click', ()=>{ if(!locked) showBot(i-1); });
    next().addEventListener('click', ()=>{ if(!locked) showBot(i+1); });
    openNow().addEventListener('click', ()=>{ if(!locked) openChat(); });

    closeChat().addEventListener('click', closeToSelector);

    document.addEventListener('keydown',(e)=>{
      // Enter from diamond
      if(!split() || split().classList.contains('hidden')){
        if(e.key==='Enter'){ openSelector(); }
        return;
      }
      const k=e.key.toLowerCase();
      if(!locked && (k==='arrowright'||k==='d')) showBot(i+1);
      if(!locked && (k==='arrowleft'||k==='a')) showBot(i-1);
      if(!locked && k==='enter') openChat();     // open + lock
      if(k==='escape' && locked===false){ // only reset to diamond when not in chat
        split().classList.add('hidden'); hud().classList.add('hidden'); btn().classList.remove('hidden');
      }
    });

    // first paint
    // (diamond visible)
  }

  document.addEventListener('DOMContentLoaded', init);
})();
