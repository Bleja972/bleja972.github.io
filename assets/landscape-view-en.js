(()=>{
'use strict';
const button=document.getElementById('horizontal-toggle'),status=document.getElementById('horizontal-status');
if(!button||!status)return;
const style=document.createElement('style');
style.textContent=`
.horizontal-tools{max-width:1080px;margin:0 auto;padding:10px max(12px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));display:flex;flex-wrap:wrap;align-items:center;gap:9px}
.horizontal-tools button{font:700 14px/1.3 system-ui,sans-serif;min-height:44px;padding:10px 16px;border:2px solid #16706c;border-radius:12px;color:#fff;background:linear-gradient(#258f86,#12615f);box-shadow:0 4px 0 #093e3d;cursor:pointer;touch-action:manipulation}
.horizontal-tools button:focus-visible{outline:3px solid #a84905;outline-offset:3px}
.horizontal-tools button:disabled{opacity:.65}
#horizontal-status{flex-basis:100%;background:#fff8dc;border:1px solid #c4a864;border-radius:10px;color:#3e3420;padding:9px 12px;margin:0;font:14px/1.5 system-ui,sans-serif}
html:fullscreen{background:#e9f8f5;overflow:auto}html:fullscreen body{min-height:100%;overflow:auto}
@media(orientation:landscape) and (max-height:600px){.horizontal-tools{padding-top:6px}.horizontal-tools button{min-height:36px;padding:6px 12px;font-size:12px}#horizontal-status{font-size:12px}}
`;
document.head.append(style);
const isFull=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function message(text){status.textContent=text;status.hidden=!text;}
function sync(){const full=isFull();button.textContent=full?'↙ Exit full screen':'↻ Landscape view';button.setAttribute('aria-pressed',String(full));}
button.addEventListener('click',async()=>{
 button.disabled=true;
 try{
  if(isFull()){
   if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();
   if(document.exitFullscreen)await document.exitFullscreen();else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
   message('');return;
  }
  const root=document.documentElement,enter=root.requestFullscreen||root.webkitRequestFullscreen;
  if(enter){try{await enter.call(root);}catch{}}
  let locked=false;
  if(screen.orientation&&screen.orientation.lock){try{await screen.orientation.lock('landscape');locked=true;}catch{}}
  if(locked||matchMedia('(orientation:landscape)').matches)message('');
  else message('On Android, turn on Auto-rotate in quick settings, then turn your phone. On iPhone, turn off orientation lock. If needed, open this game directly in Chrome or Safari rather than in the school portal.');
 }catch{message('Turn on auto-rotate, then turn your phone. You can also keep playing in portrait view.');}
 finally{button.disabled=false;sync();}
});
document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
addEventListener('orientationchange',()=>{if(matchMedia('(orientation:landscape)').matches)message('');});
sync();
})();