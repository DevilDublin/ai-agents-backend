(function () {
  // ---- Theme toggle ----
  function initThemeToggle() {
    const sel = document.querySelector("#themeSelect");
    if (!sel) return;

    sel.addEventListener("change", () => {
      document.documentElement.setAttribute("data-theme", sel.value);
      localStorage.setItem("zy_theme", sel.value);
    });

    const saved = localStorage.getItem("zy_theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      sel.value = saved;
    }
  }

  // Simple utility to safely add event listeners
  function on(el, evt, fn) {
    if (el) el.addEventListener(evt, fn);
  }

  // Expose small helpers if needed elsewhere
  window.Site = { on };

  document.addEventListener("DOMContentLoaded", initThemeToggle);
})();
