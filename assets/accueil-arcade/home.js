'use strict';

const isEnglish = document.documentElement.lang.startsWith('en');
const isChinese = document.documentElement.lang.startsWith('zh');
const isSpanish = document.documentElement.lang.startsWith('es');
const hasMathsOnly = isChinese || isSpanish;
const language = isChinese ? 'zh' : isSpanish ? 'es' : isEnglish ? 'en' : 'fr';
const localise = (french, english, chinese, spanish) => isChinese ? chinese : isSpanish ? spanish : isEnglish ? english : french;
const languageLinks = document.querySelector('.language-links');

function playHref(id, href) {
  const target = new URL(href, location.href);
  if (isChinese || target.pathname.startsWith('/jouer/') || ((isEnglish || isSpanish) && target.origin !== location.origin)) return href;
  return '/jouer/?' + new URLSearchParams({ lang: language, jeu: id });
}

document.querySelectorAll('article[data-game] a.play, article[data-ranked-game] a[data-goatcounter-click^="jouer-top10-"]').forEach(link => {
  const card = link.closest('article');
  link.href = playHref(card.dataset.game || card.dataset.rankedGame, link.getAttribute('href'));
});
try {
  localStorage.setItem('bleja-blog-language', language);
} catch {}
languageLinks?.addEventListener('click', event => {
  const link = event.target.closest('a[lang]');
  if (link) {
    try {
      localStorage.setItem('bleja-blog-language', link.lang.split('-')[0]);
    } catch {}
  }
});

async function enhanceHome() {
  const response = await fetch('/assets/catalogue-v2/' + localise('catalogue.json', 'catalogue-en.json', 'catalogue-zh.json', 'catalogue-es.json'), { cache: 'no-cache' });
  if (!response.ok) throw new Error('Catalogue indisponible');
  const source = await response.json();
  if (!Array.isArray(source) || !source.length) throw new Error('Catalogue vide');
  activateCatalogue(source);
}

