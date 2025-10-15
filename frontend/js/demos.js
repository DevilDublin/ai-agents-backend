(function(){
  const orbitCanvas = document.getElementById('orbits');
  if(!orbitCanvas) return;
  const ctx = orbitCanvas.getContext('2d');
  function size(){ orbitCanvas.width=orbitCanvas.clientWidth; orbitCanvas.height=orbitCanvas.clientHeight; draw() }
  function draw(){
    const w=orbitCanvas.width,h=orbitCanvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle="rgba(255,255,255,.12)";
    ctx.setLineDash([6,8]);
    const cx=w/2, cy=h/2; const radii=[120,200,280];
    radii.forEach(r=>{ ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke() });
  }
  new ResizeObserver(size).observe(orbitCanvas); size();

  const tooltip = document.getElementById('orbit-tooltip');
  const pills = document.querySelectorAll('.bot-pill');
  const placements = {
    appointment: el=>{ el.style.left="50%"; el.style.transform="translateX(-50%)"; el.style.top="110px" },
    support: el=>{ el.style.top="50%"; el.style.right="70px"; el.style.left=""; el.style.transform="translateY(-50%)" },
    internal: el=>{ el.style.top="50%"; el.style.left="70px"; el.style.transform="translateY(-50%)" },
    automation: el=>{ el.style.left="50%"; el.style.transform="translateX(-50%)"; el.style.bottom="80px" }
  };
  pills.forEach(p=>{
    const key=p.dataset.bot;
    if(placements[key]) placements[key](p);
    p.addEventListener('mouseenter',()=>{
      const t=AA.copy.bots[key].sub;
      tooltip.textContent=t;
      tooltip.style.display="block";
      const rect=p.getBoundingClientRect(), tw=tooltip.offsetWidth;
      if(key==="internal"){ tooltip.style.left=(rect.left - tw - 12)+"px"; tooltip.style.top=(rect.top + rect.height/2 - 18)+"px" }
      if(key==="support"){ tooltip.style.left=(rect.right + 12)+"px"; tooltip.style.top=(rect.top + rect.height/2 - 18)+"px" }
      if(key==="appointment"){ tooltip.style.left=(rect.left + rect.width/2 - tw/2)+"px"; tooltip.style.top=(rect.top - 40)+"px" }
      if(key==="automation"){ tooltip.style.left=(rect.left + rect.width/2 - tw/2)+"px"; tooltip.style.top=(rect.bottom + 12)+"px" }
    });
    p.addEventListener('mouseleave',()=>{ tooltip.style.display="none" });
    p.addEventListener('click',()=>openDialog(key));
  });

  const overlay=document.getElementById('dlg');
  const title=document.getElementById('dlg-title');
  const sub=document.getElementById('dlg-sub');
  const exWrap=document.getElementById('dlg-examples');
  const chat=document.getElementById('dlg-chat');
  const input=document.getElementById('dlg-input');
  const send=document.getElementById('dlg-send');
  const mic=document.getElementById('dlg-mic');
  const ghost=document.getElementById('dlg-ghost');

  function openDialog(key){
    const data=AA.copy.bots[key];
    title.textContent=data.title;
    sub.textContent=data.sub;
    exWrap.innerHTML="";
    data.prompts.forEach(t=>{
      const b=document.createElement('div');
      b.className="chip";
      b.textContent=t;
      b.addEventListener('click',()=>{ input.value=t; input.focus() });
      exWrap.appendChild(b);
    });
    chat.innerHTML='<div class="bubble intro">Hi — ask me about '+data.title.toLowerCase()+'.</div>';
    input.value="";
    ghost.textContent="";
    overlay.style.display="flex";
  }
  document.getElementById('dlg-close').addEventListener('click',()=>overlay.style.display="none");

  function pushBubble(text,me=false){
    const b=document.createElement('div');
    b.className="bubble"+(me?" me":"");
    b.textContent=text;
    chat.appendChild(b);
    chat.scrollTop=chat.scrollHeight;
  }
  function handleSend(){
    const t=input.value.trim();
    if(!t) return;
    pushBubble(t,true);
    input.value="";
    ghost.textContent="";
    setTimeout(()=>pushBubble("Thanks — this is a static demo. In your build this would call the agent’s API."),400);
  }
  send.addEventListener('click',handleSend);
  input.addEventListener('keydown',e=>{ if(e.key==="Enter") handleSend() });

  AA.voice && AA.voice.wire({mic,input,ghost,onFinal:(txt)=>{ input.value=txt; handleSend() },onInterim:(txt)=>{ ghost.textContent=txt }});
})();
