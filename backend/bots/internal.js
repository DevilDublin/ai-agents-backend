const HR_TERMS = ['holiday','leave','benefit','pension','handbook','policy','vacation','hr','sick','payroll'];
const SALES_TERMS = ['sales','stage','pipeline','quota','target','discount','deal','opportunity','pricing'];

const KB = {
  hr: [
    {q:['holiday','annual leave','vacation'], a:'HR Policy: 25 days of annual leave plus UK bank holidays.'},
    {q:['benefit','health','pension'], a:'Benefits: private health plan, 5% pension match, wellness stipend.'},
    {q:['policy','handbook'], a:'You’ll find the HR handbook on the intranet → HR › Policies.'}
  ],
  sales: [
    {q:['stage','pipeline','process'], a:'Sales stages: Prospect → Qualify → Proposal → Negotiation → Closed.'},
    {q:['quota','target'], a:'Quotas are set quarterly based on territory and ACV history.'},
    {q:['pricing','discount'], a:'Discount guidelines: ≤10% rep approval, 10–20% manager approval, >20% VP approval.'}
  ]
};

function chooseSection(text){
  const lc = text.toLowerCase();
  const hrScore = HR_TERMS.reduce((s,k)=> s + (lc.includes(k)?1:0),0);
  const salesScore = SALES_TERMS.reduce((s,k)=> s + (lc.includes(k)?1:0),0);
  if(hrScore===0 && salesScore===0) return null;
  return hrScore >= salesScore ? 'hr' : 'sales';
}
function match(section, text){
  const items = KB[section]||[];
  const lc = text.toLowerCase();
  for(const item of items){ if(item.q.some(k=> lc.includes(k))) return item.a; }
  return null;
}

export default function internalBot(message){
  const intro = "Hello! Ask me an HR or Sales question; I’ll route it to the right knowledge automatically.";
  if(!message || !message.trim()) return intro;
  const section = chooseSection(message||'');
  if(!section){ return intro; }
  const ans = match(section, message||'');
  if(ans) return ans;
  return `I couldn’t find that in the ${section.toUpperCase()} knowledge. Please check the relevant handbook or ask your manager.`;
}
