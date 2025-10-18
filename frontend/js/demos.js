/* Zypher Demos — Floating hero → selector → chat */
import { ZYPHER_CONFIG } from './config.js';
import { initVoice, onInterimTranscript, onFinalTranscript } from './voice.js';

const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

const state = {
  stage: 'idle', // idle | hero | selector
  idx:   0,
  bots:  ZYPHER_CONFIG.demos || [],
  chatOpen: false,
  heroEl: null,
  stageEl: null,
  sttPreview: null
};

/* ========== Mount flow (robust) ========== */
function safeMount() {
  if (qs('.demo-hero') || qs('.demo-stage')) return; // already mounted
  mountHero();
}
document.addEventListener('DOMContentLoaded', safeMount);
if (document.readyState !== 'loading') setTimeout(safeMount, 0);
window.addEventListener('pageshow', safeMount);

/* ========== HERO ========== */
function mountHero(){
  cleanup();

  const hero = document.createElement('div');
  hero.className = 'demo-hero';
  hero.innerHTML = `
    <div class="zy-shape" id="zy-shape" tabindex="0" role="button" aria-label="Open demos">
      <div class="shape-label">Click me!</div>
    </div>
  `;
  document.body.appendChild(hero);

  const open = () => goSelector();
  hero.addEventListener('click', open);
  hero.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') open(); });

  state.stage  = 'hero';
  state.heroEl = hero;
}

