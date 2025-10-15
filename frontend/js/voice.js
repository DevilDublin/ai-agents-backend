const Voice = (() => {
  let recogniser, micBtn, inputEl, ghostEl, silenceTimer, onFinish;

  function ensureGhost() {
    if(!ghostEl) ghostEl = document.getElementById('ghost');
  }

  function start() {
    if(!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    recogniser = new R();
    recogniser.lang = 'en-GB';
    recogniser.interimResults = true;
    recogniser.continuous = true;
    recogniser.onresult = e => {
      let interim = '', final = '';
      for(let i=e.resultIndex; i<e.results.length; i++){
        const t = e.results[i][0].transcript;
        if(e.results[i].isFinal) final += t; else interim += t;
      }
      ensureGhost();
      ghostEl.textContent = interim;
      inputEl.value = final || inputEl.value;
      restartSilence(interim || final);
    };
    recogniser.onend = () => { micBtn.setAttribute('aria-pressed','false'); };
    recogniser.start();
  }

  function restartSilence(text) {
    clearTimeout(silenceTimer);
    if(!text.trim()) return;
    silenceTimer = setTimeout(() => {
      stop();
      const combined = (inputEl.value + ' ' + ghostEl.textContent).trim();
      ghostEl.textContent = '';
      if(onFinish) onFinish(combined, true);
    }, 3500);
  }

  function stop() {
    try { recogniser && recogniser.stop(); } catch(e){}
    clearTimeout(silenceTimer);
    micBtn && micBtn.setAttribute('aria-pressed','false');
  }

  function bind(btn, input, done) {
    micBtn = btn; inputEl = input; onFinish = done; ensureGhost();
    ghostEl.textContent = '';
    micBtn.onclick = () => {
      const isOn = micBtn.getAttribute('aria-pressed') === 'true';
      if(isOn) { stop(); }
      else { micBtn.setAttribute('aria-pressed','true'); start(); }
    };
  }
  function unbind(){ stop(); micBtn && (micBtn.onclick = null); }

  return { bind, unbind };
})();
