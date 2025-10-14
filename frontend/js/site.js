const stars = document.getElementById('stars');
if (stars && stars.getContext) {
  const ctx = stars.getContext('2d');
  function fit(){ stars.width = innerWidth; stars.height = innerHeight; draw(); }
  addEventListener('resize', fit, { passive:true });
  function draw(){
    ctx.clearRect(0,0,stars.width,stars.height);
    for(let i=0;i<180;i++){
      const x=Math.random()*stars.width, y=Math.random()*stars.height;
      const r=Math.random()*1.2; ctx.fillStyle='rgba(200,200,255,'+(0.15+Math.random()*0.45)+')';
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
  }
  fit();
}
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
