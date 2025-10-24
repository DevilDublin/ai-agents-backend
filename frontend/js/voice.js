(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending…";
    await new Promise(r => setTimeout(r, 700));
    status.textContent = "Thanks. We’ll be in touch within one business day.";
    form.reset();
  });
})();
