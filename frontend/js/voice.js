const Voice = (() => {
  let enabled = false;
  let voice = null;

  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    const maleGB = voices.find(v => v.lang === "en-GB" && /male|daniel|george|english uk/i.test(v.name)) || voices.find(v => v.lang === "en-GB");
    voice = maleGB || null;
  }

  function speak(text) {
    if (!enabled || !text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 1;
    u.pitch = 1.05;
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  function setEnabled(on) {
    enabled = !!on;
  }

  function isEnabled() { return enabled; }

  if (typeof window !== "undefined") {
    window.speechSynthesis.onvoiceschanged = () => pickVoice();
    setTimeout(() => pickVoice(), 300);
  }

  return { speak, setEnabled, isEnabled, pickVoice };
})();

window.Voice = Voice;
