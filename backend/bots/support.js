const KB = [
  {q:['return','refund','exchange','returns'], a:'Our returns policy allows returns within 30 days (unused, in original packaging). Refunds are processed within 5–7 days.'},
  {q:['shipping','expedited','delivery','postage'], a:'Expedited shipping typically arrives in 2–3 working days. Standard shipping is 4–6 working days.'},
  {q:['hours','support','weekend','opening'], a:'Support is available Mon–Fri, 09:00–18:00 GMT. Weekend coverage is e‑mail only for urgent issues.'},
  {q:['warranty','guarantee'], a:'We provide a 12‑month limited warranty covering manufacturing defects. Please open a ticket with your order details.'},
  {q:['contact','agent','human'], a:'I can connect you with a human agent — please share your order number and a contact e‑mail.'}
];
const INAPPROPRIATE = /(sex|sexual|nude|nsfw|hate|racist|suicide|self\-harm)/i;
export default function supportBot(message){
  const text = (message||'').toLowerCase();
  if(INAPPROPRIATE.test(text)){
    return "I’m not able to help with that. If you have a question about orders, shipping, or returns, I’m happy to assist.";
  }
  for(const item of KB){ if(item.q.some(k=> text.includes(k))) return item.a; }
  return "I couldn’t find that in our documents. Would you like me to connect you with a human agent?";
}
