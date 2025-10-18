/* Demos page — floating hero -> selector -> chat
   - Hero is a fixed element; never pushes footer
   - After click/Enter, nice exit then selector appears
   - Instructions bar with kbd keys
   - Chat opens cleanly; no blurred placeholder remains
*/
import { ZYPHER_CONFIG } from './config.js';
import { initVoice, onInterimTranscript, onFinalTranscript } from './voice.js';

const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

const state = {
  stage: 'hero', // 'hero' | 'selector' | 'chat'
  bots: ZYPHER_CONFIG.demos, // [{id,name,script,prefill,...}]
  idx: 0,
  chatOpen: false,
  heroEl: null,
  stageEl: null,
  chatEl: null,
  sttPreview: null
};

document.addEventListener('DOMContentLoaded', () => {
  mountHero();
  wireKeys();
});

function mountHero() {
  // Remove any old stage/chat
  qsa('.demo-stage, .demo-hero').forEach(n => n.remove());

  // HERO
  const hero = document.createElement('div');
  hero.className = 'demo-hero';
  hero.innerHTML = `
    <div class="zy-shape" id="zy-shape" aria-label="Open demos" role="button" tabindex="0">
      <div class="shape-label">Click me!</div>
    </div>
  `;
  document.body.appendChild(hero);

  hero.addEventListener('click', goSelector);
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') goSelector();
  });

  state.stage  = 'hero';
  state.heroEl = hero;
}

function goSelector() {
  if (state.stage !== 'hero') return;
  state.stage = 'selector';
  // fade hero
  state.heroEl.classList.add('is-exiting');
  setTimeout(() => state.heroEl.remove(), 280);

  // mount selector stage
  const stage = document.createElement('section');
  stage.className = 'demo-stage show';
  stage.innerHTML = `
    <div class="demo-left">
      <div class="crt-card" id="botCard">
        ${renderBotCrt(state.idx)}
        <div class="row gap-8" style="padding:10px 12px 14px;">
          <button class="chip" id="prevBtn">Prev</button>
          <button class="chip" id="nextBtn">Next</button>
          <button class="chip accent" id="openBtn">Open (Enter)</button>
        </div>
      </div>
    </div>
    <div class="demo-right">
      <div id="chatMount" class="chat-mount dashed" aria-live="polite">
        <div class="placeholder">
          <div class="h3">Select a bot to open the chat</div>
          <div class="dim">Press <b>Enter</b> to preview first</div>
        </div>
      </div>
    </div>
  `;
  // place before footer so z-index stack is sane, but still part of page
  const footer = qs('footer') || document.body.lastElementChild;
  document.body.insertBefore(stage, footer);

  // controls bar
  mountControls();

  // wire buttons
  qs('#prevBtn', stage).addEventListener('click', () => selectDelta(-1));
  qs('#nextBtn', stage).addEventListener('click', () => selectDelta(+1));
  qs('#openBtn', stage).addEventListener('click', () => openChat());

  state.stageEl = stage;
}

function renderBotCrt(i) {
  const b = state.bots[i];
  const lines = [
    `Loading module…`,
    `Agent: ${b.name} — ${b.subtitle}`,
    ...b.bullets.map(x => x),
    `Hint → say: "${b.hint}"`
  ];
  const list = lines.map(s => `<div>${escapeHtml(s)}</div>`).join('');
  return `
    <div class="crt-head">
      <span class="dot"></span>
      <span class="title">› ${escapeHtml(b.name)}</span>
    </div>
    <div class="crt-body mono green" id="crtBody">${list}</div>
  `;
}
function selectDelta(d) {
  state.idx = (state.idx + d + state.bots.length) % state.bots.length;
  qs('#botCard').innerHTML = renderBotCrt(state.idx) +
    `<div class="row gap-8" style="padding:10px 12px 14px;">
      <button class="chip" id="prevBtn">Prev</button>
      <button class="chip" id="nextBtn">Next</button>
      <button class="chip accent" id="openBtn">Open (Enter)</button>
    </div>`;
  qs('#prevBtn').addEventListener('click', () => selectDelta(-1));
  qs('#nextBtn').addEventListener('click', () => selectDelta(+1));
  qs('#openBtn').addEventListener('click', () => openChat());
}

