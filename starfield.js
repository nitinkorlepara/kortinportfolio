// Starfield
(function(){
  const canvas = document.getElementById('starCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars=[], shootingStars=[], W, H;
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  function initStars(){ stars=[]; for(let i=0;i<280;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+0.2,alpha:Math.random()*0.6+0.2,speed:Math.random()*0.3+0.05,twinkle:Math.random()*Math.PI*2}); }
  function spawnShoot(){ if(Math.random()>0.008)return; shootingStars.push({x:Math.random()*W*0.6+W*0.2,y:Math.random()*H*0.3,len:Math.random()*120+60,speed:Math.random()*8+6,alpha:1,angle:Math.PI/5}); }
  let frame=0;
  (function animate(){
    requestAnimationFrame(animate); ctx.clearRect(0,0,W,H); frame++;
    stars.forEach(s=>{ s.twinkle+=0.02; const a=s.alpha*(0.7+0.3*Math.sin(s.twinkle)); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(200,220,255,${a})`; ctx.fill(); s.y-=s.speed*0.1; if(s.y<-2)s.y=H+2; });
    spawnShoot(); shootingStars=shootingStars.filter(ss=>ss.alpha>0);
    shootingStars.forEach(ss=>{ ctx.save(); ctx.translate(ss.x,ss.y); ctx.rotate(ss.angle); const g=ctx.createLinearGradient(0,0,ss.len,0); g.addColorStop(0,`rgba(0,212,255,${ss.alpha})`); g.addColorStop(1,'transparent'); ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(ss.len,0); ctx.stroke(); ctx.restore(); ss.x+=Math.cos(ss.angle)*ss.speed; ss.y+=Math.sin(ss.angle)*ss.speed; ss.alpha-=0.02; });
    if(frame%3===0){ ctx.save(); ctx.globalAlpha=0.015; const grd=ctx.createRadialGradient(W*0.3,H*0.4,0,W*0.3,H*0.4,400); grd.addColorStop(0,'#7b2fff'); grd.addColorStop(1,'transparent'); ctx.fillStyle=grd; ctx.fillRect(0,0,W,H); ctx.restore(); }
  })();
  resize(); initStars();
  window.addEventListener('resize',()=>{ resize(); initStars(); });

  // Reveal observer
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{ setTimeout(()=>{ b.style.width=b.dataset.width+'%'; },100); });
        e.target.querySelectorAll('[data-target]').forEach(el=>{ const t=+el.dataset.target; let c=0; const s=t/40; (function tick(){ c=Math.min(c+s,t); el.textContent=Math.floor(c)+(t>=10?'+':''); if(c<t)requestAnimationFrame(tick); })(); });
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.reveal,.timeline-item,.timeline-entry').forEach(el=>obs.observe(el));
})();
