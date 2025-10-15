(function () {
  const wrap = document.querySelector(".orbit-wrap");
  if (!wrap) return;
  const svg = document.getElementById("orbits") || (() => {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("id", "orbits");
    wrap.appendChild(s);
    return s;
  })();
  function sizeSvg() {
    const r = wrap.getBoundingClientRect();
    svg.setAttribute("width", r.width);
    svg.setAttribute("height", r.height);
  }
  sizeSvg();
  window.addEventListener("resize", sizeSvg);
  const cx = () => wrap.clientWidth / 2;
  const cy = () => wrap.clientHeight / 2;
  function circle(r, dashed) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    el.setAttribute("cx", cx());
    el.setAttribute("cy", cy());
    el.setAttribute("r", r);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "rgba(255,255,255,.08)");
    el.setAttribute("stroke-width", "1");
    if (dashed) el.setAttribute("stroke-dasharray", "6 8");
    svg.appendChild(el);
    return el;
  }
  function line(x1, y1, x2, y2) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    el.setAttribute("x1", x1);
    el.setAttribute("y1", y1);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute("stroke", "rgba(185,138,255,.55)");
    el.setAttribute("stroke-width", "2");
    el.setAttribute("stroke-linecap", "round");
    svg.appendChild(el);
    return el;
  }
  const radii = [Math.min(cx(), cy()) - 40, (Math.min(cx(), cy()) - 140), (Math.min(cx(), cy()) - 240)].sort((a,b)=>a-b);
  circle(radii[2], true);
  circle(radii[1], true);
  circle(radii[0], true);
  const crossX = line(20, cy(), wrap.clientWidth - 20, cy());
  crossX.setAttribute("stroke", "rgba(255,255,255,.06)");
  const crossY = line(cx(), 20, cx(), wrap.clientHeight - 20);
  crossY.setAttribute("stroke", "rgba(255,255,255,.06)");
  const centre = document.createElement("div");
  centre.className = "hex-centre";
  const glow = document.createElement("div");
  glow.className = "hex-glow";
  const hex = document.createElement("div");
  hex.className = "hex";
  const label = document.createElement("div");
  label.className = "centre-label";
  label.textContent = "Select your demo";
  centre.appendChild(glow);
  centre.appendChild(hex);
  centre.appendChild(label);
  wrap.appendChild(centre);
  function centrePos() {
    centre.style.left = cx() - 75 + "px";
    centre.style.top = cy() - 75 + "px";
  }
  centrePos();
  window.addEventListener("resize", centrePos);
  const positions = {
    top: (r) => [cx(), cy() - r],
    right: (r) => [cx() + r, cy()],
    left: (r) => [cx() - r, cy()],
    bottom: (r) => [cx(), cy() + r]
  };
  const tooltip = document.getElementById("orbit-tooltip") || (() => {
    const d = document.createElement("div");
    d.id = "orbit-tooltip";
    wrap.appendChild(d);
    return d;
  })();
  let hoverLine = null;
  function showTip(x, y, side, text, pillRect) {
    tooltip.style.display = "block";
    tooltip.textContent = text;
    const gap = 12;
    const tRect = tooltip.getBoundingClientRect();
    if (side === "left") {
      tooltip.style.left = pillRect.left - tRect.width - gap - wrap.getBoundingClientRect().left + "px";
      tooltip.style.top = pillRect.top + pillRect.height / 2 - tRect.height / 2 - wrap.getBoundingClientRect().top + "px";
    } else if (side === "right") {
      tooltip.style.left = pillRect.right + gap - wrap.getBoundingClientRect().left + "px";
      tooltip.style.top = pillRect.top + pillRect.height / 2 - tRect.height / 2 - wrap.getBoundingClientRect().top + "px";
    } else if (side === "top") {
      tooltip.style.left = pillRect.left + pillRect.width / 2 - tRect.width / 2 - wrap.getBoundingClientRect().left + "px";
      tooltip.style.top = pillRect.top - tRect.height - gap - wrap.getBoundingClientRect().top + "px";
    } else {
      tooltip.style.left = pillRect.left + pillRect.width / 2 - tRect.width / 2 - wrap.getBoundingClientRect().left + "px";
      tooltip.style.top = pillRect.bottom + gap - wrap.getBoundingClientRect().top + "px";
    }
    if (hoverLine) svg.removeChild(hoverLine);
    hoverLine = line(cx(), cy(), x, y);
  }
  function hideTip() {
    tooltip.style.display = "none";
    if (hoverLine) {
      svg.removeChild(hoverLine);
      hoverLine = null;
    }
  }
  function makePill(bot, r) {
    const pill = document.createElement("div");
    pill.className = "bot-pill " + bot.side;
    pill.textContent = bot.label;
    wrap.appendChild(pill);
    const [px, py] = positions[bot.side](r);
    const pr = pill.getBoundingClientRect();
    const pW = pr.width || 220;
    const pH = pr.height || 42;
    if (bot.side === "top") {
      pill.style.left = px - pW / 2 + "px";
      pill.style.top = py - pH - 24 + "px";
    } else if (bot.side === "bottom") {
      pill.style.left = px - pW / 2 + "px";
      pill.style.top = py + 24 + "px";
    } else if (bot.side === "left") {
      pill.style.left = px - pW - 28 + "px";
      pill.style.top = py - pH / 2 + "px";
    } else {
      pill.style.left = px + 28 + "px";
      pill.style.top = py - pH / 2 + "px";
    }
    pill.addEventListener("mouseenter", () => {
      const rect = pill.getBoundingClientRect();
      showTip(px, py, bot.side === "left" ? "left" : bot.side === "right" ? "right" : bot.side === "top" ? "top" : "bottom", bot.tip, rect);
    });
    pill.addEventListener("mouseleave", hideTip);
    pill.addEventListener("click", () => openDialog(bot));
  }
  CONFIG.bots.forEach((b, i) => makePill(b, radii[1]));
  function openDialog(bot) {
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = `
        <div class="dialog">
          <div class="dialog-head">
            <div>
              <div class="title"></div>
              <div class="subtitle">Hover to connect. Click to chat. Pause on a prompt to paste it.</div>
            </div>
            <button class="close-btn">Close</button>
          </div>
          <div class="dialog-body">
            <div class="examples"></div>
            <div class="chat"></div>
            <div class="input-wrap">
              <input id="dlg-input" type="text" placeholder="Type your message..." />
              <button type="button" class="mic" aria-pressed="false">🎤</button>
              <button id="dlg-send" class="btn primary">Send</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    const title = overlay.querySelector(".title");
    const ex = overlay.querySelector(".examples");
    const chat = overlay.querySelector(".chat");
    const input = overlay.querySelector("#dlg-input");
    const send = overlay.querySelector("#dlg-send");
    const close = overlay.querySelector(".close-btn");
    overlay.style.display = "flex";
    title.textContent = bot.label;
    ex.innerHTML = "";
    bot.examples.forEach(t => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.textContent = t;
      chip.onclick = () => {
        input.value = t;
        input.focus();
      };
      ex.appendChild(chip);
    });
    chat.innerHTML = "";
    addBubble(chat, bot.intro, false, true);
    const voice = Voice.attach(overlay.querySelector(".input-wrap"));
    close.onclick = () => {
      overlay.style.display = "none";
    };
    send.onclick = () => {
      if (!input.value.trim()) return;
      addBubble(chat, input.value.trim(), true);
      input.value = "";
      voice && voice.stop && voice.stop();
    };
  }
  function addBubble(chat, text, me, intro) {
    const b = document.createElement("div");
    b.className = "bubble" + (me ? " me" : "") + (intro ? " intro" : "");
    b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }
})();
