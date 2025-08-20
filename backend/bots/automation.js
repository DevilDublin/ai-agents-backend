// Automation planner with richer blueprints by domain
function plan(idea){
  const t = (idea||'').toLowerCase();

  const has = (...keys)=> keys.some(k => t.includes(k));

  // Insurance (broker / MGA / carrier)
  if (has('insurance','policy','underwrit','premium','broker','claim','renewal','quote')){
    return bullets([
      "Trigger: New lead or quote request via web form/phone intake",
      "Enrich lead (company/person) and DPA consent check",
      "Collect risk questions (LOB-specific) and required documents upload",
      "Rating: call pricing/underwriting API or route to underwriter queue",
      "Generate quote PDF and e-mail to lead; log to CRM & policy admin",
      "If accepted: take payment/deposit, bind cover, issue documents",
      "Renewal workflow: 30/14/7-day nudges, price re-check, retention scoring",
      "Alerts: Slack/Teams for high-value quotes & declined risks"
    ]);
  }

  // Social media content ops
  if (has('social','instagram','tiktok','linkedin','twitter','x','facebook','post','hashtag','caption','content calendar')){
    return bullets([
      "Trigger: Monthly content brief intake (topics, tone, offers)",
      "Generate content calendar (publish dates/times per channel)",
      "Draft posts + variations (A/B hooks) with image/video placeholders",
      "Approval loop: comments → apply edits → version lock",
      "Schedule via Buffer/Hootsuite (or native APIs) with UTM tags",
      "Repurpose long-form → shorts/reels; auto-thumb + alt text",
      "Listen & respond: route high-intent comments to CRM",
      "Weekly performance roll-up: CTR, saves, shares, top creatives"
    ]);
  }

  // E-commerce (Shopify / Woo / etc.)
  if (has('shopify','woocommerce','cart','checkout','order','inventory','sku','abandoned')){
    return bullets([
      "Trigger: Events from shop (view, add-to-cart, checkout, order)",
      "Abandoned carts: 1h/24h e-mails with personalised dynamic coupon",
      "Post-purchase: cross-sell sequence based on SKU affinities",
      "Inventory alerts: low-stock → reorder task; OOS page updates",
      "Support: auto-answer FAQs; create tickets for exceptions",
      "Returns portal: generate label, track RMA, update refund status",
      "Analytics: LTV cohort chart & weekly revenue summary"
    ]);
  }

  // SaaS onboarding / product-led growth
  if (has('onboarding','trial','signup','saas','product','activation')){
    return bullets([
      "Trigger: New signup → validate + dedupe CRM",
      "Activation map: track key actions (Aha, core task, invite teammate)",
      "Guided nudges: in-app tips + e-mails tied to missing steps",
      "Health scoring: usage, time-to-value, support touches",
      "Sales assist: route high-score trials to SDR with context",
      "Weekly ops digest: signups, activation rate, churn risk"
    ]);
  }

  // Finance ops
  if (has('invoice','billing','payment','stripe','xero','quickbooks','accounts')){
    return bullets([
      "Trigger: New invoice or payment intent",
      "Validate tax/VAT & line items; post to ledger",
      "Payment collection: dunning sequence with smart retries",
      "Reconciliation: match payouts to invoices; exceptions queue",
      "Month-end pack: AR ageing, receipts, revenue by product"
    ]);
  }

  // Support ops (tickets)
  if (has('ticket','zendesk','helpdesk','support','sla')){
    return bullets([
      "Trigger: New ticket (e-mail/chat/web form)",
      "Classify intent & priority; detect sentiment and VIPs",
      "Retrieve policy/KB snippets; draft reply with citations",
      "If confidence low → escalate to human with context",
      "SLA watch: reminders before breach; auto-close on resolution",
      "Weekly QA: random sample for tone & accuracy"
    ]);
  }

  // Generic fallback
  return bullets([
    "Trigger received → validate payload",
    "Branch by rules → call external APIs",
    "Handle errors/retries → persist run history",
    "Notify Slack/E-mail → emit webhooks",
    "Weekly summary of runs, failures and SLAs"
  ]);
}

function bullets(lines){
  return "Here’s a draft blueprint:\n• " + lines.join("\n• ");
}

export default function automationBot(message){
  const idea = (message||'').trim();
  if(!idea) return "Tell me what you’d like to automate — I’ll propose a clean, step-by-step workflow you can run today.";
  return plan(idea);
}
