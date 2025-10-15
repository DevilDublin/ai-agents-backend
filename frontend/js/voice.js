// Speech-to-text for bot chat: inline animation + auto-send on 3.5s silence
(() => {
  const mic = document.querySelector('.mic-btn');
  const input = document.querySelector('#chat-input');
  const ghost = document.querySelector('.ghost-txt');
  const form = document.querySelector('#chat-form');
  if (!mic || !input || !form) return;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { mic.disabled = true; return; }

  let recog = null, silenceTimer = null, running = false, finalised = '';

  function start() {
    recog = new SR();
    recog.lang = 'en-GB';
    recog.continuous = true;
    recog.interimResults = true;
    running = true; mic.setAttribute('aria-pressed','true'); mic.focus();

    recog.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalised += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      const composite = (finalised + interim).trim();
      ghost.textContent = composite;
      input.value = composite;
      resetSilence();
    };
    recog.onend = () => stop(false);
    recog.start();
    resetSilence();
  }

  function resetSilence() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      stop(true);
    }, 3500);
  }

  function stop(autoSend) {
    if (!running) return;
    running = false;
    try { recog.stop(); } catch {}
    mic.setAttribute('aria-pressed','false');
    clearTimeout(silenceTimer);
    ghost.textContent = input.value;
    if (autoSend && input.value.trim()) {
      form.requestSubmit();
    }
  }

  mic.addEventListener('click', e => {
    e.preventDefault();
    if (running) stop(false); else { finalised=''; ghost.textContent=''; start(); }
  });
})();