function activateCatalogue(source) {

  const $ = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const staticCards = new Map(all('#catalog-grid [data-game]').map(card => [card.dataset.game, card]));
  const catalogue = source.map(game => {
    const card = staticCards.get(game.id);
    const extras = card ? all('.card-extra', card).map(link => {
      const copy = link.cloneNode(true);
      delete copy.dataset.goatcounterBound;
      return copy;
    }) : [];
    return {
      ...game,
      image: game.thumb || game.image || card?.querySelector('img')?.getAttribute('src'),
      capture: game.screenshotUrl || game.image,
      alt: game.imageAlt,
      short: (isEnglish || isSpanish || isChinese) ? (game.short || game.description || card?.querySelector('.card-description')?.textContent.trim() || '') : (game.short || card?.querySelector('.card-description')?.textContent.trim() || game.description),
      pdf: game.pdfUrl || extras.find(link => link.dataset.kind === 'pdf')?.getAttribute('href'),
      plays: game.playClicks,
      tracking: card?.querySelector('a.play')?.dataset,
      extras,
    };
  });

  const legacySubjects = { maths: 'Mathématiques', francais: 'Français' };
  const subjects = {
    tous: localise('Toutes les matières', 'All subjects', '所有科目', 'Todas las asignaturas'),
    maths: localise(legacySubjects.maths, 'Maths', '数学', 'Matemáticas'),
    ...(!hasMathsOnly && { francais: localise(legacySubjects.francais, 'French') }),
  };
  const subjectIcons = { tous: 'grid', maths: 'math', francais: 'book' };
  const levels = ['CP', 'CE1', 'CE2', 'CM1'];
  const yearLabels = { CP: 'Year 2', CE1: 'Year 3', CE2: 'Year 4', CM1: 'Year 5' };
  const chineseYears = { CP: '一年级', CE1: '二年级', CE2: '三年级', CM1: '四年级' };
  const spanishYears = { CP: '1.º', CE1: '2.º', CE2: '3.º', CM1: '4.º' };
  const levelLabel = level => localise(level, yearLabels[level] || level, chineseYears[level] || level, spanishYears[level] || level);
  const levelLine = game => game.levels.map(levelLabel).join(' · ');
  const groupOrder = ['numeration', 'mental', 'pose', 'problemes', 'geometrie', 'codage', 'lecture', 'orthographe', 'grammaire', 'vocabulaire', 'ecriture'];
  const groups = new Map(catalogue.map(game => [
    game.group, isEnglish && game.group === 'numeration' ? 'Number skills' : game.groupName,
  ]));
  const games = new Map(catalogue.map(game => [game.id, game]));
  const defaults = { niveau: 'tous', matiere: 'tous', domaine: 'tous', competence: '', q: '', tri: 'catalogue', collection: '', aide: '', patrimoine: '' };
  const collectionLabels = {
    favoris: localise('Mes jeux favoris', 'My favourite games', '我的收藏', 'Mis favoritos'),
    semaine: localise('Les jeux de la semaine', 'This week’s games', '本周游戏', 'Juegos de la semana'),
    nouveautes: localise('Les nouveautés', 'New games', '新游戏', 'Novedades'),
  };
  const pageSize = 12;
  const storageKey = 'bleja-discovery-favorites-v1';
  const grid = $('#catalog-grid');
  const search = $('#search');
  const dialog = $('#preview-dialog');
  const htmlMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => htmlMap[character]);
  const icon = name => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  const gameCount = count => isChinese ? count + ' 个游戏' : count + ' ' + (count === 1 ? localise('jeu', 'game', '', 'juego') : localise('jeux', 'games', '', 'juegos'));
  const shownLabel = (shown, total) => isChinese ? `已显示 ${shown} / ${total} 个游戏` : shown + localise(' sur ', ' of ', '', ' de ') + gameCount(total);
  const previewLabel = localise('Agrandir la capture de ', 'Enlarge screenshot of ', '放大截图：', 'Ampliar la captura de ');
  const subjectOf = game => game.subject === legacySubjects.maths ? 'maths' : 'francais';
  const subjectValues = new Map([...Object.entries(subjects), ...Object.entries(legacySubjects)].map(([key, label]) => [label, key]));
  const trackingAttributes = data => data?.goatcounterClick
    ? ` data-goatcounter-click="${escape(data.goatcounterClick)}" data-goatcounter-title="${escape(data.goatcounterTitle)}"`
    : '';
  const normalize = value => String(value).toLocaleLowerCase(language).normalize('NFD')
    .replace(/\p{M}/gu, '').replaceAll('œ', 'oe').replace(/[^a-z0-9\p{Script=Han}]+/gu, ' ').trim();
  const searchIndex = new Map(catalogue.map(game => {
    const content = [game.title, game.subject, subjects[subjectOf(game)], game.groupName, game.skillName, game.short, game.description, game.objective, game.levels.join(' '), levelLine(game), ...(game.accessibility || []), game.localHeritage].join(' ');
    return [game.id, normalize(content)];
  }));

  let favorites = readFavorites();
  let state = readState();
  let visibleCount = pageSize;
  let previewTrigger;

  function readFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(stored) ? stored.filter(id => typeof id === 'string').map(id => {
      if (id === 'en-41') return 'en-1';
      if (id === 'en-2') return 'en-calcul-mental-cp-pygame';
      return id;
    }) : []);
    } catch {
      return new Set();
    }
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const next = { ...defaults };
    if (levels.includes(params.get('niveau'))) next.niveau = params.get('niveau');
    const subject = params.get('matiere');
    if (subjectValues.has(subject) && Object.hasOwn(subjects, subjectValues.get(subject))) next.matiere = subjectValues.get(subject);
    else if (Object.hasOwn(subjects, subject)) next.matiere = subject;
    if (groups.has(params.get('domaine'))) next.domaine = params.get('domaine');
    if (catalogue.some(game => game.skill === params.get('competence'))) next.competence = params.get('competence');
    if (params.get('tri') === 'az' || (!isEnglish && params.get('tri') === 'popularite')) next.tri = params.get('tri');
    const collection = params.get('collection') || params.get('vue');
    if (Object.hasOwn(collectionLabels, collection)) next.collection = collection;
    if (language === 'fr' && ['audio','dys'].includes(params.get('aide'))) next.aide = params.get('aide');
    if (language === 'fr' && params.get('patrimoine') === 'martinique') next.patrimoine = 'martinique';
    next.q = (params.get('q') || '').slice(0, 150);
    if (isEnglish && !params.has('domaine')) {
      const hash = location.hash.slice(1);
      const legacyGroup = { calculs: 'mental', numeration: 'numeration', problemes: 'problemes' }[hash];
      if (legacyGroup && groups.has(legacyGroup)) {
        next.domaine = legacyGroup;
        next.matiere = 'maths';
        next.niveau = 'tous';
      } else if (hash === 'cp' || hash === 'ce2') {
        next.niveau = hash.toUpperCase();
      } else if (hash === 'francais' || hash === 'maths') {
        next.matiere = hash;
        next.niveau = 'tous';
      }
    }
    return next;
  }

  function getLink(next, fragment = location.hash) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value !== defaults[key]) params.set(key, key === 'matiere' ? legacySubjects[value] || value : value);
    }
    return location.pathname + (params.size ? '?' + params : '') + fragment;
  }

  function setState(patch, { jump = false, replace = false, focus = '' } = {}) {
    state = { ...state, ...patch };
    validateFilters();
    visibleCount = pageSize;
    const url = getLink(state, jump ? '#catalogue' : location.hash);
    if (url !== location.pathname + location.search + location.hash) {
      history[replace ? 'replaceState' : 'pushState'](null, '', url);
    }
    render();
    if (focus === 'filter') search.focus({ preventScroll: true });
    if (jump) {
      $('#catalogue').scrollIntoView({ block: 'start' });
      $('#catalogue-title').focus({ preventScroll: true });
    }
  }

  function levelMatches(game) {
    return state.niveau === 'tous' || game.levels.includes(state.niveau);
  }

  function subjectMatches(game) {
    return state.matiere === 'tous' || subjectOf(game) === state.matiere;
  }

  function eligibleGroups() {
    const available = new Set(catalogue.filter(game => levelMatches(game) && subjectMatches(game)).map(game => game.group));
    return groupOrder.filter(group => available.has(group));
  }

  function eligibleSkills() {
    const matches = catalogue.filter(game => levelMatches(game) && subjectMatches(game) && (state.domaine === 'tous' || game.group === state.domaine));
    return [...new Map(matches.map(game => [game.skill, game.skillName]))].sort((a, b) => a[1].localeCompare(b[1], language));
  }

  function validateFilters() {
    if (state.domaine !== 'tous' && !eligibleGroups().includes(state.domaine)) state.domaine = 'tous';
    if (state.competence && !eligibleSkills().some(([key]) => key === state.competence)) state.competence = '';
  }

  function visibleGames() {
    const terms = normalize(state.q).split(' ').filter(Boolean);
    const matching = catalogue.filter(game =>
      levelMatches(game) && subjectMatches(game) &&
      (state.domaine === 'tous' || game.group === state.domaine) &&
      (!state.competence || game.skill === state.competence) &&
      (state.collection !== 'favoris' || favorites.has(game.id)) &&
      (state.collection !== 'semaine' || game.weekly) &&
      (state.collection !== 'nouveautes' || game.new) &&
      (!state.aide || game.accessibility?.includes(state.aide)) &&
      (!state.patrimoine || game.localHeritage === 'Martinique') &&
      terms.every(term => searchIndex.get(game.id).includes(term))
    );
    if (state.tri === 'az') matching.sort((first, second) => first.title.localeCompare(second.title, language));
    if (state.tri === 'popularite') matching.sort((first, second) => (second.plays ?? -1) - (first.plays ?? -1));
    return matching;
  }

  function renderFeatured() {
    const holder = $('#hero-display');
    const game = games.get(holder.dataset.featuredGame || 'jeu-109');
    if (!game?.image) return;
    holder.innerHTML = `
      <button class="featured-game" type="button" data-preview="${game.id}" aria-label="${previewLabel}${escape(game.title)}">
        <span class="featured-head"><span>${localise('JEU EN VEDETTE', 'FEATURED GAME', '精选游戏', 'JUEGO DESTACADO')}</span><span>${escape(levelLine(game).toLocaleUpperCase(language))} · ${subjects[subjectOf(game)].toLocaleUpperCase(language)}</span></span>
        <img class="featured-image" src="${escape(game.image)}" alt="${escape(game.alt)}" fetchpriority="high">
        <span class="featured-foot"><strong>${escape(game.title)}</strong><span class="featured-zoom">${icon('zoom')} <span>${localise('Agrandir', 'Enlarge', '放大', 'Ampliar')}</span></span></span>
      </button>`;
  }

  function renderLevelLinks() {
    $('#level-grid').innerHTML = levels.map(level => {
      const count = catalogue.filter(game => game.levels.includes(level)).length;
      return `<a class="level-button" href="?niveau=${level}#catalogue" data-level-link="${level}">
        <span class="level-mark" aria-hidden="true"></span><strong class="level-name">${levelLabel(level)}</strong>
        <span class="level-count">${gameCount(count)}</span>
      </a>`;
    }).join('');
  }

  const playLabel = game => localise('Jouer', game.contentLanguage === 'fr' ? 'Play in French' : 'Play', game.contentLanguage === 'fr' ? '法语游戏' : '开始游戏', game.contentLanguage === 'fr' ? 'Jugar en francés' : 'Jugar');

  function card(game, eager = false) {
    const image = game.image
      ? `<button data-preview="${game.id}" class="image-button" type="button" aria-label="${previewLabel}${escape(game.title)}">
           <img src="${escape(game.image)}" alt="${escape(game.alt || game.title)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
           <span class="image-expand">${icon('zoom')}</span>
         </button>`
      : `<span class="image-placeholder" aria-hidden="true">${icon(subjectIcons[subjectOf(game)])}</span>`;
    return `<article class="game-card" data-game="${escape(game.id)}" data-card-subject="${subjectOf(game)}">
      <div class="game-image">
        ${image}
        ${(isEnglish || isSpanish || isChinese) ? `<span class="game-language-badge" data-game-language="${game.contentLanguage === 'fr' ? 'fr' : isChinese ? 'zh' : isSpanish ? 'es' : 'en'}" aria-label="${isChinese ? '游戏语言：' : isSpanish ? 'Idioma del juego: ' : 'Game language: '}${game.contentLanguage === 'fr' ? (isChinese ? '法语' : isSpanish ? 'Francés' : 'French') : isChinese ? '中文' : isSpanish ? 'Español' : 'English'}"><span class="game-language-flag" aria-hidden="true"></span>${game.contentLanguage === 'fr' ? (isChinese ? '法语' : isSpanish ? 'Francés' : 'French') : isChinese ? '中文' : isSpanish ? 'Español' : 'English'}</span>` : ''}
        <button class="icon-button fav-button" data-favorite="${game.id}" type="button" aria-pressed="false">${icon('heart')}</button>
      </div>
      <div class="card-body">
        <p class="card-meta"><span class="card-levels">${escape(levelLine(game))}</span><span aria-hidden="true">/</span><span>${escape(game.groupName)}</span></p>
        <h3 class="card-title">${escape(game.title)}</h3>
        <p class="card-description">${escape(game.short)}</p>
        ${language === 'fr' && game.localHeritage === 'Martinique' ? '<p style="margin:5px 0"><span style="display:inline-block;font-size:.78rem;border:1px solid #e8b15b;border-radius:6px;padding:3px 8px;color:#ffd18c">🌴 Création Martinique</span></p>' : ''}
        ${language === 'fr' && game.accessibility?.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">${game.accessibility.map(a => `<span style="font-size:.78rem;border:1px solid #769bdd;border-radius:6px;padding:3px 7px">${a === 'audio' ? '🔊 Audio' : 'Aide DYS'}</span>`).join('')}</div>` : ''}
        <div class="card-actions">
          <a class="control control-outline play" href="${escape(playHref(game.id, game.url))}" target="_blank" rel="noopener" aria-label="${playLabel(game)}: ${escape(game.title)}"${trackingAttributes(game.tracking)}>${icon('play')} ${playLabel(game)}</a>
          ${game.extras.filter(link=>!game.pdfResources?.some(r=>r.url===link.getAttribute('href'))).map(link => link.outerHTML).join('')}
          ${language === 'fr' && game.ficheUrl && !game.extras.some(link => link.getAttribute('href') === game.ficheUrl) ? `<a class="quiet-link" href="${escape(game.ficheUrl)}" aria-label="${escape('Fiche pédagogique de '+game.title)}">Fiche</a>` : ''}
          ${game.pdfResources?.length ? game.pdfResources.map(r=>`<a class="control control-primary arcade-player-sheet" style="border:1px solid #78baff;border-radius:8px;box-shadow:0 3px #162854,0 0 8px #3874c955;background:linear-gradient(145deg,#2856a0,#172d57);color:#fff" href="${escape(r.url)}" target="_blank" rel="noopener" aria-label="${escape(r.label+' — '+game.title)}">PDF${game.pdfResources.length>1?' · '+escape(r.label):''}${r.language!==language?' · '+r.language.toUpperCase():''}</a>`).join('') : game.pdf && !game.extras.some(link => link.getAttribute('href') === game.pdf) ? `<a class="quiet-link card-pdf" href="${escape(game.pdf)}" target="_blank" rel="noopener">PDF</a>` : ''}
        </div>
      </div>
    </article>`;
  }

  function syncFavorites() {
    $('#favorite-count').textContent = catalogue.filter(game => favorites.has(game.id)).length;
    all('[data-favorite]').forEach(button => {
      const id = button.dataset.favorite;
      const active = favorites.has(id);
      button.setAttribute('aria-pressed', active);
      button.setAttribute('aria-label', (active ? localise('Retirer des favoris : ', 'Remove from favourites: ', '取消收藏：', 'Quitar de favoritos: ') : localise('Ajouter aux favoris : ', 'Add to favourites: ', '添加到收藏：', 'Añadir a favoritos: ')) + games.get(id).title);
    });
  }

  function favorite(button) {
    const id = button.dataset.favorite;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch {}

    if (state.collection === 'favoris') {
      const remaining = visibleGames();
      const index = all('[data-favorite]', grid).indexOf(button);
      renderResults(remaining);
      if (index >= 0) {
        const buttons = all('[data-favorite]', grid);
        (buttons[Math.min(index, buttons.length - 1)] || $('[data-reset]', $('#empty-state'))).focus({ preventScroll: true });
      }
    }
    syncFavorites();
  }

  function option(value, label) {
    return `<option value="${escape(value)}">${escape(label)}</option>`;
  }

  function filterButton(type, key, label, count, selected) {
    return `<button type="button" data-${type}="${escape(key)}" aria-pressed="${selected}"><span>${escape(label)}</span><span class="side-count">${count}</span></button>`;
  }

  function renderFilters() {
    const focus = document.activeElement;
    const focusType = focus?.dataset?.subject ? 'subject' : focus?.dataset?.skill ? 'skill' : '';
    const focusValue = focusType ? focus.dataset[focusType] : '';
    const levelGames = catalogue.filter(levelMatches);
    const potential = levelGames.filter(subjectMatches);
    const groupOptions = eligibleGroups();

    $('#subject-list').innerHTML = Object.entries(subjects).map(([key, label]) => {
      const count = key === 'tous' ? levelGames.length : levelGames.filter(game => subjectOf(game) === key).length;
      return filterButton('subject', key, label, count, state.matiere === key);
    }).join('');
    $('#skill-list').innerHTML = filterButton('skill', 'tous', localise('Toutes les compétences', 'All skill areas', '所有技能', 'Todas las habilidades'), potential.length, state.domaine === 'tous') +
      groupOptions.map(group => filterButton('skill', group, groups.get(group), potential.filter(game => game.group === group).length, state.domaine === group)).join('');

    const skillFilter = $('#skill-filter');
    const skillOptions = option('tous', localise('Toutes les compétences', 'All skill areas', '所有技能', 'Todas las habilidades')) + groupOptions.map(group => option(group, groups.get(group))).join('');
    if (skillOptions !== skillFilter.dataset.options) {
      skillFilter.innerHTML = skillOptions;
      skillFilter.dataset.options = skillOptions;
    }
    $('#level-filter').value = state.niveau;
    $('#subject-filter').value = state.matiere;
    skillFilter.value = state.domaine;
    $('#exercise-filter').innerHTML = option('', localise('Tous les exercices', 'All skills', '所有练习', 'Todos los ejercicios')) +
      eligibleSkills().map(([key, label]) => option(key, label)).join('');
    $('#exercise-filter').value = state.competence;
    $('#exercise-control').toggleAttribute('hidden', state.domaine === 'tous' && !state.competence);
    $('#sort-filter').value = state.tri;
    if ($('#access-filter')) $('#access-filter').value = state.aide;
    if ($('#heritage-filter')) $('#heritage-filter').checked = state.patrimoine === 'martinique';
    if (search.value !== state.q) search.value = state.q;
    $('#clear-search').hidden = !state.q;
    all('[data-level-link]').forEach(link => {
      if (link.dataset.levelLink === state.niveau) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (focusType) {
      const replacement = all('button', $(focusType === 'skill' ? '#skill-list' : '#subject-list'))
        .find(button => button.dataset[focusType] === focusValue);
      replacement?.focus({ preventScroll: true });
    }
  }

  const familyTitles = { halloween: 'Happy Halloween — Compléments', sorciere: 'La course de la sorcière — Compléments', araignee: 'Le défi de l’araignée — Compléments', 'cm1-livrets': 'Mission Calcul CM1 — Les livrets' };
  function groupResults(results) {
    const entries = [], families = new Map();
    for (const game of results) {
      if (language !== 'fr' || !game.family || state.collection === 'favoris') { entries.push([game]); continue; }
      if (!families.has(game.family)) { const list = []; families.set(game.family,list); entries.push(list); }
      families.get(game.family).push(game);
    }
    return entries;
  }
  function familyCard(list) {
    if (list.length === 1) return card(list[0]);
    const sorted = [...list].sort((a,b) => a.variantLabel.localeCompare(b.variantLabel,'fr',{numeric:true}));
    const first = sorted[0];
    return '<article class="game-card" data-card-subject="'+subjectOf(first)+'"><div class="game-image"><button class="image-button" type="button" data-preview="'+escape(first.id)+'" aria-label="'+escape(previewLabel+first.title)+'"><img src="'+escape(first.image)+'" alt="'+escape(first.alt || first.title)+'" loading="lazy" decoding="async"></button></div><div class="card-body"><p class="card-meta">'+escape([...new Set(sorted.flatMap(g=>g.levels))].join(' · '))+' / '+escape(first.groupName)+'</p><h3 class="card-title">'+escape(familyTitles[first.family])+'</h3><p class="card-description">'+sorted.length+' variantes disponibles. Choisis ton exercice.</p><div style="display:grid;gap:6px">'+sorted.map(g=>'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px"><a class="control control-outline play" style="flex:1" href="'+escape(playHref(g.id,g.url))+'" target="_blank" rel="noopener"'+trackingAttributes(g.tracking)+'>'+icon('play')+' '+escape(g.variantLabel)+'</a>'+(g.ficheUrl ? '<a class="quiet-link" href="'+escape(g.ficheUrl)+'" aria-label="'+escape('Fiche pédagogique de '+g.title)+'">Fiche</a>' : '')+'<button type="button" class="icon-button" data-preview="'+escape(g.id)+'" aria-label="'+escape(previewLabel+g.title)+'">'+icon('zoom')+'</button><button type="button" class="icon-button" data-favorite="'+escape(g.id)+'" aria-pressed="false">'+icon('heart')+'</button></div>').join('')+'</div></div></article>';
  }
  function renderResults(results = visibleGames()) {
    const entries = groupResults(results);
    const total = results.length;
    const displayed = Math.min(entries.length, visibleCount);
    grid.innerHTML = entries.slice(0, displayed).map(familyCard).join('');
    $('#result-count').textContent = gameCount(total) + localise(total === 1 ? ' trouvé' : ' trouvés', ' found', '', total === 1 ? ' encontrado' : ' encontrados');
    $('#clear-filters').hidden = Object.keys(defaults).every(key => state[key] === defaults[key]);
    $('#more-area').hidden = displayed >= entries.length;
    $('#shown-count').textContent = shownLabel(entries.slice(0,displayed).reduce((n,list)=>n+list.length,0), total);
    $('#empty-state').hidden = total !== 0;
    if (total === 0) {
      const noFavorites = state.collection === 'favoris' && !catalogue.some(game => favorites.has(game.id));
      $('#empty-title').textContent = noFavorites ? localise('Tu n’as pas encore de favoris', 'You have no favourite games yet', '你还没有收藏游戏', 'Todavía no tienes favoritos') : localise('Aucun jeu trouvé', 'No games found', '未找到游戏', 'No se encontraron juegos');
      $('#empty-description').textContent = noFavorites
        ? localise('Utilise le cœur sur un jeu pour le retrouver ici.', 'Tap the heart on a game to save it here.', '点击游戏旁的爱心，即可在这里找到它。', 'Pulsa el corazón de un juego para guardarlo aquí.')
        : localise('Essaie un autre mot ou change de niveau, de matière ou de compétence.', 'Try a different search or change your year or subject filters.', '试试其他关键词，或切换年级、科目或技能。', 'Prueba otra búsqueda o cambia de curso, asignatura o habilidad.');
      $('#empty-icon use').setAttribute('href', noFavorites ? '#i-heart' : '#i-search');
    }
    syncFavorites();
    window.goatcounter?.bind_events?.();
  }

  function render() {
    $('#catalogue-title').textContent = collectionLabels[state.collection] || localise('Le catalogue des jeux', 'Game catalogue', '游戏目录', 'Catálogo de juegos');
    $('#catalogue-intro').textContent = state.collection === 'favoris'
      ? localise('Retrouve les jeux enregistrés sur cet appareil.', 'Find the games you saved on this device.', '在这里查看你在此设备上收藏的游戏。', 'Encuentra los juegos guardados en este dispositivo.')
      : state.collection === 'semaine'
        ? localise('Retrouve les jeux mis en avant dans le blog.', 'Explore this week’s selection.', '探索本周的精选游戏。', 'Descubre la selección de esta semana.')
        : localise('Trouve un jeu par niveau, matière ou compétence.', 'Find a game by school year, subject or skill.', '按年级、科目或技能查找游戏。', 'Busca un juego por curso, asignatura o habilidad.');
    const favoritesLink = $('[data-favorites-link]');
    if (state.collection === 'favoris') favoritesLink.setAttribute('aria-current', 'location');
    else favoritesLink.removeAttribute('aria-current');
    renderFilters();
    renderResults();
  }

  function setOptionalLink(link, url) {
    link.hidden = !url;
    if (url) link.href = url;
    else link.removeAttribute('href');
  }

  function openPreview(button) {
    const game = games.get(button.dataset.preview);
    previewTrigger = button;
    $('#preview-title').textContent = game.title;
    $('#preview-meta').textContent = levelLine(game) + ' / ' + game.groupName;
    $('#preview-description').textContent = game.short;
    const preview = $('#preview-image');
    preview.setAttribute('src', game.image);
    preview.alt = game.alt || game.title;
    const play = $('#preview-play');
    play.href = playHref(game.id, game.url);
    play.lastChild.textContent = ' ' + playLabel(game);
    const tracking = game.tracking;
    if (tracking?.goatcounterClick) {
      play.dataset.goatcounterClick = tracking.goatcounterClick;
      play.dataset.goatcounterTitle = tracking.goatcounterTitle || game.title;
    } else {
      delete play.dataset.goatcounterClick;
      delete play.dataset.goatcounterTitle;
    }
    setOptionalLink($('#preview-pdf'), game.pdf);
    setOptionalLink($('#preview-original'), game.capture && game.capture !== game.image ? game.capture : '');
    window.goatcounter?.bind_events?.();
    dialog.showModal();
  }

  function intercept(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('[data-level-link], [data-all-classes], [data-favorites-link], [data-weekly-link], [data-new-link], [data-popular-link]');
    if (link) {
      event.preventDefault();
      const patch = { ...defaults, niveau: link.dataset.levelLink || 'tous' };
      if ('favoritesLink' in link.dataset) patch.collection = 'favoris';
      if ('weeklyLink' in link.dataset) patch.collection = 'semaine';
      if ('newLink' in link.dataset) patch.collection = 'nouveautes';
      if ('popularLink' in link.dataset) patch.tri = 'popularite';
      setState(patch, { jump: true });
      return;
    }
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.preview) openPreview(button);
    if (button.dataset.favorite) favorite(button);
    if (button.dataset.subject) setState({ matiere: button.dataset.subject, domaine: 'tous', competence: '' });
    if (button.dataset.skill) setState({ domaine: button.dataset.skill, competence: '' });
    if ('reset' in button.dataset) setState(defaults, { focus: 'filter' });
  }

  document.addEventListener('click', intercept);
  $('#search-form').addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', () => {
    const firstChange = !state.q && Boolean(search.value);
    setState({ q: search.value.slice(0, 150) }, { replace: !firstChange });
  });
  $('#clear-search').addEventListener('click', () => setState({ q: '' }, { focus: 'filter' }));
  $('#level-filter').addEventListener('change', event => setState({ niveau: event.target.value }));
  $('#subject-filter').addEventListener('change', event => setState({ matiere: event.target.value, domaine: 'tous', competence: '' }));
  $('#skill-filter').addEventListener('change', event => setState({ domaine: event.target.value, competence: '' }));
  $('#exercise-filter').addEventListener('change', event => setState({ competence: event.target.value }));
  $('#sort-filter').addEventListener('change', event => setState({ tri: event.target.value }));
  $('#access-filter')?.addEventListener('change', event => setState({ aide: event.target.value }));
  $('#heritage-filter')?.addEventListener('change', event => setState({ patrimoine: event.target.checked ? 'martinique' : '' }));
  $('#load-more').addEventListener('click', () => {
    const previous = visibleCount;
    const results = visibleGames();
    visibleCount += pageSize;
    grid.insertAdjacentHTML('beforeend', results.slice(previous, visibleCount).map(game => card(game)).join(''));
    $('#more-area').hidden = visibleCount >= results.length;
    $('#shown-count').textContent = shownLabel(Math.min(visibleCount, results.length), results.length);
    syncFavorites();
    window.goatcounter?.bind_events?.();
    const nextCard = grid.children[previous];
    if (nextCard) $('button, a', nextCard)?.focus({ preventScroll: false });
  });
  dialog.addEventListener('close', () => previewTrigger?.focus({ preventScroll: true }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  window.addEventListener('popstate', () => {
    state = readState();
    validateFilters();
    visibleCount = pageSize;
    render();
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      favorites = readFavorites();
      if (state.collection === 'favoris') renderResults();
      else syncFavorites();
    }
  });

  $('#level-filter').innerHTML = option('tous', localise('Tous les niveaux', 'All years', '所有年级', 'Todos los cursos')) + levels.map(level => option(level, levelLabel(level))).join('');
  $('#subject-filter').innerHTML = Object.entries(subjects).map(([key, label]) => option(key, label)).join('');
  validateFilters();
  renderFeatured();
  renderLevelLinks();
  const weeklyIds = $('#weekly-grid').dataset.weeklyGames?.split(' ') || ['jeu-1', 'jeu-3', 'jeu-4'];
  const weekly = weeklyIds.map(id => games.get(id)).filter(Boolean);
  if (weekly.length) $('#weekly-grid').innerHTML = weekly.map(game => card(game, true)).join('');
  render();
  $('#catalogue').classList.add('catalogue-ready');
  $('#catalogue-availability').hidden = true;
  if (isEnglish && ['#calculs', '#numeration', '#problemes', '#cp', '#ce2', '#francais', '#maths'].includes(location.hash)) {
    history.replaceState(null, '', getLink(state, '#catalogue'));
    $('#catalogue').scrollIntoView({ block: 'start' });
  }
}
enhanceHome().catch(() => {
  document.querySelector('#catalogue-availability').textContent = localise(
    'Les filtres sont temporairement indisponibles. Tu peux toujours ouvrir les jeux ci-dessous.',
    'Filters are temporarily unavailable. You can still play the games below.', '筛选暂时不可用，你仍然可以打开下方的游戏。', 'Los filtros no están disponibles por el momento. Puedes abrir los juegos de abajo.'
  );
});
