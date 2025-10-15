window.Voice = (function () {
  let rec = null;
  let active = false;
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
  function typeGhost(ghostEl, text) {
    if (!ghostEl) return;
    let i = 0;
    ghostEl.textContent = "";
    function step() {
      if (i > text.length) return;
      ghostEl.textContent = text.slice(0, i);
      i += 1;
      if (active) requestAnimationFrame(step);
    }
    step();
  }
  function attach(root) {
    const mic = root.querySelector(".mic");
    const input = root.querySelector("#dlg-input");
    let ghost = root.querySelector(".ghost");
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.className = "ghost";
      root.appendChild(ghost);
    }
    const r = ensure();
    function stop() {
      if (!active) return;
      active = false;
      mic.setAttribute("aria-pressed", "false");
      ghost.textContent = "";
      if (r) r.stop();
    }
    function start() {
      if (!r) return;
      active = true;
      mic.setAttribute("aria-pressed", "true");
      r.start();
    }
    if (r) {
      r.onresult = (e) => {
        let final = "";
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const str = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += str;
          else interim += str;
        }
        const out = (final + " " + interim).trim();
        typeGhost(ghost, out);
        input.value = out;
      };
      r.onend = () => {
        if (active) r.start();
      };
    }
    mic.onclick = () => {
      if (active) stop();
      else start();
    };
    return { stop, start };
  }
  return { attach };
})();
