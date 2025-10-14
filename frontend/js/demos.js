/* === Orbit drawing, placement, hover tips, and modal === */

const tips = {
  appt: "Books qualified meetings straight into your calendar.",
  internal: "Answers HR and Sales questions clearly from your docs.",
  support: "Helps with returns, delivery and warranty.",
  planner: "Designs an automation plan from your brief."
};

const promptSets = {
  appt: [
    "Hello, I'd like a 30-minute intro next week. Budget is £2k per month.",
    "Could you do Tuesday 2–4pm?",
    "Use alex@example.com for the invite."
  ],
  support: ["Nuanced returns", "Shipping speed", "Weekend hours"],
  internal: ["Holiday policy summary", "New-starter checklist", "Quarterly targets"],
  planner: ["Connect CRM to Slack when cases close", "Weekly data export to Sheets", "Onboarding workflow"]
};

// SVG rings
const svg = document.getElementById("orbits");
const size = 800;
svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
const centre = size / 2;

[170, 260, 350].forEach(r => {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", centre);
  c.setAttribute("cy", centre);
  c.setAttribute("r", r);
  c.setAttribute("fill", "none");
  c.setAttribute("stroke", "rgba(255,255,255,.12)");
  c.setAttribute("stroke-dasharray", "8 10");
  svg.appendChild(c);
});

// place pills exactly on cardinal points
const wrap = document.querySelector(".orbit-wrap");
const place = () => {
  const rect = wrap.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const radius = Math.min(rect.width, rect.height) * 0.32;

  const pos = (angle) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  });

  const top = document.querySelector(".bot-pill.top");
  const right = document.querySelector(".bot-pill.right");
  const bottom = document.querySelector(".bot-pill.bottom");
  const left = document.querySelector(".bot-pill.left");

  const t = pos(-Math.PI/2), r = pos(0), b = pos(Math.PI/2), l = pos(Math.PI);
  top.style.left   = `${t.x - top.offsetWidth/2}px`;
  top.style.top    = `${t.y - top.offsetHeight - 22}px`;

  right.style.left = `${r.x + 22}px`;
  right.style.top  = `${r.y - right.offsetHeight/2}px`;

  bottom.style.left= `${b.x - bottom.offsetWidth/2}px`;
  bottom.style.top = `${b.y + 22}px`;

  left.style.left  = `${l.x - left.offsetWidth - 22}px`;
  left.style.top   = `${l.y - left.offsetHeight/2}px`;
};
window.addEventListener("resize", place);
window.addEventListener("load", place);

// tooltips
const tooltip = document.getElementById("orbit-tooltip");
document.querySelectorAll(".bot-pill").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    const key = btn.dataset.bot;
    tooltip.textContent = tips[key];
    tooltip.style.display = "block";
    // place beside, not over
    const r = btn.getBoundingClientRect();
    const wrapR = wrap.getBoundingClientRect();
    const pos = btn.dataset.tipPos;
    const pad = 10;

    let x = r.left - wrapR.left;
    let y = r.top  - wrapR.top;

    if (pos === "left")  { x -= tooltip.offsetWidth + pad; y += (r.height-tooltip.offsetHeight)/2; }
    if (pos === "right") { x += r.width + pad;            y += (r.height-tooltip.offsetHeight)/2; }
    if (pos === "top")   { x += (r.width-tooltip.offsetWidth)/2; y -= tooltip.offsetHeight + pad; }
    if (pos === "bottom"){ x += (r.width-tooltip.offsetWidth)/2; y += r.height + pad; }

    tooltip.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
});

// centre label always centred within hex
const centreLabel = document.querySelector(".centre-label");
const hexCentre = document.getElementById("hex-centre");
const centreAlign = () => {
  const r = hexCentre.getBoundingClientRect();
  centreLabel.style.left = "50%";
  centreLabel.style.transform = "translateX(-50%)";
};
window.addEventListener("resize", centreAlign);
window.addEventListener("load", centreAlign);

/* ==== Modal Chat ==== */
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("dlg-close");
const chipsWrap = document.getElementById("chips");
const chat = document.getElementById("chat");
const input = document.getElementById("dlg-input");
const send = document.getElementById("dlg-send");

let currentBot = null;

const openChat = (key, title) => {
  currentBot = key;
  document.getElementById("dlg-title").textContent = title;
  chipsWrap.innerHTML = "";
  (promptSets[key] || []).forEach(txt => {
    const c = document.createElement("button");
    c.className = "chip";
    c.textContent = txt;
    c.addEventListener("click", () => {
      input.value = txt;
      input.focus();
    });
    chipsWrap.appendChild(c);
  });

  chat.innerHTML = "";
  addBubble("Hi — ask me about " + title.toLowerCase() + ".", "bot");
  overlay.style.display = "flex";
  input.focus();
};

document.querySelectorAll(".bot-pill").forEach(b =>
  b.addEventListener("click", () => openChat(b.dataset.bot, b.textContent))
);

closeBtn.addEventListener("click", () => { overlay.style.display = "none"; stopMic(); });

function addBubble(text, who="bot"){
  const b = document.createElement("div");
  b.className = "bubble" + (who === "me" ? " me" : "");
  b.textContent = text;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

send.addEventListener("click", () => {
  const val = input.value.trim() || ghostText;
  if(!val) return;
  addBubble(val, "me");
  input.value = "";
  stopMic(true);           // turn off mic on send
  ghostWrite("");          // clear ghost
  // demo reply
  setTimeout(()=> addBubble("Thanks — this is a demo reply for “" + currentBot + "”.", "bot"), 500);
});
