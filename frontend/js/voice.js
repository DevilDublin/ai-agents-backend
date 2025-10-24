(() => {
  const f=document.getElementById("contactForm"); if(!f) return;
  const s=document.getElementById("formStatus");
  f.addEventListener("submit",async e=>{
    e.preventDefault();
    s.textContent="Sending…";
    await new Promise(r=>setTimeout(r,650));
    s.textContent="Thanks. We’ll be in touch within one business day.";
    f.reset();
  });
})();
