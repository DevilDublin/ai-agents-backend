// Minimal demo previews (no backend required). Swap with your endpoints later.
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $$(".grid .card .btn.flat").forEach(btn => {
    btn.addEventListener("click", async () => {
      const key = btn.dataset.demo;
      const out = $("#out-" + key);
      out.textContent = "Loading preview…";
      await new Promise(r => setTimeout(r, 500));
      const replies = {
        appointly: "Hi! I can book a slot this Thursday at 2pm or Friday at 10am. What works best?",
        realestate: "This 2-bed flat has south-facing windows and is available from 12 December.",
        insurance: "Please share your policy number and a brief note on the incident to start your claim."
      };
      out.textContent = "Preview:\n" + (replies[key] || "Coming soon.");
    });
  });
})();
