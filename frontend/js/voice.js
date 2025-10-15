const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, silenceTimer = null;

function useMic(inputEl, onFinal) {
  if (!SR) return;
  if (rec && rec.started) { rec.stop(); return; }

  rec = new SR();
  rec.lang = 'en-GB';
  rec.interimResults = true;
  rec.continuous = true;
  rec.started = true;

  const startSilence = () => {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => { rec.stop(); }, 3500);
  };

  rec.onresult = e => {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    inputEl.value = final || interim;
    inputEl.style.backgroundImage = interim ? 'linear-gradient(90deg, rgba(174,144,255,.25), transparent)' : 'none';
    startSilence();
  };

  rec.onend = () => {
    rec.started = false;
    clearTimeout(silenceTimer);
    if (inputEl.value.trim()) onFinal(inputEl.value.trim());
    inputEl.style.backgroundImage = 'none';
  };

  rec.start();
}

window.Voice = { useMic };
