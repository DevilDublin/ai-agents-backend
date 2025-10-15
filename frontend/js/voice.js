(function () {
  const input = document.getElementById('dlg-input');
  const ghost = document.getElementById('dlg-ghost');
  const mic = document.getElementById('dlg-mic');
  const sendBtn = document.getElementById('dlg-send');
  if (!input || !mic || !sendBtn) return;

  let rec, listening = false, silenceTimer, lastPartial = '';

  const canVoice = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (!canVoice) mic.style.display = 'none';

  function setGhost(text) {
    ghost.textContent = text || '';
    ghost.style.display = text ? 'block' : 'none';
  }

  function start() {
    if (listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = true;

    rec.onstart = () => {
      listening = true;
      mic.setAttribute('aria-pressed', 'true');
      setGhost('Listening… speak naturally');
      clearTimeout(silenceTimer);
    };

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          input.value = input.value ? input.value + ' ' + r[0].transcript.trim() : r[0].transcript.trim();
          setGhost('');
          lastPartial = '';
          scheduleAutoSend();
        } else {
          interim += r[0].transcript;
        }
      }
      if (interim && interim !== lastPartial) {
        lastPartial = interim;
        setGhost(interim.trim());
        scheduleAutoSend();
      }
    };

    rec.onerror = stop;
    rec.onend = stop;
    rec.start();
  }

  function stop() {
    if (!listening) return;
    listening = false;
    try { rec.stop(); } catch {}
    mic.setAttribute('aria-pressed', 'false');
    setGhost('');
    clearTimeout(silenceTimer);
  }

  function scheduleAutoSend() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (ghost.textContent) {
        input.value = input.value ? (input.value + ' ' + ghost.textContent) : ghost.textContent;
        setGhost('');
      }
      if (input.value.trim()) {
        sendBtn.click();
      }
      stop();
    }, 3200);
  }

  mic.addEventListener('click', () => (listening ? stop() : start()));
})();