function goSelector(){
  if (state.stage!=='hero') return;
  state.stage='selector';

  state.heroEl?.classList.add('is-exiting');
  setTimeout(()=> state.heroEl?.remove(), 280);

  const stage = document.createElement('section');
  stage.className = 'demo-stage';
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
      <div id="chatMount" class="chat-mount dashed">
        <div class="placeholder">
          <div class="h3">Select a bot to open the chat</div>
          <div class="dim">Use <b>←</b>/<b>→</b> or <b>A</b>/<b>D</b> · Press <b>Enter</b> to preview</div>
        </div>
      </div>
    </div>
  `;
  const footer = qs('footer');
  if (footer) document.body.insertBefore(stage, footer); else document.body.appendChild(stage);
  state.stageEl = stage;

  mountControls();
  wireSelectorButtons(stage);

  // keyboard
  window.addEventListener('keydown', selectorKeys);
}

function cleanup(){
  qsa('.demo-hero, .demo-stage, #zy-controls').forEach(n=>n.remove());
  window.removeEventListener('keydown', selectorKeys);
  state.chatOpen=false;
  state.stage='idle';
}

/* ========== SELECTOR ========== */
function renderBotCrt(i){
  const b = state.bots[i] || state.bots[0];
  if (!b) return `<div class="crt-body mono green">No demos configured.</div>`;

  const lines = [
    `Loading module…`,
    `Agent: ${b.name} — ${b.subtitle}`,
    ...b.bullets,
    `Hint → say: "${b.hint}"`
  ].map(s=>`<div>${escapeHtml(s)}</div>`).join('');

  return `
    <div class="crt-head">
      <span class="dot"></span>
      <span class="title">› ${escapeHtml(b.name)}</span>
    </div>
    <div class="crt-body mono green">${lines}</div>
  `;
}

function wireSelectorButtons(stage){
  qs('#prevBtn',stage).addEventListener('click', ()=>cycle(-1));
  qs('#nextBtn',stage).addEventListener('click', ()=>cycle(+1));
  qs('#openBtn',stage).addEventListener('click', openChat);
}
function cycle(delta){
  state.idx = (state.idx + delta + state.bots.length) % state.bots.length;
  const c = qs('#botCard', state.stageEl);
  c.innerHTML = renderBotCrt(state.idx) + `
    <div class="row gap-8" style="padding:10px 12px 14px;">
      <button class="chip" id="prevBtn">Prev</button>
      <button class="chip" id="nextBtn">Next</button>
      <button class="chip accent" id="openBtn">Open (Enter)</button>
    </div>`;
  wireSelectorButtons(state.stageEl);
}

/* ========== CHAT ========== */
function openChat(){
  if (state.chatOpen) return;
  const bot = state.bots[state.idx]; if (!bot) return;

  const mount = qs('#chatMount', state.stageEl);
  mount.classList.remove('dashed');
  mount.innerHTML = chatHtml(bot);

  // Close button
  qs('[data-close-chat]', mount).addEventListener('click', closeChat);

  // Voice hooks (keeps your existing engines)
  const input  = qs('.msg', mount);
  const micBtn = qs('[data-mic]', mount);
  const sendBtn= qs('[data-send]', mount);

  initVoice({
    input, micBtn, sendBtn,
    onInterim: (t)=> onInterimTranscript(t, (txt)=> showStt(txt, mount)),
    onFinal:  (t)=> onFinalTranscript(t, ()=> clearStt(mount)),
  });

  state.chatOpen = true;
  updateControls(true);
}

function closeChat(){
  if (!state.chatOpen) return;
  const mount = qs('#chatMount', state.stageEl);
  mount.classList.add('dashed');
  mount.innerHTML = `
    <div class="placeholder">
      <div class="h3">Select a bot to open the chat</div>
      <div class="dim">Use <b>←</b>/<b>→</b> or <b>A</b>/<b>D</b> · Press <b>Enter</b> to preview</div>
    </div>`;
  state.chatOpen = false;
  updateControls(false);
}

/* STT green typewriter overlay (inside the chat box) */
function showStt(text, mount){
  let p = qs('.stt-preview', mount);
  if (!p){
    p = document.createElement('div');
    p.className = 'stt-preview';
    qs('.chatbox', mount).appendChild(p);
  }
  p.textContent = text;
}
function clearStt(mount){
  const p = qs('.stt-preview', mount);
  if (p) p.textContent = '';
}

function chatHtml(bot){
  return `
    <div class="chatbox glass glow">
      <button class="x" data-close-chat title="Close">×</button>
      <div class="log">
        <div class="pill">Opening demo: ${escapeHtml(bot.name)}</div>
      </div>
      <div class="input-row">
        <button class="mic" data-mic title="Push to talk"></button>
        <input class="msg" type="text" placeholder="type a message or press the mic…" autocomplete="off"/>
        <button class="send" data-send title="Send"></button>
      </div>
    </div>`;
}

/* ========== Controls bar + keys ========== */
function mountControls(){
  const c = document.createElement('div');
  c.id = 'zy-controls';
  c.className = 'zy-controls';
  c.innerHTML = `
    <span class="dot"></span> Use <kbd>←</kbd><kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch ·
    <b>Enter</b> to preview · <b>Esc</b> back
  `;
  document.body.appendChild(c);
}
function updateControls(chatOpen){
  const c = qs('#zy-controls'); if (!c) return;
  c.innerHTML = chatOpen
    ? `<span class="dot"></span> <b>Chat open.</b> Press <kbd>Esc</kbd> to go back.`
    : `<span class="dot"></span> Use <kbd>←</kbd><kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd> to switch ·
       <b>Enter</b> to preview · <b>Esc</b> back`;
}

function selectorKeys(e){
  if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (state.stage !== 'selector') return;

  const k = e.key;
  if (k === 'ArrowRight' || k.toLowerCase() === 'd') { e.preventDefault(); cycle(+1); }
  if (k === 'ArrowLeft'  || k.toLowerCase() === 'a') { e.preventDefault(); cycle(-1); }
  if (k === 'Enter') { e.preventDefault(); openChat(); }
  if (k === 'Escape') { e.preventDefault(); qs('#zy-controls')?.remove(); state.stageEl?.remove(); mountHero(); }
}

/* utils */
function escapeHtml(s){ return s.replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
