(() => {
const orbitEffects = !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!orbitEffects) return;
const orbitCanvas=document.getElementById('orbit-fx'),orbitCtx=orbitCanvas.getContext('2d');let orbitParticles=[],orbitTime=0,orbitLast=0;
const orbitStars=Array.from({length:65},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.4,phase:Math.random()*6.28}));
function orbitResize(){orbitCanvas.width=innerWidth;orbitCanvas.height=innerHeight;}addEventListener('resize',orbitResize);orbitResize();
function orbitBurst(){if(!orbitEffects)return;document.body.classList.remove('fx-hit');void document.body.offsetWidth;document.body.classList.add('fx-hit');setTimeout(()=>document.body.classList.remove('fx-hit'),750);const rect=document.getElementById('operation').getBoundingClientRect();for(let i=0;i<34;i++){const a=Math.random()*Math.PI*2;orbitParticles.push({x:rect.left+rect.width/2,y:rect.top+rect.height/2,vx:Math.cos(a)*(1+Math.random()*3),vy:Math.sin(a)*(1+Math.random()*3),life:1});}}
function orbitDraw(now){requestAnimationFrame(orbitDraw);if(!orbitEffects||document.hidden||now-orbitLast<32)return;const delta=Math.min((now-orbitLast)/16.67,3);orbitLast=now;orbitTime=now*.0005;orbitCtx.clearRect(0,0,orbitCanvas.width,orbitCanvas.height);for(const s of orbitStars){orbitCtx.fillStyle='rgba(185,235,255,'+(.3+Math.sin(orbitTime+s.phase)*.22)+')';orbitCtx.beginPath();orbitCtx.arc(s.x*orbitCanvas.width,s.y*orbitCanvas.height,s.r,0,Math.PI*2);orbitCtx.fill();}orbitParticles=orbitParticles.filter(p=>p.life>0);for(const p of orbitParticles){p.x+=p.vx*delta;p.y+=p.vy*delta;p.life-=.018*delta;orbitCtx.fillStyle='rgba(119,255,215,'+Math.max(0,p.life)+')';orbitCtx.beginPath();orbitCtx.arc(p.x,p.y,2.5,0,7);orbitCtx.fill();}}requestAnimationFrame(orbitDraw);
document.addEventListener('orbit-addition-correct', orbitBurst);
})();
