(() => {
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const copy={
    flow:["Connect forms → calendar → email.","Drag nodes, publish, done."],
    insight:["Upload a CSV. Get clear actions.","Spot anomalies instantly."],
    voice:["Voice Agent requires a live demo."],
    docs:["Pull clauses, dates and risks."],
    persona:["Keep tone on-brand across channels."],
    research:["Trusted sources. Summaries that stick."],
    designer:["Logos and micro-assets that match."],
    audit:["We’ll audit with you on a call."],
    secure:["Policy checks and GDPR guardrails."],
    draft:["Proposals and specs ready to send."]
  };

  const modal=$("#modal"),title=$("#modalTitle"),text=$("#modalText"),close=$("#modalClose"),cycle=$("#modalCycle");
  const openLive=(k)=>{let list=copy[k]||["Preview"];let i=0;title.textContent=$(`[data-key="${k}"] h3`).textContent;text.textContent=list[i];modal.classList.add("show");cycle.onclick=()=>{i=(i+1)%list.length;text.textContent=list[i]}};
  const goBook=()=>location.href="contact.html#demo";

  $$(".suite .tile").forEach(t=>{
    t.addEventListener("click",()=>{ const mode=t.dataset.mode; const k=t.dataset.key; if(mode==="live") openLive(k); else goBook(); });
  });

  close?.addEventListener("click",()=>modal.classList.remove("show"));
  modal?.addEventListener("click",e=>{ if(e.target===modal) modal.classList.remove("show"); });
})();
