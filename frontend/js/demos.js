/* demos page interactions: modal terminal + mock replies */
(function(){
  const $ = (s, el=document)=> el.querySelector(s);
  const $$ = (s, el=document)=> [...el.querySelectorAll(s)];

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const modal = $('#demoModal');
  const log = $('#termLog');
  const form = $('#termForm');
  const input = $('#termInput');

  function openModal(kind){
    modal.setAttribute('aria-hidden','false');
    log.innerHTML = '';
    input.value = '';
    input.focus();
    const hello = kind === 'realestate'
      ? 'Zypher Real Estate: Hi! Interested in a viewing or valuation?'
      : 'Zypher SaaS Triage: Hi! Ask a question or describe your issue.';
    append('system', hello);
  }

  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  function append(who, text){
    const row = document.createElement('div');
    row.style.margin = '6px 0';
    row.innerHTML = `<strong style="color:${who==='user'?'#66f7d1':'#cfe6ff'}">${who==='user'?'You':'Zypher'}</strong>: ${text}`;
    log.appendChild(row); log.scrollTop = log.scrollHeight;
  }

  $$('.open-demo').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.demo)));
  $$('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  modal?.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = input.value.trim(); if (!q) return;
    append('user', q); input.value = '';
    setTimeout(()=>{
      const reply = (q.toLowerCase().includes('view') || q.toLowerCase().includes('book'))
        ? 'I can check availability and book a time. What date suits you?'
        : 'Here’s a quick summary: I can answer FAQs, route complex issues, and book follow-ups.';
      append('system', reply);
    }, 500);
  });
})();
