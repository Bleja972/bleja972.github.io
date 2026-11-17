/* 中文数字认识游戏界面翻译。仅在中文页面、同源 iframe 中执行，不改动法语原版。 */
(()=>{'use strict';
const dict={
'↻ Affichage horizontal':'↻ 横屏显示','← Retour au blog':'← 返回游戏博客','← Retour aux jeux':'← 返回游戏','← Les jeux de CP':'← 返回 CP 游戏','← Les jeux de CE2':'← 返回 CE2 游戏','← Jeux de numération CE1':'← 返回 CE1 数字游戏','← Tous les jeux du blog':'← 返回全部游戏',
'Accueil':'首页','Menu':'菜单','Blog':'博客','Français':'法语','English':'英语',
'Vérifier':'检查','Vérifier ↗':'检查 ↗','Valider':'确认','Valider ✓':'确认 ✓','Effacer':'清除','Tout effacer':'全部清除','Effacer la dernière':'撤销上一步','Nouvelle grille':'新棋盘','Nouvelle série':'新一轮','↻ Nouvelle série':'↻ 新一轮','Rejouer':'再玩一次','Rejouer ce niveau':'重玩本关','Défi suivant →':'下一个挑战 →','Nombre suivant →':'下一个数字 →','Traversée suivante':'下一次穿越','Série suivante':'下一组',
'Choisis ton niveau':'选择关卡','Choisir un niveau':'选择关卡','Choisis ta mission':'选择任务','Choisis ton parcours':'选择路线','Choisir un parcours':'选择路线','Choisis ta série':'选择一组','Choisis ton niveau pour commencer.':'选择关卡开始。',
'Nombres pairs':'偶数','Nombres impairs':'奇数','pair':'偶数','impair':'奇数',
'Niveau':'关卡','NIVEAU':'关卡','Série':'组','SÉRIE':'组','Défi':'挑战','Résultat':'结果','Nombre':'数字','Nombre à trouver':'待找数字','Ta réponse':'你的答案','Ma réponse':'我的答案','Ma réponse :':'我的答案：','Score':'得分','Réussite':'正确率','Justes du premier coup :':'首次答对：','Justes du premier coup':'首次答对',
'Centaines':'百位','Dizaines':'十位','Unités':'个位','Décomposer':'拆分数字','Recomposer':'组合数字',
'Les nombres en orbite':'轨道上的数字','La magie des nombres':'数字的魔法','LABORATOIRE MONTESSORI':'蒙台梭利实验室','Explore les nombres dans le laboratoire des cartons lumineux.':'在发光数字卡片实验室里探索数字。',
'Écris la valeur de chaque chiffre.':'写出每个数字所在数位的数值。','Les pointes sont superposées. Quels nombres se cachent dessous ?':'数字卡片叠在一起，下面藏着哪些数字？','Complète l’addition en ligne.':'完成横式加法。','Valeur des unités':'个位的数值','Nombre recomposé':'组合后的数字','Écris le nombre recomposé.':'写出组合后的数字。','Pour la classe · choisir un nombre':'课堂演示 · 选择数字','Afficher ce nombre':'显示这个数字',
'SYSTÈME PRÊT · À TOI DE JOUER':'系统就绪 · 开始吧！','♫ Sons activés':'♫ 音效开启','♫ Sons coupés':'♫ 音效关闭','✧ Effets activés':'✧ 特效开启','✧ Effets réduits':'✧ 特效减弱','Voir la correction':'查看答案','↔ Revoir l’animation':'↔ 重看动画','Prends ton temps. Observe, écris, puis vérifie.':'慢慢来。先观察，再填写，最后检查。',
'Les crabes du tombolo':'沙洲上的螃蟹','Aide les crabes à rejoindre l’autre rive en traversant la langue de sable.':'帮助螃蟹沿着沙洲到达对岸。','Les crabes des Salines':'盐滩上的螃蟹','Range les crabes en cliquant sur leurs pancartes.':'点击螃蟹举着的牌子，按顺序排列数字。','Choisis le sens du rangement':'选择排序方向','Du plus petit au plus grand':'从小到大','Du plus grand au plus petit':'从大到小','Les deux sens':'两种方向','← Crabes rangés':'← 已排序的螃蟹','Crabes à choisir →':'待选择的螃蟹 →','Partie terminée !':'游戏结束！','Compose ton pseudo et choisis ton pays pour enregistrer ton score.':'选择昵称和国家，以保存分数。','Animal':'动物','Qualité':'特点','Pays ou territoire':'国家或地区','Enregistrer mon score':'保存分数','Rang':'名次','Pseudo':'昵称','Pays':'国家','Mode':'模式','Temps':'时间','Dernière partie':'上一局','Non renseigné':'未填写','Aucune partie terminée.':'尚无已完成的游戏。','Décroissant':'降序','Mélangé':'混合','Pélican':'鹈鹕','Éclair':'闪电','Étoile':'星星','Comète':'彗星','Crabes rangés : ':'已排序的螃蟹：','Bravo, les crabes sont bien rangés !':'做得好，螃蟹的顺序正确！','Bravo, les trois crabes ont traversé !':'太棒了，三只螃蟹都过河了！','Choisis encore un crabe avant de vérifier.':'请先再选一只螃蟹。','Vérifie le pseudo et le pays choisis.':'请检查昵称和国家。',
'Le chemin du kangourou':'袋鼠数字之路','Australie · Labynombre':'澳大利亚 · 数字迷宫','Colorie le chemin jusqu’au spinifex !':'为通向终点的路线涂色！','Départ ↓':'起点 ↓','Arrivée':'终点','Couleur du chemin : ocre du désert':'路线颜色：沙漠赭色','Un clic sur une case la colorie ; un nouveau clic l’efface.':'点击方格涂色，再点击一次即可取消。','Impossible de créer le parcours':'无法生成路线','Pas encore : vérifie les bonds et colorie toutes les cases du chemin, sans diagonale.':'还不对：检查每次跳跃，给所有路线方格涂色，不要走斜线。',
'Popeye sur la ligne graduée':'大力水手的数轴',
'Le château des nombres':'数字城堡','Bienvenue au château':'欢迎来到','des nombres !':'数字城堡！','Écoute, observe le tableau et trouve la bonne case.':'听数字，观察表格，找出正确方格。','Les familles de nombres':'数字家族','Le nombre mystère':'神秘数字','Écoute une famille, puis clique sur un nombre de cette famille pour colorier toute sa ligne.':'听一个数字家族，再点击其中一个数字，为整行涂色。','Écoute un nombre, puis retrouve sa case. Chaque famille garde sa couleur !':'听数字并找出方格。每个数字家族都有自己的颜色！','Un tableau de':'数字表：','10 familles à découvrir':'探索10个数字家族','20 nombres à retrouver':'找出20个数字','La consigne est donnée à voix haute.':'语音会读出题目。','La voix n’est pas disponible sur cet appareil.':'此设备无法播放语音。','🔊 Réécouter':'🔊 再听一遍','Afficher la consigne':'显示题目','Mission accomplie':'任务完成','Bravo, chevalier des nombres !':'太棒了，数字骑士！','Le pourcentage indique les réponses justes au premier essai.':'百分比表示首次作答正确的比例。','Pour s’entraîner sur papier':'纸上练习','cahier de mathématiques CP à imprimer':'可打印的CP数学练习册',
'La planète de Fritz':'弗里茨的星球','Un nombre.':'一个数字。','Deux voisins. À toi de jouer !':'找出左右两个邻数！','MISSION ENCADREMENT · CP':'找邻数任务 · CP','MISSION ENCADREMENT · CE1':'找邻数任务 · CE1','MISSION ENCADREMENT · CE2':'找邻数任务 · CE2','À l’unité':'按个位','À la dizaine':'按整十','À la centaine':'按整百','Au millier':'按整千','Le nombre juste avant':'紧挨着的前一个数','et le nombre juste après.':'与后一个数。','La dizaine entière précédente':'前一个整十数','et la dizaine entière suivante.':'与后一个整十数。','La centaine entière précédente':'前一个整百数','et la centaine entière suivante.':'与后一个整百数。','Le millier entier précédent':'前一个整千数','et le millier entier suivant.':'与后一个整千数。','Borne inférieure':'左侧数','Nombre à encadrer':'中间数','Borne supérieure':'右侧数','🔊 Sons':'🔊 音效','Une aide':'提示','MISSION TERMINÉE':'任务完成','Bravo, explorateur !':'太棒了，探险家！',
'Les droites du T-Rex — CE1':'霸王龙的数轴 — CE1','Les droites du T-Rex animé':'霸王龙的42条动画数轴','La droite numérique du T-Rex':'霸王龙的数轴','UNE GRADUATION = UNE UNITÉ':'每小格代表1','⏸ Animation':'⏸ 暂停动画','L’AVENTURE DES NOMBRES':'数字大冒险','Quel nombre montre la flèche ?':'箭头指向哪个数字？','Observe la droite numérique, puis saisis ta réponse pour aider le T-Rex.':'观察数轴，写下答案帮助霸王龙。','Observe la droite numérique, puis clique sur la bonne case pour aider le T-Rex.':'观察数轴，点击正确的答案帮助霸王龙。','Observe les nombres indiqués pour trouver le nombre montré par la flèche.':'根据标出的数字，找到箭头指向的数字。','Prends le temps d’observer. Chaque petit trait vaut 1.':'仔细观察。每个小刻度代表1。','Les cinq niveaux mélangés →':'五关混合 →','Les 42 défis mélangés →':'42道挑战混合 →','Les 24 défis mélangés →':'24道挑战混合 →','Choisis ton parcours':'选择路线','La jungle':'丛林','Le volcan':'火山','La vallée':'山谷','Aide-moi à trouver':'帮我找到','le nombre !':'这个数字！','Clique sur la bonne réponse.':'点击正确答案。','Écris ta réponse, puis valide.':'写下答案并确认。','Défi suivant →':'下一题 →','Bravo pour ton aventure !':'冒险完成，太棒了！','Toutes les réponses ont été trouvées. Rejoue pour progresser !':'你已找到所有答案！再玩一次继续进步！','Rejouer':'再玩一次','Nombre à trouver':'目标数字','Résultat':'结果','Répondre ':'回答 ','✓ Du premier coup':'✓ 首次答对','✓ Après ':'✓ 尝试后答对',' · Aide utilisée':' · 使用了提示',
'Réponse correcte !':'答案正确！','Bonne réponse !':'答对了！','Bravo !':'太棒了！','Essaie encore !':'再试一次！','La bonne réponse est':'正确答案是','Écris un nombre pour valider.':'请输入数字后确认。','Écris un nombre dans chacune des deux cases.':'请在两个输入框中填写数字。','Rejouer ce niveau':'重玩本关',
'Exercices à imprimer':'打印练习','↓ Télécharger les exercices et le corrigé (PDF)':'↓ 下载练习及答案（PDF）'
};
const patterns=[
[/^Niveau (\d+)(.*)$/i,(_,a,b)=>'第'+a+'关'+tail(b)],
[/^Série (\d+)(.*)$/i,(_,a,b)=>'第'+a+'组'+tail(b)],
[/^Défi (\d+) \/ (\d+)$/i,(_,a,b)=>'第'+a+'题 / 共'+b+'题'],
[/^Défi (\d+)(.*)$/i,(_,a,b)=>'第'+a+'题'+tail(b)],
[/^(\d+) réussites?$/i,(_,a)=>a+'次正确'],
[/^(\d+) défis?(.*)$/i,(_,a,b)=>a+'道挑战'+tail(b)],
[/^De (\d+) en (\d+)$/i,(_,a,b)=>'每次增加'+b+'（从'+a+'开始）'],
[/^Nombres? jusqu’à ([\d\s\u202f]+)$/i,(_,a)=>'数字不超过'+a],
[/^Bravo, (\d+) est (pair|impair) !$/i,(_,a,b)=>'太棒了！'+a+'是'+(b==='pair'?'偶数':'奇数')+'！'],
[/^Cartons superposés : (.+)$/i,(_,a)=>'重叠的数字卡片：'+a],
[/^Série terminée ! (\d+) \/ 10, soit (\d+) % de réussite sans erreur\..*$/i,(_,a,b)=>'本组完成！答对'+a+'/10，正确率'+b+'%。再练习一次吧！']
];
const fallbacks=[
[/\bVérifier\b/g,'检查'],[/\bEffacer\b/g,'清除'],[/\bValider\b/g,'确认'],[/\bRejouer\b/g,'再玩一次'],
[/\bNiveau\b/gi,'关卡'],[/\bSérie\b/gi,'组'],[/\bDéfi\b/gi,'挑战'],
[/\bCentaines\b/g,'百位'],[/\bDizaines\b/g,'十位'],[/\bUnités\b/g,'个位'],
[/\bnombres\b/gi,'数字'],[/\bnombre\b/gi,'数字'],[/\bRéponse\b/gi,'答案'],
[/\bAccueil\b/g,'首页'],[/\bscore\b/gi,'分数'],[/\bpoints\b/g,'分'],
[/\bpairs\b/gi,'偶数'],[/\bimpairs\b/gi,'奇数'],
[/\bprécédent\b/g,'前一个'],[/\bsuivant\b/g,'下一个'],
[/\bChoisis\b/g,'选择'],[/\bCommencer\b/g,'开始'],[/\bBravo\b/g,'太棒了']
];
function tail(s){return s.replace(/chiffres/g,'位数字').replace(/sans zéro/g,'不含零').replace(/Nombres jusqu’à/g,'数字不超过').replace(/De (\d+) en (\d+)/g,(_,a,b)=>'每次加'+b).replace(/défis/g,'题')}
function translate(value){
 if(!value||!value.trim())return value;
 const pre=(value.match(/^\s*/)||[''])[0],post=(value.match(/\s*$/)||[''])[0],v=value.trim();
 if(Object.prototype.hasOwnProperty.call(dict,v))return pre+dict[v]+post;
 for(const [re,fn] of patterns){if(re.test(v))return pre+v.replace(re,fn)+post}
 let out=v;for(const [re,newVal] of fallbacks)out=out.replace(re,newVal);
 return pre+out+post;
}
function boot(){
 const iframe=document.getElementById('translated-game');if(!iframe)return;
 iframe.addEventListener('load',()=>{
  let d,w;
  try{d=iframe.contentDocument;w=iframe.contentWindow;if(!d||!d.body)throw Error('body');}
  catch(e){document.getElementById('translation-status').textContent='此游戏无法自动翻译，请点击顶部的法语原版链接。';return}
  d.documentElement.lang='zh-Hans';
  // 对数字城堡：把法语录音替换成中文语音（如果设备支持）。
  if(/\/chateau-nombres-(?:exterieur-)?cp\//.test(iframe.getAttribute('src')||'')){
   const originalAudio=w.Audio;
   const speech=(src)=>{
    const name=String(src||'');let m;
    if((m=name.match(/family-(\d+)\.mp3/)))return '请找出'+(Number(m[1])*10)+'这一组的所有数字。';
    if((m=name.match(/number-(\d+)\.mp3/)))return '请找出数字'+Number(m[1])+'。';
    if(name.includes('retry.mp3'))return '请再试一次。';
    if(name.includes('finish.mp3'))return '任务完成！';
    if(name.includes('bravo.mp3'))return '答对了！';
    return null;
   };
   w.Audio=function(src){const sentence=speech(src);if(!sentence)return new originalAudio(src);
    return {src,paused:true,onplaying:null,onended:null,onerror:null,
     pause(){this.paused=true;try{w.speechSynthesis?.cancel()}catch(e){}},
     play(){this.paused=false;
      if(!w.speechSynthesis||!w.SpeechSynthesisUtterance){this.onerror?.();return Promise.resolve()}
      const utter=new w.SpeechSynthesisUtterance(sentence);utter.lang='zh-CN';utter.rate=.82;
      const voice=w.speechSynthesis.getVoices().find(v=>/^zh(?:[-_]|$)/i.test(v.lang));
      if(voice)utter.voice=voice;
      utter.onstart=()=>this.onplaying?.();utter.onend=()=>{this.paused=true;this.onended?.()};
      utter.onerror=()=>{this.paused=true;this.onerror?.()};
      try{w.speechSynthesis.speak(utter)}catch(e){this.onerror?.()}
      return Promise.resolve();
     }};};
  }
  const attrs=['aria-label','title','placeholder'];
  function apply(node){
   if(!node)return;
   if(node.nodeType===3){
    if(node.parentElement&&/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|OPTION)$/i.test(node.parentElement.tagName))return;
    const next=translate(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;return;
   }
   if(node.nodeType!==1&&node.nodeType!==9&&node.nodeType!==11)return;
   if(node.nodeType===1&&/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(node.tagName))return;
   if(node.nodeType===1)for(const attr of attrs){if(!node.hasAttribute(attr))continue;const v=node.getAttribute(attr),n=translate(v);if(v!==n)node.setAttribute(attr,n)}
   const walker=d.createTreeWalker(node,w.NodeFilter.SHOW_TEXT);const texts=[];
   while(walker.nextNode())texts.push(walker.currentNode);
   for(const text of texts)if(!text.parentElement||!/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|OPTION)$/i.test(text.parentElement.tagName)){let n=translate(text.nodeValue);if(n!==text.nodeValue)text.nodeValue=n}
   if(node.querySelectorAll)for(const el of node.querySelectorAll('[aria-label],[title],[placeholder]'))for(const attr of attrs)if(el.hasAttribute(attr)){let v=el.getAttribute(attr),n=translate(v);if(v!==n)el.setAttribute(attr,n)}
  }
  const changed=new Set();let scheduled=false;
  function flush(){scheduled=false;observer.disconnect();for(const node of changed)apply(node);changed.clear();observer.observe(d.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs})}
  const observer=new w.MutationObserver(changes=>{for(const c of changes){if(c.type==='characterData'||c.type==='attributes')changed.add(c.target);else for(const n of c.addedNodes)changed.add(n)}if(!scheduled){scheduled=true;w.requestAnimationFrame(flush)}});
  apply(d.body);
  observer.observe(d.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrs});
  const status=document.getElementById('translation-status');if(status)status.textContent='简体中文界面已启用。';
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();