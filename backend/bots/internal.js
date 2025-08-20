// Internal knowledge assistant: auto-routes HR vs Sales with broader coverage
const HR_TERMS = [
  'holiday','leave','benefit','pension','handbook','policy','vacation','hr','sick','payroll',
  'promotion','promote','review','performance','expense','expenses','reimburse','equipment',
  'laptop','it','security','2fa','mfa','travel','remote','hybrid','training','learning','probation'
];
const SALES_TERMS = [
  'sales','stage','pipeline','quota','target','discount','deal','opportunity','pricing',
  'mql','sql','lead score','demo','proof of concept','poc','nda','proposal','renewal'
];

const KB = {
  hr: [
    {q:['holiday','annual leave','vacation'], a:'Holiday entitlement: 25 days annual leave plus UK bank holidays.'},
    {q:['benefit','health','pension'], a:'Benefits include private health cover, 5% pension match, and a wellness stipend.'},
    {q:['policy','handbook'], a:'You’ll find the HR handbook on the intranet → HR › Policies.'},
    {q:['promotion','promote','progression'], a:'Promotion process: align with your manager on scope, gather evidence vs. the next level rubric, then submit during the bi-annual review cycle.'},
    {q:['review','performance'], a:'Performance reviews happen twice a year. Mid-cycle check-ins are encouraged to avoid surprises.'},
    {q:['expense','expenses','reimburse'], a:'Expenses: submit within 30 days with receipts; standard approval is your line manager. Travel requires pre-approval for flights/hotels.'},
    {q:['equipment','laptop','hardware'], a:'Equipment requests go via IT Service Desk. Standard laptop refresh is every 3 years.'},
    {q:['it','security','2fa','mfa'], a:'IT/Security: enable MFA on all accounts; password resets and access requests are handled in the IT portal.'},
    {q:['travel','remote','hybrid'], a:'Travel policy: economy class unless approved; hybrid policy is 2–3 days per week in the office, team-dependent.'}
  ],
  sales: [
    {q:['stage','pipeline','process'], a:'Sales stages: Prospect → Qualify → Proposal → Negotiation → Closed.'},
    {q:['quota','target'], a:'Quotas are set quarterly based on territory and ACV history.'},
    {q:['pricing','discount'], a:'Discounts: ≤10% rep approval; 10–20% manager; >20% VP approval.'},
    {q:['mql','sql','lead score'], a:'MQL: marketing-qualified by engagement; SQL: sales-qualified after discovery. Lead score blends fit + intent.'},
    {q:['demo','poc','proof of concept'], a:'Demo best practice: 30 minutes, problem → solution → proof. For PoC, define success criteria and timeline up front.'},
    {q:['nda'], a:'NDAs: use the standard template in the legal portal. Customer-paper NDAs need Legal review.'},
    {q:['renewal','proposal'], a:'Renewals: start 90 days prior to end date. Proposal templates are in the sales library.'}
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
  const msg = (message||'').trim();
  if(!msg) return intro;

  const section = chooseSection(msg);
  if(!section) return "I’ll help with HR or Sales queries. Try asking about promotion, expenses, holiday policy, pipeline stages, pricing approvals, or NDAs.";

  const ans = match(section, msg);
  if(ans) return ans;

  return `I couldn’t find that in the ${section.toUpperCase()} knowledge. Please check the relevant handbook or ask your manager.`;
}
