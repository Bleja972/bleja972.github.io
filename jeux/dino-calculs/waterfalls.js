(()=>{'use strict';
const canvas=document.getElementById('waterfalls'),stage=document.getElementById('stage');if(!canvas||!stage)return;const ctx=canvas.getContext('2d');if(!ctx)return;let width=0,height=0,scale=1,ox=0,oy=0,last=0,clock=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const falls=[
{x:1198,y:301,w:30,h:145,speed:105,shape:[[1197,303],[1218,301],[1211,331],[1215,359],[1211,403],[1227,433],[1197,446],[1181,428],[1190,394],[1189,366],[1196,330]],spray:[1203,441,42,17]},
{x:1345,y:365,w:59,h:104,speed:118,shape:[[1385,367],[1404,363],[1395,386],[1380,409],[1375,435],[1370,459],[1343,469],[1347,446],[1358,414],[1370,389]],spray:[1361,466,44,15]},
{x:377,y:469,w:34,h:63,speed:90,shape:[[378,470],[392,473],[397,496],[406,518],[410,530],[389,529],[383,514],[381,493]],spray:[401,530,27,10]}
];
function resize(){width=stage.clientWidth;height=stage.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);scale=Math.max(width/1672,height/941);ox=(width-1672*scale)/2;oy=(height-941*scale)/2;}
function path(points){ctx.beginPath();points.forEach((p,i)=>{if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1])});ctx.closePath()}
const lakeImage=new Image();lakeImage.src='assets/vallee.webp';
const shoreline=[[440,548],[677,518],[910,515],[1075,527],[1231,534],[1330,532],[1323,545],[1190,560],[1134,572],[1114,585],[1216,608],[1318,613],[1311,640],[1195,667],[1143,685],[1210,711],[1282,738],[1242,772],[1155,799],[1134,826],[1217,848],[1191,875],[1120,899],[1066,902],[1040,846],[979,817],[876,799],[823,773],[728,754],[709,717],[715,682],[663,657],[582,640],[617,612],[556,594],[483,582],[382,576],[348,558]];
function drawLake(){
ctx.save();path(shoreline);ctx.clip();
if(lakeImage.complete&&lakeImage.naturalWidth){
 for(let y=515;y<904;y+=4){const depth=(y-515)/389,amplitude=.3+depth*2.7,dx=Math.sin(y*.17+clock*1.9)*amplitude+Math.sin(y*.061-clock*.8)*amplitude*.55,dy=Math.sin(clock*1.35+y*.09)*depth*.8;ctx.drawImage(lakeImage,0,y,1672,4,dx,y+dy,1672,4.3)}
}
for(let i=0;i<70;i++){
 const depth=((i*83.19)%380)/380,y=524+depth*378+Math.sin(clock*.65+i)*(.4+depth*1.6),x=380+((i*141.73)%930)+Math.sin(clock*.45+i*1.91)*(3+depth*9),length=5+depth*21+(i%4)*7,brightness=(.035+depth*.055)*(0.55+0.45*Math.sin(clock*1.15+i*2.3));
 ctx.strokeStyle=i%3===0?'rgba(15,68,71,'+(brightness*.9)+')':'rgba(255,240,190,'+brightness+')';ctx.lineWidth=.5+depth*.75;ctx.beginPath();ctx.moveTo(x-length,y);ctx.bezierCurveTo(x-length*.4,y+Math.sin(clock+i)*1.1,x+length*.3,y-Math.cos(clock*.8+i)*.9,x+length,y);ctx.stroke();
}
for(let i=0;i<15;i++){
 const phase=clock*.17+i*.331,depth=(phase%1),y=540+depth*250,x=670+Math.sin(i*2.17)*280+Math.sin(clock*.23+i)*8,alpha=Math.sin(depth*Math.PI)*.045;ctx.strokeStyle='rgba(249,235,187,'+alpha+')';ctx.lineWidth=.65;ctx.beginPath();ctx.ellipse(x,y,9+depth*40,1+depth*2.5,0,0,Math.PI*2);ctx.stroke();
}
ctx.restore();
}

