import express from "express";
import cors from "cors";

import appointmentBot from "./bots/appointment.js";
import supportBot from "./bots/support.js";
import automationBot from "./bots/automation.js";
import internalBot from "./bots/internal.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ AI Agents backend is running. Endpoints: /appointment, /support, /automation, /internal");
});

app.post("/appointment", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const reply = await appointmentBot(message, sessionId);
    res.json({ reply, bot: "appointment" });
  } catch (err) {
    console.error("Appointment bot error:", err);
    res.status(500).json({ error: "Bot failed" });
  }
});

app.post("/support", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const reply = await supportBot(message, sessionId);
    res.json({ reply, bot: "support" });
  } catch (err) {
    console.error("Support bot error:", err);
    res.status(500).json({ error: "Bot failed" });
  }
});

app.post("/automation", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const reply = await automationBot(message, sessionId);
    res.json({ reply, bot: "automation" });
  } catch (err) {
    console.error("Automation bot error:", err);
    res.status(500).json({ error: "Bot failed" });
  }
});

app.post("/internal", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    const reply = await internalBot(message, sessionId);
    res.json({ reply, bot: "internal" });
  } catch (err) {
    console.error("Internal bot error:", err);
    res.status(500).json({ error: "Bot failed" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Bot server running on ${PORT}`);
});
