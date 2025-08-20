// Support bot with escalation and simple policy KB
const KB = [
  {q:['return','refund','exchange','returns'], a:'Our returns policy allows returns within 30 days (unused, in original packaging). Refunds are processed within 5–7 working days.'},
  {q:['shipping','expedited','delivery','postage','courier'], a:'Expedited shipping typically arrives in 2–3 working days. Standard shipping is 4–6 working days.'},
  {q:['hours','support','weekend','opening','contact hours'], a:'Support is available Mon–Fri, 09:00–18:00 GMT. Weekend coverage is e-mail only for urgent issues.'},
  {q:['warranty','guarantee'], a:'We provide a 12-month limited warranty covering manufacturing defects. Please open a ticket with your order details.'},
];

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const ORDER = /\b(#?\d{6,})\b/;
const INAPPROPRIATE = /(sex|sexual|nude|nsfw|hate|racist|suicide|self\-harm)/i;
const WANT_HUMAN = /(human|agent|person|someone|real support|call me|ring me|speak to)/i;
const YES = /^(y|yes|yeah|yep|please|ok|okay|sure)\b/i;

export default function supportBot(message){
  const text = (message||'').trim();
  const lc = text.toLowerCase();

  if(!text) return "Hello — ask me about returns, shipping, warranty or support hours.";

  if(INAPPROPRIATE.test(lc)){
    return "I’m not able to help with that. If you have a question about orders, shipping, or returns, I’m happy to assist.";
  }

  // If user explicitly wants a human or simply says "yes" (common after our offer), escalate.
  if (WANT_HUMAN.test(lc) || YES.test(lc)){
    const email = text.match(EMAIL)?.[0];
    const order = text.match(ORDER)?.[1];
    const bits = [];
    if(order) bits.push(`order ${order}`);
    if(email) bits.push(`e-mail ${email}`);
    const noted = bits.length ? ` I’ve noted ${bits.join(' and ')}.` : "";
    return `Okay — I’ll connect you with a human agent.${noted} If there’s anything else I can include for context, tell me here.`;
  }

  // Try to answer from KB
  for(const item of KB){
    if(item.q.some(k=> lc.includes(k))) return item.a;
  }

  // Fallback
  return "I couldn’t find that in our documents. Would you like me to connect you with a human agent?";
}
