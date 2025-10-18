(function () {
  // Clean any old nav items that shouldn't be visible
  function cleanNav(){
    const items=[...document.querySelectorAll('nav a, nav button, nav span')];
    items.forEach(el=>{
      const t=(el.textContent||'').trim().toLowerCase();
      if(t==='voice & chat'||t==='voice and chat'||t==='support') el.style.display='none';
    });
  }
  document.addEventListener('DOMContentLoaded', cleanNav);
})();
