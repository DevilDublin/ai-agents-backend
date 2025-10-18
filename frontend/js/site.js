// Bootstraps theme, background, demos, and cleans nav
(function () {
  function removeTopRightExtras() {
    const links = Array.from(document.querySelectorAll('nav a, nav button, nav span'));
    links.forEach((el) => {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t === 'voice & chat' || t === 'support' || t === 'voice and chat') el.style.display = 'none';
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(() => {
    removeTopRightExtras();
  });
})();
