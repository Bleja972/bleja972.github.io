'use strict';

const iframe = document.querySelector('#math-game');
const dictionary = fetch('/assets/traductions/math-chinois.json').then(response => {
  if (!response.ok) throw new Error('Translation unavailable');
  return response.json();
});

const places = { unités: '个位', dizaines: '十位', centaines: '百位', milliers: '千位' };
const patterns = [
  [/^(\d+) parts? coloriées? sur (\d+)$/i, '共 $2 份，其中 $1 份已涂色'],
  [/^MISSION (\d+) · /, '任务 $1 · '],
  [/^(\d+) bonnes réponses? sur (\d+)/i, '答对 $1 / $2 题'],
  [/^(\d+) bonnes réponses? au premier essai sur (\d+) calculs : (\d+) % de réussite\.$/i, '共 $2 题，首次答对 $1 题，正确率 $3%。'],
  [/^Encore (\d+) poissons? à ramasser : l’ours continue son chemin\.$/, '还剩 $1 条鱼，北极熊继续前进。'],
  [/^Encore (\d+) cristaux? à collecter : le robot continue son chemin\.$/, '还剩 $1 块水晶，机器人继续前进。'],
  [/^Il reste (\d+) poissons? à ramasser\..*$/, '还剩 $1 条鱼。请在最后一条指令后添加箭头，再按 GO。'],
  [/^Il reste (\d+) cristaux? à collecter\..*$/, '还剩 $1 块水晶。请在每块水晶所在的格子添加收集指令，再按 GO。'],
  [/^Résultat des (unités|dizaines|centaines|milliers)$/i, (_, p) => places[p.toLowerCase()] + '的结果'],
  [/^Addition en ligne des (unités|dizaines|centaines|milliers)\s*:/i, (_, p) => places[p.toLowerCase()] + '横式加法：'],
  [/Échanger 10 unités → 1 dizaine/i, '把10个一换成1个十'],
  [/Échanger 10 dizaines → 1 centaine/i, '把10个十换成1个百'],
  [/Échanger 10 centaines → 1 millier/i, '把10个百换成1个千'],
  [/^Calcule les (unités|dizaines|centaines|milliers)\./i, (_, p) => '计算' + places[p.toLowerCase()] + '。'],
  [/^Complète (?:d’abord )?le (?:résultat|calcul en ligne) des (unités|dizaines|centaines|milliers)\./i, (_, p) => '请先完成' + places[p.toLowerCase()] + '的计算。'],
  [/^Vérifie le calcul en ligne des (unités|dizaines|centaines|milliers)\./i, (_, p) => '请检查' + places[p.toLowerCase()] + '的横式计算。'],
  [/^Tu as réussi (\d+) additions sur 8, soit (\d+) % !$/, '8 道加法中答对 $1 道，正确率 $2%！'],
  [/^(\d+) % de soustractions réussies au premier essai$/, '首次答对 $1% 的减法题'],
  [/^Temps\s*:/, '用时：'],
  [/^Combien manque-t-il pour (?:faire|obtenir)\s*/i, '还差多少才能得到'],
  [/^La plus petite fraction/i, '最小的分数'],
  [/^La plus grande fraction/i, '最大的分数']
];

function localize(doc, lexicon) {
  if (doc.documentElement.lang === 'zh-Hans') return;
  const win = doc.defaultView;
  doc.documentElement.lang = 'zh-Hans';
  const source = new Map(Object.entries(lexicon).map(([key, value]) => [key.toLowerCase(), value]));
  const phrases = Array.from(source.keys()).sort((a, b) => b.length - a.length);
  const matcher = new RegExp(phrases.map(phrase => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return ( /^[\p{L}\p{N}]/u.test(phrase) ? '(?<![\\p{L}\\p{N}])' : '') + escaped +
      (/[\p{L}\p{N}]$/u.test(phrase) ? '(?![\\p{L}\\p{N}])' : '');
  }).join('|'), 'giu');
  function translate(value) {
    if (!value || !/[A-Za-zÀ-ÿ]/.test(value)) return value;
    const exact = source.get(value.trim().toLowerCase());
    if (exact) return value.replace(value.trim(), exact);
    for (const [pattern, replacement] of patterns) value = value.replace(pattern, replacement);
    return value.replace(matcher, phrase => source.get(phrase.toLowerCase()));
  }

  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const excluded = 'script,style,noscript,textarea,code';
  function updateText(node) {
    if (node.parentElement?.closest(excluded)) return;
    const translated = translate(node.data);
    if (translated !== node.data) node.data = translated;
  }
  function updateAttributes(node) {
    for (const name of attributes) {
      const value = node.getAttribute(name);
      const translated = translate(value);
      if (translated !== value) node.setAttribute(name, translated);
    }
  }
  function update(node) {
    if (node.nodeType === 3) return updateText(node);
    if (node.nodeType !== 1 || node.matches(excluded)) return;
    updateAttributes(node);
    node.querySelectorAll('[aria-label], [title], [placeholder], [alt]').forEach(updateAttributes);
    const walker = doc.createTreeWalker(node, win.NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) updateText(walker.currentNode);
  }
  update(doc.body);
  const observer = new win.MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') updateAttributes(record.target);
      if (record.type === 'characterData') updateText(record.target);
      for (const node of record.addedNodes) update(node);
    }
  });
  observer.observe(doc.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });

  const synth = win.speechSynthesis;
  if (synth && iframe.dataset.speak === 'true') {
    const speak = synth.speak.bind(synth);
    synth.speak = utterance => {
      utterance.lang = 'zh-CN';
      utterance.text = utterance.text
        .replace(/combien faut-il ajouter à/gi, '要加多少才能让')
        .replace(/plus combien égale/gi, '加上几等于')
        .replace(/plus|\+/gi, '加')
        .replace(/moins|−|-/gi, '减')
        .replace(/égale combien\s*\?/gi, '等于多少？')
        .replace(/égal(?:e|ent)?|=/gi, '等于')
        .replace(/pour obtenir/gi, '等于');
      speak(utterance);
    };
  }
  doc.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && (link.pathname === '/' || link.hash === '#catalogue')) {
      event.preventDefault();
      window.location.assign('/zh/#catalogue');
    }
  });
}

async function translated() {
  const doc = iframe.contentDocument;
  if (!doc || !doc.body || doc.URL === 'about:blank') return;
  try {
    localize(doc, await dictionary);
  } catch (error) {
    document.querySelector('#translation-status').textContent = '中文界面加载失败。请刷新页面。';
  } finally {
    iframe.removeAttribute('aria-busy');
  }
}

iframe.addEventListener('load', translated);
if (iframe.contentDocument?.readyState === 'complete') translated();
