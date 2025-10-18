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
        'Links → reschedule/cancel',
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
        'Resolve → guided steps or human handoff',
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
  const twTitle = () => $('twTitle');
  const twBody = () => $('twBody');
  const prev = () => $('prevBot');
  const next = () => $('nextBot');
  const full = () => $('fullBot');
  const chat = () => $('chatContainer');
  const ghost = () => $('chatPlaceholder');
  const input = () => $('userInput');
  const send = () => $('sendBtn');

  let i = 0;
  let frame;
  const glyphs = '!<>-_\\/[]{}—=+*^?#________';

  function scrambleTo(target, onDone) {
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
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 24) + 6;
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
            q[n].char = char;
            line += char;
          } else {
            line += from;
          }
        }
        output[li] = line.replace(/\s+$/,'');
      }
      el.textContent = output.join('\n');
      frameCount++;
      if (complete >= queue.length * maxLen) { if (onDone) onDone(); return; }
      frame = requestAnimationFrame(update);
    })();
  }

  function showBot(index, animate = true) {
    i = (index + BOTS.length) % BOTS.length;
    const bot = BOTS[i];
    twTitle().textContent = `> ${bot.name}`;
    scrambleTo(bot.lines);

    full().href = `./bot.html?bot=${encodeURIComponent(bot.name)}`;

    if (ghost()) ghost().classList.add('hidden');
    if (chat()) chat().classList.remove('hidden');
    if (input()) input().value = `Open demo: ${bot.name}`;
    if (send()) setTimeout(() => send().click(), 80);

    if (animate) {
      split().style.animation = 'whoosh .5s ease';
      setTimeout(() => (split().style.animation = ''), 500);
    }
  }

  function init() {
    if (!btn()) return;
    btn().addEventListener('click', () => {
      btn().classList.add('hidden');
      split().classList.remove('hidden');
      showBot(0, false);
    });
    if (prev()) prev().addEventListener('click', () => showBot(i - 1));
    if (next()) next().addEventListener('click', () => showBot(i + 1));
    document.addEventListener('keydown', (e) => {
      if (split().classList.contains('hidden')) return;
      if (e.key === 'ArrowRight') showBot(i + 1);
      if (e.key === 'ArrowLeft')  showBot(i - 1);
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // whoosh keyframes (once)
  const style = document.createElement('style');
  style.textContent = `@keyframes whoosh{0%{transform:translateX(10px);opacity:.9}100%{transform:none;opacity:1}}`;
  document.head.appendChild(style);
})();
