(() => {
  'use strict';
  const id = new URLSearchParams(location.search).get('jeu');
  const nav = document.querySelector('.arcade-player-links');
  if (!id || !nav || !document.querySelector('#game-container iframe')) return;
  const normalize = href => { const u = new URL(href, location.origin); return u.pathname + u.search; };
  fetch('/assets/catalogue-v2/catalogue.json?v=pdf-20261127')
    .then(r => { if (!r.ok) throw Error('Catalogue'); return r.json(); })
    .then(items => {
      const entry = items.find(item => item.id === id);
      const resources = entry?.pdfResources?.length ? entry.pdfResources : entry?.pdfUrl ? [{url:entry.pdfUrl,label:entry.pdfLabel}] : [];
      for (const resource of resources) {
        if (!resource.url || !/^\/(?:pdf|fiches|jeux|imprimer)\//.test(resource.url)) continue;
        if ([...nav.querySelectorAll('a[href]')].some(a => !a.hidden && normalize(a.href) === normalize(resource.url))) continue;
        fetch(resource.url,{method:'HEAD'}).then(response => {
          if (!response.ok) return;
          const link = document.createElement('a');
          link.className = 'control control-primary arcade-player-sheet';
          link.href = resource.url;
          link.target = '_blank'; link.rel = 'noopener';
          link.textContent = 'PDF à imprimer' + (resources.length > 1 && resource.label ? ' · ' + resource.label : '');
          link.title = resource.label || 'PDF à imprimer';
          nav.insertBefore(link, nav.querySelector('#horizontal-toggle'));
        }).catch(()=>{});
      }
    }).catch(()=>{});
})();