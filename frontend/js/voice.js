/* Minimal voice hook: turn speech-to-text into the chat input with a typewriter */
(() => {
  // If you already have your Web Speech / SDK logic, just call window.typeIntoChat(transcript)
  // Below is a tiny demo using the Web Speech API (where available).
  const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if(!hasWebSpeech) return;

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SpeechRec();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.continuous = false;

  // optional: start recognition when input focused + Cmd/M pressed
  document.addEventListener('keydown', (e)=>{
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='m'){
      try{ rec.start(); }catch{}
    }
  });

  rec.onresult = (ev) => {
    const text = Array.from(ev.results).map(r=>r[0].transcript).join(' ');
    if(window.typeIntoChat){
      window.typeIntoChat(text);
    }else{
      // fallback: drop into any focused input
      const el = document.activeElement;
      if(el && 'value' in el) el.value = text;
    }
  };
})();
