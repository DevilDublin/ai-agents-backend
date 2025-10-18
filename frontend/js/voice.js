/* voice.js — Zypher
 * Minimal mic wiring + callbacks for the demos screen.
 * If you already connect to an STT backend, call the provided hooks.
 */

window.ZYPHER_VOICE = (() => {
  let handlers = { onStart: null, onFinal: null };

  const attach = (h) => {
    handlers = { ...handlers, ...h };
  };

  // Call these from your real recorder when you start/stop
  const _emitStart = () => handlers.onStart && handlers.onStart();
  const _emitFinal = (text) => handlers.onFinal && handlers.onFinal(text);

  // Demo-only mic (no real STT). Replace with your actual implementation.
  let demoListening = false;
  const demoStart = () => {
    if (demoListening) return;
    demoListening = true;
    _emitStart();
    // Fake a recognized utterance
    setTimeout(() => {
      if (!demoListening) return;
      const sample = [
        'get me a quick quote',
        'book me Friday 3pm',
        'i want to view a 2-bed',
        'connect me to an agent'
      ];
      const text = sample[Math.floor(Math.random() * sample.length)];
      _emitFinal(text);
      demoListening = false;
    }, 1400);
  };

  const demoStop = () => { demoListening = false; };

  return {
    attach,
    // If you have a real mic pipeline, wire to these:
    _emitStart, _emitFinal,
    // Fallback demo triggers used by demos.js mic button:
    demoStart, demoStop
  };
})();

