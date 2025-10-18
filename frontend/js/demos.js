/* Demos — Zypher
 * One-screen “Click me!” → cinematic selector → locked chat with ESC back.
 * Mobile-safe, keyboard hints, and green typewriter STT overlay.
 */

(() => {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const root = qs('#app') || document.body;

  // ---- Config: bots and copy ------------------------------------------------
  const BOTS = [
    {
      id: 'car',
      name: 'Car Insurance',
      lines: [
        'Decrypting module…',
        'Agent: Car Insurance — Quick-qualify & quote',
        'Collect → name, phone, vehicle, NCB, claims',
        'Decision → instant quote / manual review',
        'Integrations → Calendar · CRM · Email',
        'Hint → say: "Get a quick quote"',
      ],
      openHint: 'Opening demo: Car Insurance'
    },
    {
      id: 'appointly',
      name: 'Appointly',
      lines: [
        'Loading scheduler…',
        'Agent: Appointly — Appointment Booking',
        'Collect → service, date & time, notes',
        'Confirm → SMS + calendar invite',
        'Links → reschedule / cancel',
        'Hint → say: "Book me Friday 3pm"',
      ],
      openHint: 'Opening demo: Appointly'
    },
    {
      id: 'salon',
      name: 'Salon Booker',
      lines: [
        'Compiling treatments…',
        'Agent: Salon Booker — Services & add-ons',
        'Upsell → bundles, extras, deposits',
        'Remind → no-show sequences',
        'Ops → CRM summary',
        'Hint → say: "Cut + beard trim this weekend"',
      ],
      openHint: 'Opening demo: Salon Booker'
    },
    {
      id: 'property',
      name: 'Property Qualifier',
      lines: [
        'Scanning listings…',
        'Agent: Property Qualifier — Tenants & viewings',
        'Filter → budget, move-in, location, docs',
        'Book → viewing slots / agent call',
        'Sync → CRM with transcript',
        'Hint → say: "I want to view a 2-bed"',
      ],
      openHint: 'Opening demo: Property Qualifier'
    },
  ];

  // ---- State ----------------------------------------------------------------
  let index = 0;
  let stage = 'intro'; // intro | selector | chat
  let sttOverlay;      // green typewriter for STT

  // ---- Helpers --------------------------------------------------------------
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const setStage = (next) => {
    stage = next;
    document.body.setAttribute('data-demo-stage', next);
  };

  const clearRoot = () => {
    const mount = qs('#demoMount');
    if (mount) mount.remove();
    const hud = qs('.z-hud');
    if (hud) hud.remove();
  };

  const mountWrap = () => {
    const wrap = document.createElement('div');
    wrap.id = 'demoMount';
    wrap.className = 'z-mount';
    root.appendChild(wrap);
    return wrap;
  };

  // ---- Intro: single centered shape ----------------------------------------
  const renderIntro = () => {
    clearRoot();
    setStage('intro');
    const wrap = mountWrap();
    wrap.innerHTML = `
      <div class="z-intro">
        <div class="z-orb" role="button" aria-label="Open demos" tabindex="0">
          <span class="z-orb-label">Click me!</span>
        </div>
      </div>
    `;

    // tiny idle tilt
    let t = 0;
    const orb = qs('.z-orb', wrap);
    const spin = () => {
      if (stage !== 'intro') return;
      t += 0.01;
      const rx = Math.sin(t) * 6;
      const ry = Math.cos(t * 0.8) * 6;
      orb.style.transform = `translateZ(0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      requestAnimationFrame(spin);
    };
    spin();

    const open = () => {
      orb.classList.add('z-orb-open');
      setTimeout(() => renderSelector(true), 500); // hand off to selector with camera move
    };
    orb.addEventListener('click', open);
    orb.addEventListener('keydown', (e) => (e.key === 'Enter') && open());
  };

  // ---- Selector HUD ---------------------------------------------------------
  const renderHud = () => {
    const hud = document.createElement('div');
    hud.className = 'z-hud';
    hud.innerHTML = `
      <div class="z-hud-row">
        <div class="z-pill">Use <b>← →</b> or <b>A / D</b> to switch</div>
        <div class="z-pill"><b>Enter</b> to open</div>
        <div class="z-pill"><b>Esc</b> back</div>
      </div>
      <div class="z-tip">Tip: Press <b>Enter</b> to preview, then again to open chat.</div>
    `;
    root.appendChild(hud);
  };

  // ---- Terminal (left) + Chat placeholder (right) --------------------------
  const typeLines = async (el, lines) => {
    el.innerHTML = '';
    for (const line of lines) {
      const p = document.createElement('div');
      p.className = 'z-term-line';
      el.appendChild(p);
      await new Promise((r) => {
        let i = 0;
        const tick = () => {
          p.textContent = line.slice(0, i++) + (i % 2 ? '▌' : ' ');
          if (i <= line.length) requestAnimationFrame(tick);
          else r();
        };
        tick();
      });
    }
  };

  const renderSelector = (animateIn = false) => {
    clearRoot();
    setStage('selector');
    const wrap = mountWrap();
    wrap.classList.add('z-selector');

    // grid: left terminal, right chat placeholder
    wrap.innerHTML = `
      <div class="z-col z-term">
        <div class="z-term-head">
          <span class="z-dot z-live"></span>
          <span class="z-term-title"></span>
        </div>
        <div class="z-term-body" aria-live="polite"></div>
        <div class="z-term-actions">
          <button class="z-btn z-btn-ghost" data-act="prev">Prev</button>
          <button class="z-btn z-btn-ghost" data-act="next">Next</button>
          <button class="z-btn" data-act="open">Open (Enter)</button>
        </div>
      </div>
      <div class="z-col z-chat-preview">
        <div class="z-chat-blur">
          <div class="z-chat-hint">
            <div class="z-h">Select a bot to open the chat</div>
            <div class="z-s">Press <b>Enter</b> when ready</div>
          </div>
        </div>
      </div>
    `;

    renderHud();

    if (animateIn) {
      // quick camera drift effect
      wrap.classList.add('z-enter');
      setTimeout(() => wrap.classList.remove('z-enter'), 700);
    }

    const title = qs('.z-term-title', wrap);
    const body = qs('.z-term-body', wrap);

    const show = async () => {
      const bot = BOTS[index];
      title.textContent = `› ${bot.name}`;
      await typeLines(body, bot.lines);
    };

    // controls
    const nav = (dir) => {
      if (stage !== 'selector') return;
      index = (index + dir + BOTS.length) % BOTS.length;
      body.innerHTML = '';
      show();
    };
    qs('[data-act="prev"]', wrap).onclick = () => nav(-1);
    qs('[data-act="next"]', wrap).onclick = () => nav(1);
    qs('[data-act="open"]', wrap).onclick = () => openCurrent();

    // keyboard
    window.onkeydown = (e) => {
      if (stage === 'selector') {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') nav(-1);
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') nav(1);
        if (e.key === 'Enter') openCurrent();
        if (e.key === 'Escape') { clearRoot(); renderIntro(); }
      } else if (stage === 'chat') {
        if (e.key === 'Escape') { closeChat(); }
      }
    };

    show();
  };

  // ---- Open / Close chat ----------------------------------------------------
  const openCurrent = () => {
    if (stage !== 'selector') return;
    setStage('chat');

    // remove blur & build chat shell
    const preview = qs('.z-chat-preview');
    preview.innerHTML = `
      <div class="z-chatbox is-open">
        <button class="z-close" aria-label="Close">×</button>
        <div class="z-chat-stream">
          <div class="z-chip">Opening demo: ${BOTS[index].name}</div>
        </div>
        <div class="z-chat-input">
          <button class="z-mic" title="Press to speak" aria-label="Microphone">🎤</button>
          <input class="z-inp" placeholder="Type a message or press the mic…" />
          <button class="z-send" aria-label="Send">›</button>
        </div>
        <div class="z-stt" aria-live="polite"></div>
      </div>
    `;

    // wire close
    qs('.z-close', preview).onclick = closeChat;

    // wire send
    const stream = qs('.z-chat-stream', preview);
    const inp = qs('.z-inp', preview);
    const send = () => {
      const msg = inp.value.trim();
      if (!msg) return;
      addBubble(stream, 'user', msg);
      inp.value = '';
      // “futuristic” response — keep snappy & capable
      fakeAI(stream, msg);
    };
    qs('.z-send', preview).onclick = send;
    inp.onkeydown = (e) => (e.key === 'Enter') && send();

    // wire mic → STT overlay
    sttOverlay = qs('.z-stt', preview);
    const micBtn = qs('.z-mic', preview);
    micBtn.onmousedown = () => startSTT();
    micBtn.onmouseup = () => stopSTT();

    // hook into voice.js if available
    if (window.ZYPHER_VOICE && typeof window.ZYPHER_VOICE.attach === 'function') {
      window.ZYPHER_VOICE.attach({
        onStart: () => startSTT(),
        onFinal: (text) => {
          stopSTT();
          typeToInput(inp, text);
        }
      });
    }
  };

  const closeChat = () => {
    if (stage !== 'chat') return;
    renderSelector(false);
  };

  // ---- Chat helpers ---------------------------------------------------------
  const addBubble = (stream, who, text) => {
    const row = document.createElement('div');
    row.className = `z-row ${who}`;
    row.innerHTML = `<div class="z-bubble">${escapeHTML(text)}</div>`;
    stream.appendChild(row);
    stream.scrollTop = stream.scrollHeight;
  };

  const escapeHTML = (s) =>
    s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const fakeAI = (stream, msg) => {
    // Lightweight, confident “futuristic” tone
    const responses = [
      "Online. Parsing intent…",
      "Context stitched. Next best action →",
      "Secure handoff available. Confirm to continue.",
    ];
    let i = 0;
    const step = () => {
      if (i < responses.length) {
        setTimeout(() => {
          addBubble(stream, 'ai', responses[i++]);
          step();
        }, 450);
      } else {
        addBubble(stream, 'ai', `For "${msg}", I can demo booking, qualification, or support. Say “run flow” to see it in action.`);
      }
    };
    step();
  };

  // ---- STT typewriter (green) ----------------------------------------------
  let sttTick;
  const startSTT = () => {
    if (!sttOverlay) return;
    sttOverlay.classList.add('on');
    sttOverlay.textContent = '';
    const fake = 'listening…';
    let i = 0;
    const run = () => {
      sttOverlay.textContent = fake.slice(0, i++) + (i % 2 ? ' ▌' : '');
      sttTick = requestAnimationFrame(run);
      if (i > fake.length + 10) i = 0;
    };
    run();
  };

  const stopSTT = () => {
    if (!sttOverlay) return;
    cancelAnimationFrame(sttTick);
    sttOverlay.classList.remove('on');
    sttOverlay.textContent = '';
  };

  const typeToInput = (inp, text) => {
    inp.value = '';
    let i = 0;
    const run = () => {
      inp.value = text.slice(0, i++);
      if (i <= text.length) requestAnimationFrame(run);
    };
    run();
  };

  // ---- Boot -----------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', renderIntro);
})();
