// Appointment bot: slot-filling first, general LLM fallback second.
import { generalAnswer, USE_LLM } from '../openaiClient.js';

const sessions = new Map();

const emailRe   = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const currencyRe = /(?:£|\$|€)\s?\d{1,3}(?:[,\s]?\d{3})*(?:\.\d+)?\s?(?:k|K)?|(?:\d+\s?(?:k|K)\b)/;
const budgetHintRe = /\b(budget|price|cost|spend|per\s*(month|year)|monthly|annual)\b/i;
const timeRe = /\b(today|tomorrow|mon(day)?|tue(s(day)?)?|wed(nesday)?|thu(rs(day)?)?|fri(day)?|sat(urday)?|sun(day)?|next week|this week|morning|afternoon|evening|\d{1,2}(:\d{2})?\s?(am|pm)?)\b/i;

const YES = /^(y|yes|yeah|yep|ok|okay|sure|confirm|book)/i;
const NO  = /^(n|no|not now|later|maybe)/i;
const RESET = /\b(reset|restart|start over|cancel)\b/i;

const SCHED_HINT = /(budget|price|cost|scope|meet|meeting|call|appoint|slot|calendar|invite|time|day|date|week|am|pm|email|e-mail)/i;

function getSession(id){
  if(!sessions.has(id)){
    sessions.set(id, { data:{ budget:null, timeline:null, email:null }, step:'collect' });
  }
  return sessions.get(id);
}
function parseBudget(msg){ const m = msg.match(currencyRe); if(m) return m[0]; if(budgetHintRe.test(msg)) return msg; return null; }
function parseTimeline(msg){ const m = msg.match(timeRe); return m ? msg : null; }
function parseEmail(msg){ const m = msg.match(emailRe); return m ? m[0] : null; }
const allFilled = d => d.budget && d.timeline && d.email;

function askFor(slot){
  return ({
    budget:  "What’s your budget or target scope to start with?",
    timeline:"When would you like to meet?",
    email:   "What’s the best e-mail for the invite?"
  })[slot] || "How can I help?";
}
function prettyCaptured(captured, s){
  const bits = [];
  if(captured.includes('budget')) bits.push(`your budget`);
  if(captured.includes('timeline')) bits.push(`your preferred timing`);
  if(captured.includes('email')) bits.push(`your e-mail (${s.data.email})`);
  return bits.join(' and ');
}
function ackFor(captured, s){
  if(captured.length === 1){
    if(captured[0]==='email') return `Thanks — I’ve got your e-mail (${s.data.email}). `;
    if(captured[0]==='budget') return `Noted your budget. `;
    if(captured[0]==='timeline') return `Got your timing. `;
  }
  return `Thanks — I’ve noted ${prettyCaptured(captured, s)}. `;
}

export default async function appointmentBot(message, sessionId='guest'){
  const msg = (message || '').trim();
  const s = getSession(sessionId);

  if(!msg) return askFor(['budget','timeline','email'].find(k=>!s.data[k]) || 'budget');
  if(RESET.test(msg)){ sessions.delete(sessionId); return "No problem — I’ve reset our chat. What’s your budget or target scope to start with?"; }

  if(YES.test(msg) && (s.step === 'confirm' || allFilled(s.data))){
    s.step = 'done'; return `All set! I’ve pencilled a 30-minute introduction and sent a placeholder invite to ${s.data.email || 'your e-mail'}.`;
  }
  if(NO.test(msg) && (s.step === 'confirm' || allFilled(s.data))){
    s.step = 'collect'; return "No worries — share a preferred day/time and I’ll propose alternatives.";
  }

  const captured = [];
  const e = parseEmail(msg);    if(e && !s.data.email){ s.data.email = e; captured.push('email'); }
  const b = parseBudget(msg);   if(b && !s.data.budget){ s.data.budget = b; captured.push('budget'); }
  const t = parseTimeline(msg); if(t && !s.data.timeline){ s.data.timeline = t; captured.push('timeline'); }

  if(captured.length){
    const missing = ['budget','timeline','email'].filter(k=>!s.data[k]);
    if(!missing.length){ s.step='confirm'; return `Thanks — I’ve noted ${prettyCaptured(captured, s)}. Shall I book a 30-minute introduction next week? (yes/no)`; }
    s.step='collect'; return `${ackFor(captured, s)}${askFor(missing[0])}`;
  }

  if (USE_LLM && !SCHED_HINT.test(msg)) {
    const nudge = "When you’re ready, tell me your budget, preferred time, and e-mail and I’ll book the meeting.";
    const ans = await generalAnswer(msg, "You are an appointment-setting assistant, but you can also answer general questions helpfully.");
    return ans ? `${ans} ${nudge}` : askFor(['budget','timeline','email'].find(k=>!s.data[k]));
  }

  const missing = ['budget','timeline','email'].filter(k=>!s.data[k]);
  if(missing.length){ s.step='collect'; return askFor(missing[0]); }
  s.step='confirm'; return "Shall I book a 30-minute introduction next week? (yes/no)";
}
