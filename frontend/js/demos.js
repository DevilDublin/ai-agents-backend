// Glowing "Select Your Demo" + orbital pan (no libs)
(function () {
  function qs(sel) { return document.querySelector(sel); }

  function ensureButton() {
    let btn = document.getElementById('selectDemoBtn');
    if (!btn) {
      const host = qs('.demos-section') || document.body;
      btn = document.createElement('button');
      btn.id = 'selectDemoBtn';
      btn.textContent = 'Select Your Demo';
      btn.style.border = '2px solid var(--accent, #7b61ff)';
      btn.style.background = 'transparent';
      btn.style.padding = '14px 32px';
      btn.style.borderRadius = '12px';
      btn.style.color = 'var(--accent, #7b61ff)';
      btn.style.fontSize = '1.05rem';
      btn.style.boxShadow = '0 0 14px var(--accent, #7b61ff), inset 0 0 20px rgba(255,255,255,0.08)';
      btn.style.animation = 'zypherPulse 3s ease-in-out infinite';
      btn.style.margin = '24px 0';
      host.insertBefore(btn, host.firstChild.nextSibling);
      const style = document.createElement('style');
      style.textContent = '@keyframes zypherPulse{0%,100%{filter:drop-shadow(0 0 6px var(--accent))}50%{filter:drop-shadow(0 0 18px var(--accent))}}';
      document.head.appendChild(style);
    }
    return btn;
  }

  function buildOrbit() {
    let orbit = document.getElementById('orbitContainer');
    if (!orbit) {
      orbit = document.createElement('div');
      orbit.id = 'orbitContainer';
      const host = qs('.demos-section') || document.body;
      host.appendChild(orbit);
    }
    orbit.style.position = 'relative';
    orbit.style.width = '100%';
    orbit.style.maxWidth = '1100px';
    orbit.style.height = '420px';
    orbit.style.margin = '12px auto 0';
    orbit.style.perspective = '1000px';
    orbit.innerHTML = '';

    const stage = document.createElement('div');
    stage.style.position = 'absolute';
    stage.style.inset = '0';
    stage.style.transformStyle = 'preserve-3d';
    stage.style.transition = 'transform 900ms cubic-bezier(.2,.7,.1,1)';
    orbit.appendChild(stage);

    const names = [
      'Car Insurance',
      'Appointly',
      'Salon Booker',
      'Property Qualifier',
      'Support Triage',
      'Custom Bot'
    ];

    const panels = [];
    const radius = 380;
    const tilt = -10;

    for (let i = 0; i < names.length; i++) {
      const a = (i / names.length) * Math.PI * 2;
      const panel = document.createElement('button');
      panel.textContent = names[i];
      panel.setAttribute('data-bot', names[i]);
      panel.style.position = 'absolute';
      panel.style.left = '50%';
      panel.style.top = '50%';
      panel.style.transformStyle = 'preserve-3d';
      panel.style.transform = `rotateY(${(a * 180) / Math.PI}deg) translateZ(${radius}px) rotateX(${tilt}deg)`;
      panel.style.padding = '16px 22px';
      panel.style.borderRadius = '14px';
      panel.style.border = '1px solid rgba(255,255,255,.15)';
      panel.style.background = 'rgba(0,0,0,.35)';
      panel.style.backdropFilter = 'blur(8px)';
      panel.style.color = '#fff';
      panel.style.cursor = 'pointer';
      panel.style.boxShadow = '0 0 10px rgba(255,255,255,.08)';
      panel.style.transition = 'transform 350ms, box-shadow 350ms';
      panel.onmouseenter = () => (panel.style.boxShadow = '0 0 20px var(--accent)');
      panel.onmouseleave = () => (panel.style.boxShadow = '0 0 10px rgba(255,255,255,.08)');
      stage.appendChild(panel);
      panels.push(panel);
    }

    let idx = 0;
    function focus(n) {
      idx = (n + panels.length) % panels.length;
      const rot = (idx / panels.length) * -360;
      stage.style.transform = `rotateY(${rot}deg)`;
    }
    focus(0);

    orbit.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      focus(idx + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    orbit.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') focus(idx + 1);
      if (e.key === 'ArrowLeft') focus(idx - 1);
    });
    orbit.tabIndex = 0;

    panels.forEach((p) => {
      p.onclick = () => {
        const name = p.getAttribute('data-bot');
        const el = document.getElementById('userInput');
        if (el) el.value = `Open demo: ${name}`;
        const send = document.getElementById('sendBtn');
        if (send) send.click();
      };
    });

    return { orbit, stage, panels, focus };
  }

  function init() {
    const btn = ensureButton();
    let built = null;
    btn.addEventListener('mouseenter', () => { if (!built) built = buildOrbit(); });
    btn.addEventListener('click', () => { if (!built) built = buildOrbit(); });

    // hint text (only once)
    let hint = document.getElementById('orbitHint');
    if (!hint) {
      const host = document.querySelector('.demos-section') || document.body;
      hint = document.createElement('div');
      hint.id = 'orbitHint';
      hint.textContent = 'Hover or click the button, then scroll or use ← → to pan. Tap a tile to open that bot.';
      hint.style.opacity = '0.75';
      hint.style.fontSize = '0.95rem';
      hint.style.marginTop = '6px';
      host.insertBefore(hint, btn.nextSibling);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const onDemos = /demos/i.test(location.pathname) || document.querySelector('.demos-section');
    if (onDemos) init();
  });
})();
