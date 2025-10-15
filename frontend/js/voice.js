function initVoice(micSel, inputSel, ghostSel, onAutoSend){
  const mic = document.querySelector(micSel);
  const input = document.querySelector(inputSel);
  const ghost = document.querySelector(ghostSel);
  let rec, active=false, silenceTimer=null, buffer='';

  function ensure(){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return null;
    const r = new SR();
    r.lang = 'en-GB';
    r.interimResults = true;
    r.continuous = true;
    return r;
  }

  function start(){
    rec = ensure();
    if(!rec) return;
    active=true;
    mic.setAttribute('aria-pressed','true');
    ghost.style.display='block';
    mic.classList.add('listening');
    rec.onresult = e=>{
      let interim='', final='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const str = e.results[i][0].transcript;
        if(e.results[i].isFinal) final += str;
        else interim += str;
      }
      if(interim) ghost.textContent = interim;
      if(final){
        buffer += (buffer ? ' ' : '') + final.trim();
        input.value = buffer;
        ghost.textContent = '';
      }
      resetSilence();
    };
    rec.onend = ()=>{ if(active) rec.start(); };
    rec.onerror = ()=> stop();
    rec.start();
    resetSilence();
  }
  function stop(){
    active=false;
    if(rec){ try{rec.onend=null;rec.stop();}catch{} }
    mic.setAttribute('aria-pressed','false');
    mic.classList.remove('listening');
    ghost.style.display='none';
    clearTimeout(silenceTimer);
    ghost.textContent='';
  }
  function resetSilence(){
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(()=>{
      stop();
      if(input.value.trim()){ onAutoSend && onAutoSend(); }
      buffer='';
    }, 3500);
  }

  mic.addEventListener('click', ()=>{
    if(active) stop(); else { buffer=''; start(); }
  });
}
