(function () {
  const KEY = 'zypher-accent-hue';
  const SPEED_KEY = 'zypher-theme-autoplay';
  let hue = parseInt(localStorage.getItem(KEY) || '260', 10);
  if (isNaN(hue)) hue = 260;
  let autoplay = localStorage.getItem(SPEED_KEY) === '1';

  const root = document.documentElement;
  const toggle = () => document.getElementById('colorToggle');

  function apply() {
    const color = `hsl(${hue}, 100%, 70%)`;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-strong', `hsla(${hue}, 100%, 70%, .45)`);
    const t = toggle();
    if (t) t.style.background = color;
  }

  function cycleTick() {
    if (!autoplay) return;
    hue = (hue + 1) % 360;
    localStorage.setItem(KEY, String(hue));
    apply();
    requestAnimationFrame(cycleTick);
  }

  function init() {
    apply();
    const t = toggle();
    if (!t) return;

    // left click = step, right click = toggle autoplay (press-and-hold feel)
    t.addEventListener('click', (e) => {
      e.preventDefault();
      autoplay = false;
      localStorage.setItem(SPEED_KEY, '0');
      hue = (hue + 40) % 360;
      localStorage.setItem(KEY, String(hue));
      apply();
    });
    t.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      autoplay = !autoplay;
      localStorage.setItem(SPEED_KEY, autoplay ? '1' : '0');
      if (autoplay) requestAnimationFrame(cycleTick);
    });

    // small tooltip
    t.title = 'Theme — click to change, right-click to auto-cycle';
    if (autoplay) requestAnimationFrame(cycleTick);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
