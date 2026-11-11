(() => {
  'use strict';

  const loader = document.currentScript;
  const asset = new URL(loader.src);

  const pagePath = url => new URL(url).pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  const path = pagePath(location.href);
  const trexNumberLine = /\/(?:droite-numerique-t-rex-ce1|t-rex-number-lines-ce1)\/$/.test(path);
  const launchers = new Set(['/jouer/calcul-ce1/', '/jouer/calcul-ce2/', '/jouer/numeration-ce1/']);

  // These games generate a plain text input for their numeric questions.
  const numberTemplates = new Set(`
    /en/games/compare-two-numbers/
    /en/games/complete-number-sequences/
    /en/games/compose-and-partition-numbers/
    /en/games/count-a-collection/
    /en/games/count-in-different-ways/
    /en/games/number-dictation/
    /en/games/put-numbers-in-order/
    /en/games/read-and-write-numbers/
    /en/games/recognise-odd-and-even-numbers/
    /en/games/review-numbers-up-to-1-000/
    /es/games/comparer-deux-nombres/
    /es/games/completer-des-suites/
    /es/games/composer-et-decomposer/
    /es/games/compter-de-plusieurs-facons/
    /es/games/denombrer-une-collection/
    /es/games/dictee-de-nombres/
    /es/games/je-revois-les-nombres-jusqua-1000/
    /es/games/lire-et-ecrire-les-nombres/
    /es/games/ranger-des-nombres/
    /es/games/reconnaitre-les-nombres-pairs-et-impairs/
    /zh/games/comparer-deux-nombres/
    /zh/games/completer-des-suites/
    /zh/games/composer-et-decomposer/
    /zh/games/compter-de-plusieurs-facons/
    /zh/games/denombrer-une-collection/
    /zh/games/dictee-de-nombres/
    /zh/games/je-revois-les-nombres-jusqua-1000/
    /zh/games/lire-et-ecrire-les-nombres/
    /zh/games/ranger-des-nombres/
    /zh/games/reconnaitre-les-nombres-pairs-et-impairs/
  `.trim().split(/\s+/));
  // These games switch to text input in the thousands, where spaces are optional.
  const spacedNumberFields = new Set(`
    /en/games/popeye-number-line/
    /jeux/popeye-ligne-graduee/
  `.trim().split(/\s+/));
  const numberLine = trexNumberLine || spacedNumberFields.has(path);
  const numericGames = new Set(`
    /activites/dizaines-entieres/
    /activites/soustraire-a-10/
    /en/games/add-and-subtract-tens/
    /en/games/addition-by-bridging-10/
    /en/games/addition-with-regrouping-3d-counters/
    /en/games/build-a-number/
    /en/games/bulles-de-sorcellerie/
    /en/games/ce1-chronomaths-20-challenges/
    /en/games/ce2-chronomaths-20-challenges/
    /en/games/column-addition-with-regrouping/
    /en/games/column-addition-without-regrouping/
    /en/games/column-subtraction-with-regrouping/
    /en/games/cp-mental-maths/
    /en/games/dino-calculs/
    /en/games/divisions-galactiques/
    /en/games/doubles/
    /en/games/fritz-number-bounds/
    /en/games/ile-mysterieuse-soustractions/
    /en/games/maths-lab/
    /en/games/mental-maths-term-1/
    /en/games/mental-maths-term-2/
    /en/games/mission-nautilus/
    /en/games/montessori-number-cards/
    /en/games/near-doubles/
    /en/games/number-bonds-to-10-100-and-1-000/
    /en/games/number-bonds-to-10/
    /en/games/number-fish/
    /en/games/number-sequences/
    /en/games/partition-a-number/
    /en/games/simple-addition/
    /en/games/subtract-from-10/
    /en/games/subtraction-with-base-ten-blocks/
    /en/games/t-rex-number-lines-ce1/
    /en/games/tables-enchantees/
    /en/games/temple-des-doubles/
    /en/games/the-calculation-race/
    /en/games/tour-du-monde-complements-1000/
    /en/games/vallee-des-moities/
    /en/games/ways-to-represent-numbers/
    /es/games/additions-avec-echanges-jetons-3d/
    /es/games/additions-avec-passage-par-10/
    /es/games/additions-posees-avec-echanges/
    /es/games/additions-posees-sans-echange/
    /es/games/ajouter-et-soustraire-des-dizaines/
    /es/games/bulles-de-sorcellerie/
    /es/games/calcul-mental-cp/
    /es/games/calcul-mental-periode-1/
    /es/games/calcul-mental-periode-2/
    /es/games/chronomaths-ce1-20-defis/
    /es/games/chronomaths-ce2-20-defis/
    /es/games/chronomaths-enchantes-ce1/
    /es/games/chronomaths-galactiques-ce2/
    /es/games/complements-a-10-100-et-1-000/
    /es/games/decomposer-un-nombre/
    /es/games/dino-calculs/
    /es/games/divisions-galactiques/
    /es/games/la-course-des-calculs/
    /es/games/labo-des-calculs/
    /es/games/le-tour-du-monde-en-80-jours-complements-a-1-000/
    /es/games/les-complements-a-10/
    /es/games/les-doubles/
    /es/games/les-petites-additions/
    /es/games/les-poissons-des-nombres/
    /es/games/les-presque-doubles/
    /es/games/les-representations-des-nombres/
    /es/games/lile-mysterieuse-soustractions/
    /es/games/mission-nautilus-complements-a-100/
    /es/games/recomposer-un-nombre/
    /es/games/soustractions-avec-le-materiel-de-numeration/
    /es/games/soustractions-par-cassage/
    /es/games/soustraire-un-nombre-a-10/
    /es/games/suites-de-nombres/
    /es/games/tables-enchantees-ce2/
    /es/games/tables-enchantees/
    /es/games/temple-des-doubles/
    /es/games/vallee-des-moities/
    /jeux/bulles-de-sorcellerie/
    /jeux/calcul-mental-cp/
    /jeux/cartons-montessori-ce1/
    /jeux/cartons-montessori-ce2/
    /jeux/chronomaths-enchantes-ce1/
    /jeux/dino-calculs/
    /jeux/divisions-galactiques/
    /jeux/droite-numerique-t-rex-ce1/
    /jeux/fritz-encadrements-ce1/
    /jeux/fritz-encadrements-ce2/
    /jeux/fritz-encadrements-cp/
    /jeux/ile-mysterieuse-soustractions/
    /jeux/labo-des-calculs/
    /jeux/mission-nautilus/
    /jeux/tables-enchantees-ce2/
    /jeux/tables-enchantees/
    /jeux/temple-des-doubles/
    /jeux/tour-du-monde-complements-1000/
    /jeux/vallee-des-moities/
    /zh/games/additions-avec-echanges-jetons-3d/
    /zh/games/additions-avec-passage-par-10/
    /zh/games/additions-posees-avec-echanges/
    /zh/games/additions-posees-sans-echange/
    /zh/games/ajouter-et-soustraire-des-dizaines/
    /zh/games/bulles-de-sorcellerie/
    /zh/games/calcul-mental-cp/
    /zh/games/calcul-mental-periode-1/
    /zh/games/calcul-mental-periode-2/
    /zh/games/chronomaths-ce1-20-defis/
    /zh/games/chronomaths-ce2-20-defis/
    /zh/games/chronomaths-enchantes-ce1/
    /zh/games/chronomaths-galactiques-ce2/
    /zh/games/complements-a-10-100-et-1-000/
    /zh/games/decomposer-un-nombre/
    /zh/games/dino-calculs/
    /zh/games/divisions-galactiques/
    /zh/games/la-course-des-calculs/
    /zh/games/labo-des-calculs/
    /zh/games/le-tour-du-monde-en-80-jours-complements-a-1-000/
    /zh/games/les-complements-a-10/
    /zh/games/les-doubles/
    /zh/games/les-petites-additions/
    /zh/games/les-poissons-des-nombres/
    /zh/games/les-presque-doubles/
    /zh/games/les-representations-des-nombres/
    /zh/games/lile-mysterieuse-soustractions/
    /zh/games/mission-nautilus-complements-a-100/
    /zh/games/recomposer-un-nombre/
    /zh/games/soustractions-avec-le-materiel-de-numeration/
    /zh/games/soustractions-par-cassage/
    /zh/games/soustraire-un-nombre-a-10/
    /zh/games/suites-de-nombres/
    /zh/games/tables-enchantees-ce2/
    /zh/games/tables-enchantees/
    /zh/games/temple-des-doubles/
    /zh/games/vallee-des-moities/
  `.trim().split(/\s+/));

  // Les anciens jeux restent hébergés dans leurs dépôts GitHub Pages.
  // Le lanceur leur fournit le pavé lorsqu'ils partagent l'origine du blog.
  if (launchers.has(path)) {
    const frame = document.querySelector('#game-container iframe');
    if (!frame) return;
    const loadInGame = () => {
      const game = frame.contentDocument;
      if (!game?.head || new URL(game.URL).origin !== location.origin || pagePath(game.URL) !== pagePath(frame.src)) return;
      if (game.querySelector('script[data-numeric-pad], #keypad, #mobileKeypad')) return;
      const script = game.createElement('script');
      script.src = asset.href;
      script.dataset.numericPad = '';
      script.dataset.gameNumericPad = '';
      const inputTemplate = /^\/(?:evaluation_periode1_numeration|denombrer2|comparer|ranger|lire_nombres|dictee_nombres|suite_de_nombres|composer_decomposer|pair_ou_impair|suites)\/$/i;
      if (inputTemplate.test(pagePath(game.URL))) script.dataset.numberTemplate = '';
      game.head.append(script);
    };
    frame.addEventListener('load', loadInGame);
    if (frame.contentDocument?.readyState === 'complete') loadInGame();
    return;
  }

  if (!numericGames.has(path) && !numberTemplates.has(path) && !spacedNumberFields.has(path)
    && !loader.hasAttribute('data-game-numeric-pad')) return;

  const device = matchMedia('(pointer: coarse) and (max-width: 1024px), (pointer: coarse) and (max-height: 600px)');
  const fieldSelector = 'input[inputmode="numeric"], input[type="number"], input[data-keypad-number]'
    + (loader.hasAttribute('data-number-template') || numberTemplates.has(path) ? ', input#a.answer' : '')
    + (spacedNumberFields.has(path) ? ', input#answer' : '');
  const nativePad = document.querySelector('#keypad, #mobileKeypad');
  if (nativePad) return;

  const labels = {
    fr: ['Clavier de chiffres', 'Tout effacer', 'Effacer le dernier chiffre', 'Masquer le clavier', 'Valider'],
    en: ['Number keypad', 'Clear all', 'Delete the last digit', 'Hide keypad', 'Check'],
    es: ['Teclado numérico', 'Borrar todo', 'Borrar el último dígito', 'Ocultar el teclado', 'Comprobar'],
    zh: ['数字键盘', '全部清除', '删除最后一位数字', '隐藏键盘', '确认']
  };
  const language = document.documentElement.lang.toLowerCase().split('-')[0];
  const [title, clear, backspace, close, check] = labels[language] || labels.fr;
  const modifiedFields = new Map();
  let activeField;
  let updatePending = false;
  let selectionVersion = 0;

  const host = document.createElement('bleja-number-pad');
  host.hidden = true;
  host.translate = false;
  const shadow = host.attachShadow({mode: 'open'});
  shadow.innerHTML = `
    <style>
      :host { all: initial; box-sizing: border-box; display: block; flex: 0 0 auto;
        grid-column: 1 / -1; width: min(100%, 300px); margin: 6px auto 8px; }
      :host([hidden]) { display: none !important; }
      .pad { box-sizing: border-box; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 4px; padding: 5px; background: rgba(19, 45, 68, .30); border: 1px solid #8ea9bf9c;
        border-radius: 10px; }
      button { appearance: none; min-width: 0; min-height: 34px; padding: 0 2px; border: 1px solid #6ba6cd85;
        border-radius: 6px; background: rgba(242, 249, 255, .86); color: #102b42;
        font: 700 17px/1 system-ui, sans-serif; touch-action: manipulation; cursor: pointer; }
      button[data-action] { background: rgba(217, 239, 255, .86); }
      button:active { background: rgba(138, 205, 243, .95); }
      button:focus-visible { outline: 2px solid #234d72; outline-offset: -2px; }
      .actions { grid-column: 1 / -1; display: flex; gap: 4px; }
      .actions button { flex: 1; min-height: 28px; font-size: 12px; }
      .actions button[data-action="submit"] { background: rgba(210, 244, 227, .88); }
      .actions button[hidden] { display: none; }
      @media (orientation: landscape) and (min-width: 620px) {
        :host { width: min(100%, 490px); }
        .pad { grid-template-columns: repeat(12, minmax(0, 1fr)); }
      }
    </style>
    <div class="pad" role="group"></div>`;
  const pad = shadow.querySelector('.pad');
  pad.setAttribute('aria-label', title);

  function addKey(value, action, label) {
    const key = document.createElement('button');
    key.type = 'button';
    key.textContent = value;
    if (action) key.dataset.action = action;
    if (label) key.setAttribute('aria-label', label);
    return key;
  }

  for (const digit of '123456789') pad.append(addKey(digit));
  pad.append(addKey('C', 'clear', clear), addKey('0'), addKey('⌫', 'backspace', backspace));
  const actions = document.createElement('div');
  actions.className = 'actions';
  const submitKey = addKey(check, 'submit');
  actions.append(addKey(close, 'close'), submitKey);
  pad.append(actions);

  function isNumberField(field) {
    return field instanceof HTMLInputElement && ['text', 'tel', 'number', 'search'].includes(field.type)
      && (modifiedFields.has(field) || field.matches(fieldSelector));
  }

  function prepare(field) {
    if (!device.matches || !isNumberField(field) || field.readOnly || field.disabled) return;
    if (!modifiedFields.has(field)) modifiedFields.set(field, field.getAttribute('inputmode'));
    if (field.inputMode !== 'none') field.inputMode = 'none';
  }

  function available(field) {
    return field?.isConnected && !field.disabled && !field.readOnly && field.getClientRects().length
      && getComputedStyle(field).visibility === 'visible';
  }

  function formSubmit(field) {
    const submit = field?.form?.querySelector('button[type="submit"], input[type="submit"]');
    return available(submit) ? submit : null;
  }

  function dismiss() {
    host.hidden = true;
    activeField = null;
  }

  // Leave the game and answer controls in their normal flow. The keypad
  // gets a new row below the answer block, including on number-line games.
  function answerBlock(field) {
    const container = field.closest('section, article, details, #gamePage, #game, main');
    let block = field.closest('form, [role="form"], .dock, .answer-entry, .response-form, .answerWrap') || field;
    if (block === field && container) {
      while (block.parentElement !== container) block = block.parentElement;
    }
    while (block.parentElement !== document.body) {
      const parent = block.parentElement;
      const layout = getComputedStyle(parent);
      const inline = ['LABEL', 'SPAN', 'P'].includes(parent.tagName);
      const singleRow = layout.display.includes('flex') && layout.flexWrap === 'nowrap'
        && layout.flexDirection.startsWith('row');
      if (!inline && !singleRow) break;
      block = parent;
    }
    return block;
  }

  function updatePad() {
    if (!activeField) return;
    if (!available(activeField)) return dismiss();
    submitKey.hidden = !formSubmit(activeField);
  }

  function scheduleUpdate() {
    if (updatePending || !activeField) return;
    updatePending = true;
    requestAnimationFrame(() => {
      updatePending = false;
      updatePad();
    });
  }

  function show(field, reveal = false) {
    prepare(field);
    if (!device.matches || !isNumberField(field) || !available(field)) return;
    selectionVersion += 1;
    activeField = field;
    const block = answerBlock(field);
    if (block.nextElementSibling !== host) block.after(host);
    host.hidden = false;
    updatePad();

    if (reveal) requestAnimationFrame(() => {
      if (activeField !== field || host.hidden) return;
      host.scrollIntoView({block: 'nearest', inline: 'nearest'});
      if (!numberLine) return;

      // If the exercise and keypad fit together, keep the whole line in view.
      const axis = document.getElementById('axis');
      if (!axis) return;
      const lineTop = axis.getBoundingClientRect().top;
      const padBottom = host.getBoundingClientRect().bottom;
      const toolbarBottom = document.querySelector('.bleja-landscape-tools')?.getBoundingClientRect().bottom || 0;
      const top = Math.max(0, toolbarBottom) + 4;
      if (lineTop < top && padBottom - lineTop <= document.documentElement.clientHeight - top) {
        scrollBy(0, lineTop - top);
      }
    });
  }

  function editField(field, digit, action) {
    const value = field.value;
    let start = field.selectionStart ?? value.length;
    const end = field.selectionEnd ?? value.length;
    if (action === 'backspace' && start === end) start = Math.max(0, start - 1);
    const insert = action ? '' : digit;
    const next = action === 'clear' ? '' : value.slice(0, start) + insert + value.slice(end);
    if (next === value || (insert && field.maxLength >= 0 && next.length > field.maxLength)) return;
    field.value = next;
    if (field.selectionStart !== null) {
      const caret = action === 'clear' ? 0 : start + insert.length;
      field.setSelectionRange(caret, caret);
    }
    field.dispatchEvent(new Event('input', {bubbles: true}));
    scheduleUpdate();
  }

  // Keep the input focused while tapping buttons, including in games that
  // automatically move to the next box on each digit.
  pad.addEventListener('pointerdown', event => event.preventDefault());
  pad.addEventListener('click', event => {
    const key = event.target.closest('button');
    if (!key || !available(activeField) || key.dataset.action === 'close') return dismiss();
    if (key.dataset.action === 'submit') {
      const submit = formSubmit(activeField);
      if (submit) {
        dismiss();
        submit.click();
      }
      return;
    }
    editField(activeField, key.textContent, key.dataset.action);
  });

  document.addEventListener('focusin', event => {
    if (isNumberField(event.target)) show(event.target);
  }, true);
  document.addEventListener('pointerdown', event => {
    if (isNumberField(event.target)) prepare(event.target);
  }, true);
  document.addEventListener('click', event => {
    if (isNumberField(event.target)) {
      show(event.target, true);
    } else if (!event.composedPath().includes(host) && activeField) {
      const version = selectionVersion;
      // Let the original button handle the click before removing the row.
      requestAnimationFrame(() => {
        if (version === selectionVersion) dismiss();
      });
    }
    scheduleUpdate();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeField) dismiss();
  });

  const observer = new MutationObserver(changes => {
    for (const change of changes) {
      if (change.type === 'attributes') prepare(change.target);
      for (const node of change.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE || node === host) continue;
        prepare(node);
        node.querySelectorAll(fieldSelector).forEach(prepare);
      }
    }
    for (const field of modifiedFields.keys()) {
      if (!field.isConnected) modifiedFields.delete(field);
    }
    scheduleUpdate();
  });

  function adaptToDevice() {
    if (!device.matches) {
      observer.disconnect();
      dismiss();
      for (const [field, mode] of modifiedFields) {
        if (mode === null) field.removeAttribute('inputmode');
        else field.setAttribute('inputmode', mode);
      }
      modifiedFields.clear();
      return;
    }
    document.querySelectorAll(fieldSelector).forEach(prepare);
    observer.observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['inputmode', 'disabled', 'readonly', 'hidden']
    });
    show(document.activeElement);
  }

  function init() {
    if (trexNumberLine) {
      const style = document.createElement('style');
      style.textContent = `
        @media (orientation: landscape) and (max-height: 500px) {
          #game .axis { padding-bottom: 4px; }
          #game .axis svg { max-height: 28vh; }
          #game .response-form { margin: 8px auto 4px; }
          #game .response-form label { font-size: 16px; margin-bottom: 4px; }
          #game .response-row input { font-size: 24px; padding: 5px 8px; }
          #game .response-row button { font-size: 16px; padding: 8px 12px; }
        }
      `;
      document.head.append(style);
    }
    adaptToDevice();
    device.addEventListener('change', adaptToDevice);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
