/* Demos page — floating hero -> selector -> chat
   - Fixed hero shape shows on page load (guaranteed)
   - After click/Enter, hero fades out, selector appears
   - Enter opens chat on the right (no blur ghost)
   - Esc backs cleanly; X closes chat; post-click UI unchanged
*/
import { ZYPHER_CONFIG } from './config.js';
import { initVoice, onInterimTranscript, onFinalTranscript } from './voice.js';

const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

const state = {
  stage: 'idle',    // 'idle' | 'hero' | 'selector' | 'chat'
  bots:  ZYPHER_CONFIG.demos || [],
  idx:   0,
  chatOpen: false,
  heroEl: null,
  stageEl: null,
  sttPreview: null
};

/* ---------- bootstrap (guaranteed) ---------- */
function safeMount() {
  // Only on the demos page; ignore if there's already a hero or stage
  if (state.stage !== 'idle' && (qs('.demo-hero') || qs('.demo-stage'))) return;
  mountHero();
}
document.addEventListener('DOMContentLoaded', safeMount);
// Fallback in case DOMContentLoaded was too early or blocked by other scripts
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(safeMount, 0);
}
window.addEventListener('pageshow', safeMount);

/* ---------- HERO ---------- */
function mountHero() {
  // clean any leftovers
  qsa('.demo-hero, .demo-stage, #zy-controls').forEach(n => n.remove());

  const hero = document.createElement('div');
  hero.className = 'demo-hero';
  hero.innerHTML = `
    <div class="zy-shape" id="zy-shape" role="button" tabindex="0" aria-label="Open demos">
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

/* ---------- SELECTOR ---------- */
function goSelector() {
  if (state.stage !== 'hero') return;
  state.stage = 'selector';

  // fade out hero
  state.heroEl.classList.add('is-exiting');
  setTimeout(() => state.heroEl?.remove(), 280);

  // Build selector UI
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
          <div class="dim">Use <b>←</b>/<b>→</b> or <b>A</b>/<b>D</b> · Press <b>Enter</b> to preview</div>
        </div>
      </div>
    </div>
  `;

  // Insert above the footer so it never hides behind it
  const footer = qs('footer') || null;
  if (footer) document.body.insertBefore(stage, footer);
  else document.body.appendChild(stage);

  mountControls();
  wireSelectorButtons(stage);

  state.stageEl = stage;
}

function renderBotCrt(i) {
  const b = state.bots[i] || state.bots[0];
  if (!b) return '<div class="crt-body mono green">No demos configured.</div>';

  const lines = [
    `Loading module…`,
    `Agent: ${b.name} — ${b.subtitle}`,
    ...b.bullets,
    `Hint → say: "${b.hint}"`
  ].map(s => `<div>${escapeHtml(s)}</div>`).join('');

  return `
    <div class="crt-head">
      <span class="dot"></span>
      <span class="title">› ${escapeHtml(b.name)}</span>
    </div>
    <div class="crt-body mono green" id="crtBody">${lines}</div>
  `;
}

function wireSelectorButtons(stage) {
  qs('#prevBtn', stage).addEventListener('click', () => cycle(-1));
  qs('#nextBtn', stage).addEventListener('click', () => cycle(+1));
  qs('#openBtn', stage).addEventListener('click', openChat);
}

function cycle(delta) {
  state.idx = (state.idx + delta + state.bots.length) % state.bots.length;
  const card = qs('#botCard', state.stageEl);
  card.innerHTML = renderBotCrt(state.idx) +
    `<div class="row gap-8" style="padding:10px 12px 14px;">
      <button class="chip" id="prevBtn">Prev</button>
      <button class="chip" id="nextBtn">Next</button>
      <button class="chip accent" id="openBtn">Open (Enter)</button>
    </div>`;
  wireSelectorButtons(state.stageEl);
}

/* ---------- CHAT ---------- */
function openChat() {
  if (state.chatOpen) return;
  const bot = state.bots[state.idx]; if (!bot) return;

  const mount = qs('#chatMount', state.stageEl);
  mount.classList.remove('dashed');
  mount.innerHTML = chatHtml(bot);

  // STT typewriter overlay
  const preview = document.createElement('div');
  preview.className = 'stt-preview';
  qs('.chatbox', mount).appendChild(preview);
  state.sttPreview = preview;

  // Close button
  qs('[data-close-chat]', mount).addEventListener('click', () => closeChat());

  // Voice glue (keeps your engine)
  initVoice({
    input:  qs('.msg', mount),
    micBtn: qs('[data-mic]', mount),
    sendBtn:qs('[data-send]', mount),
    onInterim: (t) => onInterimTranscript(t, showStt),
    onFinal:  (t) => onFinalTranscript(t, clearStt),
  });

  state.chatOpen = true;
  updateControls(true);
}

function closeChat() {
  if (!state.chatOpen) return;
  const mount = qs('#chatMount', state.stageEl);
  mount.classList.add('dashed');
  mount.innerHTML = `
    <div class="placeholder">
      <div class="h3">Select a bot to open the chat</div>
      <div class="dim">Use <b>←</b>/<b>→</b> or <b>A</b>/<b>D</b> · Press <b>Enter</b> to preview</div>
    </div>`;
  state.chatOpen = false;
  state.sttPreview = null;
  updateControls(false);
}

function chatHtml(bot) {
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

/* ---------- Controls bar + keys ---------- */
function mountControls() {
  const c = document.createElement('div');
  c.id = 'zy-controls';
  c.className = 'zy-controls';
  c.innerHTML = `
    <span class="dot"></span> Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch
    <span>·</span> <b>Enter</b> to preview
    <span>·</span> <b>Esc</b> back
  `;
  document.body.appendChild(c);
}
function updateControls(chatOpen) {
  const c = qs('#zy-controls'); if (!c) return;
  c.innerHTML = chatOpen
    ? `<span class="dot"></span> <b>Chat open.</b> Press <kbd>Esc</kbd> to go back.`
    : `<span class="dot"></span> Use <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch
       <span>·</span> <b>Enter</b> to preview
       <span>·</span> <b>Esc</b> back`;
}

window.addEventListener('keydown', (e) => {
  if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;

  if (state.stage === 'hero' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault(); goSelector();
  } else if (state.stage === 'selector') {
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); cycle(+1); }
    if (e.key === 'ArrowLeft'  || e.key.toLowerCase() === 'a') { e.preventDefault(); cycle(-1); }
    if (e.key === 'Enter') { e.preventDefault(); openChat(); }
    if (e.key === 'Escape') {
      e.preventDefault();
      qs('#zy-controls')?.remove();
      state.stageEl?.remove();
      mountHero();
    }
  } else if (state.stage === 'chat') {
    if (e.key === 'Escape') { e.preventDefault(); closeChat(); }
  }
});

/* ---------- STT preview ---------- */
function showStt(txt)   { if (state.sttPreview) state.sttPreview.textContent = txt; }
function clearStt()     { if (state.sttPreview) state.sttPreview.textContent = ''; }

/* ---------- utils ---------- */
function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
