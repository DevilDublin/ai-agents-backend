const toolcopy = {
  appt: 'Books qualifying meetings from website and e-mail',
  support: 'Answers from policies and docs, links included',
  internal: 'Quick answers from your internal knowledge',
  auto: 'Plans automations and hands them to your stack'
};
const prompts = {
  appt: [
    "Hello, I'd like a 30-minute intro next week. Budget is £2k per month.",
    "Could you do Tuesday 2–4pm?",
    "Use alex@example.com for the invite."
  ],
  support: [
    "What’s the returns window?",
    "Do you ship to the UK?",
    "Are weekend deliveries available?"
  ],
  internal: [
    "What’s our SDR playbook for outbound?",
    "Where’s the latest HR policy doc?",
    "What’s the travel budget for EMEA?"
  ],
  auto: [
    "Webhook from Stripe should open a CRM ticket.",
    "When we get a lead, create a Slack thread.",
    "Nightly summary e-mail from yesterday’s sales."
  ]
};

(() => {
  const orbit = document.getElementById('orbit');
  const t = document.getElementById('tooltip');
  const ray = document.getElementById('ray');

  const pills = {
    appt: document.querySelector('.pill.top'),
    internal: document.querySelector('.pill.left'),
    support: document.querySelector('.pill.right'),
    auto: document.querySelector('.pill.bottom')
  };

  function centrePos() {
    const r = orbit.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2 };
  }
  function pillCentre(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2, rect: r };
  }
  function showTip(el, id) {
    const p = pillCentre(el);
    t.textContent = toolcopy[id];
    t.style.display = 'block';
    if (id === 'support') { t.style.left = (p.rect.right + 14) + 'px'; t.style.top = (p.rect.top - 6) + 'px'; }
    else if (id === 'internal') { t.style.left = (p.rect.left - t.offsetWidth - 14) + 'px'; t.style.top = (p.rect.top - 6) + 'px'; }
    else if (id === 'appt') { t.style.left = (p.rect.left - t.offsetWidth/2 + p.rect.width/2) + 'px'; t.style.top = (p.rect.top - t.offsetHeight - 10) + 'px'; }
    else { t.style.left = (p.rect.left - t.offsetWidth/2 + p.rect.width/2) + 'px'; t.style.top = (p.rect.bottom + 10) + 'px'; }
    const c = centrePos();
    const dx = p.x - c.x, dy = p.y - c.y;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);
    ray.style.opacity = 1;
    ray.style.left = c.x + 'px';
    ray.style.top = c.y + 'px';
    ray.style.width = len + 'px';
    ray.style.transform = `rotate(${ang}rad)`;
  }
  function hideTip() {
    t.style.display = 'none';
    ray.style.opacity = 0;
  }

  Object.entries(pills).forEach(([id, el]) => {
    el.addEventListener('mouseenter', () => showTip(el, id));
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('click', () => openDialog(id));
  });

  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('dlg-close');
  const title = document.getElementById('dlg-title');
  const sub = document.getElementById('dlg-sub');
  const chips = document.getElementById('chips');
  const chat = document.getElementById('chat');
  const input = document.getElementById('dlg-input');
  const send = document.getElementById('send');
  const mic = document.getElementById('mic');

  function openDialog(id){
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    title.textContent = elTitle(id);
    sub.textContent = toolcopy[id];
    chips.innerHTML = '';
    prompts[id].forEach(p => {
      const c = document.createElement('span');
      c.className = 'chip';
      c.textContent = p;
      c.addEventListener('click', ()=>{ appendMe(p); aiReply(id); });
      chips.appendChild(c);
    });
    chat.innerHTML = '';
    input.value = '';
    Voice.bind(mic, input, onDictation);
    input.focus();
  }
  function elTitle(id){
    return id==='appt'?'Appointment Setter'
      : id==='support'?'Support Q&A'
      : id==='internal'?'Internal Knowledge'
      : 'Automation Planner';
  }
  function appendMe(text){
    const b = document.createElement('div');
    b.className = 'bubble me';
    b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }
  function appendBot(text){
    const b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }
  function aiReply(id){
    const copy = {
      appt: "Thanks — this is a static demo. In your build this would check calendars and create an invite.",
      support: "I’ll pull the answer from your policy and link the source. This box is just a preview.",
      internal: "I would search your internal docs and return the relevant snippet. This is a demo stub.",
      auto: "I’d draft the automation and hand it to your stack. Here we just show the flow."
    };
    setTimeout(()=>appendBot(copy[id]), 600);
  }

  send.addEventListener('click', () => {
    if(!input.value.trim()) return;
    const id = title.textContent.includes('Appointment')?'appt':
               title.textContent.includes('Support')?'support':
               title.textContent.includes('Internal')?'internal':'auto';
    appendMe(input.value.trim());
    input.value='';
    aiReply(id);
  });
  function onDictation(text, final) {
    if(final && text.trim()){
      appendMe(text.trim());
      const id = title.textContent.includes('Appointment')?'appt':
                 title.textContent.includes('Support')?'support':
                 title.textContent.includes('Internal')?'internal':'auto';
      aiReply(id);
    }
  }

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    Voice.unbind();
  });
})();
