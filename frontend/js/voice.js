(function () {
  let recognition = null;
  let listening = false;

  function micBtn() { return document.querySelector("#micBtn"); }

  function supported() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }

  function ensureRecognition() {
    if (recognition) return recognition;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = (window.ZYPHER_CONFIG && window.ZYPHER_CONFIG.speechLocale) || "en-GB";
    recognition.continuous = false;
    recognition.interimResults = false;
    return recognition;
  }

  function glow(on) {
    const mic = micBtn();
    if (!mic) return;
    if (on) mic.classList.add("glow");
    else mic.classList.remove("glow");
  }

  function toggleMic() {
    const mic = micBtn();
    if (!mic) return;

    if (!supported()) {
      if (window.Demo && typeof window.Demo.addMsg === "function") {
        window.Demo.addMsg("bot", "Speech recognition isn’t supported in this browser.");
      }
      return;
    }

    const rec = ensureRecognition();

    if (!listening) {
      listening = true;
      glow(true);
      rec.start();

      rec.onresult = (e) => {
        const transcript = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "";
        // Hand off to demos.js to insert + send
        if (window.Demo && typeof window.Demo.setTranscriptAndSend === "function") {
          window.Demo.setTranscriptAndSend(transcript);
        }
      };

      rec.onerror = () => {
        listening = false;
        glow(false);
        if (window.Demo && typeof window.Demo.addMsg === "function") {
          window.Demo.addMsg("bot", "Sorry — I couldn’t hear that. Try again?");
        }
      };

      rec.onend = () => {
        // Auto-stop glow when user finishes talking
        listening = false;
        glow(false);
      };
    } else {
      rec.stop();
      listening = false;
      glow(false);
    }
  }

  function init() {
    const mic = micBtn();
    if (mic) mic.addEventListener("click", toggleMic);
  }

  // Expose if you prefer inline onclick
  window.toggleMic = toggleMic;

  document.addEventListener("DOMContentLoaded", init);
})();
