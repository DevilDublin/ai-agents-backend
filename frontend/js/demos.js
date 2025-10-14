/* ---------- Orbit UI, tooltips, and chat overlay ---------- */

(() => {
  const byId = (id) => document.getElementById(id);

  // Map DOM to CSS class names from main.css
  const orbit = document.querySelector('.orbit-wrap');
  if (!orbit) return; // not on demos page

  // Ensure centre hex structure matches CSS classes
  (function normaliseCentre() {
    let centre = orbit.querySelector('#orbit-centre, .hex-centre');
    if (!centre) {
      centre = document.createElement('div');
      centre.className = 'hex-centre';
      orbit.appendChild(centre);
    } else {
      centre.classList.add('hex-centre');
    }
    if (!centre.querySelector('.hex')) {
      const hex = document.createElement('div'); hex.className = 'hex';
      centre.appendChild(hex);
    }
    if (!centre.querySelector('.hex-glow')) {
      const g = document.createElement('div'); g.className = 'hex-glow';
      centre.appendChild(g);
    }
    let label = centre.querySelector('.centre-label, .label');
    if (!label) {
      label = document.createElement('div');
      centre.appendChild(label);
    }
    label.className = 'centre-label';
    label.textContent = 'Select your demo';
  })();

  // Align bot buttons to class expected in CSS
  const raw = orbit.querySelectorAll('.bot, .bot-pill');
  raw.forEach(btn => btn.classList.add('bot-pill'));

  // Tooltip
  const tip = byId('tooltip') || (() => {
    const t = document.createElement('div');
    t.id = 'orbit-tooltip';
    orbit.appendChild(t);
    return t;
  })();

  const showTip = (el, text, where) => {
    tip.textContent = text;
    tip.style.display = 'block';
    const r = el.getBoundingClientRect();
    const o = orbit.getBoundingClientRect();

    // place fully to the side/above/below by design
    const pad = 10;
    switch (where) {
      case 'left':
        tip.style.left = `${r.left - o.left - tip.offsetWidth - pad}px`;
        tip.style.top = `${r.top - o.top + r.height / 2 - tip.offsetHeight / 2}px`;
        break;
      case 'right':
        tip.style.left = `${r.right - o.left + pad}px`;
        tip.style.top = `${r.top - o.top + r.height / 2 - tip.offsetHeight / 2}px`;
        break;
      case 'top':
        tip.style.left = `${r.left - o.left + r.width / 2 - tip.offsetWidth / 2}px`;
        tip.style.top = `${r.top - o.top - tip.offsetHeight - pad}px`;
        break;
      default: // bottom
        tip.style.left = `${r.left - o.left + r.width / 2 - tip.offsetWidth / 2}px`;
        tip.style.top = `${r.bottom - o.top + pad}px`;
    }
  };
  const hideTip = () => { tip.style.display = 'none'; };

  // Hover lines “shoot” effect
  const ensureShoot = (btn) => {
    if (btn.querySelector('.shoot')) return;
    const s = document.createElement('span');
    s.className = 'shoot';
    s.style.position = 'absolute';
    s.style.pointerEvents = 'none';
    s.style.background = 'linear-gradient(90deg, rgba(185,138,255,.6), rgba(185,138,255,0))';
    s.style.height = '2px';
    s.style.opacity = '0';
    s.style.transition = 'transform .35s ease, opacity .2s';
    btn.appendChild(s);

    // place the shoot line exiting the pill towards centre.
    const place = () => {
      const rect = btn.getBoundingClientRect();
      const cen = orbit.getBoundingClientRect();
      const cx = cen.left + cen.width / 2;
      const cy = cen.top + cen.height / 2;
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;

      const angle = Math.atan2(cy - by, cx - bx); // towards centre
      const len = Math.min(120, Math.hypot(cx - bx, cy - by) - 80);

      s.style.left = `${rect.width / 2}px`;
      s.style.top = `${rect.height / 2}px`;
      s.style.transformOrigin = '0 0';
      s.style.width = `${Math.max(0, len)}px`;
      s.style.transform = `rotate(${angle}rad)`;
    };
    place();
    new ResizeObserver(place).observe(orbit);
    new ResizeObserver(place).observe(btn);

    btn.addEventListener('mouseenter', () => {
      s.style.opacity = '1';
      // extend a touch further each time
      s.style.transform += ' scaleX(1.15)';
    });
    btn.addEventListener('mouseleave', () => {
      s.style.opacity = '0';
      s.style.transform = s.style.transform.replace(' scaleX(1.15)', '');
    });
  };

  // Attach behaviour to each bot pill
  const openChat = (key) => {
    const data = APP.BOTS[key];
    if (!data) return;

    overlay.style.display = 'flex';
    chatTitle.textContent = data.title;
    prompts.innerHTML = '';
    data.prompts.forEach(p => {
      const c = document.createElement('button');
      c.className = 'chip';
      c.textContent = p;
      c.addEventListener('click', () => {
        input.value = p;
        input.focus();
      });
      prompts.appendChild(c);
    });

    chatWin.innerHTML = '';
    // friendly greeting
    const greet = document.createElement('div');
    greet.className = 'bubble intro';
    greet.textContent = `Hi — ask me about ${data.title.toLowerCase()}.`;
    chatWin.appendChild(greet);
  };

  raw.forEach(btn => {
    const key = btn.dataset.bot;
    const cfg = APP.BOTS[key];
    if (!cfg) return;

    // Ensure location classes are present
    // (HTML already has .top/.right/.bottom/.left)
    ensureShoot(btn);

    btn.addEventListener('mouseenter', () => {
      const side =
        btn.classList.contains('left') ? 'left' :
        btn.classList.contains('right') ? 'right' :
        btn.classList.contains('top') ? 'top' : 'bottom';
      showTip(btn, cfg.tooltip, side);
    });
    btn.addEventListener('mouseleave', hideTip);
    btn.addEventListener('click', () => openChat(key));
  });

  /* ---------- Chat overlay & input ---------- */
  const overlay = document.getElementById('chat-overlay');
  const chatTitle = document.getElementById('chat-title');
  const prompts = document.getElementById('prompts');
  const chatWin = document.getElementById('chat-window');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const closeBtn = document.getElementById('chat-close');
  const micBtn = document.getElementById('mic');

  const addBubble = (text, me = false) => {
    const b = document.createElement('div');
    b.className = 'bubble' + (me ? ' me' : '');
    b.textContent = text;
    chatWin.appendChild(b);
    chatWin.scrollTop = chatWin.scrollHeight;
  };

  sendBtn?.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    addBubble(val, true);
    input.value = '';
    // stop mic if recording
    if (micBtn?.getAttribute('aria-pressed') === 'true') {
      micBtn.click();
    }
    // Fake bot response for the demo
    setTimeout(() => addBubble("Got it — here's how I’d handle that…"), 500);
  });

  closeBtn?.addEventListener('click', () => {
    overlay.style.display = 'none';
    // Stop mic if open
    if (micBtn?.getAttribute('aria-pressed') === 'true') micBtn.click();
  });

  // Escape closes dialog
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') closeBtn.click();
  });
})();
