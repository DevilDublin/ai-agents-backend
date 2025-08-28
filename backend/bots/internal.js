// Internal knowledge (HR & Sales) first; otherwise general LLM fallback.
import { generalAnswer, USE_LLM } from '../openaiClient.js';

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
    {q:['review','performance'], a:'Performance reviews happen twice a year. Mid-cycle check-ins avoid surprises.'},
    {q:['expense','expenses','reimburse'], a:'Expenses: submit within 30 days with receipts; standard approval is your line manager. Travel needs pre-approval.'},
    {q:['equipment','laptop','hardware'], a:'Equipment requests go via IT Service Desk. Standard laptop refresh is every 3 years.'},
    {q:['it','security','2fa','mfa'], a:'Enable MFA on all accounts; access requests are handled in the IT portal.'},
    {q:['travel','remote','hybrid'], a:'Travel policy: economy class unless approved; hybrid policy is 2–3 days in office per week, team-dependent.'}
  ],
  sales: [
    {q:['stage','pipeline','process'], a:'Sales stages: Prospect → Qualify → Proposal → Negotiation → Closed.'},
    {q:['quota','target'], a:'Quotas are set quarterly based on territory and ACV history.'},
    {q:['pricing','discount'], a:'Discounts: ≤10% rep approval; 10–20% manager; >20% VP approval.'},
    {q:['mql','sql','lead score'], a:'MQL vs SQL: marketing qualified by engagement vs sales qualified after discovery.'},
    {q:['demo','poc','proof of concept'], a:'Demo: 30 minutes, problem → solution → proof. For PoC, define success criteria and timeline up front.'},
    {q:['nda'], a:'NDAs: use the standard template in the legal portal. Customer-paper NDAs need Legal review.'},
    {q:['renewal','proposal'], a:'Renewals: start 90 days before end date. Proposal templates are in the sales library.'}
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
  const items = KB[section]||[]; const lc = text.toLowerCase();
  for(const item of items){ if(item.q.some(k=> lc.includes(k))) return item.a; }
  return null;
}

export default async function internalBot(message){
  const msg = (message||'').trim();
  if(!msg) return "Hello! Ask me an HR or Sales question; I’ll route it to the right knowledge automatically.";

  const section = chooseSection(msg);
  const ans = section ? match(section, msg) : null;
  if (ans) return ans;

  if (section) {
    if (USE_LLM) {
      const llm = await generalAnswer(
        `Section: ${section.toUpperCase()}.\nQuestion: ${msg}`,
        "You are an internal assistant for HR & Sales. If policy is unknown, say so and suggest the handbook or manager."
      );
      return llm || `I couldn’t find that in the ${section.toUpperCase()} knowledge. Please check the relevant handbook or ask your manager.`;
    }
    return `I couldn’t find that in the ${section.toUpperCase()} knowledge. Please check the relevant handbook or ask your manager.`;
  }

  if (USE_LLM) {
    const llm = await generalAnswer(msg, "You are a helpful internal assistant who can answer general questions too.");
    return llm || "Could you share a bit more detail?";
  }
  return "I can help with HR or Sales queries. Try asking about promotion, expenses, holiday policy, pipeline stages, pricing approvals, or NDAs.";
}
