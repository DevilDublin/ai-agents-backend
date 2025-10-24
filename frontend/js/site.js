(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $$(".transition-link").forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
  addEventListener("load", () => setTimeout(() => document.body.classList.remove("page-enter"), 350));

  $("#scrollExplore")?.addEventListener("click", () => {
    $("#analytics")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const nums = $$(".metric-num");
  if (nums.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        const target = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const start = performance.now(), dur = 1200 + Math.random()*600;
        const ease = k => (k<.5 ? 2*k*k : -1+(4-2*k)*k);
        function tick(t) {
          const k = Math.min(1,(t-start)/dur);
          el.textContent = (target*ease(k)).toFixed(decimals);
          if (k<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold:.35 });
    nums.forEach(n => io.observe(n));
  }

  const reveals = $$(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold:.2 });
    reveals.forEach(el => io.observe(el));
  }

  const chip = $("#voiceChip"), btn = $("#chipBtn");
  if (chip && btn) {
    btn.addEventListener("click", () => chip.classList.toggle("open"));
  }
})();
