(function () {
  const data = [
    {
      name: 'Car Insurance',
      lines: [
        '> Bot: Car Insurance — Quick-qualify & quote',
        '> Collects: name, phone, vehicle, NCB, claims',
        '> Decides: quote route or manual review',
        '> Integrates: Calendar + CRM + email handoff',
        '> Try: “Get a quick quote”'
      ]
    },
    {
      name: 'Appointly',
      lines: [
        '> Bot: Appointly — Appointment Booking',
        '> Collects: service, date & time, notes',
        '> Confirms: SMS + calendar invite',
        '> Reschedule/Cancel links included',
        '> Try: “Book me for Friday 3pm”'
      ]
    },
    {
      name: 'Salon Booker',
      lines: [
        '> Bot: Salon Booker — Services & Add-ons',
        '> Upsells: treatments, bundles, extras',
        '> Deposits: optional link checkout',
        '> No-shows: reminder flows',
        '> Try: “Cut + beard trim this weekend”'
      ]
    },
    {
      name: 'Property Qualifier',
      lines: [
        '> Bot: Property Qualifier — Tenants & Viewings',
        '> Filters: budget, move-in, location, docs',
        '> Books: viewing slots or agent call',
        '> Sends: summary to CRM',
        '> Try: “I want to view a 2-bed flat”'
      ]
    },
    {
      name: 'Support Triage',
      lines: [
        '> Bot: Support Triage — Right Fix, First Time',
        '> Identifies: issue category & priority',
        '> Resolves: guided steps or routes to human',
        '> Logs: ticket with context',
        '> Try: “My order never arrived”'
      ]
    },
    {
      name: 'Custom Bot',
      lines: [
        '> Bot: Custom — Built for Your Use-case',
        '> Pick: lead gen, bookings, support, sales',
        '> Connect: your CRM + calendar + APIs',
        '> Brand: tone, colours, copy — yours',
        '> Try: “Show me a tailored flow”'
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
  const chatWrap = () => $('chatContainer');
  const chatGhost = () => $('chatPlaceholder');
  const input = () => $('userInput');
  const send = () => $('sendBtn');

  let i = 0;
  let typingTimeout;

  function typewriter(lines, onDone) {
    clearTimeout(typingTimeout);
    twBody().textContent = '';
    let li = 0, ci = 0;

    function tick() {
      if (li >= lines.length) return onDone && onDone();
      const line = lines[li];
      twBody().textContent += line.slice(0, ci) + (ci % 2 ? '_' : ' ') + (ci ? '\n' : '');
      ci++;
      if (ci > line.length) {
        twBody().textContent = lines.slice(0, li + 1).join('\n') + '\n';
        li++; ci = 0;
      }
      typingTimeout = setTimeout(tick, 18); // hacker speed
    }
    tick();
  }

  function showBot(index, whoosh = true) {
    i = (index + data.length) % data.length;
    const bot = data[i];

    twTitle().textContent = `> ${bot.name}`;
    typewriter(bot.lines);

    // update deep link
    full().href = `./bot.html?bot=${encodeURIComponent(bot.name)}`;

    // prep chat
    if (chatGhost()) chatGhost().classList.add('hidden');
    if (chatWrap()) chatWrap().classList.remove('hidden');
    if (input()) input().value = `Open demo: ${bot.name}`;
    if (send()) setTimeout(() => send().click(), 80);

    // whoosh animation on split container
    if (whoosh) {
      split().style.animation = 'whoosh .5s ease';
      setTimeout(() => split().style.animation = '', 500);
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

    // keyboard arrows
    document.addEventListener('keydown', (e) => {
      if (split().classList.contains('hidden')) return;
      if (e.key === 'ArrowRight') showBot(i + 1);
      if (e.key === 'ArrowLeft') showBot(i - 1);
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // whoosh keyframes injected once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes whoosh { 
      0% { transform: translateX(10px); opacity:.9 } 
      100% { transform: none; opacity:1 } 
    }
  `;
  document.head.appendChild(style);
})();
