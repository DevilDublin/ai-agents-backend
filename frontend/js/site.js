(() => {
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  $$(".transition-link").forEach(a=>{
    a.addEventListener("click",e=>{
      const href=a.getAttribute("href")||"";
      if(href.startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(()=>{ location.href=href },140);
    });
  });

  addEventListener("load",()=>setTimeout(()=>document.body.classList.remove("page-enter"),220));

  const chip=$("#voiceFloat"),btn=$("#vfBtn");
  if(btn&&chip){ btn.addEventListener("click",()=>chip.classList.toggle("open")); }

  const vfText=$("#vfText");
  if(vfText){
    const msgs=["Book a demo and hear it live.","Real-time booking and triage.","Fits your stack: calendars, CRMs, email."];
    let i=0; setInterval(()=>{ i=(i+1)%msgs.length; vfText.textContent=msgs[i]; },2100);
  }
})();
