/* ===== ZYPHER — voice + green capture typing =====
   Adds optional mic capture that "types" recorded text in the input
*/
(function(){
  const input = document.querySelector('#chat-input');
  const micBtn = document.querySelector('#chat-mic');
  if (!input || !micBtn) return;

  let rec=null, chunks=[];
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    // graceful: hide mic if not supported
    micBtn.style.display='none';
    return;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sr = new SpeechRec();
  sr.continuous = false; sr.interimResults = true; sr.lang = 'en-US';

  micBtn.addEventListener('click', ()=> sr.start());

  sr.onresult = (e)=>{
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++){
      const trans = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += trans;
      else interim += trans;
    }
    greenType(input, (final || interim).trim());
  };

  function greenType(target, text){
    target.value=''; let i=0;
    const id = setInterval(()=>{
      target.value = text.slice(0, ++i);
      target.style.caretColor = '#9cff9c';
      if(i>=text.length){ clearInterval(id); target.style.caretColor = '#fff'; }
    }, 14);
  }
})();
