(function(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function wire({mic,input,ghost,onFinal,onInterim}){
    if(!SR){ mic.style.display="none"; return }
    const r = new SR();
    r.lang="en-GB";
    r.continuous=true;
    r.interimResults=true;

    let lastSpeech=0, silenceTimer=null, active=false, finalBuffer="";

    function start(){
      if(active) return;
      active=true;
      mic.setAttribute("aria-pressed","true");
      ghost.textContent="";
      finalBuffer="";
      lastSpeech=Date.now();
      r.start();
      tickSilence();
    }
    function stop(send){
      if(!active) return;
      active=false;
      mic.setAttribute("aria-pressed","false");
      r.stop();
      clearTimeout(silenceTimer);
      if(send){
        const txt=finalBuffer.trim();
        if(txt){ onFinal && onFinal(txt) }
      }
      finalBuffer="";
      ghost.textContent="";
    }
    function tickSilence(){
      clearTimeout(silenceTimer);
      silenceTimer=setTimeout(()=>{
        if(Date.now()-lastSpeech>3200) stop(true);
        else tickSilence();
      },800);
    }

    r.onresult = e=>{
      lastSpeech=Date.now();
      let interim="", final="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        const res=e.results[i];
        if(res.isFinal) final+=res[0].transcript;
        else interim+=res[0].transcript;
      }
      if(interim){ onInterim && onInterim(interim) }
      if(final){
        finalBuffer += " " + final;
        onInterim && onInterim("");
      }
      tickSilence();
    };
    r.onerror = ()=>stop(false);
    r.onend = ()=>{ if(active) r.start() };

    mic.addEventListener('click',()=> active ? stop(false) : start());
  }
  window.AA = window.AA || {};
  AA.voice = { wire };
})();
