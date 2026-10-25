/* Jeux conseillés : affichés uniquement au bilan de la partie. */
(()=>{'use strict';
const loader=document.currentScript;
if(!loader||document.getElementById('jeux-conseilles'))return;
let config;try{config=JSON.parse(loader.dataset.recommendations)}catch(e){return}
const panel=document.createElement('section');panel.id='jeux-conseilles';panel.hidden=true;panel.setAttribute('aria-labelledby','jeux-conseilles-title');
const style=document.createElement('style');style.textContent='#jeux-conseilles{box-sizing:border-box;clear:both;width:100%;max-width:100%;margin:22px auto;padding:20px;border:2px solid #b7d9c5;border-radius:18px;background:#f1faf4;color:#173f30;font:16px/1.5 Arial,sans-serif;text-align:left;overflow-wrap:anywhere}#jeux-conseilles[hidden]{display:none!important}#jeux-conseilles h2{font:700 23px/1.25 Arial,sans-serif;margin:0 0 8px;color:#173f30}#jeux-conseilles p{margin:0 0 14px}#jeux-conseilles .jc-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:12px}#jeux-conseilles a{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px;border-radius:12px;background:#176346;color:#fff;text-decoration:none;font:700 16px/1.4 Arial,sans-serif;text-align:center;white-space:normal}#jeux-conseilles a:hover{background:#104a34}#jeux-conseilles a:focus-visible{outline:3px solid #df9600;outline-offset:3px}#jeux-conseilles .jc-home{margin-top:14px;background:white;color:#173f30;border:1px solid #8eb69e}';
document.head.append(style);
const title=document.createElement('h2');title.id='jeux-conseilles-title';title.textContent='Pour continuer à apprendre';
const intro=document.createElement('p');intro.textContent='Choisis un autre jeu pour poursuivre ton entraînement.';
const links=document.createElement('div');links.className='jc-links';
for(const game of config.games){const a=document.createElement('a');a.href=game.url;a.target='_top';a.textContent=game.title;links.append(a)}
const home=document.createElement('a');home.href='https://bleja972.github.io/?lang=fr';home.target='_top';home.className='jc-home';home.textContent='🏠 Tous les jeux du blog';
panel.append(title,intro,links,home);
function visible(el){if(!el||!el.isConnected)return false;for(let p=el;p&&p!==document;p=p.parentElement){if(p.hidden)return false;const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return false}return true}
let queued=false;
const observer=new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(update)}});
function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style','disabled']})}
function update(){queued=false;observer.disconnect();
const anchor=document.querySelector(config.selector);
let finished=visible(anchor)&&(!config.match||new RegExp(config.match,'i').test(anchor.textContent));
if(finished&&config.questions){const choices=[...anchor.querySelectorAll('.choice')];finished=choices.length>0&&choices.every(b=>b.disabled)}
if(finished){if(config.match){if(panel.previousElementSibling!==anchor)anchor.after(panel)}else if(panel.parentElement!==anchor){anchor.append(panel)}panel.hidden=false}
else panel.hidden=true;
observe()}
update();
})();