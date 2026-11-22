'use strict';

const languageLinks = document.querySelector('[aria-label="Langue"]');
try {
  localStorage.setItem('bleja-blog-language', 'fr');
} catch {}
languageLinks.addEventListener('click', event => {
  const link = event.target.closest('a[lang]');
  if (link) {
    try {
      localStorage.setItem('bleja-blog-language', link.lang);
    } catch {}
  }
});

async function enhanceHome() {
  const response = await fetch('/assets/catalogue-v2/catalogue.json', { cache: 'no-cache' });
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
      pdf: game.pdfUrl || extras.find(link => link.dataset.kind === 'pdf')?.getAttribute('href'),
      plays: game.playClicks,
      tracking: card?.querySelector('a.play')?.dataset,
      extras,
    };
  });

  const subjects = { tous: 'Toutes les matières', maths: 'Mathématiques', francais: 'Français' };
  const subjectIcons = { tous: 'grid', maths: 'math', francais: 'book' };
  const levels = ['CP', 'CE1', 'CE2', 'CM1'];
  const groupOrder = ['numeration', 'mental', 'pose', 'problemes', 'geometrie', 'codage', 'lecture', 'orthographe', 'grammaire', 'vocabulaire', 'ecriture'];
  const groups = new Map(catalogue.map(game => [game.group, game.groupName]));
  const games = new Map(catalogue.map(game => [game.id, game]));
  const defaults = { niveau: 'tous', matiere: 'tous', domaine: 'tous', competence: '', q: '', tri: 'catalogue', collection: '' };
  const collectionLabels = { favoris: 'Mes jeux favoris', semaine: 'Les jeux de la semaine', nouveautes: 'Les nouveautés' };
  const pageSize = 12;
  const storageKey = 'bleja-discovery-favorites-v1';
  const grid = $('#catalog-grid');
  const search = $('#search');
  const dialog = $('#preview-dialog');
  const htmlMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => htmlMap[character]);
  const icon = name => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  const gameCount = count => count + (count === 1 ? ' jeu' : ' jeux');
  const subjectOf = game => game.subject === subjects.maths ? 'maths' : 'francais';
  const legacySubjects = new Map(Object.entries(subjects).map(([key, label]) => [label, key]));
  const trackingAttributes = data => data?.goatcounterClick
    ? ` data-goatcounter-click="${escape(data.goatcounterClick)}" data-goatcounter-title="${escape(data.goatcounterTitle)}"`
    : '';
  const normalize = value => String(value).toLocaleLowerCase('fr').normalize('NFD')
    .replace(/\p{M}/gu, '').replaceAll('œ', 'oe').replace(/[^a-z0-9]+/g, ' ').trim();
  const searchIndex = new Map(catalogue.map(game => {
    const content = [game.title, game.subject, game.groupName, game.skillName, game.short, game.description, game.objective, game.levels.join(' ')].join(' ');
    return [game.id, normalize(content)];
  }));

  let favorites = readFavorites();
  let state = readState();
  let visibleCount = pageSize;
  let previewTrigger;

  function readFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(stored) ? stored.filter(id => typeof id === 'string') : []);
    } catch {
      return new Set();
    }
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const next = { ...defaults };
    if (levels.includes(params.get('niveau'))) next.niveau = params.get('niveau');
    const subject = params.get('matiere');
    if (legacySubjects.has(subject)) next.matiere = legacySubjects.get(subject);
    else if (Object.hasOwn(subjects, subject)) next.matiere = subject;
    if (groups.has(params.get('domaine'))) next.domaine = params.get('domaine');
    if (catalogue.some(game => game.skill === params.get('competence'))) next.competence = params.get('competence');
    if (['popularite', 'az'].includes(params.get('tri'))) next.tri = params.get('tri');
    const collection = params.get('collection') || params.get('vue');
    if (Object.hasOwn(collectionLabels, collection)) next.collection = collection;
    next.q = (params.get('q') || '').slice(0, 150);
    return next;
  }

  function getLink(next, fragment = location.hash) {
    const params = new URLSearchParams();
    if (new URLSearchParams(location.search).get('lang') === 'fr') params.set('lang', 'fr');
    for (const [key, value] of Object.entries(next)) {
      if (value !== defaults[key]) params.set(key, key === 'matiere' ? subjects[value] : value);
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
    return [...new Map(matches.map(game => [game.skill, game.skillName]))].sort((a, b) => a[1].localeCompare(b[1], 'fr'));
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
      terms.every(term => searchIndex.get(game.id).includes(term))
    );
    if (state.tri === 'az') matching.sort((first, second) => first.title.localeCompare(second.title, 'fr'));
    if (state.tri === 'popularite') matching.sort((first, second) => (second.plays ?? -1) - (first.plays ?? -1));
    return matching;
  }

  function renderFeatured() {
    const game = games.get('jeu-109');
    if (!game?.image) return;
    $('#hero-display').innerHTML = `
      <button class="featured-game" type="button" data-preview="${game.id}" aria-label="Agrandir la capture de ${escape(game.title)}">
        <span class="featured-head"><span>JEU EN VEDETTE</span><span>CE1 · FRANÇAIS</span></span>
        <img class="featured-image" src="${escape(game.image)}" alt="${escape(game.alt)}" fetchpriority="high">
        <span class="featured-foot"><strong>${escape(game.title)}</strong><span class="featured-zoom">${icon('zoom')} <span>Agrandir</span></span></span>
      </button>`;
  }

  function renderLevelLinks() {
    $('#level-grid').innerHTML = levels.map(level => {
      const count = catalogue.filter(game => game.levels.includes(level)).length;
      return `<a class="level-button" href="?niveau=${level}#catalogue" data-level-link="${level}">
        <span class="level-mark" aria-hidden="true"></span><strong class="level-name">${level}</strong>
        <span class="level-count">${gameCount(count)}</span>
      </a>`;
    }).join('');
  }

  function card(game, eager = false) {
    const image = game.image
      ? `<button data-preview="${game.id}" class="image-button" type="button" aria-label="Agrandir la capture de ${escape(game.title)}">
           <img src="${escape(game.image)}" alt="${escape(game.alt || game.title)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
           <span class="image-expand">${icon('zoom')}</span>
         </button>`
      : `<span class="image-placeholder" aria-hidden="true">${icon(subjectIcons[subjectOf(game)])}</span>`;
    return `<article class="game-card" data-game="${escape(game.id)}" data-card-subject="${subjectOf(game)}">
      <div class="game-image">
        ${image}
        <button class="icon-button fav-button" data-favorite="${game.id}" type="button" aria-pressed="false">${icon('heart')}</button>
      </div>
      <div class="card-body">
        <p class="card-meta"><span class="card-levels">${escape(game.levels.join(' · '))}</span><span aria-hidden="true">/</span><span>${escape(game.groupName)}</span></p>
        <h3 class="card-title">${escape(game.title)}</h3>
        <p class="card-description">${escape(game.short)}</p>
        <div class="card-actions">
          <a class="control control-outline play" href="${escape(game.url)}" target="_blank" rel="noopener" aria-label="Jouer à ${escape(game.title)}"${trackingAttributes(game.tracking)}>${icon('play')} Jouer</a>
          ${game.extras.map(link => link.outerHTML).join('')}
          ${game.pdf && !game.extras.some(link => link.getAttribute('href') === game.pdf)
            ? `<a class="quiet-link card-pdf" href="${escape(game.pdf)}" target="_blank" rel="noopener" aria-label="Fiche PDF de ${escape(game.title)}">Fiche PDF</a>` : ''}
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
      button.setAttribute('aria-label', (active ? 'Retirer des favoris : ' : 'Ajouter aux favoris : ') + games.get(id).title);
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
    $('#skill-list').innerHTML = filterButton('skill', 'tous', 'Toutes les compétences', potential.length, state.domaine === 'tous') +
      groupOptions.map(group => filterButton('skill', group, groups.get(group), potential.filter(game => game.group === group).length, state.domaine === group)).join('');

    const skillFilter = $('#skill-filter');
    const skillOptions = option('tous', 'Toutes les compétences') + groupOptions.map(group => option(group, groups.get(group))).join('');
    if (skillOptions !== skillFilter.dataset.options) {
      skillFilter.innerHTML = skillOptions;
      skillFilter.dataset.options = skillOptions;
    }
    $('#level-filter').value = state.niveau;
    $('#subject-filter').value = state.matiere;
    skillFilter.value = state.domaine;
    $('#exercise-filter').innerHTML = option('', 'Tous les exercices') +
      eligibleSkills().map(([key, label]) => option(key, label)).join('');
    $('#exercise-filter').value = state.competence;
    $('#exercise-control').toggleAttribute('hidden', state.domaine === 'tous' && !state.competence);
    $('#sort-filter').value = state.tri;
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

  function renderResults(results = visibleGames()) {
    const total = results.length;
    const displayed = Math.min(total, visibleCount);
    grid.innerHTML = results.slice(0, displayed).map(game => card(game)).join('');
    $('#result-count').textContent = gameCount(total) + (total === 1 ? ' trouvé' : ' trouvés');
    $('#clear-filters').hidden = Object.keys(defaults).every(key => state[key] === defaults[key]);
    $('#more-area').hidden = displayed >= total;
    $('#shown-count').textContent = displayed + ' sur ' + gameCount(total);
    $('#empty-state').hidden = total !== 0;
    if (total === 0) {
      const noFavorites = state.collection === 'favoris' && favorites.size === 0;
      $('#empty-title').textContent = noFavorites ? 'Tu n’as pas encore de favoris' : 'Aucun jeu trouvé';
      $('#empty-description').textContent = noFavorites
        ? 'Utilise le cœur sur un jeu pour le retrouver ici.'
        : 'Essaie un autre mot ou change de niveau, de matière ou de compétence.';
      $('#empty-icon use').setAttribute('href', noFavorites ? '#i-heart' : '#i-search');
    }
    syncFavorites();
    window.goatcounter?.bind_events?.();
  }

  function render() {
    $('#catalogue-title').textContent = collectionLabels[state.collection] || 'Le catalogue des jeux';
    $('#catalogue-intro').textContent = state.collection === 'favoris'
      ? 'Retrouve les jeux enregistrés sur cet appareil.'
      : state.collection === 'semaine'
        ? 'Retrouve les jeux mis en avant dans le blog.'
        : 'Trouve un jeu par niveau, matière ou compétence.';
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
    $('#preview-meta').textContent = game.levels.join(' · ') + ' / ' + game.groupName;
    $('#preview-description').textContent = game.short;
    const preview = $('#preview-image');
    preview.setAttribute('src', game.image);
    preview.alt = game.alt || game.title;
    const play = $('#preview-play');
    play.href = game.url;
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
  $('#load-more').addEventListener('click', () => {
    const previous = visibleCount;
    const results = visibleGames();
    visibleCount += pageSize;
    grid.insertAdjacentHTML('beforeend', results.slice(previous, visibleCount).map(game => card(game)).join(''));
    $('#more-area').hidden = visibleCount >= results.length;
    $('#shown-count').textContent = visibleCount + ' sur ' + gameCount(results.length);
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

  $('#level-filter').innerHTML = option('tous', 'Tous les niveaux') + levels.map(level => option(level, level)).join('');
  $('#subject-filter').innerHTML = Object.entries(subjects).map(([key, label]) => option(key, label)).join('');
  validateFilters();
  renderFeatured();
  renderLevelLinks();
  const weekly = ['jeu-1', 'jeu-3', 'jeu-4'].map(id => games.get(id)).filter(Boolean);
  if (weekly.length) $('#weekly-grid').innerHTML = weekly.map(game => card(game, true)).join('');
  render();
  $('#catalogue').classList.add('catalogue-ready');
  $('#catalogue-availability').hidden = true;
}
enhanceHome().catch(() => {
  document.querySelector('#catalogue-availability').textContent =
    'Les filtres sont temporairement indisponibles. Tu peux toujours ouvrir les jeux ci-dessous.';
});
