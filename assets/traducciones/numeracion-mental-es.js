/* Traducción al español de interfaces de numeración y cálculo mental.
 * Se ejecuta únicamente en la página española, sobre un iframe del mismo origen.
 * Los juegos originales no se modifican.
 */
(()=>{'use strict';
const T={
  "← Tous les jeux du blog":"← Todos los juegos del blog",
  "↓ 7 fiches et corrigés (PDF)":"↓ 7 fichas y soluciones (PDF)",
  "↻ Jouer en paysage":"↻ Jugar en horizontal",
  "Son : désactivé":"Sonido: desactivado",
  "Son : activé":"Sonido: activado",
  "Son : ":"Sonido: ",
  "Effets : activés":"Efectos: activados",
  "Effets : désactivés":"Efectos: desactivados",
  "Effets : ":"Efectos: ",
  "MISSION ORBITE · CE1 / CE2":"MISIÓN ORBITAL · CE1 / CE2",
  "Les additions sans échange en orbite":"Las sumas sin llevadas en órbita",
  "Les additions en orbite":"Las sumas en órbita",
  "J’aligne les chiffres et je calcule, sans retenue, dans le système solaire.":"Alineo las cifras y calculo sin llevar en el sistema solar.",
  "Je calcule en colonnes et je propulse la retenue vers sa nouvelle orbite.":"Calculo en columnas y envío la llevada a su nueva órbita.",
  "Appuie sur « Jouer en paysage ».":"Pulsa « Jugar en horizontal ».",
  "Si l’écran ne tourne pas, active « Rotation auto » dans les réglages rapides d’Android, puis tourne le téléphone.":"Si la pantalla no gira, activa la rotación automática en Android y gira el teléfono.",
  "CENTRE DE COMMANDE":"CENTRO DE CONTROL",
  "Choisis ta mission":"Elige tu misión",
  "10 additions par partie. Calcule une colonne à la fois.":"10 sumas por partida. Calcula una columna cada vez.",
  "Deux chiffres":"Dos cifras",
  "Trois chiffres":"Tres cifras",
  "Des dizaines et des unités.":"Decenas y unidades.",
  "Des centaines, dizaines et unités.":"Centenas, decenas y unidades.",
  "J’aligne bien":"Alineo correctamente",
  "Un nombre à trois chiffres et un nombre à deux chiffres.":"Un número de tres cifras y otro de dos.",
  "Sans échange :":"Sin llevadas:",
  "Un échange":"Una llevada",
  "Deux échanges":"Dos llevadas",
  "Des unités vers les dizaines.":"De las unidades a las decenas.",
  "Des unités vers les dizaines, puis des dizaines vers les centaines.":"De las unidades a las decenas y luego a las centenas.",
  "Changer de niveau":"Cambiar de nivel",
  "Un coup de pouce":"Una pista",
  "Voir la réponse de la colonne":"Ver la respuesta de la columna",
  "Colonne suivante →":"Siguiente columna →",
  "Bravo pour ton entraînement !":"¡Buen trabajo!",
  "Une addition entièrement juste au premier essai, sans afficher de réponse, vaut un point.":"Una suma completamente correcta al primer intento, sin mostrar la respuesta, vale un punto.",
  "Rejouer ce niveau":"Repetir este nivel",
  "Choisir un niveau":"Elegir un nivel",
  "Sans échange · 10 additions par mission":"Sin llevadas · 10 sumas por misión",
  "Voyage des retenues · 10 additions par mission":"Viaje de las llevadas · 10 sumas por misión",
  "🏠 Voir tous les jeux du blog":"🏠 Ver todos los juegos del blog",
  "Additions posées sans retenue : 7 fiches CE1":"Sumas en columna sin llevadas: 7 fichas CE1",
  "Format A4 : pages 1 à 7 pour les élèves ; pages 8 à 14 pour les corrigés.":"Formato A4: páginas 1 a 7 para los alumnos y 8 a 14 con las soluciones.",
  "↓ Télécharger les 7 fiches et les corrigés (PDF)":"↓ Descargar las 7 fichas y sus soluciones (PDF)",
  "📄 PDF · 7 niveaux d’additions":"📄 PDF · 7 niveles de sumas",
  "42 exercices à imprimer · Cercles pour les retenues · Corrigés inclus":"42 ejercicios imprimibles · Círculos para las llevadas · Soluciones incluidas",
  "Exemple :":"Ejemplo:",
  "7 unités + 5 unités = 12 unités.":"7 unidades + 5 unidades = 12 unidades.",
  "12 dans le calcul en ligne ou dans la colonne":"12 en el cálculo en línea o en la columna",
  "La colonne suivante s’active automatiquement.":"La siguiente columna se activa automáticamente.",
  "Écris le total de la colonne avant de vérifier.":"Escribe el total de la columna antes de comprobar.",
  "Reprendre →":"Reanudar →",
  "Le déplacement a été interrompu. Clique sur Reprendre pour continuer.":"El movimiento se ha interrumpido. Pulsa Reanudar para continuar.",
  "Voici le total en ligne. Appuie sur Vérifier pour le placer dans la colonne dans l’addition posée.":"Aquí está el total en línea. Pulsa Comprobar para colocarlo en la columna de la suma.",
  "Voici le total en ligne. Appuie sur Vérifier pour le placer dans la colonne et observer l’échange.":"Aquí está el total en línea. Pulsa Comprobar para colocarlo en la columna y observar la llevada.",
  "Les crabes des Salines":"Los cangrejos de las Salinas",
  "Range les crabes en cliquant sur leurs pancartes.":"Ordena los cangrejos pulsando sus carteles.",
  "Choisis le sens du rangement":"Elige el sentido del orden",
  "5 séries de 5 nombres. Chaque série réussie du premier coup rapporte 1 point.":"5 series de 5 números. Cada serie correcta al primer intento vale 1 punto.",
  "← Crabes rangés":"← Cangrejos ordenados",
  "Crabes à choisir →":"Cangrejos por elegir →",
  "Partie terminée !":"¡Partida terminada!",
  "Compose ton pseudo et choisis ton pays pour enregistrer ton score.":"Escribe tu apodo y elige tu país para guardar tu puntuación.",
  "Pays ou territoire":"País o territorio",
  "Enregistrer mon score":"Guardar mi puntuación",
  "Continue à jouer au CP":"Sigue jugando en CP",
  "Continue à jouer au CE1":"Sigue jugando en CE1",
  "Continue à jouer au CE2":"Sigue jugando en CE2",
  "Tous les jeux de numération au CP":"Todos los juegos de numeración de CP",
  "Tous les jeux de numération au CE1":"Todos los juegos de numeración de CE1",
  "Tous les jeux de numération au CE2":"Todos los juegos de numeración de CE2",
  "Tableau des scores ·":"Clasificación ·",
  "Les 10 meilleurs résultats de ce navigateur, avec ta dernière partie si elle est hors du classement. À score égal, le plus rapide passe devant.":"Los 10 mejores resultados de este navegador y tu última partida si no aparece en la clasificación. En caso de empate, gana quien termine antes.",
  "Les crabes des Salines à imprimer":"Fichas imprimibles de los cangrejos de las Salinas",
  "Deux séries de huit exercices par niveau.":"Dos series de ocho ejercicios por nivel.",
  "Aucune partie terminée.":"Todavía no hay partidas terminadas.",
  "Termine une partie pour enregistrer un score.":"Termina una partida para guardar tu puntuación.",
  "Vérifie le pseudo et le pays choisis.":"Comprueba el apodo y el país elegidos.",
  "Programme les déplacements pour ramasser tous les poissons sans tomber à l’eau.":"Programa los movimientos para recoger todos los peces sin caer al agua.",
  "La banquise":"El hielo",
  "Mon programme":"Mi programa",
  "Ramassage automatique":"Recogida automática",
  "🐟 Manger":"🐟 Comer",
  "Ajoute des flèches, puis lance ton programme.":"Añade flechas y ejecuta tu programa.",
  "Chaque flèche déplace l’ours d’une case. Maximum : 24 instructions.":"Cada flecha mueve al oso una casilla. Máximo: 24 instrucciones.",
  "Programme ton robot, évite les croix rouges et récupère tous les cristaux !":"Programa tu robot, evita las cruces rojas y recoge todos los cristales.",
  "⚡ Grille noire · cases interdites":"⚡ Cuadrícula negra · casillas prohibidas",
  "⚡ Console de pilotage":"⚡ Panel de control",
  "💎 Collecte manuelle":"💎 Recogida manual",
  "💎 COLLECTER":"💎 RECOGER",
  "Guide ton robot vers les cristaux à l’aide des flèches.":"Guía tu robot hacia los cristales con las flechas.",
  "Chaque flèche déplace le robot d’une case. Sur un cristal, ajoute 💎 COLLECTER dans ton programme. Maximum : 24 instructions.":"Cada flecha mueve al robot una casilla. Cuando llegues a un cristal, añade 💎 RECOGER al programa. Máximo: 24 instrucciones.",
  "3 minutes par série. Le chrono démarre à la première réponse saisie.":"3 minutos por serie. El cronómetro comienza al escribir la primera respuesta.",
  "Choisis une compétence":"Elige una habilidad",
  "Effectue le plus grand nombre possible de calculs.":"Resuelve tantas operaciones como puedas.",
  "Le chrono commencera quand tu écriras ta première réponse.":"El cronómetro comenzará cuando escribas la primera respuesta.",
  "Corriger maintenant":"Corregir ahora",
  "Recommencer":"Reiniciar",
  "Choisir une compétence":"Elegir una habilidad",
  "Exercice suivant":"Siguiente ejercicio",
  "Chronomètre en cours.":"Cronómetro en marcha.",
  "Exercice terminé.":"Ejercicio terminado.",
  "Sons activés":"Sonidos activados",
  "Sons désactivés":"Sonidos desactivados",
  "Laboratoire orbital · CE1":"Laboratorio orbital · CE1",
  "Je calcule les ":"Calculo las ",
  "Calcule les ":"Calcula las ",
  "Bravo ! Le total est ":"¡Bien! El total es ",
  "Bravo ! Le 1 devient une ":"¡Bien! El 1 se convierte en una ",
  "Poissons restants : ":"Peces restantes: ",
  "Cristaux restants : ":"Cristales restantes: ",

'L’ours de la banquise':'El oso del hielo','L\'ours de la banquise':'El oso del hielo',
'Mission Néon':'Misión Neón','Le robot des cristaux':'El robot de los cristales',
'Choisir un défi':'Elegir un reto','Choisis un défi':'Elige un reto',
'Défi suivant':'Siguiente reto','Lancer':'Iniciar','Démarrer':'Empezar',
'Déplacements':'Movimientos','Avancer':'Avanzar','Tourner à gauche':'Girar a la izquierda',
'Tourner à droite':'Girar a la derecha','Ramasser':'Recoger','Poissons':'Peces',
'Poisson':'Pez','Cristaux':'Cristales','Cristal':'Cristal',
'Commandes':'Comandos','Programme':'Programa','Exécuter':'Ejecutar',
'Retour aux jeux':'Volver a los juegos',
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

Object.assign(T,{
'✧ Effets réduits':'✧ Efectos reducidos',
'♫ Sons coupés':'♫ Sonido desactivado',
'Additionne les valeurs des deux cartons. Le nombre obtenu a toujours une unité de 1 à 9.':'Suma los valores de las dos tarjetas. El número resultante siempre tiene una unidad del 1 al 9.',
'Écris le nombre recomposé.':'Escribe el número formado.',
'Valeur des unités':'Valor de las unidades',
'Nombre recomposé':'Número formado',
'Essaie encore : écris la valeur du chiffre, avec ses zéros.':'Inténtalo de nuevo: escribe el valor de la cifra, con sus ceros.',
'Impossible de créer le parcours':'No se puede crear el recorrido',
'Pas encore : vérifie les bonds et colorie toutes les cases du chemin, sans diagonale.':'Todavía no: comprueba los saltos y colorea todas las casillas del camino, sin diagonales.',
'Bravo, les trois crabes ont traversé !':'¡Muy bien! ¡Los tres cangrejos han cruzado!',
'Choisis encore un crabe avant de vérifier.':'Elige otro cangrejo antes de comprobar.',
'Bravo, les crabes sont bien rangés !':'¡Muy bien! Los cangrejos están bien ordenados.',
'Vérifie le pseudo et le pays choisis.':'Comprueba el apodo y el país elegidos.',
'Score enregistré pour ':'Puntuación guardada para ',
'Crabes rangés : ':'Cangrejos ordenados: ',
'Aucune partie terminée.':'Ninguna partida terminada.',
'Dernière partie':'Última partida',
'Non renseigné':'No especificado',
'Pélican':'Pelícano','Éclair':'Rayo','Étoile':'Estrella','Comète':'Cometa',
'Décroissant':'Descendente','Mélangé':'Mezclado',
'Tu peux réessayer avec le bouton Réécouter ou afficher la consigne.':'Puedes pulsar Escuchar de nuevo o mostrar la instrucción.',
'Écoute bien…':'Escucha atentamente…',
'Essaie encore ! Tu peux réécouter la consigne.':'Inténtalo otra vez. Puedes escuchar la instrucción de nuevo.',
'Bravo ! Tu as trouvé ':'¡Bravo! Has encontrado ',
'Écris un nombre dans chacune des deux cases.':'Escribe un número en cada casilla.',
'Nombre précédent':'Número anterior',
'Dizaine précédente':'Decena anterior',
'Centaine précédente':'Centena anterior',
'Écris un nombre pour valider.':'Escribe un número para comprobar.',
'Bravo ! La flèche montre ':'¡Bravo! La flecha señala ',
'Répondre ':'Responder ',
' · Aide utilisée':' · Pista utilizada',
'✓ Du premier coup':'✓ Al primer intento',
'✓ Après ':'✓ Después de ',
'Défi suivant →':'Siguiente reto →',
'Cartons superposés : ':'Tarjetas superpuestas: ',
'Cartons séparés : ':'Tarjetas separadas: ',
'Le château des nombres · CP':'El castillo de los números · CP'
});

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
[/^Série terminée ! (\d+) \/ 10, soit (\d+) % de réussite sans erreur\..*$/i,(_,n,p)=>'¡Serie terminada! '+n+' de 10, es decir '+p+' % de aciertos sin errores. ¡Vuelve a jugar para practicar!'],
[/^Cartons superposés : (.+)$/i,(_,n)=>'Tarjetas superpuestas: '+n],
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
const prefixes=[
["Bravo ! Le total est ","¡Bien! El total es "],
["Bravo ! Le 1 devient une ","¡Bien! El 1 se convierte en una "],
["Bravo ! ✓ Addition terminée : ","¡Bien! ✓ Suma terminada: "],
["Poissons restants : ","Peces restantes: "],
["Cristaux restants : ","Cristales restantes: "],
["Score : ","Puntuación: "],
["Son : ","Sonido: "],
["Effets : ","Efectos: "],
["Calcule les ","Calcula las "],
["Je calcule les ","Calculo las "],
["Série ","Serie "]
];
function translateRest(s){return s.replace(/Nombres jusqu’à/g,'Números hasta').replace(/chiffres/g,'cifras').replace(/sans zéro/g,'sin cero').replace(/De /g,'De ').replace(/en /g,'en ')}
function translate(s){
 if(!s||!s.trim())return s;
 const lead=s.match(/^\s*/)[0],trail=s.match(/\s*$/)[0],v=s.trim();
 if(Object.hasOwn(T,v))return lead+T[v]+trail;
 for(const [re,fn] of patterns)if(re.test(v))return lead+v.replace(re,fn)+trail;
 for(const [from,to] of prefixes)if(v.startsWith(from))return lead+to+v.slice(from.length)+trail;
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