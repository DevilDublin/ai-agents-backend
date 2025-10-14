/* Web Speech + smooth “ghost typing” that sits above the input */
const micBtn = document.getElementById("mic");
const inputEl = document.getElementById("dlg-input");
const ghostEl = document.getElementById("dlg-ghost");

let recognition, listening = false, ghostText = "";

function ghostWrite(t){
  ghostText = t;
  ghostEl.textContent = t;
  ghostEl.style.display = t ? "block" : "none";
}

function stopMic(keepGhost=false){
  if(recognition && listening){ recognition.stop(); }
  listening = false;
  micBtn?.setAttribute("aria-pressed","false");
  if(!keepGhost) ghostWrite("");
}

if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.onresult = (e)=>{
    let final = "", inter = "";
    for(const res of e.results){
      (res.isFinal ? final : inter) += res[0].transcript;
    }
    if(final){ inputEl.value = (inputEl.value + " " + final).trim(); }
    ghostWrite(inter);
  };
  recognition.onend = ()=> { listening = false; micBtn?.setAttribute("aria-pressed","false"); };
}

micBtn?.addEventListener("click", ()=>{
  if(!recognition) return;
  if(listening){ stopMic(); return; }
  recognition.start();
  listening = true;
  micBtn.setAttribute("aria-pressed","true");
  ghostWrite("");
  inputEl.focus();
});

// safety: pressing Enter sends and stops mic
inputEl?.addEventListener("keydown", (e)=>{
  if(e.key === "Enter"){ document.getElementById("dlg-send").click(); e.preventDefault(); }
});
