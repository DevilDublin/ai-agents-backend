// Voice module: mic control, ghost typing, and auto-send after silence
window.Voice = (function () {
  let rec = null;

  function ensure() {
    if (rec) return rec;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    rec = new SR();
    rec.lang = "en-GB";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  }

  function typeGhost(el, text, guard) {
    if (!el) return;
    let i = 0;
    el.textContent = "";
    function step() {
      if (!guard.active) return;
      if (i > text.length) return;
      el.textContent = text.slice(0, i);
      i += 1;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function attach(root, opts = {}) {
    const mic   = root.querySelector(".mic");
    const input = root.querySelector("#dlg-input");
    const send  = root.querySelector("#dlg-send");
    let ghost = root.querySelector(".ghost");
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.className = "ghost";
      root.appendChild(ghost);
    }

    const r = ensure();
    const guard = { active:false };
    let silenceTimer = null;
    const silenceMs = Math.max(1500, +opts.silenceMs || 3600);

    function clearSilence() {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    }
    function armSilence() {
      clearSilence();
      silenceTimer = setTimeout(() => {
        if (!guard.active) return;
        const text = (input.value || "").trim();
        if (text) {
          if (typeof opts.onAutoSend === "function") {
            opts.onAutoSend(text);
          }
        }
        stop();
      }, silenceMs);
    }

    function stop() {
      if (!guard.active) return;
      guard.active = false;
      mic.setAttribute("aria-pressed", "false");
      ghost.textContent = "";
      clearSilence();
      if (r) r.stop();
    }

    function start() {
      if (!r) return;
      guard.active = true;
      mic.setAttribute("aria-pressed", "true");
      try { r.start(); } catch {}
    }

    if (r) {
      r.onresult = (e) => {
        let final = "";
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t;
          else interim += t;
        }
        const out = (final + " " + interim).trim();
        input.value = out;
        if (out) typeGhost(ghost, out, guard);
        armSilence();
      };
      r.onend = () => {
        if (guard.active) {
          try { r.start(); } catch {}
        }
      };
      r.onerror = () => { stop(); };
    }

    mic.addEventListener("click", () => (guard.active ? stop() : start()));

    if (send) {
      send.addEventListener("click", () => stop());
    }

    input.addEventListener("input", () => { ghost.textContent = ""; });

    return { start, stop };
  }

  return { attach };
})();
