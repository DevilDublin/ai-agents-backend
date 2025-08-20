const sessions = new Map();
const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const budgetRe = /(budget|\b£\s?\d+[kK]?|\$\s?\d+[kK]?|\d+\s?(k|K)\b|monthly|per\s*month|annual|per\s*year)/i;
const timeRe = /(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|this week|\b\d{1,2}(:\d{2})?\s?(am|pm)?\b)/i;
const yesRe = /^(y|yes|sure|ok|okay|confirm|book)/i;
const noRe = /^(n|no|not now|later)/i;

function getState(id){
  if(!sessions.has(id)) sessions.set(id, {step:'greet', data:{}});
  return sessions.get(id);
}
export default function appointmentBot(message, sessionId='guest'){
  const msg = (message||'').trim();
  const text = msg.toLowerCase();
  const state = getState(sessionId);

  const em = msg.match(emailRe)?.[0];
  if(em) state.data.email = em;
  if(budgetRe.test(msg)) state.data.budget = msg;
  if(timeRe.test(msg)) state.data.timeline = msg;

  if(state.step==='greet'){ state.step='budget'; if(!state.data.budget) return "Hello! 👋 I can help schedule a meeting. What’s your budget or target scope to start with?"; }
  if(state.step==='budget'){ if(!state.data.budget) state.data.budget = msg; state.step='timeline'; return "Grand. When would you like to meet?"; }
  if(state.step==='timeline'){ if(!state.data.timeline) state.data.timeline = msg; state.step='contact'; return "Brilliant. What’s the best e‑mail for the invite?"; }
  if(state.step==='contact'){ if(!state.data.email) return "Could you share your e‑mail so I can send the invite?"; state.step='confirm'; return `Thanks! Shall I book a 30‑minute introduction next week? (yes/no)`; }
  if(state.step==='confirm'){
    if(yesRe.test(text)){ state.step='done'; return `All set! I’ve pencilled a 30‑minute introduction and sent a placeholder invite to ${state.data.email}.`; }
    if(noRe.test(text)){ return `No problem — tell me a preferred day/time and I’ll propose alternatives.`; }
    return "Just to confirm — would you like me to book that 30‑minute introduction? (yes/no)";
  }
  return "I’m here — share budget, timing, or your e‑mail and I’ll get you booked.";
}
