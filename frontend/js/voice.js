// voice.js — speech-to-text integration
export const initVoice = () => {
  const micBtn = document.getElementById('micBtn');
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  if (!micBtn || !input || !sendBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-GB';
  recognition.interimResults = true;

  micBtn.addEventListener('click', () => {
    recognition.start();
    micBtn.classList.add('listening');
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
  };

  recognition.onend = () => {
    micBtn.classList.remove('listening');
    if (input.value.trim()) sendBtn.click();
  };
};
