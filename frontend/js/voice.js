// Mic + Speech-to-Text with live overlay text and shimmer animation
const micBtn = document.getElementById('mic');
const msgInput = document.getElementById('msg');
const liveText = document.getElementById('liveText');

let recognizing = false;
let rec;

(function initSTT(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ return; }
  rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-GB';

  rec.onresult = (e)=>{
    let interim = '', final = '';
    for(let i=e.resultIndex;i<e.results.length;i++){
      const t = e.results[i][0].transcript;
      if(e.results[i].isFinal) final += t; else interim += t;
    }
    if(interim){
      liveText.textContent = interim.trim();
      liveText.classList.add('shimmer');
    }else{
      liveText.textContent = '';
      liveText.classList.remove('shimmer');
    }
    if(final){
      msgInput.value = (msgInput.value + ' ' + final).trim();
    }
  };

  rec.onend = ()=>{
    if(recognizing){ try{ rec.start(); }catch{} }
    else{
      liveText.textContent = '';
      liveText.classList.remove('shimmer');
    }
  };
})();

function toggleMic(){
  if(!rec) return;
  recognizing = !recognizing;
  micBtn.setAttribute('aria-pressed', recognizing ? 'true' : 'false');
  try{
    if(recognizing){ rec.start(); }
    else{ rec.stop(); }
  }catch{}
}

if(micBtn) micBtn.addEventListener('click', toggleMic);
