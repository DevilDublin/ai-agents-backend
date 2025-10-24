/* Zypher AI — Site interactions (British English, human-readable) */

(function () {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // ---- Page transition (applies to all pages)
  $$(".transition-link").forEach(a => {
    a.addEventListener("click", (e) => {
      // Allow anchor-only scroll within the same page
      const href = a.getAttribute("href") || "";
      const isSamePageAnchor = href.startsWith("#");
      if (isSamePageAnchor) return;

      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

  // Remove enter class after load
  window.addEventListener("load", () => {
    setTimeout(() => document.body.classList.remove("page-enter"), 350);
  });

  // ---- Smooth scroll for "Explore" button
  const explore = $("#scrollExplore");
  if (explore) {
    explore.addEventListener("click", () => {
      $("#analytics")?.scrollIntoView({ behaviour: "smooth", block: "start" });
    });
  }

  // ---- Metrics count-up when visible
  const nums = $$(".metric-num");
  if (nums.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        const target = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const start = performance.now(), dur = 1200 + Math.random()*600;
        function tick(t) {
          const k = Math.min(1, (t - start) / dur);
          const eased = k<.5 ? 2*k*k : -1+(4-2*k)*k;
          const val = target * eased;
          el.textContent = val.toFixed(decimals);
          if (k < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: .3 });
    nums.forEach(n => io.observe(n));
  }

  // ---- Theme pill (cycles accent sets)
  const theme = $("#themePill");
  if (theme) {
    theme.addEventListener("click", () => {
      const order = ["theme-green", "theme-cyan", "theme-purple"];
      const cur = order.findIndex(cls => document.body.classList.contains(cls));
      document.body.classList.remove(...order);
      const next = order[(cur + 1) % order.length];
      document.body.classList.add(next);
      // Persist per tab
      try { sessionStorage.setItem("zypherTheme", next); } catch {}
    });
    // Load persisted theme
    try {
      const saved = sessionStorage.getItem("zypherTheme");
      if (saved) document.body.classList.add(saved);
      else document.body.classList.add("theme-green");
    } catch {
      document.body.classList.add("theme-green");
    }
  }

  // ---- Phone object interaction
  const voicePanel = $("#voicePanel");
  const phone = $("#phoneObj");
  if (voicePanel && phone) {
    const openStage = () => {
      phone.classList.add("pop");
      $("#voiceStage")?.scrollIntoView({ behaviour: "smooth", block: "center" });
      // brief pop effect
      setTimeout(() => phone.classList.remove("pop"), 900);
    };
    voicePanel.addEventListener("click", openStage);
    voicePanel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openStage(); }
    });
  }

  // ---- Animated text logo (lightweight type-on)
  const logo = $("#logoType");
  if (logo && !logo.dataset.typed) {
    logo.dataset.typed = "1";
    const text = "Zypher AI";
    let i = 0;
    const base = logo.textContent;
    logo.textContent = "";
    function type() {
      logo.textContent += text[i++];
      if (i < text.length) setTimeout(type, 60);
      else logo.style.textShadow = `0 0 24px rgba(31,226,154,.35)`;
    }
    setTimeout(type, 150);
  }
})();
