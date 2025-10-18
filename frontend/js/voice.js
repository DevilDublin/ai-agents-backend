// Mic → Speech-to-Text → auto-send on pause
(function () {
  const mic = () => document.getElementById('micBtn');
  const input = () => document.getElementById('userInput');
  const send = () => document.getElementById('sendBtn');

  function init() {
    const m = mic(), i = input(), s = send();
    if (!m || !i || !s) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const r = new SR();
    r.lang = 'en-GB';
    r.continuous = false;
    r.interimResults = true;

    m.addEventListener('click', () => { r.start(); m.classList.add('listening'); });

    r.onresult = (e) => {
      let finalTxt = '';
      for (let j = e.resultIndex; j < e.results.length; j++) {
        finalTxt += e.results[j][0].transcript;
      }
      i.value = finalTxt.trim();
    };

    r.onend = () => {
      m.classList.remove('listening');
      if (i.value.trim()) s.click();
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();
