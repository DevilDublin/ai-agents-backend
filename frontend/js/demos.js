(() => {
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const previews = {
    flow: [
      `<div class="mock">
         <div class="bar">Flow • Draft</div>
         <div class="lane"><span class="node">Form</span><span class="pipe">→</span><span class="node">Calendar</span><span class="pipe">→</span><span class="node">Email</span></div>
         <button class="btn primary small" id="doRun">Run</button>
       </div>`,
      `<div class="mock"><div class="bar">Flow • Nodes</div><div class="lane"><span class="node">Webhook</span><span class="pipe">→</span><span class="node">CRM</span></div></div>`
    ],
    insight: [
      `<div class="mock"><div class="bar">Insight • CSV</div><p>Upload a CSV and we’ll narrate the trends.</p><button class="btn flat small" id="doAnalyse">Analyse sample</button></div>`
    ],
    docs: [
      `<div class="mock"><div class="bar">Docs • Extract</div><p>Clause • Date • Risk</p><button class="btn flat small">Open PDF</button></div>`
    ],
    persona: [
      `<div class="mock"><div class="bar">Persona</div><p>Choose tone: <button class="btn flat small">Warm</button> <button class="btn flat small">Direct</button></p></div>`
    ],
    research: [
      `<div class="mock"><div class="bar">Research</div><p>Summaries with sources.</p><button class="btn flat small">Show brief</button></div>`
    ],
    designer: [
      `<div class="mock"><div class="bar">Designer</div><p>Generate a palette from a keyword.</p><button class="btn flat small">Try “FinTech”</button></div>`
    ],
    draft: [
      `<div class="mock"><div class="bar">Draft</div><p>Create a proposal skeleton.</p><button class="btn flat small">Generate</button></div>`
    ]
  };

  const modal=$("#modal"), title=$("#modalTitle"), body=$("#modalBody"), close=$("#modalClose"), cycle=$("#modalCycle");
  let currentKey=null, idx=0;

  function openPreview(key){
    currentKey=key; idx=0;
    title.textContent=$(`[data-key="${key}"] h3`).textContent;
    body.innerHTML=previews[key][idx] || "<div class='mock'><p>Preview</p></div>";
    modal.classList.add("show");
  }
  function next(){
    if(!currentKey) return;
    const arr=previews[currentKey]; if(!arr) return;
    idx=(idx+1)%arr.length;
    body.innerHTML=arr[idx];
  }

  $$(".tile.live").forEach(el=>{
    el.addEventListener("click",()=>openPreview(el.dataset.key));
  });
  $$(".tile.book").forEach(el=>{
    el.addEventListener("click",()=>{ location.href="contact.html#demo"; });
  });

  cycle?.addEventListener("click",next);
  close?.addEventListener("click",()=>modal.classList.remove("show"));
  modal?.addEventListener("click",e=>{ if(e.target===modal) modal.classList.remove("show"); });
})();
