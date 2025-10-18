(function () {
  const track = () => document.getElementById('demoTrack');
  const prev = () => document.getElementById('demoPrev');
  const next = () => document.getElementById('demoNext');

  function openBot(name) {
    const input = document.getElementById('userInput');
    const send = document.getElementById('sendBtn');
    if (!input || !send) return alert(`Opening: ${name}`);
    input.value = `Open demo: ${name}`;
    send.click();
  }

  function init() {
    const t = track();
    if (!t) return;

    // Click on tiles → open bot
    t.addEventListener('click', (e) => {
      const tile = e.target.closest('.demo-tile');
      if (!tile) return;
      const name = tile.getAttribute('data-bot') || tile.textContent.trim();
      openBot(name);
    });

    // Arrows + scroll snapping
    const scrollBy = () => Math.round(t.clientWidth * 0.66);
    const p = prev(), n = next();
    if (p) p.addEventListener('click', () => t.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    if (n) n.addEventListener('click', () => t.scrollBy({ left:  scrollBy(), behavior: 'smooth' }));

    // Keyboard support
    t.tabIndex = 0;
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') t.scrollBy({ left:  scrollBy(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft')  t.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
