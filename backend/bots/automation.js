const ENTITIES = {
  lead: ['lead','form','signup','capture','crm','ghl','clearbit'],
  weekly: ['weekly','summary','report','kpi','airtable','sheets','metrics'],
  notify: ['slack','email','gmail','outlook','notify','alert','teams'],
  support: ['ticket','zendesk','helpdesk','support']
};
function planFor(idea){
  const t = idea.toLowerCase();
  const steps = [];
  if(ENTITIES.lead.some(k=>t.includes(k))){
    steps.push("Trigger: new lead form submission");
    steps.push("Validate & de‑dupe by e‑mail");
    steps.push("Enrich company/person (e.g., Clearbit)");
    steps.push("Score lead (e.g., GHL / CRM rules)");
    steps.push("Create/Update CRM record & owner routing");
  }
  if(ENTITIES.weekly.some(k=>t.includes(k))){
    steps.push("CRON: Weekly run (Mon 09:00)");
    steps.push("Fetch metrics from Airtable/Sheets");
    steps.push("Aggregate KPIs and highlight changes");
    steps.push("Generate summary text & chart links");
  }
  if(ENTITIES.notify.some(k=>t.includes(k))){
    steps.push("Post summary to Slack/Teams");
    steps.push("E‑mail a detailed report to stakeholders");
  }
  if(ENTITIES.support.some(k=>t.includes(k))){
    steps.push("Classify support intent and priority");
    steps.push("Retrieve policy snippets (retrieval‑ready)");
    steps.push("Draft reply; escalate if confidence is low");
  }
  if(steps.length===0){
    steps.push("Trigger received → validate payload");
    steps.push("Branch by rules → call external APIs");
    steps.push("Handle errors/retries → persist run history");
    steps.push("Notify Slack/E‑mail → emit webhooks");
  }
  return "Here’s a draft blueprint:\n• " + steps.join("\n• ");
}
export default function automationBot(message){
  const idea = (message||'').trim();
  if(!idea) return "Tell me what you’d like to automate — I’ll propose a clean, step‑by‑step workflow you can run today.";
  return planFor(idea);
}
