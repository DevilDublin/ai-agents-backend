const chipsByBot = {
  appointments: [
    "What’s the returns window?",
    "Do you ship to the UK?",
    "Are weekend deliveries available?"
  ],
  support: [
    "Where can I track my order?",
    "How do I reset my password?",
    "Can I change my delivery address?"
  ],
  internal: [
    "What’s the travel policy?",
    "Where’s the brand tone guide?",
    "How do I raise a purchase order?"
  ],
  automation: [
    "Can you plan a Slack → CRM handoff?",
    "Draft a Zap for inbound leads",
    "Show me the approval workflow"
  ]
};

const titles = {
  appointments: ["Appointment Setter", "Books meetings from website or email"],
  support: ["Support Q&A", "Answers from your policy and docs"],
  internal: ["Internal Knowledge", "Answers from your policy and docs"],
  automation: ["Automation Planner", "Plans automations and hands them to your stack"]
};

const orbit = document.getElementById("orbit");
const modal = document.getElementById("chatModal");
const closeBtn = document.getElementById("closeModal");
const msgs = document.getElementById("msgs");
const textInput = document.getElementById("textInput");
const interimBox = document.getElementById("interim");
const micBtn = document.getElementById("micBtn");
const sendBtn = document.getElementById("sendBtn");
const chipsWrap = document.getElementById("promptChips");
const titleEl = document.getElementById("modalTitle");
const descEl = document.getElementById("modalDesc");
const inputRow = document.getElementById("inputRow");

let currentBot = null;

/* open modal from chip click */
orbit.addEventListener("click", e => {
  const btn = e.target.closest(".demo-chip");
  if (!btn) return;
  const bot = btn.dataset.bot;
  currentBot = bot;

  titleEl.textContent = titles[bot][0];
  descEl.textContent = titles[bot][1];
  chipsWrap.innerHTML = "";
  chipsByBot[bot].forEach(t => {
    const b = document.createElement("button");
    b.textContent = t;
    b.addEventListener("click", () => textInput.value = t);
    chipsWrap.appendChild(b);
  });

  msgs.innerHTML = `
    <div class="bubble bot">Hi — ask me about ${titles[bot][0].toLowerCase()}.</div>
    <div class="bubble bot">Thanks — this is a static demo. In your build this would call the agent’s API.</div>
  `;
  textInput.value = "";
  interimBox.innerHTML = "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  textInput.focus();
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
});

/* sending helper */
function sendMessage(text) {
  if (!text.trim()) return;
  const me = document.createElement("div");
  me.className = "bubble user";
  me.textContent = text.trim();
  msgs.appendChild(me);
  msgs.scrollTop = msgs.scrollHeight;
  textInput.value = "";
  interimBox.innerHTML = "";
}

/* buttons */
sendBtn.addEventListener("click", () => sendMessage(textInput.value));
textInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage(textInput.value);
});

/* Speech recognition with interim typing + auto send after silence */
let recognition = null;
let silenceTimer = null;
let listening = false;

function supportsSpeech() {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

function startListening() {
  if (!supportsSpeech()) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "en-GB";
  recognition.interimResults = true;
  recognition.continuous = true;

  listening = true;
  micBtn.classList.add("active");
  inputRow.classList.add("listening");
  interimBox.innerHTML = "";
  textInput.value = "";

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += t + " ";
      else interimText += t;
    }
    if (interimText) {
      // animated interim
      interimBox.innerHTML = "";
      interimText.split("").forEach((ch, i) => {
        const span = document.createElement("span");
        span.style.animationDelay = `${i * 0.01}s`;
        span.textContent = ch;
        interimBox.appendChild(span);
      });
    } else {
      interimBox.innerHTML = "";
    }
    if (finalText) {
      textInput.value = (textInput.value + " " + finalText).trim();
    }
    resetSilenceTimer();
  };

  recognition.onend = () => {
    stopListening(false);
  };

  recognition.start();
  resetSilenceTimer();
}

function stopListening(cancelAutoSend) {
  try { recognition && recognition.stop(); } catch {}
  listening = false;
  micBtn.classList.remove("active");
  inputRow.classList.remove("listening");
  clearTimeout(silenceTimer);
  if (!cancelAutoSend && textInput.value.trim()) {
    sendMessage(textInput.value);
  }
}

function resetSilenceTimer() {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => stopListening(false), 3200); // ~3.2s quiet → send
}

micBtn.addEventListener("click", () => {
  if (listening) stopListening(true);
  else startListening();
});

/* click outside sheet closes modal */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
});
