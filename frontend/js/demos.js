(function () {
  const state = {
    activeBot: null,
    bots: {
      appointly: { name: "Appointly (Generic Appointment Setter)", sys: "Concise UK appointment assistant." },
      realestate: { name: "Property Qualifier", sys: "Qualify buyers/sellers and book viewings." },
      salon: { name: "Salon Booker", sys: "Hair & beauty bookings, suggest add-ons." },
      carins: { name: "Car Insurance Quick-Qualifier", sys: "Pre-qualify drivers and schedule a consult." },
      support: { name: "Support Triage", sys: "Triage issues and route to KB/human." },
      guardrails: { name: "Off-topic Wrangler", sys: "Politely steer irrelevant queries back on task." }
    }
  };

  // ---------- DOM helpers ----------
  function qs(sel) { return document.querySelector(sel); }
  function show(el) { if (el) el.style.display = "block"; }
  function hide(el) { if (el) el.style.display = "none"; }

  // ---------- Chat helpers ----------
  function addMsg(role, text) {
    const msgs = qs(".msgs");
    if (!msgs) return;
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function fakeAIResponse(input) {
    const k = state.activeBot;
    const low = input.toLowerCase();

    if (k === "guardrails" && (low.includes("politics") || low.includes("weather") || low.includes("joke"))) {
      return "Let's park that for now — to help you quicker, what service do you need? I can book you in.";
    }
    if (k === "appointly" && low.includes("tuesday")) {
      return "I can offer Tue 10:00 or 14:30. Which works?";
    }
    if (k === "carins" && low.includes("quote")) {
      return "Quick check: name, DOB, licence type, any claims in last 3 years?";
    }
    if (k === "salon" && (low.includes("hair") || low.includes("cut"))) {
      return "We can do a Cut & Finish. Want to add a scalp treatment today?";
    }
    if (k === "support" && (low.includes("down") || low.includes("error"))) {
      return "I can create a ticket. What's your email and a short description?";
    }
    if (k === "realestate" && (low.includes("view") || low.includes("flat"))) {
      return "Great — are you looking to buy or rent, and what budget range?";
    }
    return "Got it. Tell me a bit more and I’ll guide you.";
  }

  function handleSend() {
    const input = qs("#chatInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    addMsg("user", text);
    input.value = "";
    // Simulated latency
    setTimeout(() => addMsg("bot", fakeAIResponse(text)), 400);
  }

  // Called by voice.js when speech ends
  function setTranscriptAndSend(text) {
    const input = qs("#chatInput");
    if (!input) return;
    input.value = text || "";
    if (input.value.trim()) handleSend();
  }

  // ---------- Orbit / Chat panel ----------
  function openChat(botKey) {
    state.activeBot = botKey;

    const orbit = qs(".orbit");
    const chatWrap = qs(".chat-wrap");
    const title = qs("#chatBotName");

    if (title) title.textContent = state.bots[botKey]?.name || "Bot";
    if (orbit) orbit.classList.add("hidden");
    show(chatWrap);

    const msgs = qs(".msgs");
    if (msgs) msgs.innerHTML = "";
    addMsg("bot", `Hi — I'm ${state.bots[botKey].name}. Ask me something or press the mic to speak.`);
  }

  function backToOrbit() {
    const orbit = qs(".orbit");
    const chatWrap = qs(".chat-wrap");
    if (orbit) orbit.classList.remove("hidden");
    hide(chatWrap);
  }

  // ---------- Init bindings ----------
  function init() {
    // Only run on demos page
    if (!qs(".orbit") && !qs(".chat")) return;

    const sendBtn = qs("#sendBtn");
    const input = qs("#chatInput");
    if (sendBtn) sendBtn.addEventListener("click", handleSend);
    if (input) input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }

  // Expose API for inline HTML handlers and voice.js
  window.Demo = {
    openChat, backToOrbit, handleSend, setTranscriptAndSend, addMsg
  };
  window.openChat = openChat;     // for onclick in HTML
  window.backToOrbit = backToOrbit;

  document.addEventListener("DOMContentLoaded", init);
})();
