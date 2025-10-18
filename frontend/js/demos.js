/* Demos: keep your UI/flow, add animated intro + clean toggling */
(() => {
  const intro = document.getElementById('demoIntro');
  const stage = document.getElementById('demoStage');
  const glyph = document.getElementById('introGlyph');
  const brief = document.getElementById('botBrief');
  const chatMount = document.getElementById('chatMount');

  // --- Intro open animation -> reveal selector
  function openSelector(){
    if(!intro || !stage) return;
    glyph.style.pointerEvents = 'none';
    glyph.animate([
      { transform:'scale(1)', opacity:1 },
      { transform:'scale(1.06)', opacity:1, offset:.4 },
      { transform:'scale(.84)', opacity:.0 }
    ], { duration:520, easing:'cubic-bezier(.2,.7,0,1)' }).onfinish = () => {
      intro.style.display='none';
      stage.classList.add('active');
      initSelector();
    };
  }
  glyph?.addEventListener('click', openSelector);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && intro?.style.display!=='none') openSelector(); });

  // --- Simple demo data (keep your earlier content structure)
  const DEMOS = [
    {
      id:'car',
      title:'Car Insurance',
      brief:[
        'Decrypting module…',
        'Agent: Car Insurance — Quick-qualify & quote',
        'Collect → name, phone, vehicle, NCB, claims',
        'Decision → instant quote / manual review',
        'Integrations → Calendar · CRM · Email',
        'Hint → say: "Get a quick quote"'
      ]
    },
    {
      id:'appointly',
      title:'Appointly',
      brief:[
        'Loading scheduler…',
        'Agent: Appointly — Appointment Booking',
        'Collect → service, date & time, notes',
        'Confirm → SMS + calendar invite',
        'Links → reschedule / cancel',
        'Hint → say: "Book me Friday 3pm"'
      ]
    },
    {
      id:'salon',
      title:'Salon Booker',
      brief:[
        'Compiling treatments…',
        'Agent: Salon Booker — Services & add-ons',
        'Upsell → bundles, extras, deposits',
        'Remind → no-show sequences',
        'Ops → CRM summary',
        'Hint → say: "Cut + beard trim this weekend"'
      ]
    },
    {
      id:'property',
      title:'Property Qualifier',
      brief:[
        'Scanning listings…',
        'Agent: Property Qualifier — Tenants & viewings',
        'Filter → budget, move-in, location, docs',
        'Book → viewing slots / agent call',
        'Sync → CRM with transcript',
        'Hint → say: "I want to view a 2-bed"'
      ]
    }
  ];

  let index = 0;
  let previewOpen = false;
  let chatOpen = false;

  function renderBrief(){
    const d = DEMOS[index];
    const lines = d.brief.map(l => `<div class="type-green">${l}</div>`).join('');
    brief.innerHTML = `
      <div style="border-radius:16px; border:1px solid rgba(255,255,255,.1); padding:18px; background:#0e1218;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--success);box-shadow:0 0 16px var(--success)"></div>
          <div style="opacity:.9">› ${d.title}</div>
        </div>
        <div id="briefLines" style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:14px; line-height:1.6"></div>
        <div style="display:flex; gap:8px; margin-top:12px; opacity:.7">
          <span class="badge">Prev</span>
          <span class="badge">Next</span>
          <span class="badge">Open (Enter)</span>
        </div>
      </div>
    `;
    // typewriter reveal
    const el = brief.querySelector('#briefLines');
    el.innerHTML = '';
    let i = 0;
    function tick(){
      if(i >= d.brief.length) return;
      const row = document.createElement('div');
      row.className = 'type-green typewriter';
      row.style.animationDuration = '820ms';
      row.textContent = d.brief[i++];
      el.appendChild(row);
      setTimeout(tick, 260);
    }
    tick();
  }

  function openChat(){
    if(chatOpen) return;
    chatOpen = true;
    previewOpen = true;
    chatMount.innerHTML = `
      <div style="position:relative">
        <button id="chatClose"
          style="position:absolute;right:10px;top:10px;width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:#0f141a;color:#fff">×</button>
        <div style="margin:0 8px 10px 0;opacity:.9">Opening demo: <strong>${DEMOS[index].title}</strong></div>
        <div id="chatBox" class="panel" style="background:#0f141a; border:1px solid rgba(255,255,255,.1); padding:12px">
          <div id="chatLog" style="min-height:180px"></div>
          <div style="display:flex; gap:8px; margin-top:12px">
            <input id="chatInput" class="input" placeholder="type a message or press the mic…"/>
            <button id="chatSend" class="btn-send">›</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('chatClose').onclick = () => {
      chatOpen = false;
      chatMount.innerHTML = '';
    };

    // send handler
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const log = document.getElementById('chatLog');
    function append(role, text){
      const row = document.createElement('div');
      row.style.margin = '8px 0';
      row.innerHTML = `<div style="opacity:.7">${role}</div><div>${text}</div>`;
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
    }
    send.onclick = () => {
      const val = input.value.trim();
      if(!val) return;
      append('You', val);
      input.value = '';
      // mock smart reply (keep your backend hook here)
      setTimeout(()=>append('Zypher', `Running ${DEMOS[index].title} flow…`), 300);
    };

    // Hook for voice.js transcription -> typewriter effect into input
    window.typeIntoChat = (text) => {
      const target = document.getElementById('chatInput');
      if(!target) return;
      target.value = ''; // reset
      let i=0;
      const interval = setInterval(() => {
        target.value += text[i++];
        if(i>=text.length) clearInterval(interval);
      }, 18);
    };
  }

  function initSelector(){
    renderBrief();
    window.addEventListener('keydown', (e)=>{
      if(e.key==='ArrowRight' || e.key.toLowerCase()==='d'){
        index = (index+1) % DEMOS.length;
        renderBrief();
      }
      if(e.key==='ArrowLeft' || e.key.toLowerCase()==='a'){
        index = (index-1+DEMOS.length) % DEMOS.length;
        renderBrief();
      }
      if(e.key==='Enter'){
        if(!previewOpen){ previewOpen = true; renderBrief(); openChat(); }
        else if(!chatOpen){ openChat(); }
      }
      if(e.key==='Escape'){
        if(chatOpen){ chatOpen=false; chatMount.innerHTML=''; return; }
        // go back to intro
        stage.classList.remove('active');
        intro.style.display='grid';
        glyph.style.pointerEvents='auto';
        previewOpen=false;
      }
    }, { passive:true });
  }
})();
