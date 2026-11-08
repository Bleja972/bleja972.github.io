(async()=>{
'use strict';
const labels={
 fr:{back:'← Tous les jeux',direct:'Ouvrir directement le jeu ↗',missing:'Choisis un jeu depuis le catalogue.',error:'Ce jeu ne peut pas être chargé. Reviens au catalogue pour choisir un jeu.',navigation:'Navigation du jeu'},
 en:{back:'← All games',direct:'Open the game directly ↗',missing:'Choose a game from the catalogue.',error:'This game could not be loaded. Return to the catalogue to choose a game.',navigation:'Game navigation'},
 es:{back:'← Todos los juegos',direct:'Abrir el juego directamente ↗',missing:'Elige un juego del catálogo.',error:'No se pudo cargar este juego. Vuelve al catálogo para elegir un juego.',navigation:'Navegación del juego'},
 zh:{back:'← 所有游戏',direct:'直接打开游戏 ↗',missing:'请从目录中选择一个游戏。',error:'无法加载此游戏。请返回目录选择游戏。',navigation:'游戏导航'}
};
const lang=document.documentElement.lang in labels?document.documentElement.lang:'fr',text=labels[lang],$=id=>document.getElementById(id);
$('catalogue-link').href=lang==='fr'?'/?lang=fr':'/'+lang+'/?lang='+lang;
$('catalogue-link').textContent=text.back;$('direct-link').textContent=text.direct;document.querySelector('.game-links').setAttribute('aria-label',text.navigation);$('missing').textContent=text.missing;
const id=new URLSearchParams(location.search).get('jeu');if(!id)return;
try{
 const response=await fetch('/assets/landscape-game-links.json?v=all-languages-20261108');if(!response.ok)throw Error('manifest');
 const games=await response.json(),key=lang+':'+id;if(!Object.hasOwn(games,key))throw Error('unknown game');
 const game=games[key],url=new URL(game.url,'https://bleja972.github.io/');if(!['http:','https:'].includes(url.protocol))throw Error('invalid url');
 document.title=game.title;$('game-title').textContent=game.title;$('direct-link').href=url.href;$('direct-link').hidden=false;
 const frame=document.createElement('iframe');frame.title=game.title;frame.src=url.href;frame.allow='fullscreen; autoplay';frame.allowFullscreen=true;frame.dataset.blejaGameFrame='';$('game-container').replaceChildren(frame);
}catch{$('missing').textContent=text.error;}
})();
