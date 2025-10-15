(function(){
  const wire = window.__voiceWire;
  if(!wire) return;
  const { input, mic, onSend } = wire;
  const ghost = document.getElementById('dlg-ghost');

  let rec, silenceTimer, lastTranscript = '';
  const haveAPI = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;

  function start(){
    if(!haveAPI) return;
    if(rec) rec.stop();
    rec = new Rec();
    rec.lang = 'en-GB';
    rec.continuous = true;
    rec.interimResults = true;

    mic.setAttribute('aria-pressed','true');
    ghost.textContent = 'Listening…';
    ghost.style.display='block';

    rec.onresult = e=>{
      let finalText = '', interim = '';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const r = e.results[i];
        (r.isFinal? finalText : interim) += r[0].transcript;
      }
      if(finalText) lastTranscript += ' ' + finalText.trim();
      const preview = (lastTranscript + ' ' + interim).trim();
      input.value = preview;
      resetSilence();
    };
    rec.onend = ()=>{
      mic.setAttribute('aria-pressed','false');
      ghost.style.display='none';
      if(lastTranscript.trim()){
        onSend();
        lastTranscript='';
      }
    };
    rec.start();
    resetSilence();
  }
  function stop(){
    if(rec) rec.stop();
    mic.setAttribute('aria-pressed','false');
    ghost.style.display='none';
  }
  function resetSilence(){
    if(silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(()=>{ stop(); }, 3200);
  }

  mic.addEventListener('click',()=>{
    const on = mic.getAttribute('aria-pressed')==='true';
    if(on) stop(); else start();
  });
})();
