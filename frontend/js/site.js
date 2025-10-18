// === keep your existing code; only add this after the nav is built ===
(() => {
  const themeWrap = document.querySelector('[data-theme-toggle]');
  if (themeWrap && !themeWrap.classList.contains('nav-theme')) {
    themeWrap.classList.add('nav-theme');
    // Make sure the label element exists & matches font
    const span = themeWrap.querySelector('.label') || (() => {
      const s = document.createElement('span'); s.className = 'label'; themeWrap.prepend(s); return s;
    })();
    span.textContent = 'Theme';
  }
})();
