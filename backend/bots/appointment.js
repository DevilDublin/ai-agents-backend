// State-aware appointment bot that fills slots in any order and responds contextually.
const sessions = new Map();

const emailRe   = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const currencyRe = /(?:£|\$|€)\s?\d{1,3}(?:[,\s]?\d{3})*(?:\.\d+)?\s?(?:k|K)?|(?:\d+\s?(?:k|K)\b)/;
const budgetHintRe = /\b(budget|price|cost|spend|per\s*(month|year)|monthly|annual)\b/i;
const timeRe = /\b(today|tomorrow|mon(day)?|tue(s(day)?)?|wed(nesday)?|thu(rs(day)?)?|fri(day)?|sat(urday)?|sun(day)?|next week|this week|morning|afternoon|evening|\d{1,2}(:\d{2})?\s?(am|pm)?)\b/i;

const YES = /^(y|yes|yeah|yep|ok|okay|sure|confirm|book)/i;
const NO  = /^(n|no|not now|later|maybe)/i;
const RESET = /\b(reset|restart|start over|cancel)\b/i;

function getSession(id){
  if(!sessions.has(id)){
    sessions.set(id, {
      data: { budget:null, timeline:null, email:null },
      step: 'collect' // collect → confirm → done
    });
  }
  return sessions.get(id);
}

function parseBudget(msg){
  const m = msg.match(currencyRe);
  if(m) return m[0];
  if(budgetHintRe.test(msg)) return msg; // phrases like "budget is flexible"
  return null;
}
function parseTimeline(msg){
  const m = msg.match(timeRe);
  return m ? msg : null; // keep raw phrase (e.g., "Tuesday 2–4pm")
}
function parseEmail(msg){
  const m = msg.match(emailRe);
  return m ? m[0] : null;
}

export default function appointmentBot(message, sessionId='guest'){
  const msg = (message || '').trim();
  const s = getSession(sessionId);

  if(!msg){
    // First open — frontend shows greeting; here just ask for the first missing thing.
    const missing = ['budget','timeline','email'].filter(k=>!s.data[k]);
    return askFor(missing[0]);
  }

  if(RESET.test(msg)){
    sessions.delete(sessionId);
    return "No problem — I’ve reset our chat. What’s your budget or target scope to start with?";
  }

  // Quick confirm handling any time after slots filled
  if(YES.test(msg) && (s.step === 'confirm' || allFilled(s.data))){
    s.step = 'done';
    return `All set! I’ve pencilled a 30-minute introduction and sent a placeholder invite to ${s.data.email || 'your e-mail'}.`;
  }
  if(NO.test(msg) && (s.step === 'confirm' || allFilled(s.data))){
    s.step = 'collect';
    return "No worries — share a preferred day/time and I’ll propose alternatives.";
  }

  // Try to capture any slots from the incoming message
  const captured = [];
  const email = parseEmail(msg);
  if(email && !s.data.email){ s.data.email = email; captured.push('email'); }
  const budget = parseBudget(msg);
  if(budget && !s.data.budget){ s.data.budget = budget; captured.push('budget'); }
  const timeline = parseTimeline(msg);
  if(timeline && !s.data.timeline){ s.data.timeline = timeline; captured.push('timeline'); }

  // If we captured something, acknowledge then ask the next missing piece
  if(captured.length){
    const missing = ['budget','timeline','email'].filter(k=>!s.data[k]);
    if(missing.length === 0){
      s.step = 'confirm';
      return `Thanks — I’ve noted ${prettyCaptured(captured, s)}. Shall I book a 30-minute introduction next week? (yes/no)`;
    }
    const next = missing[0];
    const lead = ackFor(captured, s);
    s.step = 'collect';
    return `${lead}${askFor(next)}`;
  }

  // Nothing captured → ask for the first missing piece
  const missing = ['budget','timeline','email'].filter(k=>!s.data[k]);
  if(missing.length){
    s.step = 'collect';
    return askFor(missing[0]);
  }

  // Everything already captured → move to confirm
  s.step = 'confirm';
  return "Shall I book a 30-minute introduction next week? (yes/no)";
}

function allFilled(d){ return d.budget && d.timeline && d.email; }
function askFor(slot){
  const prompts = {
    budget:  "What’s your budget or target scope to start with?",
    timeline:"When would you like to meet?",
    email:   "What’s the best e-mail for the invite?"
  };
  return prompts[slot] || "How can I help?";
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
