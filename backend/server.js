import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

// --- Conversation memory (simple per IP for demo) ---
const conversations = {};
function getSession(id) {
  if (!conversations[id]) conversations[id] = {};
  return conversations[id];
}

// --- Utility: call OpenAI ---
async function callOpenAI(messages, fallback = "Sorry, I didn’t catch that.") {
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3
      })
    });
    const data = await r.json();
    return data.choices?.[0]?.message?.content || fallback;
  } catch (err) {
    console.error("OpenAI error:", err);
    return fallback;
  }
}

// ------------------- SUPPORT QA BOT -------------------
async function supportBot(message) {
  const text = (message || "").trim().toLowerCase();
  if (!text) return "Hello — ask me about returns, shipping, warranty or support hours.";

  // Quick rule-based KB
  if (text.includes("return") || text.includes("refund") || text.includes("exchange"))
    return "Our returns policy allows returns within 30 days if unused and in original packaging. Refunds are processed within 5–7 working days.";
  if (text.includes("shipping") || text.includes("delivery") || text.includes("courier"))
    return "Expedited shipping: 2–3 working days. Standard shipping: 4–6 working days.";
  if (text.includes("hours") || text.includes("support"))
    return "Support is available Mon–Fri, 09:00–18:00 GMT. Weekend coverage is e-mail only for urgent issues.";
  if (text.includes("warranty") || text.includes("guarantee"))
    return "We provide a 12-month limited warranty covering manufacturing defects. Please open a ticket with your order details.";

  // Otherwise use LLM fallback
  return await callOpenAI([
    { role: "system", content: "You are a retail/customer support assistant. If unsure, say you don’t know and offer human handoff." },
    { role: "user", content: message }
  ], "I couldn’t find that in our documents. Would you like me to connect you with a human agent?");
}

// ------------------- APPOINTMENT BOT -------------------
const apptSessions = new Map();
function getApptSession(id) {
  if (!apptSessions.has(id)) {
    apptSessions.set(id, { budget: null, time: null, email: null, step: "collect" });
  }
  return apptSessions.get(id);
}
async function appointmentBot(message, sessionId) {
  const msg = (message || "").trim();
  const s = getApptSession(sessionId);

  // Regex helpers
  const email = msg.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const budget = msg.match(/(?:£|\$|€)?\s?\d+(?:k|K)?/)?.[0];
  const time = msg.match(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|next week|morning|afternoon|evening)\b/i)?.[0];

  if (email && !s.email) s.email = email;
  if (budget && !s.budget) s.budget = budget;
  if (time && !s.time) s.time = time;

  if (!s.budget) return "What’s your budget or target scope to start with?";
  if (!s.time) return "When would you like to meet?";
  if (!s.email) return "What’s the best e-mail for the invite?";

  if (s.step === "collect") {
    s.step = "confirm";
    return `Thanks — I’ve got budget ${s.budget}, timing ${s.time}, and e-mail ${s.email}. Shall I book a 30-minute intro call next week? (yes/no)`;
  }

  if (/^y(es)?|ok|sure/i.test(msg)) {
    s.step = "done";
    return `All set! I’ve pencilled a 30-minute introduction and sent a placeholder invite to ${s.email}.`;
  }
  if (/^no|later|not now/i.test(msg)) {
    s.step = "collect";
    return "No worries — share a preferred day/time and I’ll propose alternatives.";
  }

  return await callOpenAI([
    { role: "system", content: "You are an appointment-setting assistant. Be helpful but always try to move towards budget, time, and e-mail." },
    { role: "user", content: message }
  ]);
}

// ------------------- AUTOMATION BOT -------------------
async function automationBot(message) {
  const text = (message || "").toLowerCase();
  if (!message) return "Tell me what you’d like to automate — I’ll propose a workflow.";

  if (text.includes("insurance") || text.includes("policy"))
    return "Here’s a draft insurance workflow:\n• Trigger: new quote request\n• Collect risk questions\n• Generate quote & email\n• Log to CRM\n• Send renewal reminders";

  if (text.includes("social") || text.includes("instagram") || text.includes("linkedin"))
    return "Here’s a draft social media workflow:\n• Collect monthly topics\n• Generate content calendar\n• Draft posts with hooks\n• Schedule & approve\n• Weekly engagement report";

  if (text.includes("shopify") || text.includes("cart"))
    return "Here’s a draft e-commerce workflow:\n• Trigger: cart/checkout events\n• Abandoned cart emails\n• Post-purchase cross-sell\n• Inventory alerts\n• Revenue summary";

  return await callOpenAI([
    { role: "system", content: "You design practical automation blueprints. Be concise, step-by-step." },
    { role: "user", content: message }
  ], "Could you share more detail about the workflow, tools, or triggers?");
}

// ------------------- ONPREM BOT -------------------
async function onpremBot(message) {
  const text = (message || "").toLowerCase();
  if (!message) return "Hello! Ask me an HR or Sales question; I’ll route it automatically.";

  if (text.includes("holiday") || text.includes("leave"))
    return "Holiday entitlement: 25 days annual leave plus UK bank holidays.";
  if (text.includes("benefit") || text.includes("pension"))
    return "Benefits include private health cover, 5% pension match, and a wellness stipend.";
  if (text.includes("promotion") || text.includes("review"))
    return "Promotions align with manager feedback and bi-annual reviews.";
  if (text.includes("pipeline") || text.includes("quota"))
    return "Sales pipeline: Prospect → Qualify → Proposal → Negotiation → Closed. Quotas are set quarterly.";

  return await callOpenAI([
    { role: "system", content: "You are an internal HR & Sales assistant. Answer with company policy if known; otherwise suggest handbook/manager." },
    { role: "user", content: message }
  ], "I couldn’t find that in our HR/Sales docs. Please check the handbook or ask your manager.");
}

// ------------------- MAIN ROUTE -------------------
app.post("/chat", async (req, res) => {
  const { message, bot } = req.body;
  if (!message || !bot) return res.status(400).json({ error: "Missing message or bot" });

  const sessionId = req.ip; // simple demo session key
  let reply;

  if (bot === "support-qa-bot") reply = await supportBot(message);
  else if (bot === "appointment-setter-bot") reply = await appointmentBot(message, sessionId);
  else if (bot === "custom-automation") reply = await automationBot(message);
  else if (bot === "onprem-chatbot") reply = await onpremBot(message);
  else reply = "Unknown bot.";

  res.json({ reply, bot });
});

// Root health check
app.get("/", (req, res) => {
  res.send("✅ AI Agents backend running. Use POST /chat with {message, bot}.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot server running on port " + PORT));
