(function () {
  const BOTS = [
    {
      name: 'Car Insurance',
      lines: [
        'Decrypting module…',
        'Agent: Car Insurance — Quick-qualify & quote',
        'Collect → name, phone, vehicle, NCB, claims',
        'Decision → instant quote / manual review',
        'Integrations → Calendar · CRM · Email',
        'Hint → say: "Get a quick quote"'
      ]
    },
    {
      name: 'Appointly',
      lines: [
        'Loading scheduler…',
        'Agent: Appointly — Appointment Booking',
        'Collect → service, date & time, notes',
        'Confirm → SMS + calendar invite',
        'Links → reschedule / cancel',
        'Hint → say: "Book me Friday 3pm"'
      ]
    },
    {
      name: 'Salon Booker',
      lines: [
        'Compiling treatments…',
        'Agent: Salon Booker — Services & add-ons',
        'Upsell → bundles, extras, deposits',
        'Remind → no-show sequences',
        'Ops → CRM summary',
        'Hint → say: "Cut + beard trim this weekend"'
      ]
    },
    {
      name: 'Property Qualifier',
      lines: [
        'Scanning listings…',
        'Agent: Property Qualifier — Tenants & viewings',
        'Filter → budget, move-in, location, docs',
        'Book → viewing slots / agent call',
        'Sync → CRM with transcript',
        'Hint → say: "I want to view a 2-bed"'
      ]
    },
    {
      name: 'Support Triage',
      lines: [
        'Routing engine online…',
        'Agent: Support Triage — Right fix, first time',
        'Identify → category · priority',
        'Resolve → guided steps / human handoff',
        'Ticket → context auto-logged',
        'Hint → say: "My order never arrived"'
      ]
    },
    {
      name: 'Custom Bot',
      lines: [
        'Generating blueprint…',
        'Agent: Custom — Your use-case',
        'Modes → lead gen · bookings · support',
        'Connect → APIs · CRM · calendar',
        'Brand → tone, visuals, copy',
        'Hint → say: "Show me a tailored flow"'
      ]
    }
  ];

  const $ = (id) => document.getElementById(id);
  const btn = () => $('selectDemoBtn');
  const split = () => $('demoSplit');
  const hud = () => $('demoHUD');
  const twTitle = () => $('twTitle');
  const twBody = () => $('twBody');
  const prev = () => $('prevBot');
  const next = () => $('nextBot');
  const full = () => $('fullBot');
  const chat = () => $('chatContainer');
  const ghost = () => $('chatPlaceholder');
  const input = () => $('userInput');
  const send = () => $('sendBtn');
  const twPane = () => $('twPane');
  const chatPane = () => $('chatPane');

  let i = 0, frame;

  // cryptic scramble→reveal
  const glyphs = '!<>-_\\/[]{}—=+*^?#________';
  function scrambleTo(target) {
    cancelAnimationFrame(frame);
    const el = twBody();
    const lines = target.slice();
    let queue = [];
    let output = lines.map(() => '');
    const maxLen = Math.max(...lines.map(l => l.length));

    for (let li = 0; li < lines.length; li++) {
      const from = ''.padEnd(maxLen, ' ');
      const to = lines[li].padEnd(maxLen, ' ');
      const lineQ = [];
      for (let n = 0; n < maxLen; n++) {
        const start = Math.floor(Math.random() * 14);
        const end = start + Math.floor(Math.random() * 18) + 8;
        lineQ.push({ from: from[n], to: to[n], start, end, char: '' });
      }
      queue.push(lineQ);
    }

    let frameCount = 0;
    (function update(){
      let complete = 0;
      for (let li = 0; li < queue.length; li++) {
        const q = queue[li];
        let line = '';
        for (let n = 0; n < q.length; n++) {
          let { from, to, start, end, char } = q[n];
          if (frameCount >= end) { complete++; line += to; }
          else if (frameCount >= start) {
            if (!char || Math.random() < 0.09) char = glyphs[Math.floor(Math.random()*glyphs.length)];
            q[n].char = char; line += char;
          } else { line += from; }
        }
        output[li] = line.replace(/\s+$/,'');
      }
      el.textContent = output.join('\n');
      frameCount++;
      if (complete >= queue.length * maxLen) return;
      frame = requestAnimationFrame(update);
    })();
  }

  function parallax(n) {
    const left = twPane(); const right = chatPane();
    const dir = n > 0 ? 1 : -1;
    [left, right].forEach((pane, ix) => {
      pane.animate(
        [{ transform: `translateX(${8*dir}px)` }, { transform: 'translateX(0)' }],
        { duration: 450, easing: 'cubic-bezier(.2,.7,.1,1)' }
      );
    });
  }

  function openBot(iNew, withAnim = true) {
    i = (iNew + BOTS.length) % BOTS.length;
    const bot = BOTS[i];
    twTitle().textContent = `> ${bot.name}`;
    scrambleTo(bot.lines);

    full().href = `./bot.html?bot=${encodeURIComponent(bot.name)}`;

    if (ghost()) ghost().classList.add('hidden');
    if (chat()) chat().classList.remove('hidden');
    if (input()) input().value = `Open demo: ${bot.name}`;
    if (send()) setTimeout(() => send().click(), 80);

    if (withAnim) parallax(1);
  }

  function reset() {
    split().classList.add('hidden');
    hud().classList.add('hidden');
    btn().classList.remove('hidden');
  }

  function init() {
    if (!btn()) return;

    btn().addEventListener('click', () => {
      btn().classList.add('hidden');
      split().classList.remove('hidden');
      hud().classList.remove('hidden');
      openBot(0, false);
    });

    if (prev()) prev().addEventListener('click', () => openBot(i - 1));
    if (next()) next().addEventListener('click', () => openBot(i + 1));

    document.addEventListener('keydown', (e) => {
      if (btn() && !btn().classList.contains('hidden')) return;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') openBot(i + 1);
      if (e.key === 'ArrowLeft'  || e.key.toLowerCase() === 'a') openBot(i - 1);
      if (e.key === 'Enter') openBot(i, true);
      if (e.key === 'Escape') reset();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
