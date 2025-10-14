/* ---------- Speech to text (live ghost + clean mic UX) ---------- */

(() => {
  const mic = document.getElementById('mic');
  const input = document.getElementById('chat-input');
  const send = document.getElementById('chat-send');

  if (!mic || !input) return; // not on demos overlay yet

  const ghost = document.getElementById('ghost') || (() => {
    const g = document.createElement('div');
    g.id = 'ghost';
    g.className = 'ghost';
    document.querySelector('.input-box, .input-wrap')?.appendChild(g);
    return g;
  })();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    mic.style.display = 'none';
    return;
  }

  const rec = new SpeechRecognition();
  rec.lang = 'en-GB';
  rec.interimResults = true;
  rec.continuous = true;

  let finalText = '';

  const start = () => {
    finalText = input.value || '';
    ghost.textContent = '';
    rec.start();
    mic.setAttribute('aria-pressed', 'true');
  };

  const stop = () => {
    try { rec.stop(); } catch (_) {}
    mic.setAttribute('aria-pressed', 'false');
    ghost.textContent = '';
  };

  mic.addEventListener('click', () => {
    const on = mic.getAttribute('aria-pressed') === 'true';
    if (on) stop(); else start();
  });

  // Stop recording when you click Send (as requested)
  send?.addEventListener('click', stop);

  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const chunk = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += (finalText ? ' ' : '') + chunk.trim();
      else interim += chunk;
    }
    // Show the soft wavy/ghost text **above** the input, and mirror into the box
    ghost.textContent = finalText + (interim ? (finalText ? ' ' : '') + interim : '');
    input.value = ghost.textContent;
    // keep caret at end
    input.selectionStart = input.selectionEnd = input.value.length;
  };

  rec.onerror = () => stop();
  rec.onend = () => {
    // keep aria state tidy when the engine ends itself
    mic.setAttribute('aria-pressed', 'false');
    ghost.textContent = '';
  };
})();
