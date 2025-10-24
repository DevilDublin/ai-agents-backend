// Contact form handler (fake submit) – replace with real endpoint if needed.
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending…";
    await new Promise(r => setTimeout(r, 700)); // simulate a send
    status.textContent = "Thanks — we’ll be in touch within one business day.";
    form.reset();
  });
})();
