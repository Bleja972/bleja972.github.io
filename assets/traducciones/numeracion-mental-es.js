/* Traducción al español de interfaces de numeración y cálculo mental.
 * Se ejecuta únicamente en la página española, sobre un iframe del mismo origen.
 * Los juegos originales no se modifican.
 */
(()=>{'use strict';
const T={
'↻ Affichage horizontal':'↻ Vista horizontal','← Retour au blog':'← Volver al blog',
'← Retour aux jeux':'← Volver a los juegos','← Les jeux de CP':'← Juegos de CP',
'← Les jeux de CE2':'← Juegos de CE2','← Jeux de numération CE1':'← Juegos de numeración CE1',
'← Tous les jeux du blog':'← Todos los juegos del blog','← Retour au blog':'← Volver al blog',
'Français':'Francés','English':'Inglés','Español':'Español',
'Accueil':'Inicio','Menu':'Menú','Blog':'Blog','Rejouer':'Volver a jugar',
'Vérifier':'Comprobar','Valider':'Confirmar','Valider ✓':'Comprobar ✓',
'Vérifier ↗':'Comprobar ↗','Effacer':'Borrar',
'Effacer la dernière':'Borrar la última','Tout effacer':'Borrar todo',
'Nouvelle grille':'Nueva cuadrícula','↻ Nouvelle série':'↻ Nueva serie',
'Nouvelle série':'Nueva serie','Défi suivant →':'Siguiente reto →',
'Nombre suivant →':'Siguiente número →','Traversée suivante':'Siguiente travesía',
'Série suivante':'Siguiente serie','Rejouer ce niveau':'Repetir este nivel',
'Choisir un niveau':'Elegir nivel','Choisis ton niveau':'Elige un nivel',
'Choisis ta mission':'Elige una misión','Choisis ton parcours':'Elige un recorrido',
'Choisir un parcours':'Elegir recorrido','Choisis ta série':'Elige una serie',
'Choisis le sens du rangement':'Elige el orden',
'Du plus petit au plus grand':'De menor a mayor',
'Du plus grand au plus petit':'De mayor a menor',
'Les deux sens':'Ambos sentidos',
'Décomposer':'Descomponer','Recomposer':'Componer',
'Centaines':'Centenas','Dizaines':'Decenas','Unités':'Unidades',
'Défi':'Reto','Niveau':'Nivel','Série':'Serie','Réponse':'Respuesta',
'Ta réponse':'Tu respuesta','Ma réponse':'Mi respuesta',
'Réussite':'Aciertos','Résultat':'Resultado','Score':'Puntuación',
'Bonnes réponses':'Respuestas correctas','Justes du premier coup :':'Correctas al primer intento:',
'Voir la correction':'Ver la solución','Afficher la consigne':'Mostrar la instrucción',
'Réécouter':'Escuchar de nuevo','🔊 Réécouter':'🔊 Escuchar de nuevo',
'Une aide':'Una pista','💡 Une aide':'💡 Una pista',
'Aide-moi à trouver':'Ayúdame a encontrar','le nombre !':'¡el número!',
'Vérifier mes réponses':'Comprobar mis respuestas',
'Écris ta réponse, puis valide.':'Escribe tu respuesta y compruébala.',
'Clique sur la bonne réponse.':'Pulsa la respuesta correcta.',
'Choisis ton niveau pour commencer.':'Elige un nivel para empezar.',
'Nombres pairs':'Números pares','Nombres impairs':'Números impares',
'Les crabes du tombolo':'Los cangrejos del tómbolo',
'Aide les crabes à rejoindre l’autre rive en traversant la langue de sable.':'Ayuda a los cangrejos a llegar a la otra orilla por la franja de arena.',
'Les crabes des Salines':'Los cangrejos de las Salinas',
'Range les crabes en cliquant sur leurs pancartes.':'Ordena los cangrejos pulsando sus carteles.',
'Crabes rangés':'Cangrejos ordenados','Crabes à choisir':'Cangrejos por elegir',
'← Crabes rangés':'← Cangrejos ordenados','Crabes à choisir →':'Cangrejos por elegir →',
'Partie terminée !':'¡Partida terminada!',
'Compose ton pseudo et choisis ton pays pour enregistrer ton score.':'Elige un apodo y un país para guardar tu puntuación.',
'Animal':'Animal','Qualité':'Cualidad','Pays ou territoire':'País o territorio',
'Enregistrer mon score':'Guardar mi puntuación','Rang':'Puesto','Pseudo':'Apodo','Pays':'País','Temps':'Tiempo','Mode':'Modo',
'Le château des nombres':'El castillo de los números',
'Bienvenue au château':'Bienvenido al castillo',
'des nombres !':'¡de los números!',
'Écoute, observe le tableau et trouve la bonne case.':'Escucha, observa la tabla y encuentra la casilla correcta.',
'Les familles de nombres':'Las familias de números',
'Écoute une famille, puis clique sur un nombre de cette famille pour colorier toute sa ligne.':'Escucha una familia y pulsa un número para colorear toda su fila.',
'Le nombre mystère':'El número misterioso',
'Écoute un nombre, puis retrouve sa case. Chaque famille garde sa couleur !':'Escucha un número y encuentra su casilla. ¡Cada familia conserva su color!',
'Un tableau de':'Una tabla del',
'10 familles à découvrir':'10 familias por descubrir',
'20 nombres à retrouver':'20 números por encontrar',
'La consigne est donnée à voix haute.':'La instrucción se lee en voz alta.',
'La voix n’est pas disponible sur cet appareil.':'La voz no está disponible en este dispositivo.',
'Mission accomplie':'Misión cumplida',
'Bravo, chevalier des nombres !':'¡Bravo, caballero de los números!',
'Le pourcentage indique les réponses justes au premier essai.':'El porcentaje muestra las respuestas correctas al primer intento.',
'Pour s’entraîner sur papier':'Para practicar en papel',
'Retrouve des exercices sur cette compétence dans le':'Encuentra actividades para practicar en el',
'cahier de mathématiques CP à imprimer':'cuaderno imprimible de matemáticas de CP',
'La planète de Fritz':'El planeta de Fritz',
'Un nombre.':'Un número.','Deux voisins. À toi de jouer !':'Dos vecinos. ¡Te toca!',
'MISSION ENCADREMENT · CP':'MISIÓN: ENCUADRAR NÚMEROS · CP',
'MISSION ENCADREMENT · CE1':'MISIÓN: ENCUADRAR NÚMEROS · CE1',
'MISSION ENCADREMENT · CE2':'MISIÓN: ENCUADRAR NÚMEROS · CE2',
'À l’unité':'A la unidad','À la dizaine':'A la decena',
'À la centaine':'A la centena','Au millier':'Al millar',
'Le nombre juste avant':'El número inmediatamente anterior',
'et le nombre juste après.':'y el número inmediatamente posterior.',
'La dizaine entière précédente':'La decena anterior',
'et la dizaine entière suivante.':'y la decena siguiente.',
'La centaine entière précédente':'La centena anterior',
'et la centaine entière suivante.':'y la centena siguiente.',
'Le millier entier précédent':'El millar anterior',
'et le millier entier suivant.':'y el millar siguiente.',
'Borne inférieure':'Límite inferior','Nombre à encadrer':'Número central',
'Borne supérieure':'Límite superior','🔊 Sons':'🔊 Sonidos',
'MISSION TERMINÉE':'MISIÓN TERMINADA','Bravo, explorateur !':'¡Muy bien, explorador!',
'Les encadrements de Fritz à imprimer':'Ejercicios imprimibles de encuadramiento',
'Le chemin du kangourou':'El camino del canguro',
'Australie · Labynombre':'Australia · Laberinto numérico',
'Colorie le chemin jusqu’au spinifex !':'¡Colorea el camino hasta el spinifex!',
'Départ ↓':'Salida ↓','Arrivée':'Llegada',
'Couleur du chemin : ocre du désert':'Color del camino: ocre del desierto',
'Un clic sur une case la colorie ; un nouveau clic l’efface.':'Pulsa una casilla para colorearla y vuelve a pulsarla para borrarla.',
'Les droites du T-Rex — CE1':'Las rectas numéricas del T-Rex — CE1',
'Les droites du T-Rex animé':'Las rectas animadas del T-Rex',
'La droite numérique du T-Rex':'La recta numérica del T-Rex',
'Quel nombre montre la flèche ?':'¿Qué número señala la flecha?',
'Observe la droite numérique, puis saisis ta réponse pour aider le T-Rex.':'Observa la recta numérica y escribe tu respuesta para ayudar al T-Rex.',
'Observe la droite numérique, puis clique sur la bonne case pour aider le T-Rex.':'Observa la recta numérica y pulsa la casilla correcta para ayudar al T-Rex.',
'Observe les nombres indiqués pour trouver le nombre montré par la flèche.':'Observa los números marcados para descubrir cuál señala la flecha.',
'Prends le temps d’observer. Chaque petit trait vaut 1.':'Observa con calma. Cada marca pequeña vale 1.',
'Les cinq niveaux mélangés →':'Los cinco niveles mezclados →',
'Les 42 défis mélangés →':'Los 42 retos mezclados →',
'Les 24 défis mélangés →':'Los 24 retos mezclados →',
'Bravo pour ton aventure !':'¡Bravo por tu aventura!',
'Toutes les réponses ont été trouvées. Rejoue pour progresser !':'¡Has encontrado todas las respuestas! Vuelve a jugar para mejorar.',
'Nombre à trouver':'Número que hay que encontrar',
'Choisir un niveau':'Elegir nivel','Choisir un parcours':'Elegir recorrido',
'La jungle':'La selva','Le volcan':'El volcán','La vallée':'El valle',
'Justes du premier coup':'Correctas al primer intento',
'Défi suivant':'Siguiente reto','Écris ton premier chiffre':'Escribe la primera cifra',
'↻ Revoir l’animation':'↻ Repetir la animación',
'SYSTÈME PRÊT · À TOI DE JOUER':'SISTEMA LISTO · ¡A JUGAR!',
'LABORATOIRE MONTESSORI':'LABORATORIO MONTESSORI',
'La magie des nombres':'La magia de los números',
'Les nombres en orbite':'Los números en órbita',
'Explore les nombres dans le laboratoire des cartons lumineux.':'Explora los números en el laboratorio de tarjetas luminosas.',
'Écris la valeur de chaque chiffre.':'Escribe el valor de cada cifra.',
'Les pointes sont superposées. Quels nombres se cachent dessous ?':'Las tarjetas están superpuestas. ¿Qué números se esconden debajo?',
'Complète l’addition en ligne.':'Completa la suma en línea.',
'Prends ton temps. Observe, écris, puis vérifie.':'Tómate tu tiempo. Observa, escribe y comprueba.',
'♫ Sons activés':'♫ Sonidos activados','✧ Effets activés':'✧ Efectos activados',
'Pour la classe · choisir un nombre':'Para clase · elegir un número',
'Afficher ce nombre':'Mostrar este número',
'Le nombre juste avant et le nombre juste après.':'El número anterior y el siguiente.',
'Réponse correcte !':'¡Respuesta correcta!','Bravo !':'¡Muy bien!',
'Essaie encore !':'¡Inténtalo de nuevo!',
'Tu as réussi !':'¡Lo has conseguido!',
'Bonne réponse !':'¡Respuesta correcta!',
'La réponse est':'La respuesta es',
'Le nombre à trouver':'El número buscado',
'La bonne réponse est':'La respuesta correcta es',
'À toi de jouer !':'¡Te toca!',
'Niveau terminé !':'¡Nivel terminado!',
'🔊 Écouter':'🔊 Escuchar',
'Enregistrer':'Guardar','Commencer':'Empezar','Continuer':'Continuar',
'Retour':'Volver','Revenir':'Volver',
'Les familles':'Las familias','La famille':'La familia',
'Le tableau':'La tabla','Ma réponse :':'Mi respuesta:',
'Exercices à imprimer':'Ejercicios para imprimir',
'↓ Télécharger les exercices et le corrigé (PDF)':'↓ Descargar ejercicios y soluciones (PDF)'
};
const patterns=[
[/^Niveau (\d+)(.*)$/i,(_,n,rest)=>'Nivel '+n+translateRest(rest)],
[/^Série (\d+)(.*)$/i,(_,n,rest)=>'Serie '+n+translateRest(rest)],
[/^Défi (\d+)(.*)$/i,(_,n,rest)=>'Reto '+n+translateRest(rest)],
[/^(\d+) défis?(.*)$/i,(_,n,rest)=>n+' retos'+translateRest(rest)],
[/^(\d+) réussites?(.*)$/i,(_,n,rest)=>n+' aciertos'+translateRest(rest)],
[/^De (\d+) en (\d+)$/i,(_,a,b)=>'De '+a+' en '+b],
[/^(\d+) nombres? (.*)$/i,(_,n,r)=>n+' números '+translateRest(r)],
[/^Nombres? jusqu’à ([\d\s\u202f]+)$/i,(_,n)=>'Números hasta '+n],
[/^Bravo, ([\d\s]+) est (pair|impair) !$/i,(_,n,k)=>'¡Muy bien! '+n+' es '+(k==='pair'?'par':'impar')+'.'],
[/^Bravo, les trois crabes ont traversé !$/i,()=> '¡Muy bien! Los tres cangrejos han cruzado.'],
[/^(\d+) bonnes? réponses?(.*)$/i,(_,n,rest)=>n+' respuestas correctas'+translateRest(rest)],
[/^Défi (\d+) \/ (\d+)$/i,(_,a,b)=>'Reto '+a+' / '+b],
[/^(\d+) réussites?$/i,(_,n)=>n+' aciertos']
];
const generic=[
[/\bNIVEAU\b/g,'NIVEL'],[/\bNiveau\b/g,'Nivel'],
[/\bSÉRIE\b/g,'SERIE'],[/\bSérie\b/g,'Serie'],
[/\bDéfi\b/g,'Reto'],[/\bdéfis\b/g,'retos'],
[/\bNombre\b/g,'Número'],[/\bnombre\b/g,'número'],[/\bnombres\b/g,'números'],
[/\bcentaines\b/g,'centenas'],[/\bdizaines\b/g,'decenas'],[/\bunités\b/g,'unidades'],
[/\bCentaines\b/g,'Centenas'],[/\bDizaines\b/g,'Decenas'],[/\bUnités\b/g,'Unidades'],
[/\bpoints\b/g,'puntos'],[/\bScore\b/g,'Puntuación'],[/\bréussites\b/g,'aciertos'],
[/\bbonnes réponses\b/g,'respuestas correctas'],[/\bcorrecte\b/g,'correcta'],
[/\bpair\b/g,'par'],[/\bimpair\b/g,'impar'],
[/\bVérifier\b/g,'Comprobar'],[/\bEffacer\b/g,'Borrar'],
[/\bRejouer\b/g,'Volver a jugar'],[/\bValider\b/g,'Comprobar'],
[/\bSuivant\b/g,'Siguiente'],[/\bsuivant\b/g,'siguiente'],
[/\bprécédent\b/g,'anterior'],[/\bjuste\b/g,'correcto'],
[/\bRéponse\b/g,'Respuesta'],[/\bréponse\b/g,'respuesta'],
[/\bChoisir\b/g,'Elegir'],[/\bChoisis\b/g,'Elige'],
[/\bCommencer\b/g,'Empezar'],[/^Bravo(?=[ !,])/g,'¡Bien hecho'],
[/\bErreur\b/g,'Error'],[/\bÉcris\b/g,'Escribe'],[/\bÉcoute\b/g,'Escucha'],
[/\bDÉPART\b/g,'SALIDA'],[/\bARRIVÉE\b/g,'LLEGADA'],
[/\bAccueil\b/g,'Inicio'],[/\bAide\b/g,'Ayuda']
];
function translateRest(s){return s.replace(/Nombres jusqu’à/g,'Números hasta').replace(/chiffres/g,'cifras').replace(/sans zéro/g,'sin cero').replace(/De /g,'De ').replace(/en /g,'en ')}
function translate(s){
 if(!s||!s.trim())return s;
 const lead=s.match(/^\s*/)[0],trail=s.match(/\s*$/)[0],v=s.trim();
 if(Object.hasOwn(T,v))return lead+T[v]+trail;
 for(const [re,fn] of patterns)if(re.test(v))return lead+v.replace(re,fn)+trail;
 let out=v;for(const [re,to] of generic)out=out.replace(re,to);
 return lead+out+trail;
}
function start(){
 const iframe=document.getElementById('translated-game');
 if(!iframe)return;
 iframe.addEventListener('load',()=>{
 let d,w;
 try{d=iframe.contentDocument;w=iframe.contentWindow;if(!d?.body)throw Error('body unavailable');}
 catch(e){document.getElementById('translation-status').textContent='No se pudo traducir este juego. Abre la versión francesa mediante el enlace superior.';return}
 d.documentElement.lang='es';
 // El castillo utiliza grabaciones francesas. En la versión española
 // se sustituyen únicamente esos audios por lectura en español.
 if(/\/chateau-nombres-(?:exterieur-)?cp\//.test(iframe.getAttribute('src')||'')){
  const originalAudio=w.Audio;
  const sayInSpanish=(src)=>{
   let m,part=String(src||'');
   if((m=part.match(/family-(\d+)\.mp3/)))return 'Busca los números de la familia del '+(Number(m[1])*10)+'.';
   if((m=part.match(/number-(\d+)\.mp3/)))return 'Encuentra el número '+Number(m[1])+'.';
   if(part.includes('retry.mp3'))return 'Inténtalo otra vez.';
   if(part.includes('finish.mp3'))return '¡Misión completada!';
   if(part.includes('bravo.mp3'))return '¡Muy bien!';
   return null;
  };
  w.Audio=function(src){
   const esText=sayInSpanish(src);
   if(!esText)return new originalAudio(src);
   const audio={src,paused:true,onplaying:null,onended:null,onerror:null,
    pause(){this.paused=true;try{w.speechSynthesis?.cancel()}catch(e){}},
    play(){this.paused=false;
     if(!w.speechSynthesis||!w.SpeechSynthesisUtterance){this.onerror?.();return Promise.resolve()}
     const voice=new w.SpeechSynthesisUtterance(esText);voice.lang='es-ES';voice.rate=.85;
     const preferred=w.speechSynthesis.getVoices().find(v=>/^es(?:[-_]|$)/i.test(v.lang));
     if(preferred)voice.voice=preferred;
     voice.onstart=()=>this.onplaying?.();
     voice.onend=()=>{this.paused=true;this.onended?.()};
     voice.onerror=()=>{this.paused=true;this.onerror?.()};
     try{w.speechSynthesis.speak(voice)}catch(e){this.onerror?.()}
     return Promise.resolve();
    }};
   return audio;
  };
 }

 const names=['aria-label','title','placeholder'];
 const pending=new Set();
 function walk(el){
  if(!el)return;
  if(el.nodeType===3){if(el.parentElement&&/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|OPTION)$/i.test(el.parentElement.tagName))return;
    const after=translate(el.nodeValue);if(after!==el.nodeValue)el.nodeValue=after;return}
  if(el.nodeType!==1&&el.nodeType!==9&&el.nodeType!==11)return;
  if(el.nodeType===1){
   if(/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(el.tagName))return;
   for(const n of names)if(el.hasAttribute(n)){let old=el.getAttribute(n),next=translate(old);if(old!==next)el.setAttribute(n,next)}
  }
  const walker=d.createTreeWalker(el,w.NodeFilter.SHOW_TEXT);
  let n;while((n=walker.nextNode()))if(n.parentElement&&!/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|OPTION)$/i.test(n.parentElement.tagName)){let next=translate(n.nodeValue);if(n.nodeValue!==next)n.nodeValue=next}
  if(el.querySelectorAll)for(const node of el.querySelectorAll('[aria-label],[title],[placeholder]'))for(const attr of names)if(node.hasAttribute(attr)){const val=node.getAttribute(attr),newval=translate(val);if(newval!==val)node.setAttribute(attr,newval)}
 }
 let busy=false;
 function flush(){busy=false;const list=[...pending];pending.clear();observer.disconnect();for(const el of list)walk(el);observer.observe(d.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:names})}
 const observer=new w.MutationObserver(records=>{for(const m of records){if(m.type==='characterData')pending.add(m.target);else if(m.type==='attributes')pending.add(m.target);else for(const n of m.addedNodes)pending.add(n)}if(!busy){busy=true;w.requestAnimationFrame(flush)}});
 walk(d.body);
 observer.observe(d.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:names});
 document.getElementById('translation-status').textContent='Interfaz en español activada.';
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();