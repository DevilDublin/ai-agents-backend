let BACKEND = "";
setTimeout(() => (BACKEND = window.BACKEND_URL || ""), 0);

const wrap = document.getElementById("orbit-wrap");
const orbits = document.getElementById("orbits");
const ctx = orbits.getContext("2d");
const tooltip = document.getElementById("orbit-tooltip");

let W, H, t = 0, hoverIdx = -1, beamStart = 0, beamActive = false;
function size() {
  orbits.width = wrap.clientWidth;
  orbits.height = wrap.clientHeight;
  W = orbits.width; H = orbits.height;
}
addEventListener("resize", size);
size();

function metrics() {
  const base = Math.min(W, H);
  const outer = Math.max(320, base / 2 - 80);
  const mid = outer - 70;
  const inner = outer - 140;
  return { outer, mid, inner };
}
const centre = () => ({ x: W / 2, y: H / 2 });

const nodes = [
  { label: "Appointment Setter", key: "appointment", desc: "Schedules meetings and keeps conversations on track.", angle: -Math.PI / 2 },
  { label: "Support Q&A", key: "support", desc: "Helps customers with returns, shipping, and warranty.", angle: 0 },
  { label: "Automation Planner", key: "automation", desc: "Designs efficient, practical workflow blueprints.", angle: Math.PI / 2 },
  { label: "Internal Knowledge", key: "internal", desc: "Handles HR and Sales queries clearly and accurately.", angle: Math.PI }
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHoloCore(c, outer) {
  const pulse = 1 + Math.sin(t * 2) * 0.06;
  const glowR = Math.min(outer * 0.55, 120) * pulse;
  const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, glowR);
  g.addColorStop(0, "rgba(185,138,255,0.55)");
  g.addColorStop(0.6, "rgba(185,138,255,0.14)");
  g.addColorStop(1, "rgba(185,138,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c.x, c.y, glowR, 0, Math.PI * 2);
  ctx.fill();
  const hexR = Math.min(outer * 0.35, 95);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + 0.08 * Math.sin(t * 0.6);
    const x = c.x + Math.cos(a) * hexR;
    const y = c.y + Math.sin(a) * hexR;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.save();
  ctx.fillStyle = "#EDEBFF";
  ctx.font = '600 20px "Space Grotesk", Inter, system-ui';
  ctx.textAlign = "centre";
  ctx.textBaseline = "middle";
  ctx.fillText("Select your demo", c.x, c.y);
  ctx.restore();
}

function draw() {
  t += 0.016;
  ctx.clearRect(0, 0, W, H);
  const c = centre();
  const M = metrics();
  [M.inner, M.mid, M.outer].forEach((Rr, i) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, Rr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(185,138,255,${0.05 + i * 0.02})`;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  nodes.forEach(n => {
    n.r = M.outer;
    n.x = c.x + Math.cos(n.angle) * n.r;
    n.y = c.y + Math.sin(n.angle) * n.r;
  });
  if (hoverIdx > -1) {
    if (!beamActive) { beamActive = true; beamStart = performance.now(); }
    const n = nodes[hoverIdx];
    const elapsed = (performance.now() - beamStart) / 600;
    const len = Math.min(1, elapsed);
    const bx = c.x + (n.x - c.x) * len;
    const by = c.y + (n.y - c.y) * len;
    const grad = ctx.createLinearGradient(c.x, c.y, bx, by);
    grad.addColorStop(0, "rgba(185,138,255,0)");
    grad.addColorStop(1, "rgba(185,138,255,0.85)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(bx, by);
    ctx.stroke();
  } else beamActive = false;
  nodes.forEach((n, i) => {
    const dim = hoverIdx > -1 && hoverIdx !== i;
    ctx.globalAlpha = dim ? 0.5 : 1;
    ctx.fillStyle = dim ? "rgba(26,22,44,.55)" : "rgba(26,22,44,.9)";
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    roundRect(ctx, n.x - 120, n.y - 24, 240, 48, 14);
    ctx.fill(); ctx.stroke();
    ctx.globalAlpha = dim ? 0.6 : 1;
    ctx.fillStyle = "#ECECFF";
    ctx.font = "600 15px Inter, system-ui";
    ctx.textAlign = "centre";
    ctx.textBaseline = "middle";
    ctx.fillText(n.label, n.x, n.y);
    ctx.globalAlpha = 1;
  });
  drawHoloCore(c, M.outer);
  requestAnimationFrame(draw);
}
draw();

orbits.addEventListener("mousemove", e => {
  const rect = orbits.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  let idx = -1;
  nodes.forEach((n, i) => { if (Math.abs(mx - n.x) < 130 && Math.abs(my - n.y) < 34) idx = i; });
  hoverIdx = idx;
  tooltip.style.display = hoverIdx > -1 ? "block" : "none";
  if (hoverIdx > -1) {
    const n = nodes[hoverIdx];
    tooltip.textContent = n.desc;
    tooltip.style.left = (n.x + 16) + "px";
    tooltip.style.top = (n.y - 16) + "px";
  }
});
orbits.addEventListener("click", () => { if (hoverIdx > -1) openAgent(nodes[hoverIdx].key); });

const overlay = document.getElementById("overlay");
const dlgClose = document.getElementById("dlg-close");
const dlgTitle = document.getElementById("dlg-title");
const dlgChat = document.getElementById("dlg-chat");
const dlgInput = document.getElementById("dlg-input");
const dlgSend = document.getElementById("dlg-send");
const dlgExamples = document.getElementById("dlg-examples");

const intros = {
  appointment: "Hello there 👋 I can help arrange a meeting — just tell me your budget or when you’d like to meet.",
  support: "Hi, how can I help today? You can ask me about returns, delivery, or warranty information.",
  automation: "Hello! Tell me what you’d like to automate and I’ll outline a clean, step-by-step plan.",
  internal: "Hi! You can ask me HR or Sales-related questions and I’ll fetch the answer for you."
};

let current = null, sessionId = null;

function openAgent(key) {
  current = key;
  sessionId = "web-" + Math.random().toString(36).slice(2, 8);
  dlgTitle.textContent = ({ appointment: "Appointment Setter", support: "Support Q&A", automation: "Automation Planner", internal: "Internal Knowledge" })[key];
  dlgChat.innerHTML = "";
  dlgExamples.innerHTML = "";
  const intro = intros[key];
  bubble(dlgChat, intro);
  overlay.style.display = "flex";
  dlgInput.focus();
}

function closeDlg() { overlay.style.display = "none"; current = null; }
dlgClose.addEventListener("click", closeDlg);
overlay.addEventListener("click", e => { if (e.target === overlay) closeDlg(); });

function bubble(parent, text, me = false) {
  const div = document.createElement("div");
  div.className = "bubble" + (me ? " me" : "");
  div.innerHTML = text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
  if (!me) {
    const btn = document.createElement("button");
    btn.className = "voice-btn";
    btn.innerHTML = "🔊";
    btn.onclick = () => speakText(text);
    div.appendChild(btn);
  }
  parent.appendChild(div);
  parent.scrollTop = parent.scrollHeight;
}

function postJSON(url, body) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal })
    .then(async r => { clearTimeout(t); if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
}

function showThinking() {
  const think = document.createElement("div");
  think.className = "orbit-thinking";
  dlgChat.appendChild(think);
  dlgChat.scrollTop = dlgChat.scrollHeight;
  return think;
}

function sendMsg() {
  const msg = dlgInput.value.trim();
  if (!msg || !current) return;
  bubble(dlgChat, msg, true);
  dlgInput.value = "";
  const think = showThinking();
  const endpoints = { appointment: "/appointment", support: "/support", automation: "/automation", internal: "/internal" };
  setTimeout(() => {
    postJSON(`${BACKEND}${endpoints[current]}`, { message: msg, sessionId })
      .then(r => {
        think.remove();
        bubble(dlgChat, r.reply || "…");
      })
      .catch(() => {
        think.remove();
        bubble(dlgChat, "Sorry, I’m having trouble connecting at the moment.");
      });
  }, 800);
}
dlgSend.addEventListener("click", sendMsg);
dlgInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); sendMsg(); } });

function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-GB";
  utter.rate = 1;
  utter.pitch = 1.1;
  utter.volume = 1;
  const voices = speechSynthesis.getVoices();
  const brit = voices.find(v => v.lang.startsWith("en-GB"));
  if (brit) utter.voice = brit;
  speechSynthesis.speak(utter);
}
