import { chat } from "../openaiClient.js";

const sessions = new Map();

export default async function appointmentBot(message, sessionId = "guest") {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, [
      { role: "system", content: `
You are an appointment-setting assistant.
Your task is to collect three things: (1) budget, (2) preferred time, and (3) email address. 
Once you have all three, confirm and propose a 30-minute introduction call. 
You may politely answer one or two unrelated questions, but if the user asks too many, remind them firmly that your main role is scheduling meetings. 
Style: concise, friendly, British English.
` }
    ]);
  }

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: message });

  const reply = await chat(history, { temperature: 0.4 });
  history.push({ role: "assistant", content: reply });

  return reply;
}
