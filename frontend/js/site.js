(function () {
  function cleanNav() {
    const items = Array.from(document.querySelectorAll('nav a, nav button, nav span'));
    items.forEach(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t === 'voice & chat' || t === 'voice and chat' || t === 'support') el.style.display = 'none';
    });
  }
  document.addEventListener('DOMContentLoaded', cleanNav);
})();
