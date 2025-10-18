// Colour changer (persists). Also exposes a tiny helper for accent access.
(function () {
  const KEY = 'zypher-accent-hue';
  const saved = parseInt(localStorage.getItem(KEY) || '260', 10);
  let hue = isNaN(saved) ? 260 : saved;

  function apply() {
    const color = `hsl(${hue}, 100%, 70%)`;
    document.documentElement.style.setProperty('--accent', color);
    const toggle = document.getElementById('colorToggle');
    if (toggle) toggle.style.background = color;
  }

  function ensureToggle() {
    if (document.getElementById('colorToggle')) return;
    const nav = document.querySelector('nav .nav-links') || document.querySelector('nav') || document.body;
    const div = document.createElement('div');
    div.id = 'colorToggle';
    div.style.width = '20px';
    div.style.height = '20px';
    div.style.borderRadius = '50%';
    div.style.marginLeft = '12px';
    div.style.cursor = 'pointer';
    nav.appendChild(div);
  }

  function init() {
    ensureToggle();
    apply();
    const t = document.getElementById('colorToggle');
    if (t) {
      t.onclick = () => {
        hue = (hue + 60) % 360;
        localStorage.setItem(KEY, String(hue));
        apply();
      };
    }
  }

  window.ZYPHER_THEME = { getHue: () => hue };
  document.addEventListener('DOMContentLoaded', init);
})();
