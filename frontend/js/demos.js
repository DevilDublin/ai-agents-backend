// Orbit wiring: correct node placement, hover beam, tooltips
(() => {
  const orbit = document.querySelector('.orbit');
  if (!orbit) return;

  const centre = () => {
    const r = orbit.getBoundingClientRect();
    return { cx: r.left + r.width/2, cy: r.top + r.height/2 };
  };

  const beamSvg = document.getElementById('beam');
  if (beamSvg) {
    beamSvg.innerHTML = `<svg width="100%" height="100%"><line x1="0" y1="0" x2="0" y2="0" stroke="url(#grad)" stroke-width="3" stroke-linecap="round" opacity="0">
      </line><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(155,114,255,0)"/><stop offset="100%" stop-color="rgba(155,114,255,0.85)"/></linearGradient></defs></svg>`;
  }
  const beamLine = beamSvg?.querySelector('line');

  const tooltip = document.getElementById('orbit-tip');

  function showBeam(toEl) {
    if (!beamLine) return;
    const { cx, cy } = centre();
    const rect = toEl.getBoundingClientRect();
    const tx = rect.left + rect.width/2;
    const ty = rect.top + rect.height/2;
    beamLine.setAttribute('x1', String(cx - orbit.getBoundingClientRect().left));
    beamLine.setAttribute('y1', String(cy - orbit.getBoundingClientRect().top));
    beamLine.setAttribute('x2', String(tx - orbit.getBoundingClientRect().left));
    beamLine.setAttribute('y2', String(ty - orbit.getBoundingClientRect().top));
    beamLine.setAttribute('opacity','1');
  }
  function hideBeam(){ beamLine?.setAttribute('opacity','0') }

  function placeTip(node, text, side) {
    if (!tooltip) return;
    tooltip.textContent = text;
    const r = node.getBoundingClientRect();
    const pad = 12;
    if (side === 'left') {
      tooltip.style.left = `${r.left - tooltip.offsetWidth - pad}px`;
      tooltip.style.top  = `${r.top + r.height/2 - tooltip.offsetHeight/2}px`;
    } else if (side === 'right') {
      tooltip.style.left = `${r.right + pad}px`;
      tooltip.style.top  = `${r.top + r.height/2 - tooltip.offsetHeight/2}px`;
    } else if (side === 'top') {
      tooltip.style.left = `${r.left + r.width/2 - tooltip.offsetWidth/2}px`;
      tooltip.style.top  = `${r.top - tooltip.offsetHeight - pad}px`;
    } else {
      tooltip.style.left = `${r.left + r.width/2 - tooltip.offsetWidth/2}px`;
      tooltip.style.top  = `${r.bottom + pad}px`;
    }
    tooltip.classList.add('show');
  }
  function hideTip(){ tooltip?.classList.remove('show') }

  const map = {
    '#node-appoint': { tip:'Books qualifying meetings from website and email', side:'top' },
    '#node-support': { tip:'Answers support queries from your policies', side:'right' },
    '#node-internal':{ tip:'Handles HR and Sales internal questions', side:'left' },
    '#node-auto':    { tip:'Plans multi-step automations across your tools', side:'bottom' },
  };

  Object.entries(map).forEach(([sel, info]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.addEventListener('mouseenter', () => { showBeam(el); placeTip(el, info.tip, info.side) });
    el.addEventListener('mouseleave', () => { hideBeam(); hideTip() });
    el.addEventListener('click', () => {
      const dlg = document.querySelector(sel + '-dialog');
      dlg?.showModal?.();
    });
  });
})();
