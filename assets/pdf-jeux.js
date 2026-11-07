/* Bouton commun aux jeux : uniquement leurs PDF, vérifiés avant affichage. */
(()=>{'use strict';
if(window.blejaPdfReady)return;window.blejaPdfReady=true;
const own=document.currentScript;
const assetBase=new URL('.',own&&own.src||'https://bleja972.github.io/assets/pdf-jeux.js');
const origin=assetBase.origin;
const route=value=>{const p=new URL(value,location.href).pathname.replace(/\/index\.html$/i,'/').replace(/\/+$/,'');return (p||'/').toLowerCase()};
const here=route(location.href);
if(here==='/'||/^\/(?:fiches|imprimer|parents|parcours|matieres|competences|assets|pdf)(?:\/|$)/.test(here)||/^\/(?:en|es|zh)$/.test(here))return;
function pdfURL(value){try{const u=new URL(value,origin);return u.origin===origin&&u.pathname.startsWith('/pdf/')&&/\.pdf$/i.test(u.pathname)?u.href:null}catch(_){return null}}
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el}
async function start(){
 const existing=[...document.querySelectorAll('a[href]')].map(a=>({url:pdfURL(a.href),label:(a.textContent||'').trim(),anchor:a})).filter(x=>x.url);
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),9000);
 let configured=[];
 try{const r=await fetch(new URL('pdf-par-jeu.json',assetBase),{cache:'no-cache',signal:ctrl.signal});if(r.ok){const map=await r.json();for(const [path,items]of Object.entries(map))if(route(path)===here&&Array.isArray(items))configured.push(...items)}}catch(_){}
 const unique=new Map();for(const item of [...configured,...existing]){const url=pdfURL(item.url);if(url&&!unique.has(url))unique.set(url,{url,label:String(item.label||'Exercices et fiche à imprimer').slice(0,150)})}
 if(!unique.size){clearTimeout(timer);return}
 const verified=await Promise.all([...unique.values()].map(async item=>{try{const r=await fetch(item.url,{method:'HEAD',cache:'no-cache',signal:ctrl.signal});const type=r.headers.get('content-type')||'';return r.ok&&/application\/pdf/i.test(type)?item:null}catch(_){return null}}));clearTimeout(timer);
 const files=verified.filter(Boolean);if(!files.length||!document.body||document.getElementById('bleja-pdf-dock'))return;
 show(files,existing);
}
function show(files,existing){
 const style=node('style');style.id='bleja-pdf-style';style.textContent=`
#bleja-pdf-dock{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147481000;width:max-content;max-width:calc(100vw - 28px);margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;text-align:left;line-height:1.3;isolation:isolate}
#bleja-pdf-dock *{box-sizing:border-box}
#bleja-pdf-dock .bp-action{appearance:none;display:flex;align-items:center;justify-content:center;gap:10px;margin:0;padding:10px 16px;min-height:58px;border:2px solid #fff1b6;border-bottom-color:#c18322;border-radius:15px;background:linear-gradient(160deg,#fff0a2 0%,#ffd154 48%,#f2ad2d 100%);box-shadow:0 6px 0 #9d5a09,0 11px 18px #0005,inset 0 2px 0 #fff9;color:#382606;text-decoration:none;font:700 16px/1.2 Arial,sans-serif;letter-spacing:0;text-transform:none;cursor:pointer;transition:transform .15s,box-shadow .15s;white-space:nowrap;opacity:1;filter:none}
#bleja-pdf-dock .bp-action:hover{transform:translateY(-2px);box-shadow:0 8px 0 #9d5a09,0 14px 22px #0005,inset 0 2px 0 #fff9}
#bleja-pdf-dock .bp-action:active{transform:translateY(4px);box-shadow:0 2px 0 #9d5a09,0 5px 9px #0004}
#bleja-pdf-dock .bp-action:focus-visible,#bleja-pdf-dock a:focus-visible,#bleja-pdf-dock .bp-close:focus-visible{outline:3px solid #087aaf;outline-offset:4px}
#bleja-pdf-dock .bp-paper{display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0;width:33px;height:38px;border:1px solid #e4b4a1;border-radius:4px 9px 4px 4px;background:linear-gradient(135deg,#fff,#fff6ee);color:#b42719;font:800 10px Arial,sans-serif;box-shadow:2px 3px 0 #ae6d3233;transform:rotate(-5deg)}
#bleja-pdf-dock .bp-paper:after{content:'';position:absolute;top:0;right:0;border-left:8px solid #ffe0c5;border-top:8px solid #f5be4a;border-bottom:0;border-radius:0 6px 0 0}
#bleja-pdf-dock .bp-words{display:block;text-align:left}
#bleja-pdf-dock .bp-sub{display:block;margin-top:3px;font:400 11px/1.2 Arial,sans-serif;color:#5d4318}
#bleja-pdf-dock .bp-panel{position:absolute;right:0;bottom:76px;width:min(350px,calc(100vw - 28px));max-height:min(65vh,420px);overflow:auto;padding:15px;border:2px solid #d89a32;border-radius:15px;background:#fffdf6;color:#283946;box-shadow:0 12px 36px #0005;font:14px/1.4 Arial,sans-serif;white-space:normal}
#bleja-pdf-dock .bp-panel[hidden]{display:none!important}
#bleja-pdf-dock .bp-panel-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}
#bleja-pdf-dock h2{margin:0;color:#283946;text-align:left;font:700 17px/1.3 Arial,sans-serif;text-transform:none;letter-spacing:0;text-shadow:none}
#bleja-pdf-dock .bp-close{appearance:none;margin:0;min-width:32px;min-height:32px;padding:4px;border:1px solid #e2c58a;border-radius:7px;background:#fff0cc;color:#493413;font:700 20px/1 Arial,sans-serif;box-shadow:none;cursor:pointer}
#bleja-pdf-dock .bp-panel ul{margin:0;padding:0;list-style:none}
#bleja-pdf-dock .bp-panel li{margin:7px 0;padding:0;list-style:none}
#bleja-pdf-dock .bp-file{display:block;padding:11px 12px;border:1px solid #d6dfdf;border-radius:9px;background:#f3f8f5;color:#204e3c;text-decoration:none;font:700 13px/1.4 Arial,sans-serif;white-space:normal;box-shadow:none;text-transform:none;letter-spacing:0}
#bleja-pdf-dock .bp-file:hover{background:#e6f2e9;border-color:#87b49a}
#bleja-pdf-dock .bp-hint{margin:11px 0 0;padding:0;color:#67717a;font:400 11px/1.4 Arial,sans-serif}
[data-bleja-pdf-replaced]{display:none!important}
@media(max-width:480px){#bleja-pdf-dock{right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px))}#bleja-pdf-dock .bp-action{font-size:14px;padding:9px 12px;gap:8px;min-height:54px}#bleja-pdf-dock .bp-paper{width:29px;height:34px}#bleja-pdf-dock .bp-sub{font-size:10px}}
@media(prefers-reduced-motion:reduce){#bleja-pdf-dock .bp-action{transition:none}}
@media print{#bleja-pdf-dock{display:none!important}}
`;
 document.head.append(style);
 const dock=node('aside');dock.id='bleja-pdf-dock';dock.setAttribute('aria-label','Exercices PDF du jeu');
 const action=node(files.length===1?'a':'button','bp-action');if(files.length>1)action.type='button';
 const icon=node('span','bp-paper','PDF');icon.setAttribute('aria-hidden','true');const words=node('span','bp-words','PDF à imprimer');words.append(node('span','bp-sub',files.length===1?'Exercices du jeu':files.length+' fiches au choix'));action.append(icon,words);
 if(files.length===1){action.href=files[0].url;action.target='_blank';action.rel='noopener';action.type='application/pdf';action.setAttribute('aria-label','PDF à imprimer — exercices du jeu, nouvel onglet');action.title=files[0].label;action.dataset.goatcounterClick='pdf-jeu-'+here.replace(/[^a-z0-9]+/g,'-');}
 else{
  const panel=node('section','bp-panel');panel.id='bleja-pdf-panel';panel.hidden=true;panel.setAttribute('aria-label','Choisir la fiche PDF');const head=node('div','bp-panel-head');head.append(node('h2','', 'Choisis ta fiche PDF'));const close=node('button','bp-close','×');close.type='button';close.setAttribute('aria-label','Fermer le choix des PDF');head.append(close);panel.append(head);const list=node('ul');
  for(const file of files){const li=node('li'),a=node('a','bp-file',file.label+' ↗');a.href=file.url;a.target='_blank';a.rel='noopener';a.type='application/pdf';a.dataset.goatcounterClick='pdf-jeu-'+here.replace(/[^a-z0-9]+/g,'-');a.addEventListener('click',()=>setOpen(false));li.append(a);list.append(li)}panel.append(list,node('p','bp-hint','Chaque PDF s’ouvre dans un nouvel onglet pour être imprimé.'));dock.append(panel);
  action.setAttribute('aria-controls',panel.id);action.setAttribute('aria-expanded','false');
  function setOpen(open){panel.hidden=!open;action.setAttribute('aria-expanded',String(open))}
  action.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>{setOpen(false);action.focus()});document.addEventListener('pointerdown',e=>{if(!dock.contains(e.target))setOpen(false)});dock.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){setOpen(false);action.focus();e.stopPropagation()}});
 }
 dock.append(action);document.body.append(dock);
 const pad=parseFloat(getComputedStyle(document.body).paddingBottom)||0;document.body.style.paddingBottom=(pad+94)+'px';
 if(files.length===1)for(const item of existing)if(item.url===files[0].url)item.anchor.setAttribute('data-bleja-pdf-replaced','');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>start().catch(()=>{}),{once:true});else start().catch(()=>{});
})();