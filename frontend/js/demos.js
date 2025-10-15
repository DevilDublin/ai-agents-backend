const orbit = (() => {
  const wrap = document.querySelector('.orbit-wrap');
  if(!wrap) return;

  const pills = [...wrap.querySelectorAll('.pill')];
  const beams = {
    left: wrap.querySelector('.beam[data-to="left"]'),
    right: wrap.querySelector('.beam[data-to="right"]'),
    top: wrap.querySelector('.beam[data-to="top"]'),
    bottom: wrap.querySelector('.beam[data-to="bottom"]')
  };

  function placeBeams() {
    const c = wrap.getBoundingClientRect();
    const cx = c.left + c.width/2;
    const cy = c.top + c.height/2;
    function line(el, x2, y2) {
      const dx = x2 - cx, dy = y2 - cy;
      const len = Math.hypot(dx,dy);
      const ang = Math.atan2(dy,dx);
      el.style.left = cx+'px';
      el.style.top = cy+'px';
      el.style.width = len+'px';
      el.style.transform = `rotate(${ang}rad)`;
      el.style.opacity = 0;
    }
    const pTop = wrap.querySelector('.pill[data-pos="top"]').getBoundingClientRect();
    const pLeft = wrap.querySelector('.pill[data-pos="left"]').getBoundingClientRect();
    const pRight = wrap.querySelector('.pill[data-pos="right"]').getBoundingClientRect();
    const pBottom = wrap.querySelector('.pill[data-pos="bottom"]').getBoundingClientRect();
    line(beams.top, pTop.left+pTop.width/2, pTop.top+pTop.height/2);
    line(beams.left, pLeft.left+pLeft.width/2, pLeft.top+pLeft.height/2);
    line(beams.right, pRight.left+pRight.width/2, pRight.top+pRight.height/2);
    line(beams.bottom, pBottom.left+pBottom.width/2, pBottom.top+pBottom.height/2);
  }

  placeBeams();
  addEventListener('resize', placeBeams);

  pills.forEach(p=>{
    p.addEventListener('mouseenter', ()=> {
      const pos = p.dataset.pos;
      wrap.querySelector(`.beam[data-to="${pos}"]`).style.opacity = 1;
    });
    p.addEventListener('mouseleave', ()=> {
      const pos = p.dataset.pos;
      wrap.querySelector(`.beam[data-to="${pos}"]`).style.opacity = 0;
    });
  });

  const specs = {
    appt: {
      title:'Appointment Setter',
      sub:'Books meetings from website or email',
      tips:['What’s your budget?','Can you do Tuesday 2–4pm?','Use alex@example.com for the invite.']
    },
    internal: {
      title:'Internal Knowledge',
      sub:'Answers from your docs and policies',
      tips:['What’s the parental leave policy?','Who approves spend?','Where’s the brand toolkit?']
    },
    support: {
      title:'Support Q&A',
      sub:'Fast answers with policy links',
      tips:['What’s the returns window?','Do you ship to the UK?','Weekend deliveries available?']
    },
    planner: {
      title:'Automation Planner',
      sub:'Maps tasks and integrations',
      tips:['List my top manual tasks','Draft a Zapier flow','Show a weekly summary']
    }
  };

  const dlg = document.getElementById('dlg');
  const title = document.getElementById('dlg-title');
  const sub = document.getElementById('dlg-sub');
  const tips = document.getElementById('dlg-tips');
  const chat = document.getElementById('dlg-chat');
  const input = document.getElementById('dlg-input');
  const send = document.getElementById('send');

  function open(spec) {
    title.textContent = spec.title;
    sub.textContent = spec.sub;
    tips.innerHTML = '';
    spec.tips.forEach(t=>{
      const b = document.createElement('button');
      b.className='tip-chip';
      b.textContent=t;
      b.onclick=()=> { input.value=t; send.click(); };
      tips.appendChild(b);
    });
    chat.innerHTML = '';
    pushBubble('Hi — ask me about '+spec.title.toLowerCase()+'.', false);
    dlg.classList.add('show');
    input.focus();
  }

  function pushBubble(text, me){
    const div = document.createElement('div');
    div.className = 'bubble'+(me?' me':'');
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  document.getElementById('dlg-close').onclick=()=>dlg.classList.remove('show');

  pills.forEach(p=>{
    p.addEventListener('click', ()=>{
      const key = p.dataset.bot;
      open(specs[key]);
    });
  });

  send.addEventListener('click', ()=>{
    const v = input.value.trim();
    if(!v) return;
    pushBubble(v,true);
    input.value='';
    setTimeout(()=>pushBubble('Thanks — this is a demo. In your build I would call the agent and reply with context.', false), 500);
  });
})();