function openChat() {
  if (state.chatOpen) return;
  const mount = qs('#chatMount', state.stageEl);
  mount.classList.remove('dashed');
  mount.innerHTML = buildChatHtml(state.bots[state.idx]);
  // create STT typewriter overlay node
  state.sttPreview = document.createElement('div');
  state.sttPreview.className = 'stt-preview';
  qs('.chatbox', mount).appendChild(state.sttPreview);

  // X button closes chat back to selector (no hero)
  qs('[data-close-chat]', mount).addEventListener('click', () => closeChat());

  // Init voice hooks (keeps your existing engine)
  initVoice({
    input: qs('input[type="text"].msg', mount),
    micBtn: qs('[data-mic]', mount),
    sendBtn: qs('[data-send]', mount),
    onInterim: (t) => onInterimTranscript(t, showStt),
    onFinal:  (t) => onFinalTranscript(t, clearStt),
  });

  state.chatOpen = true;
  updateControls(true);
}

function closeChat() {
  if (!state.chatOpen) return;
  const mount = qs('#chatMount', state.stageEl);
  mount.innerHTML = `
    <div class="placeholder">
      <div class="h3">Select a bot to open the chat</div>
      <div class="dim">Press <b>Enter</b> to preview first</div>
    </div>`;
  state.chatOpen = false;
  state.sttPreview = null;
  updateControls(false);
}

function buildChatHtml(bot) {
  return `
    <div class="chatbox glass glow">
      <button class="x" data-close-chat title="Close">×</button>
      <div class="log">
        <div class="pill">Opening demo: ${escapeHtml(bot.name)}</div>
      </div>
      <div class="input-row">
        <button class="mic" data-mic title="Push to talk"></button>
        <input class="msg" type="text" placeholder="type a message or press the mic…" autocomplete="off" />
        <button class="send" data-send title="Send"></button>
      </div>
    </div>`;
}

function mountControls() {
  const controls = document.createElement('div');
  controls.className = 'zy-controls';
  controls.id = 'zy-controls';
  controls.innerHTML = `
    <span class="dot"></span> Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch
    <span>·</span> <b>Enter</b> to preview
    <span>·</span> <b>Esc</b> back
  `;
  document.body.appendChild(controls);
}
function updateControls(chatOpen) {
  const c = qs('#zy-controls');
  if (!c) return;
  c.innerHTML = chatOpen
    ? `<span class="dot"></span> <b>Chat open.</b> Press <kbd>Esc</kbd> to go back.`
    : `<span class="dot"></span> Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch
       <span>·</span> <b>Enter</b> to preview
       <span>·</span> <b>Esc</b> back`;
}

/* ====== Keys ====== */
function wireKeys() {
  window.addEventListener('keydown', (e) => {
    // don't hijack when typing in inputs
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (state.stage === 'hero' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); goSelector(); return;
    }
    if (state.stage === 'selector') {
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); selectDelta(+1); }
      if (e.key === 'ArrowLeft'  || e.key.toLowerCase() === 'a') { e.preventDefault(); selectDelta(-1); }
      if (e.key === 'Enter') { e.preventDefault(); openChat(); }
      if (e.key === 'Escape') { e.preventDefault(); // go back to hero
        qs('#zy-controls')?.remove();
        state.stageEl?.remove();
        mountHero();
      }
    } else if (state.stage === 'chat') {
      if (e.key === 'Escape') { e.preventDefault(); closeChat(); state.stage = 'selector'; }
    }
  });
}

/* ===== STT typewriter helpers ===== */
function showStt(text) {
  if (!state.sttPreview) return;
  state.sttPreview.textContent = text;
}
function clearStt() {
  if (!state.sttPreview) return;
  state.sttPreview.textContent = '';
}

/* ===== Utils ===== */
function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
