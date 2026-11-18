(()=>{
'use strict';
const slug=location.pathname.split('/').filter(Boolean).pop()||'';
const assets={
space:'/assets/mars/systeme-solaire.webp',
forest:'/assets/tables-sorcellerie/foret.webp',
ocean:'/assets/images/bannieres/openai/mission-nautilus.webp',
coral:'/assets/images/bannieres/openai/bulles-de-corail-pairs-impairs.webp',
australia:'/jeux/chemin-du-kangourou/australie.webp',
beach:'/jeux/crabes-des-salines/plage.webp',
jungle:'/assets/images/bannieres/openai/chemin-du-kangourou.webp',
temple:'/assets/images/bannieres/openai/temple-des-doubles.webp',
valley:'/assets/images/bannieres/openai/vallee-des-moities.webp',
castle:'/jeux/chateau-nombres-exterieur-cp/assets/apercu.webp',
fritz:'/assets/fritz-encadrements/apercu.webp'
};
const themes=[
['forest','enchanted|tables-enchantees|sorciere|witch|halloween|wizard|sorcellerie|chronomaths-enchantes|complements1|complements_a_'],
['space','montessori|orbit|mars|galactic|divisions|chronomaths-galactiques|calcul-pop'],
['coral','coral|number-fish|fish|abysses|deep-sea'],
['ocean','nautilus|popeye|sea'],
['australia','kangaroo'],
['beach','crabs|salines|tombolo'],
['jungle','dino|t-rex|trex|number-line|number-sequences'],
['temple','temple|doubles'],
['valley','vallee|halves|near-doubles|presque-doubles|earth|ile-mysterieuse'],
['castle','castle|chateau'],
['fritz','fritz']
];
let theme='numbers';
for(const [key,match] of themes)if(new RegExp(match).test(slug)){theme=key;break}
const p={
numbers:['#053a56','#177fa5','#8ae5ef'],
space:['#050d28','#24367b','#9ed8ff'],
forest:['#0c291d','#296d52','#c5ef9e'],
coral:['#032a43','#087c9a','#9af5ea'],
ocean:['#052338','#08849c','#b6f0fa'],
australia:['#542a17','#af703e','#fbe0a3'],
beach:['#064e64','#458e85','#ffe2aa'],
jungle:['#13271a','#2c6344','#f3d781'],
temple:['#332213','#875d29','#f3d995'],
valley:['#152a4a','#4d7095','#e9ecae'],
castle:['#202242','#5377a3','#f7ebbc'],
fritz:['#112e5c','#4156a9','#b6f5ff']
}[theme];
const id='en-game-backgrounds-20261117';
if(document.getElementById(id))return;
const image=assets[theme]?'url("'+assets[theme]+'")':'none';
const gradient='radial-gradient(ellipse at 16% 13%,'+p[2]+'55,transparent 52%),linear-gradient(145deg,'+p[0]+'e8,'+p[1]+'c9 60%,'+p[0]+'ed)';
const css=[
':root{--english-scene-accent:'+p[2]+';--english-scene-color:'+p[1]+';}',
'html{background:'+p[0]+'!important}',
'body{background-image:'+gradient+','+image+'!important;background-position:center,center!important;background-size:cover,cover!important;background-attachment:fixed,fixed!important}',
'body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at 75% 14%,'+p[2]+'35,transparent 34%)}',
':where(.scene,.game-scene,.game-stage,.game-world,.game-arena,.play-scene){background-image:'+gradient+','+image+'!important;background-size:cover,cover!important;background-position:center,center!important}',
':where(.shell,.app,.page,.wrapper){background-color:transparent}'
].join('\n');
const style=document.createElement('style');style.id=id;style.textContent=css;document.head.appendChild(style);
document.documentElement.setAttribute('data-english-background',theme);
function applyFrame(frame){try{const d=frame.contentDocument;if(!d?.head||d.getElementById(id))return;const s=d.createElement('style');s.id=id;s.textContent=css;d.head.appendChild(s)}catch(e){}}
for(const frame of document.querySelectorAll('iframe')){frame.addEventListener('load',()=>applyFrame(frame));if(frame.contentDocument?.readyState==='complete')applyFrame(frame)}
})();