"use strict";
document.querySelectorAll("[data-counter-path]").forEach(async function(el) {
  const ctrl = new AbortController();
  const timer = setTimeout(function() { ctrl.abort(); }, 8000);
  try {
    const r = await fetch("https://lesjeuxdemathsetdefrancais.goatcounter.com/counter/" + encodeURIComponent(el.dataset.counterPath) + ".json", {signal: ctrl.signal});
    const d = await r.json();
    if ((!r.ok && r.status !== 404) || d.count === undefined || !/^[0-9][0-9 ,.  ]*$/.test(String(d.count))) {
      throw new Error("Counter unavailable");
    }
    el.textContent = d.count;
    el.title = "Données fournies par GoatCounter ; actualisation différée possible.";
  } catch (e) {
    el.textContent = "indisponible";
    el.title = "Le compteur ne peut pas être chargé. Vérifiez que les compteurs publics sont autorisés dans GoatCounter.";
  } finally {
    clearTimeout(timer);
  }
});

/* Boutons de partage des jeux. */
(()=>{if(document.querySelector('script[data-bleja-share]'))return;const s=document.createElement('script');s.src='/assets/partager-jeu.js?v=share-v1';s.dataset.blejaShare='';s.defer=true;document.head.append(s)})();
