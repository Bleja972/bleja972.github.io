(()=>{
'use strict';
if(window.__blejaLandscapeLoaded)return;
window.__blejaLandscapeLoaded=true;
function init(){
 const language=(document.documentElement.lang||'fr').toLowerCase().split('-')[0];
 const translations={
  fr:{enter:'↻ Affichage horizontal',exit:'↙ Quitter le plein écran',label:'Affichage du jeu',help:'Sur Android, active « Rotation auto » dans les réglages rapides, puis tourne le téléphone. Sur iPhone ou iPad, désactive le verrouillage de l’orientation, puis tourne l’appareil. Si nécessaire, ouvre ce jeu directement dans Chrome ou Safari plutôt que dans l’ENT.',fallback:'Active la rotation automatique, puis tourne ton appareil. Tu peux aussi continuer à jouer en portrait.'},
  en:{enter:'↻ Landscape view',exit:'↙ Exit full screen',label:'Game display',help:'On Android, turn on Auto-rotate in quick settings, then turn your phone. On iPhone or iPad, turn off orientation lock, then turn the device. If needed, open this game directly in Chrome or Safari rather than in the school portal.',fallback:'Turn on auto-rotate, then turn your device. You can also keep playing in portrait view.'},
  es:{enter:'↻ Vista horizontal',exit:'↙ Salir de pantalla completa',label:'Vista del juego',help:'En Android, activa «Girar automáticamente» en los ajustes rápidos y gira el teléfono. En iPhone o iPad, desactiva el bloqueo de orientación y gira el dispositivo. Si es necesario, abre el juego directamente en Chrome o Safari en lugar del portal escolar.',fallback:'Activa la rotación automática y gira el dispositivo. También puedes seguir jugando en vertical.'},
  zh:{enter:'↻ 横屏显示',exit:'↙ 退出全屏',label:'游戏显示',help:'在安卓设备上，请在快捷设置中开启“自动旋转”，然后横放手机。在 iPhone 或 iPad 上，请关闭屏幕方向锁定，然后横放设备。如有需要，请直接使用 Chrome 或 Safari 打开游戏，而不是通过学校平台打开。',fallback:'请开启自动旋转，然后横放设备。你也可以继续使用竖屏玩游戏。'}
 };
 const text=translations[language]||translations.fr;
 let button=document.getElementById('horizontal-toggle');
 let tools=button?.closest('.horizontal-tools');
 if(!tools){tools=document.createElement('div');tools.className='horizontal-tools';document.body.prepend(tools);}
 tools.classList.add('bleja-landscape-tools','notranslate');tools.setAttribute('translate','no');tools.setAttribute('role','group');tools.setAttribute('aria-label',text.label);
 if(!button){button=document.createElement('button');button.id='horizontal-toggle';button.type='button';tools.prepend(button);}
 let status=document.getElementById('horizontal-status');
 if(!status){status=document.createElement('p');status.id='horizontal-status';tools.append(status);}
 status.hidden=true;status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 button.type='button';button.setAttribute('aria-controls',status.id);
 const style=document.createElement('style');style.dataset.blejaLandscape='';
 style.textContent=`
 .bleja-landscape-tools{box-sizing:border-box;position:fixed;z-index:2147483000;top:0;left:0;right:0;flex:none;max-width:none;width:100%;margin:0;pointer-events:none;padding:10px max(12px,env(safe-area-inset-right)) 10px max(12px,env(safe-area-inset-left));display:flex;flex-wrap:wrap;align-items:center;gap:9px}
 .bleja-landscape-tools>*{pointer-events:auto}
 .bleja-landscape-tools #horizontal-toggle{box-sizing:border-box;position:static;display:inline-flex;align-items:center;justify-content:center;max-width:100%;width:auto;min-height:44px;padding:10px 16px;border:2px solid #16706c;border-radius:12px;color:#fff;background:linear-gradient(#258f86,#12615f);box-shadow:0 4px 0 #093e3d;font:700 14px/1.3 system-ui,sans-serif;text-align:center;text-transform:none;letter-spacing:normal;white-space:normal;cursor:pointer;touch-action:manipulation}
 .bleja-landscape-tools #horizontal-toggle:focus-visible{outline:3px solid #efb34f;outline-offset:3px}
 .bleja-landscape-tools #horizontal-toggle:disabled{opacity:.65;cursor:wait}
 .bleja-landscape-tools #horizontal-status{box-sizing:border-box;flex-basis:100%;background:#fff8dc;border:1px solid #c4a864;border-radius:10px;color:#3e3420;padding:9px 12px;margin:0;font:14px/1.5 system-ui,sans-serif;text-shadow:none;letter-spacing:normal;max-height:35vh;overflow:auto}
 .bleja-landscape-tools #horizontal-status[hidden]{display:none!important}
 html:fullscreen{overflow:auto}html:fullscreen body{min-height:100%;overflow:auto}
 @media(orientation:landscape) and (max-height:600px){.bleja-landscape-tools{padding-top:6px;padding-bottom:6px}.bleja-landscape-tools #horizontal-toggle{min-height:36px;padding:6px 12px;font-size:12px}.bleja-landscape-tools #horizontal-status{font-size:12px}}
 `;document.head.append(style);
 // Fixed game menus and flex-based bodies must not hide or push this control off screen.
 const body=document.body,originalPadding=parseFloat(getComputedStyle(body).paddingTop)||0;
 body.style.boxSizing='border-box';
 function reserveSpace(){body.style.paddingTop=(originalPadding+tools.getBoundingClientRect().height)+'px';}
 reserveSpace();
 if(window.ResizeObserver)new ResizeObserver(reserveSpace).observe(tools);
 else addEventListener('resize',reserveSpace);
 const isFull=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
 const landscape=()=>matchMedia('(orientation:landscape)').matches;
 function message(value){status.textContent=value;status.hidden=!value;}
 function sync(){const full=isFull();button.textContent=full?text.exit:text.enter;button.setAttribute('aria-pressed',String(full));}
 button.addEventListener('click',async()=>{
  button.disabled=true;
  try{
   if(isFull()){
    if(screen.orientation?.unlock)screen.orientation.unlock();
    if(document.exitFullscreen)await document.exitFullscreen();else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
    message('');return;
   }
   const root=document.documentElement,enter=root.requestFullscreen||root.webkitRequestFullscreen;
   if(enter){try{await enter.call(root);}catch{}}
   let locked=false;
   if(screen.orientation?.lock){try{await screen.orientation.lock('landscape');locked=true;}catch{}}
   message(locked||landscape()?'':text.help);
  }catch{message(landscape()?'':text.fallback);}
  finally{button.disabled=false;sync();}
 });
 document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);
 addEventListener('orientationchange',()=>{if(landscape())message('');});
 sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
