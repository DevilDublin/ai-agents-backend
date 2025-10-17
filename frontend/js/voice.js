(function(){
let rec=null, listening=false;
function mic(){return document.querySelector('#micBtn')}
function supported(){return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window}
function ensure(){ if(rec) return rec; const SR=window.SpeechRecognition||window.webkitSpeechRecognition; rec=new SR(); rec.lang=(window.ZYPHER_CONFIG&&window.ZYPHER_CONFIG.speechLocale)||'en-GB'; rec.continuous=false; rec.interimResults=false; return rec; }
function glow(on){const m=mic(); if(!m) return; m.classList.toggle('glow', !!on)}
function toggleMic(){ if(!supported()){ if(window.Demo) window.Demo.addMsg('bot','Speech recognition isn’t supported in this browser.'); return; } const r=ensure(); if(!listening){ listening=true; glow(true); r.start(); r.onresult=e=>{ const text=e.results[0][0].transcript; if(window.Demo) window.Demo.setTranscriptAndSend(text); }; r.onerror=()=>{ listening=false; glow(false); if(window.Demo) window.Demo.addMsg('bot','Sorry — I couldn’t hear that. Try again?'); }; r.onend=()=>{ listening=false; glow(false); }; } else { r.stop(); listening=false; glow(false);} }
function init(){ const m=mic(); if(m) m.addEventListener('click', toggleMic) }
window.toggleMic=toggleMic;
document.addEventListener('DOMContentLoaded', init);
})();
