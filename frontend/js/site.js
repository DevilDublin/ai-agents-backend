// Zypher site interactions (British English, human readable)
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // Smooth page transitions
  $$(".transition-link").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) return; // allow same-page anchors
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
  addEventListener("load", () => setTimeout(() => document.body.classList.remove("page-enter"), 350));

  // Theme pill
  const order = ["theme-neo", "theme-green", "theme-cyan", "theme-purple"];
  const pill = $("#themePill");
  if (pill) {
    pill.addEventListener("click", () => {
      const cur = order.findIndex(c => document.body.classList.contains(c));
      document.body.classList.remove(...order);
      const next = order[(cur+1) % order.length];
      document.body.classList.add(next);
      try { sessionStorage.setItem("zypherTheme", next); } catch {}
    });
    try {
      const saved = sessionStorage.getItem("zypherTheme");
      if (saved) { document.body.classList.remove(...order); document.body.classList.add(saved); }
    } catch {}
  }

  // Animated text logo
  const logo = $("#logoType");
  if (logo && !logo.dataset.typed) {
    logo.dataset.typed = "1";
    const text = "Zypher AI";
    logo.textContent = "";
    let i = 0;
    const type = () => {
      logo.textContent += text[i++];
      if (i < text.length) setTimeout(type, 60);
      else logo.style.textShadow = "0 0 24px rgba(98,212,255,.35)";
    };
    setTimeout(type, 120);
  }

  // Explore scroll
  $("#scrollExplore")?.addEventListener("click", () => {
    $("#analytics")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Count-ups (start when visible)
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

  // Scroll reveals
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

  // Voice panel “peek” scroll
  const voicePeek = $("#voicePeek");
  const phone = $("#phoneObj");
  if (voicePeek && phone) {
    const open = () => {
      $("#voiceStage")?.scrollIntoView({ behavior: "smooth", block: "center" });
      phone.classList.add("pop"); setTimeout(()=>phone.classList.remove("pop"), 900);
    };
    voicePeek.addEventListener("click", open);
    voicePeek.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); open(); } });
  }

  // Floating phone widget
  const widget = $("#voiceWidget"), btn = $("#widgetBtn"), card = $("#widgetCard");
  if (widget && btn && card) {
    const toggle = () => widget.classList.toggle("open");
    btn.addEventListener("click", toggle);
    $("#widgetSee")?.addEventListener("click", () => {
      widget.classList.remove("open");
      $("#voiceStage")?.scrollIntoView({ behavior: "smooth", block: "center" });
      phone?.classList.add("pop"); setTimeout(()=>phone?.classList.remove("pop"), 900);
    });
  }
})();
