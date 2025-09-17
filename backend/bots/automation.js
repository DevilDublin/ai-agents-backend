import { chat } from "../openaiClient.js";

const sessions = new Map();

export default async function automationBot(message, sessionId = "guest") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      { role: "system", content: `
You are an automation planner. 
When the user describes a process, respond with a clear, step-by-step workflow they could implement today. 
You can answer one or two general questions, but if the user keeps going off-topic, remind them firmly that your main role is creating automation blueprints. 
Style: practical, concise, British English.
` }
    ]);
  }

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: message });

  const reply = await chat(history, { temperature: 0.4 });
  history.push({ role: "assistant", content: reply });

  return reply;
}
