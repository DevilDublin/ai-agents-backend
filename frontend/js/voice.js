/* Minimal voice glue so STT typewriter works.
   If you already had a fuller engine, this is compatible:
   - call initVoice({ input, micBtn, sendBtn, onInterim, onFinal })
*/
export function initVoice({ input, micBtn, sendBtn, onInterim, onFinal }){
  // Send button
  if (sendBtn) sendBtn.addEventListener('click', () => {
    const v = input.value.trim(); if (!v) return;
    onInterim?.(''); onFinal?.(v); input.value = '';
  });

  // Basic Web Speech API (if available)
  let rec;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SR(); rec.interimResults = true; rec.continuous = false; rec.lang = 'en-US';

    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (const r of e.results[0]) {
        if (e.results[0].isFinal) final += r.transcript;
        else interim += r.transcript;
      }
      if (interim) onInterim?.(interim);
      if (final)  onFinal?.(final);
    };
  }

  if (micBtn && rec) {
    micBtn.addEventListener('click', () => {
      try { onInterim?.(''); rec.start(); } catch(_e){}
    });
  }
}

export function onInterimTranscript(text, cb){ cb?.(text); }
export function onFinalTranscript(text, cb){ cb?.(); }
