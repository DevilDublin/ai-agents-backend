const micBtn = document.getElementById('mic');
const msgInput = document.getElementById('msg');

let recognizing = false;
let rec;
try{
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SR){
    rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-GB';
    rec.onresult = (e)=>{
      let interim = '';
      let final = '';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const t = e.results[i][0].transcript;
        if(e.results[i].isFinal) final += t; else interim += t;
      }
      if(interim){
        msgInput.classList.add('live');
        msgInput.setAttribute('data-live', interim.trim());
      }else{
        msgInput.classList.remove('live');
        msgInput.removeAttribute('data-live');
      }
      if(final){
        msgInput.value = (msgInput.value + ' ' + final).trim();
      }
    };
    rec.onend = ()=>{ if(recognizing){ rec.start(); } };
  }
}catch{}

function toggleMic(){
  if(!rec) return;
  recognizing = !recognizing;
  micBtn.setAttribute('aria-pressed', recognizing ? 'true' : 'false');
  if(recognizing){
    rec.start();
  }else{
    rec.stop();
    msgInput.classList.remove('live');
    msgInput.removeAttribute('data-live');
  }
}
if(micBtn) micBtn.addEventListener('click', toggleMic);