// Effets atmosphériques, dessinés dans les coordonnées du paysage photographique.
function drawVolcano(){
const vx=1116,vy=151;
ctx.save();
// Une colonne de cendres se dilate et dérive au-dessus du cratère.
for(let i=17;i>=0;i--){const phase=(clock*.105+i/18)%1,radius=7+phase*38,x=vx+phase*85+Math.sin(phase*7+i)*phase*8,y=vy-phase*147;const smoke=ctx.createRadialGradient(x,y,0,x,y,radius);smoke.addColorStop(0,'rgba(67,66,59,'+(Math.sin(Math.PI*phase)*.17)+')');smoke.addColorStop(.6,'rgba(113,107,90,'+(Math.sin(Math.PI*phase)*.11)+')');smoke.addColorStop(1,'rgba(113,107,90,0)');ctx.fillStyle=smoke;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill()}
const pulse=.65+.18*Math.sin(clock*2.3)+.1*Math.sin(clock*5.7),glow=ctx.createRadialGradient(vx,vy,1,vx,vy,28);glow.addColorStop(0,'rgba(255,225,110,'+(.65*pulse)+')');glow.addColorStop(.3,'rgba(255,104,20,'+(.35*pulse)+')');glow.addColorStop(1,'rgba(255,80,0,0)');ctx.fillStyle=glow;ctx.fillRect(vx-30,vy-30,60,60);
const flows=[[[1116,153],[1127,168],[1133,190],[1151,211],[1153,227],[1183,249]],[[1111,157],[1106,170],[1096,188],[1090,204],[1072,225]]];
for(const points of flows){ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle='rgba(85,32,16,.48)';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='rgba(255,74,9,'+(.6*pulse)+')';ctx.lineWidth=3.4;ctx.stroke();ctx.save();ctx.shadowColor='#ffb439';ctx.shadowBlur=5;ctx.strokeStyle='rgba(255,204,85,'+(.65*pulse)+')';ctx.lineWidth=1.1;ctx.setLineDash([7,11,3,8]);ctx.lineDashOffset=-clock*14;ctx.stroke();ctx.restore()}
for(let i=0;i<13;i++){const p=(clock*.55+i*.171)%1,angle=-Math.PI/2+Math.sin(i*3.1)*.9,x=vx+Math.cos(angle)*p*28,y=vy+Math.sin(angle)*p*36+p*p*19;ctx.fillStyle='rgba(255,'+(150+Math.floor(60*(1-p)))+',58,'+((1-p)*.85)+')';ctx.beginPath();ctx.arc(x,y,.65+(i%3)*.25,0,Math.PI*2);ctx.fill()}
ctx.restore();
}

// Petit rocher texturé, calculé une seule fois, puis animé avec sa traînée.
const meteorRock=document.createElement('canvas');meteorRock.width=128;meteorRock.height=128;
(()=>{const c=meteorRock.getContext('2d');if(!c)return;let seed=8153;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};c.save();c.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=47+random()*10,x=64+Math.cos(a)*r,y=64+Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y)}c.closePath();c.clip();const rock=c.createRadialGradient(96,42,2,50,72,90);rock.addColorStop(0,'#bd7540');rock.addColorStop(.35,'#604131');rock.addColorStop(.75,'#241e1a');rock.addColorStop(1,'#11100e');c.fillStyle=rock;c.fillRect(0,0,128,128);for(let i=0;i<1700;i++){const x=random()*128,y=random()*128,size=.5+random()*3;c.fillStyle=i%3?'rgba(6,5,4,'+(.08+random()*.27)+')':'rgba(219,160,92,'+(random()*.28)+')';c.fillRect(x,y,size,size)}for(let i=0;i<9;i++){const x=20+random()*88,y=20+random()*88,r=4+random()*10,g=c.createRadialGradient(x+1,y+2,1,x,y,r);g.addColorStop(0,'#100f0ed9');g.addColorStop(.7,'#211c17a0');g.addColorStop(1,'#b1784750');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}c.strokeStyle='#ec6e22';c.lineWidth=1.3;c.beginPath();c.moveTo(110,42);c.lineTo(86,50);c.lineTo(91,64);c.lineTo(72,76);c.moveTo(110,83);c.lineTo(93,78);c.lineTo(79,95);c.stroke();c.restore()})();

