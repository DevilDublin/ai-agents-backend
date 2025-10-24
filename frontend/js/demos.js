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
        appointly: "Hi. I can book Thursday 2pm or Friday 10am. What suits you?",
        realestate: "This 2-bed has south-facing windows and is available from 12 December.",
        insurance: "Please share your policy number and a brief description of the incident."
      };
      out.textContent = "Preview:\n" + (replies[key] || "Coming soon.");
    });
  });
})();
