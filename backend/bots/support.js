import { chat } from "../openaiClient.js";

const sessions = new Map();

export default async function supportBot(message, sessionId = "guest") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      { role: "system", content: `
You are a retail/customer support assistant.
Answer questions about returns, shipping, warranty, or support hours. 
Escalate politely if the query requires a human agent. 
You may answer one or two general questions, but if the user keeps going off-topic, stop and remind them your main role is support. 
Style: concise, professional, British English.
` }
    ]);
  }

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: message });

  const reply = await chat(history, { temperature: 0.4 });
  history.push({ role: "assistant", content: reply });

  return reply;
}
