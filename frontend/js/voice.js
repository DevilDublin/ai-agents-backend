(function(){
  const mic = document.getElementById('mic');
  const input = document.getElementById('dlg-input');
  const send = document.getElementById('send');
  if(!mic || !input) return;

  let rec, live=false, silenceTimer;

  function stopAll(){
    if(rec){ try{rec.stop()}catch(e){} }
    mic.setAttribute('aria-pressed','false');
    mic.classList.remove('live');
    live=false;
  }

  function start(){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ alert('Speech recognition is unavailable in this browser.'); return; }
    rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = true;

    mic.setAttribute('aria-pressed','true');
    mic.classList.add('live');
    live=true;
    input.focus();

    const base = input.value;

    function restartSilence() {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(()=>{
        stopAll();
        if(input.value.trim()) send.click();
      }, 3800);
    }

    rec.onresult = e => {
      let finalText = '';
      let interim = '';
      for (let i=e.resultIndex;i<e.results.length;i++){
        const t = e.results[i][0].transcript;
        if(e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      input.value = (base + ' ' + finalText + ' ' + interim).trimStart();
      restartSilence();
    };

    rec.onend = ()=> stopAll();
    rec.onerror = ()=> stopAll();
    rec.start();
  }

  mic.addEventListener('click', ()=> live ? stopAll() : start());
})();
