(function(){
  let rec, ghost, input, sendBtn, micBtn, lastSpeechAt = 0, silenceTimer;

  function bind(){
    input   = document.getElementById('dlg-input');
    ghost   = document.getElementById('dlg-ghost');
    sendBtn = document.getElementById('dlg-send');
    micBtn  = document.getElementById('mic');
    if(!input || !micBtn) return;

    micBtn.addEventListener('click', toggleRec);
    sendBtn.addEventListener('click', sendText);
    input.addEventListener('keydown', e=>{
      if(e.key==='Enter'){ e.preventDefault(); sendText(); }
    });
  }

  function ensureRec(){
    if(rec) return rec;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return null;
    rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-GB';
    rec.onresult = e=>{
      let final='', interim='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const r = e.results[i];
        (r.isFinal?final:interim) += r[0].transcript;
      }
      if(interim.trim()) ghost.textContent = interim.trim();
      if(final.trim()){
        ghost.textContent = '';
        input.value = (input.value.trim()+' '+final.trim()).trim();
        lastSpeechAt = Date.now();
        resetSilenceWatch();
      }
    };
    rec.onstart = ()=>{ micBtn.setAttribute('aria-pressed','true'); ghost.style.display='block'; lastSpeechAt=Date.now(); resetSilenceWatch(); };
    rec.onend   = ()=>{ micBtn.setAttribute('aria-pressed','false'); stopSilenceWatch(); ghost.textContent=''; };
    return rec;
  }

  function toggleRec(){
    const r = ensureRec();
    if(!r) return;
    if(micBtn.getAttribute('aria-pressed')==='true'){ r.stop(); }
    else{ r.start(); }
  }

  function resetSilenceWatch(){
    stopSilenceWatch();
    silenceTimer = setInterval(()=>{
      if(Date.now() - lastSpeechAt > 3500){
        const r = ensureRec(); if(r) r.stop();
        clearInterval(silenceTimer);
        sendText();
      }
    },400);
  }
  function stopSilenceWatch(){ if(silenceTimer){ clearInterval(silenceTimer); silenceTimer=null; } }

  function sendText(){
    const v = input.value.trim();
    if(!v) return;
    const evt = new CustomEvent('chat:send',{detail:v});
    window.dispatchEvent(evt);
    input.value=''; ghost.textContent='';
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
