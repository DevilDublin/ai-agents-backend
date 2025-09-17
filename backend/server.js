import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

// Bot personalities
const prompts = {
  insurance: "You are a car insurance assistant. Only answer questions about car insurance (policies, cover types, no-claims, excess, quotes, claims, renewals). If asked anything else, reply: 'Sorry, I can only help with car insurance. Let’s get back on track.'",
  realestate: "You are a property assistant. Only answer questions about buying, selling, renting, or property viewings. If asked anything else, reply: 'I’m focused on property queries. Let’s get back on track.'",
  linkedin: "You are a LinkedIn content assistant. Only answer questions about posting, content strategy, engagement, or profile optimisation. If asked anything else, reply: 'I can only help with LinkedIn content and strategy. Let’s get back on track.'"
};

app.post("/chat", async (req, res) => {
  try {
    const { message, bot = "insurance" } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    const systemPrompt = prompts[bot] || "You are a helpful assistant.";

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.2
      })
    });

const data = await r.json();

// Log full response to Render logs for debugging
console.log("OpenAI response:", JSON.stringify(data, null, 2));

if (!r.ok) {
  return res.status(r.status).json({ error: data });
}

const reply = data.choices?.[0]?.message?.content || "⚠️ No content from OpenAI";
res.json({ reply, bot });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bot server running on port " + PORT));

app.get("/chat", (req, res) => {
  res.send("Chat endpoint is running. Please use POST requests.");
});

// Health check for root URL
app.get("/", (req, res) => {
  res.send("✅ AI Agents backend is running. Use POST /chat to talk to the bot.");
});

