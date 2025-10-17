(function(){
const state={
activeBot:null,
bots:{
appointly:{name:'Appointly (Generic Appointment Setter)'},
realestate:{name:'Property Qualifier'},
salon:{name:'Salon Booker'},
carins:{name:'Car Insurance Quick-Qualifier'},
support:{name:'Support Triage'},
guardrails:{name:'Off-topic Wrangler'}
}
};
const qs = (s)=>document.querySelector(s);
function addMsg(role,text){const m=qs('.msgs'); if(!m) return; const d=document.createElement('div'); d.className='msg '+role; d.textContent=text; m.appendChild(d); m.scrollTop=m.scrollHeight;}
function openChat(key){state.activeBot=key; qs('.stage-placeholder')?.remove(); const wrap=qs('.chat-wrap'); if(wrap) wrap.style.display='block'; const t=qs('#chatBotName'); if(t) t.textContent=state.bots[key].name; const m=qs('.msgs'); if(m) m.innerHTML=''; addMsg('bot', `Hi — I'm ${state.bots[key].name}. Ask me something or press the mic.`);}
function backToOrbit(){ const wrap=qs('.chat-wrap'); if(wrap) wrap.style.display='none'; const st=qs('.stage'); if(st && !qs('.stage-placeholder')){ const ph=document.createElement('div'); ph.className='stage-placeholder'; ph.innerHTML='<p class="muted">Select a demo from the Dock to start chatting.</p>'; st.prepend(ph); }
}
function fakeAIResponse(input){ const k=state.activeBot; const low=input.toLowerCase(); if(k==='guardrails'&&(low.includes('politics')||low.includes('weather')||low.includes('joke'))) return "Let's park that — what service do you need?"; if(k==='appointly'&&low.includes('tuesday')) return 'I can offer Tue 10:00 or 14:30. Which works?'; if(k==='carins'&&low.includes('quote')) return 'Quick check: name, DOB, licence type, any claims in last 3 years?'; if(k==='salon'&&(low.includes('hair')||low.includes('cut'))) return 'We can do a Cut & Finish. Want to add a scalp treatment today?'; if(k==='support'&&(low.includes('down')||low.includes('error'))) return "I can create a ticket. What's your email and a short description?"; if(k==='realestate'&&(low.includes('view')||low.includes('flat'))) return 'Great — buy or rent, and budget range?'; return "Got it. Tell me a bit more and I’ll guide you."; }
function handleSend(){ const i=qs('#chatInput'); if(!i) return; const t=i.value.trim(); if(!t) return; addMsg('user', t); i.value=''; setTimeout(()=>addMsg('bot', fakeAIResponse(t)), 400); }
function setTranscriptAndSend(text){ const i=qs('#chatInput'); if(!i) return; i.value=text||''; if(i.value.trim()) handleSend(); }
function init(){ if(!qs('.dock-and-stage')) return; qs('#sendBtn')?.addEventListener('click', handleSend); qs('#chatInput')?.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSend(); }); }
window.openChat=openChat; window.backToOrbit=backToOrbit; window.Demo={setTranscriptAndSend, addMsg};
document.addEventListener('DOMContentLoaded', init);
})();
