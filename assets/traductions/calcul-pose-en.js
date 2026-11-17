/* Accessible English overlay for column arithmetic games, preserving the original French sources. */
(function(){
'use strict';
const exact=new Map(Object.entries({
"Tous les jeux du blog":"All learning games","Tous les jeux":"All games","Voir tous les jeux du blog":"See all games",
"Choisis ton niveau":"Choose your level","Choisis ta mission":"Choose your mission","Changer de niveau":"Change level","Choisir un niveau":"Choose a level",
"Rejouer ce niveau":"Play this level again","Rejouer":"Play again","Menu":"Menu",
"Vérifier ✓":"Check ✓","✓ Vérifier":"✓ Check","Vérifier":"Check","Effacer":"Clear","Un coup de pouce":"Need a hint?",
"Voir la réponse de la colonne":"Show the column answer","Soustraction suivante →":"Next subtraction →","Colonne suivante →":"Next column →",
"Les unités":"Ones","Les dizaines":"Tens","Les centaines":"Hundreds",
"Un échange":"One carry","Deux échanges":"Two carries","Des unités vers les dizaines.":"From ones to tens.",
"Des unités vers les dizaines, puis des dizaines vers les centaines.":"From ones to tens, then tens to hundreds.",
"Choisis ton niveau":"Choose your level","Choisis ta mission":"Choose your mission","CENTRE DE COMMANDE":"MISSION CONTROL",
"Additions terminées":"Additions completed","Clavier de calcul":"Number keypad",
"Effacer le dernier chiffre":"Delete last digit","Vérifier la réponse":"Check answer",
"Calculs déjà réalisés":"Previous calculations","Soustraction posée":"Column subtraction",
"Jouer en paysage":"Play in landscape","↻ Jouer en paysage":"↻ Play in landscape",
"Son : désactivé":"Sound: off","Son : activé":"Sound: on",
"Effets : activés":"Effects: on","Effets : désactivés":"Effects: off",
"🔇 Son désactivé":"🔇 Sound off","🔊 Son activé":"🔊 Sound on",
"Mission terminée !":"Mission complete!","Bravo pour ton entraînement !":"Well done!",
"Soustractions en orbite":"Subtractions in Orbit","Les additions en orbite":"Additions in Orbit",
"Les additions sans échange en orbite":"Additions in Orbit — No Carrying",
"Soustractions sans échange":"Subtractions without regrouping",
"MISSION ORBITALE • CE1":"ORBIT MISSION • Year 3",
"MISSION ORBITE · CE1 / CE2":"ORBIT MISSION · Years 3–4",
"10 additions par partie. Calcule une colonne à la fois.":"10 additions per game. Work one column at a time.",
"J’aligne les chiffres et je calcule, sans retenue, dans le système solaire.":"Line up the digits and add without carrying, in the solar system.",
"Je calcule en colonnes et je propulse la retenue vers sa nouvelle orbite.":"Add in columns and launch the carry into its new orbit.",
"Pose et calcule des soustractions sans échange, colonne par colonne.":"Set out and solve subtractions without regrouping, one column at a time.",
"Commence par les unités, puis les dizaines et les centaines. Il n’y a jamais d’emprunt. Pour chaque colonne, écris la différence et vérifie ta réponse.":"Start with the ones, then tens and hundreds. No borrowing is needed. Enter the difference for each column and check your answer.",
"Voyage des retenues · 10 additions par mission":"Carrying mission · 10 additions per game",
"Une addition entièrement juste au premier essai, sans afficher de réponse, vaut un point.":"One point for each addition solved correctly on the first try without revealing an answer.",
"Un coup de pouce":"Need a hint?","Une dizaine":"One ten","Une centaine":"One hundred",
"Exercices à imprimer":"Printable worksheets","↓ 7 fiches et corrigés (PDF)":"↓ 7 worksheets and answers (PDF)",
"📄 Exercices à imprimer":"📄 Printable worksheets","7 niveaux d’additions":"7 levels of additions",
"42 exercices à imprimer · Cercles pour les retenues · Corrigés inclus":"42 printable exercises · Carry circles · Answer key included",
"Un zéro à gauche est inutile.":"A leading zero is not needed.",
"Case vide : zéro initial inutile":"Empty box: leading zero not needed",
"Le déplacement a été interrompu. Clique sur Reprendre pour continuer.":"The movement stopped. Click Resume to continue.",
"Active « Rotation auto » dans les réglages rapides d’Android, puis tourne le téléphone. Tu peux aussi continuer à jouer en portrait.":"Enable Auto-rotate in Android quick settings, then rotate your phone. You can also keep playing in portrait mode."
}));
const phrases=[
[/^Niveau (\d+)\s*•\s*(\d+) chiffres?$/i,(_,n,d)=>'Level '+n+' • '+d+' digits'],
[/^Opération (\d+)\s*\/\s*(\d+)$/i,(_,a,b)=>'Question '+a+' / '+b],
[/^Réussite\s*:\s*(\d+)\s*\/\s*(\d+)$/i,(_,a,b)=>'Score: '+a+' / '+b],
[/^(\d+)\s*%\s*de soustractions réussies au premier essai$/i,(_,n)=>n+'% of subtractions correct on the first attempt'],
[/^(\d+)\s*%\s*de réussite au premier essai$/i,(_,n)=>n+'% correct on the first attempt'],
[/^Une addition entièrement juste/i,()=> 'One point for each addition solved correctly on the first attempt.']
];
const replaceParts=[
[/\bVérifier\b/g,'Check'],[/\bEffacer\b/g,'Clear'],[/\bRejouer\b/g,'Play again'],
[/\bNiveau\b/g,'Level'],[/\bniveau\b/g,'level'],[/\bOpération\b/g,'Question'],[/\bopération\b/g,'question'],
[/\bSoustraction\b/g,'Subtraction'],[/\bsoustraction\b/g,'subtraction'],[/\bSoustractions\b/g,'Subtractions'],[/\bsoustractions\b/g,'subtractions'],
[/\bAdditions\b/g,'Additions'],[/\badditions\b/g,'additions'],[/\bAddition\b/g,'Addition'],[/\baddition\b/g,'addition'],
[/\bunités\b/g,'ones'],[/\bUnités\b/g,'Ones'],[/\bdizaines\b/g,'tens'],[/\bDizaines\b/g,'Tens'],[/\bcentaines\b/g,'hundreds'],[/\bCentaines\b/g,'Hundreds'],
[/\bchiffres\b/g,'digits'],[/\bchiffre\b/g,'digit'],
[/\bsans échange\b/g,'without regrouping'],[/\bavec échanges\b/g,'with regrouping'],
[/\béchanges\b/g,'regroupings'],[/\béchange\b/g,'regrouping'],
[/\bretenues\b/g,'carries'],[/\bretenue\b/g,'carry'],
[/\bcalculs\b/g,'calculations'],[/\bcalcul\b/g,'calculation'],
[/\bcolonne suivante\b/gi,'next column'],[/\bcolonne\b/g,'column'],[/\bColonne\b/g,'Column'],
[/\bÉcris\b/g,'Write'],[/\bécris\b/g,'write'],[/\bcorrecte\b/g,'correct'],
[/\bRéponse\b/g,'Answer'],[/\bréponse\b/g,'answer'],
[/\bBravo\b/g,'Well done'],[/\bErreur\b/g,'Try again'],[/\bFaux\b/g,'Not quite'],
[/\bScore\b/g,'Score'],[/\bExemple\b/g,'Example'],
[/\bJouer\b/g,'Play'],[/\bMenu\b/g,'Menu']
];
function translate(s){
 if(!s||!s.trim())return s;
 const prefix=(s.match(/^\s*/)||[''])[0],suffix=(s.match(/\s*$/)||[''])[0],v=s.trim();
 if(exact.has(v))return prefix+exact.get(v)+suffix;
 for(const [re,fn] of phrases){if(re.test(v))return prefix+v.replace(re,fn)+suffix}
 let out=v;
 for(const [re,sub] of replaceParts)out=out.replace(re,sub);
 return prefix+out+suffix;
}
function attach(frame){
 let doc;
 try{doc=frame.contentDocument;if(!doc||!doc.body)throw Error('frame not ready')}catch(e){
  document.getElementById('translation-status').textContent='This game could not be translated automatically. You can open the original French game instead.';
  return;
 }
 doc.documentElement.lang='en';
 doc.documentElement.setAttribute('data-english-ui','yes');
 const attrNames=['placeholder','aria-label','title'];
 function run(root){
  if(!root||root.nodeType===8)return;
  if(root.nodeType===3){if(root.parentElement&&/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE)$/i.test(root.parentElement.tagName))return;
   const v=translate(root.nodeValue);if(v!==root.nodeValue)root.nodeValue=v;return}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  if(root.nodeType===1){
   if(/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE)$/i.test(root.tagName))return;
   for(const n of attrNames)if(root.hasAttribute(n)){
    const before=root.getAttribute(n),after=translate(before);
    if(after!==before)root.setAttribute(n,after);
   }
  }
  const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes)run(node);
  if(root.nodeType===1){
   const all=root.querySelectorAll('[aria-label],[placeholder],[title]');
   for(const elem of all){for(const n of attrNames)if(elem.hasAttribute(n)){const before=elem.getAttribute(n),after=translate(before);if(after!==before)elem.setAttribute(n,after)}}
  }
 }
 let queued=false;
 function flush(){
  queued=false;observer.disconnect();
  run(doc.body);
  observer.observe(doc.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:attrNames});
 }
 const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(flush)});
 run(doc.body);
 observer.observe(doc.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:attrNames});
 const status=document.getElementById('translation-status');if(status)status.textContent='English interface active. The original French version is unchanged.';
}
window.addEventListener('DOMContentLoaded',()=>{
 const frame=document.getElementById('original-game');
 if(!frame)return;
 frame.addEventListener('load',()=>attach(frame));
});
})();