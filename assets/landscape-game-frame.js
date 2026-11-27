(async () => {
  'use strict';

  const labels = {
    fr: {
      back: 'Catalogue', home: 'Accueil', direct: 'Ouvrir le jeu seul',
      pdf: 'PDF à imprimer', navigation: 'Navigation du jeu',
      missing: 'Choisis un jeu depuis le catalogue.', error: 'Impossible de charger ce jeu.',
    },
    en: {
      back: 'Catalogue', home: 'Home', direct: 'Open the game on its own',
      pdf: 'Printable PDF', navigation: 'Game navigation',
      missing: 'Choose a game from the catalogue.', error: 'This game could not be loaded.',
    },
    es: {
      back: 'Catálogo', home: 'Inicio', direct: 'Abrir solo el juego',
      pdf: 'PDF para imprimir', navigation: 'Navegación del juego',
      missing: 'Elige un juego del catálogo.', error: 'No se pudo cargar este juego.',
    },
    zh: {
      back: '游戏目录', home: '首页', direct: '单独打开游戏',
      pdf: '打印 PDF', navigation: '游戏导航',
      missing: '请从目录中选择一个游戏。', error: '无法加载此游戏。',
    },
  };
  const lang = document.documentElement.lang;
  const text = labels[lang] || labels.fr;
  const home = document.querySelector('.arcade-player-home');
  const get = id => document.getElementById(id);
  const back = get('catalogue-link');
  const direct = get('direct-link');
  const missing = get('missing');
  const params = new URLSearchParams(location.search);
  const id = params.get('jeu');
  const cataloguePath = lang === 'fr' ? '/assets/catalogue-v2/catalogue.json' : '/assets/catalogue-v2/catalogue-' + lang + '.json';
  const homePath = lang === 'fr' ? '/' : '/' + lang + '/';

  home.href = homePath + '?lang=' + lang;
  home.setAttribute('aria-label', text.home);
  back.href = home.href + '#catalogue';
  back.textContent = text.back;
  direct.textContent = text.direct;
  document.querySelector('.game-links').setAttribute('aria-label', text.navigation);

  if (!id) {
    missing.textContent = text.missing;
    return;
  }

  async function json(url) {
    const response = await fetch(url);
    if (!response.ok) throw Error('Catalogue indisponible');
    return response.json();
  }

  async function findGame() {
    // The legacy links resolve older aliases and include their printable sheets.
    const legacyGames = json('/assets/landscape-game-links.json?v=pronoms-pdf-20261121').catch(() => ({}));
    const catalogue = json(cataloguePath + (lang === 'en' && id === 'en-ours-de-la-banquise-neon' ? '?v=neon-english-20261126' : '')).catch(() => []);
    const legacy = await legacyGames;
    return legacy[lang + ':' + id] || (await catalogue).find(game => game.id === id);
  }

  function showPdf(game) {
    const link = get('game-pdf-link');
    if (!game.pdfUrl) return;
    link.href = game.pdfUrl;
    link.textContent = text.pdf;
    link.hidden = lang === 'fr' && id === 'jeu-27';

    if (lang === 'fr' && (id === 'jeu-27' || id === 'jeu-75')) {
      link.textContent = id === 'jeu-27' ? 'Exercices PDF à imprimer' : 'PDF · Dictées 7 à 12';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('download');
    }

    if (lang === 'fr' && id === 'jeu-27') {
      fetch(link.href, { method: 'HEAD' })
        .then(response => { link.hidden = !response.ok; })
        .catch(() => { link.hidden = true; });
    }
  }

  try {
    const game = await findGame();
    if (!game) throw Error('Jeu introuvable');
    const url = new URL(game.url, location.origin);
    if (lang === 'en' && id === 'en-ours-de-la-banquise-neon') {
      url.href = new URL('/jeux/ours-de-la-banquise-neon-en/?v=20261126', location.origin).href;
    }
    if (!['https:', 'http:'].includes(url.protocol)) throw Error('Adresse invalide');

    if (url.host === location.host || url.host === 'bleja972.github.io') {
      if (['/jouer/calcul-ce1/', '/jouer/calcul-ce2/', '/jouer/numeration-ce1/'].includes(url.pathname)) {
        // Keep the existing launchers for their synchronised URLs and PDFs.
        location.replace(url.pathname + url.search + url.hash);
        return;
      }
      if (url.pathname === '/jouer/' || url.pathname === '/jouer/index.html') throw Error('Jeu introuvable');
    }

    document.title = game.title;
    get('game-title').textContent = game.title;
    direct.href = url.href;
    direct.hidden = false;
    showPdf(game);

    const frame = document.createElement('iframe');
    frame.title = game.title;
    frame.src = url.href;
    frame.allow = 'fullscreen; autoplay';
    frame.allowFullscreen = true;
    frame.dataset.blejaGameFrame = '';
    // Apply the French arcade chrome to English embedded games without changing game artwork.
    if (lang === 'en') {
      frame.addEventListener('load', () => {
        try {
          const doc = frame.contentDocument;
          if (!doc || doc.getElementById('bleja-english-arcade-chrome')) return;
          const view = doc.defaultView;
          const link = doc.createElement('link');
          link.id = 'bleja-english-arcade-chrome';
          link.rel = 'stylesheet';
          link.href = '/assets/accueil-arcade/english-game-chrome.css?v=20261126';
          // Only flatten green/teal outer backgrounds that contain no artwork.
          const isGreen = value => {
            const colors = [...value.matchAll(/rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)/g)];
            return colors.some(m => { const [,r,g,b]=m.map(Number); return g>r+12 && g>b*.90 && g>25; });
          };
          const themed = el => {
            const cs = view.getComputedStyle(el);
            return /url\(|image-set\(|paint\(/i.test(cs.backgroundImage);
          };
          for(const el of [doc.documentElement,doc.body]){
            if(!el || themed(el)) continue;
            const cs=view.getComputedStyle(el);
            if(isGreen(cs.backgroundColor+' '+cs.backgroundImage)) el.classList.add('bleja-english-flat-background');
          }
          for(const el of doc.querySelectorAll('body > header, body > nav, body > footer, body > .wrap > header, body > .app > .shell > header, body > .shell > header, body > .page > header, body > .container > header, .decouvrir-autre-jeu')){
            if(themed(el)) continue;
            const cs=view.getComputedStyle(el);
            if(isGreen(cs.backgroundColor+' '+cs.backgroundImage)) el.classList.add('bleja-english-outer-panel');
          }
          doc.head.append(link);
        } catch {}
      });
    }
    get('game-container').replaceChildren(frame);
  } catch {
    missing.textContent = text.error;
  }
})();
