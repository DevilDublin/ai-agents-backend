// Automation planner: domain blueprints first; otherwise general LLM fallback.
import { generalAnswer, USE_LLM } from '../openaiClient.js';

function bullets(lines){ return "Here’s a draft blueprint:\n• " + lines.join("\n• "); }

function rulesPlan(idea){
  const t = (idea||'').toLowerCase();
  const has = (...k)=> k.some(x => t.includes(x));

  if (has('insurance','policy','underwrit','premium','broker','claim','renewal','quote')){
    return bullets([
      "Trigger: New lead/quote request intake (web/phone)",
      "Enrich lead & consent check; collect risk Qs + docs",
      "Rating/underwriting: call API or route to queue",
      "Generate quote, e-mail lead; log to CRM & policy admin",
      "If accepted: take payment, bind cover, issue docs",
      "Renewal: 30/14/7-day nudges, price re-check, retention scoring",
      "Alerts: Slack/Teams for high-value quotes & declines"
    ]);
  }
  if (has('social','instagram','tiktok','linkedin','twitter','x','facebook','post','hashtag','caption','content calendar')){
    return bullets([
      "Monthly brief intake (topics, tone, offers)",
      "Content calendar with per-channel publish times",
      "Draft posts + A/B hooks; image/video placeholders",
      "Approval loop, then schedule via Buffer/Hootsuite",
      "Repurpose long-form → shorts; add alt text",
      "Route high-intent comments to CRM",
      "Weekly performance roll-up (CTR, saves, shares)"
    ]);
  }
  if (has('shopify','woocommerce','cart','checkout','order','inventory','sku','abandoned')){
    return bullets([
      "Event triggers (view/add-to-cart/checkout/order)",
      "Abandoned cart: 1h/24h e-mails with dynamic coupon",
      "Post-purchase cross-sell by SKU affinities",
      "Inventory alerts, RMA flow, refund status updates",
      "Weekly revenue summary & LTV cohorts"
    ]);
  }
  if (has('onboarding','trial','signup','saas','activation')){
    return bullets([
      "New signup → validate & dedupe CRM",
      "Activation map (Aha, core task, invite teammate)",
      "Guided nudges (in-app + e-mail) for missing steps",
      "Health scoring (usage, TTV, support touches)",
      "Sales assist: high-score trials to SDR",
      "Weekly ops digest (signups, activation, risk)"
    ]);
  }
  if (has('invoice','billing','payment','stripe','xero','quickbooks','accounts')){
    return bullets([
      "New invoice/payment intent trigger",
      "VAT & line-item validation; post to ledger",
      "Dunning with smart retries; reconciliation",
      "Month-end: AR ageing, receipts, revenue by product"
    ]);
  }
  if (has('ticket','zendesk','helpdesk','support','sla')){
    return bullets([
      "New ticket: classify intent/priority; detect VIPs",
      "Retrieve policy snippets; draft reply; escalate if low confidence",
      "SLA watch; reminders; auto-close on resolution",
      "Weekly QA sample for tone/accuracy"
    ]);
  }
  return null;
}

export default async function automationBot(message){
  const idea = (message||'').trim();
  if(!idea) return "Tell me what you’d like to automate — I’ll propose a clean, step-by-step workflow you can run today.";

  const plan = rulesPlan(idea);
  if (plan) return plan;

  if (USE_LLM) {
    const ans = await generalAnswer(idea, "You design practical automation plans when asked; otherwise you can answer general questions helpfully.");
    return ans || "Could you share more detail about the workflow, tools and triggers you have in mind?";
  }

  return "Could you share more detail about the workflow, tools and triggers you have in mind?";
}
