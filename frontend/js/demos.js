(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const copy = {
    flow: "Drag-and-drop flows that connect forms, calendars, email and CRMs.",
    insight: "Upload a CSV and get narrative insights with clear next steps.",
    voice: "A natural voice concierge that books and qualifies in real time.",
    docs: "Extract clauses, dates and risks from contracts and PDFs.",
    persona: "Consistent chat tone tuned to your brand’s personality.",
    research: "Fast briefs with sources and summaries you can trust.",
    designer: "Logo, palette and micro-assets generated to fit your niche.",
    audit: "Instant UX/SEO checks with accessible, actionable fixes.",
    secure: "Content checks for GDPR and compliance concerns.",
    draft: "Proposals, job specs and reports ready to send."
  };

  const modal = $("#modal"), title = $("#modalTitle"), text = $("#modalText");
  $("#modalClose")?.addEventListener("click", () => modal.classList.remove("show"));
  modal?.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

  $$(".suite .tile").forEach(card => {
    card.addEventListener("click", () => {
      const k = card.dataset.key;
      title.textContent = card.querySelector("h3").textContent;
      text.textContent = copy[k] || "Preview coming soon.";
      modal.classList.add("show");
    });
  });
})();
