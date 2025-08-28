import OpenAI from "openai";

export const openai =
  process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function chat(messages, { model, temperature } = {}) {
  if (!openai) throw new Error("OPENAI_API_KEY not set");
  const m = model || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const t = temperature ?? 0.4;

  const resp = await openai.chat.completions.create({
    model: m,
    messages,
    temperature: t
  });

  return resp.choices?.[0]?.message?.content?.trim() || "";
}

// General helper to answer any question in concise British English
export async function generalAnswer(userText, systemHint) {
  const sys =
    (systemHint || "") +
    "\nStyle: concise, friendly, British English. Keep to 1–4 sentences.";
  return chat(
    [{ role: "system", content: sys }, { role: "user", content: userText }],
    { temperature: 0.3 }
  );
}

export const USE_LLM = (process.env.USE_LLM || "").toLowerCase() === "true";
