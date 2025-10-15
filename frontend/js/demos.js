(function () {
  const orbit = document.getElementById('orbit');
  const tooltip = document.getElementById('orbit-tooltip');
  const dlg = document.getElementById('dlg');
  const dlgTitle = document.getElementById('dlg-title');
  const dlgSub = document.getElementById('dlg-sub');
  const dlgChat = document.getElementById('dlg-chat');
  const dlgGreet = document.getElementById('dlg-greet');
  const dlgClose = document.getElementById('dlg-close');
  const dlgInput = document.getElementById('dlg-input');
  const dlgSend = document.getElementById('dlg-send');
  const examples = document.getElementById('dlg-examples');

  if (!orbit) return;

  function beam(fromEl) {
    const svg = document.getElementById('orbits');
    const rect = svg.getBoundingClientRect();
    const c = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const r = fromEl.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', c.x - rect.left);
    line.setAttribute('y1', c.y - rect.top);
    line.setAttribute('x2', x - rect.left);
    line.setAttribute('y2', y - rect.top);
    line.setAttribute('stroke', 'rgba(185,138,255,0.55)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('filter', 'url(#softGlow)');
    svg.appendChild(line);
    setTimeout(() => line.remove(), 380);
  }

  function showTip(el, text, side) {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    const r = el.getBoundingClientRect();
    const t = tooltip.getBoundingClientRect();
    let x = r.left + (r.width - t.width) / 2;
    let y = r.top - t.height - 10;

    if (side === 'right') { x = r.right + 12; y = r.top + (r.height - t.height) / 2; }
    if (side === 'left')  { x = r.left - t.width - 12; y = r.top + (r.height - t.height) / 2; }
    if (side === 'bottom'){ x = r.left + (r.width - t.width) / 2; y = r.bottom + 12; }

    tooltip.style.transform = `translate(${x}px, ${y}px)`;
  }

  function hideTip() { tooltip.style.display = 'none'; }

  function openDialog(botKey) {
    const bot = window.AGENT_DEMOS[botKey];
    if (!bot) return;

    dlgTitle.textContent = bot.title;
    dlgSub.textContent = bot.blurb;
    dlgGreet.textContent = bot.greet;
    dlgChat.innerHTML = '';
    dlgChat.appendChild(dlgGreet);

    examples.innerHTML = '';
    bot.examples.forEach(txt => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = txt;
      chip.addEventListener('click', () => {
        dlgInput.value = txt;
        dlgSend.click();
      });
      examples.appendChild(chip);
    });

    dlg.style.display = 'flex';
    dlgInput.focus();
  }

  function closeDialog() {
    dlg.style.display = 'none';
  }

  dlgClose.addEventListener('click', closeDialog);
  dlg.addEventListener('click', e => { if (e.target === dlg) closeDialog(); });

  function addBubble(text, me = false) {
    const b = document.createElement('div');
    b.className = 'bubble' + (me ? ' me' : '');
    b.textContent = text;
    dlgChat.appendChild(b);
    dlgChat.scrollTop = dlgChat.scrollHeight;
  }

  function reply(botKey, user) {
    const flavours = {
      appointments: `Got it. I can pencil that in and send a tidy calendar invite. If you’ve a preferred slot or timezone, pop it in.`,
      support: `I’ll check policy and give you the precise answer, not a waffle. What’s the situation in a sentence?`,
      internal: `Alright — I’ll fetch the relevant bit from HR/Sales. Anything sensitive, keep it brief.`,
      automation: `Let’s make life easier. Tell me the steps you do now and where it drags, and I’ll sketch a tidy automation.`
    };
    const txt = flavours[botKey] || `Noted. I’ll help with that.`;
    setTimeout(() => addBubble(txt), 500);
  }

  let currentBot = null;

  dlgSend.addEventListener('click', () => {
    const v = dlgInput.value.trim();
    if (!v) return;
    addBubble(v, true);
    dlgInput.value = '';
    reply(currentBot, v);
  });

  dlgInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dlgSend.click();
    }
  });

  document.querySelectorAll('.bot-pill').forEach(btn => {
    const key = btn.getAttribute('data-bot');

    btn.addEventListener('mouseenter', () => {
      beam(btn);
      const side = btn.classList.contains('left') ? 'left'
                 : btn.classList.contains('right') ? 'right'
                 : btn.classList.contains('bottom') ? 'bottom'
                 : 'top';
      const tip = window.AGENT_DEMOS[key]?.blurb || 'Live demo';
      showTip(btn, tip, side);
    });

    btn.addEventListener('mouseleave', hideTip);

    btn.addEventListener('click', () => {
      currentBot = key;
      openDialog(key);
    });
  });
})();
