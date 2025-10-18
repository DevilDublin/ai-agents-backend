(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Hide legacy items if present
    document.querySelectorAll('nav a, nav button, nav span').forEach(el => {
      const t=(el.textContent||'').trim().toLowerCase();
      if (t==='voice & chat'||t==='voice and chat'||t==='support') el.style.display='none';
    });
  });
})();