function drawMeteor(){
// Premier passage après trois secondes, puis un passage toutes les vingt secondes.
const cycle=(clock+17)%20;if(cycle>3.8)return;const p=cycle/3.8,from={x:1740,y:-20},to={x:120,y:338},x=from.x+(to.x-from.x)*p,y=from.y+(to.y-from.y)*p,angle=Math.atan2(to.y-from.y,to.x-from.x),r=30+p*15,length=290;
ctx.save();ctx.translate(x,y);ctx.rotate(angle);
const halo=ctx.createRadialGradient(0,0,r*.3,0,0,r*2.6);halo.addColorStop(0,'rgba(255,235,155,.75)');halo.addColorStop(.3,'rgba(255,149,45,.42)');halo.addColorStop(1,'rgba(255,96,0,0)');ctx.fillStyle=halo;ctx.fillRect(-r*3,-r*3,r*6,r*6);
for(let layer=0;layer<3;layer++){const tail=length*(1-layer*.17),w=(r*.85)*(1-layer*.27),flame=ctx.createLinearGradient(-tail,0,r,0);flame.addColorStop(0,'rgba(255,84,7,0)');flame.addColorStop(.35,'rgba(255,106,13,'+(.2+layer*.1)+')');flame.addColorStop(.8,layer===2?'rgba(255,249,196,.95)':'rgba(255,173,42,.8)');flame.addColorStop(1,'#fff2a6');ctx.fillStyle=flame;ctx.beginPath();ctx.moveTo(r*.2,-w);ctx.bezierCurveTo(-tail*.25,-w*.9,-tail*.55,-w*.2+Math.sin(clock*13+layer)*8,-tail,Math.sin(clock*10)*4);ctx.bezierCurveTo(-tail*.55,w*.2+Math.sin(clock*15+layer)*7,-tail*.2,w*.8,r*.2,w);ctx.closePath();ctx.fill()}
for(let i=0;i<24;i++){const phase=(clock*1.7+i*.173)%1,sx=-r-phase*length,sy=Math.sin(i*7.9+clock*.7)*(5+phase*28);ctx.fillStyle='rgba(255,'+(135+i%4*25)+',65,'+((1-phase)*.75)+')';ctx.beginPath();ctx.arc(sx,sy,(1-phase)*2+.5,0,Math.PI*2);ctx.fill()}
ctx.save();ctx.rotate(clock*1.25);ctx.drawImage(meteorRock,-r,-r,r*2,r*2);ctx.restore();ctx.strokeStyle='rgba(255,228,133,.85)';ctx.shadowColor='#ff8a26';ctx.shadowBlur=14;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*.88,-1,1);ctx.stroke();ctx.restore();
}

function draw(){ctx.clearRect(0,0,width,height);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);drawLake();drawVolcano();drawMeteor();for(const f of falls){ctx.save();path(f.shape);ctx.clip();for(let i=0;i<22;i++){const seed=i*2.399,x=f.x+(Math.sin(seed)*.5+.5)*f.w;for(let j=0;j<3;j++){const y=f.y+((clock*f.speed+i*19.7+j*59.3)%(f.h+60))-35;const length=14+(i%5)*5;const gradient=ctx.createLinearGradient(x,y,x,y+length);gradient.addColorStop(0,'rgba(231,250,247,0)');gradient.addColorStop(.6,'rgba(239,251,244,'+(0.16+(i%4)*.035)+')');gradient.addColorStop(1,'rgba(255,255,246,0)');ctx.strokeStyle=gradient;ctx.lineWidth=1.5+(i%3)*1.1;ctx.beginPath();ctx.moveTo(x+Math.sin(clock*3+i)*1.3,y);ctx.bezierCurveTo(x-1,y+length*.3,x+2,y+length*.6,x+Math.sin(i)*2,y+length);ctx.stroke()}}ctx.restore();const [sx,sy,sw,sh]=f.spray;for(let i=0;i<4;i++){const phase=clock*.45+i*.73,dx=Math.sin(phase)*sw*.23,dy=-((clock*6+i*5)%18);ctx.save();ctx.translate(sx+dx,sy+dy);ctx.scale(1,sh/sw);const mist=ctx.createRadialGradient(0,0,0,0,0,sw);mist.addColorStop(0,'rgba(240,251,237,'+(0.055+Math.sin(phase)*.018)+')');mist.addColorStop(1,'rgba(240,251,237,0)');ctx.fillStyle=mist;ctx.fillRect(-sw,-sw,sw*2,sw*2);ctx.restore()}}
ctx.restore();}
function frame(now){const delta=last?Math.min(.1,(now-last)/1000):0;if(last&&now-last<32){if(!reduced.matches)requestAnimationFrame(frame);return}last=now;if(!document.hidden&&!stage.classList.contains('paused')){clock+=delta;draw()}if(!reduced.matches)requestAnimationFrame(frame)}
new ResizeObserver(resize).observe(stage);resize();requestAnimationFrame(frame);
})();
