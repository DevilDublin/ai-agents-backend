import { chat } from "../openaiClient.js";

const sessions = new Map();

export default async function internalBot(message, sessionId = "guest") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      { role: "system", content: `
You are an internal knowledge assistant for HR and Sales. 
Answer questions about HR policies (holiday, expenses, promotions, equipment, etc.) or Sales processes (pipeline, quotas, pricing, NDAs, renewals, etc.). 
If unsure, politely suggest checking the handbook or manager. 
You may answer one or two unrelated questions, but if the user keeps going off-topic, remind them that your purpose is HR and Sales support. 
Style: professional, concise, British English.
` }
    ]);
  }

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: message });

  const reply = await chat(history, { temperature: 0.4 });
  history.push({ role: "assistant", content: reply });

  return reply;
}
