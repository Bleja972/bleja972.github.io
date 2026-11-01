/* Total commun des visites des quatre accueils, sans modifier leur suivi. */
(async function () {
  const buttons = [...document.querySelectorAll("[data-counter-total]")];
  if (!buttons.length) return;
  const paths = ["/", "/en/", "/es/", "/zh/"];
  const lang = document.documentElement.lang.split("-")[0];
  const words = {
    fr: {label:"Visites · toutes les langues", unavailable:"Compteur indisponible", detail:"Détail des visites : français, anglais, espagnol et chinois. Les visites sont additionnées ; une personne peut être comptée plusieurs fois.", names:["Français","English","Español","中文"]},
    en: {label:"Visits · all languages", unavailable:"Counter unavailable", detail:"Visits across French, English, Spanish and Chinese. Visits are added together; a person may be counted more than once.", names:["Français","English","Español","中文"]},
    es: {label:"Visitas · todos los idiomas", unavailable:"Contador no disponible", detail:"Suma de visitas en francés, inglés, español y chino. Una persona puede contarse varias veces.", names:["Français","English","Español","中文"]},
    zh: {label:"访问次数 · 所有语言", unavailable:"计数器暂不可用", detail:"法语、英语、西班牙语和中文主页访问次数之和。同一访客可能被多次计数。", names:["Français","English","Español","中文"]}
  };
  const text = words[lang] || words.fr;
  const locale = ({fr:"fr-FR",en:"en-GB",es:"es-ES",zh:"zh-CN"})[lang] || "fr-FR";
  const format = n => n.toLocaleString(locale);
  buttons.forEach(button => {
    button.title = text.detail;
    button.addEventListener("click", () => {
      const details = button.parentElement.querySelector("[data-counter-breakdown]");
      if (!details || !details.textContent) return;
      details.hidden = !details.hidden;
      button.setAttribute("aria-expanded", String(!details.hidden));
    });
  });
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const counts = await Promise.all(paths.map(async path => {
      const response = await fetch("https://lesjeuxdemathsetdefrancais.goatcounter.com/counter/" + encodeURIComponent(path) + ".json", {signal:ctrl.signal});
      if (!response.ok && response.status !== 404) throw Error("Counter unavailable");
      const data = await response.json();
      const raw = String(data.count ?? "");
      if (!/^[0-9][0-9 ,.\u00a0\u202f]*$/.test(raw)) throw Error("Invalid counter");
      const value = Number(raw.replace(/[ ,.\u00a0\u202f]/g, ""));
      if (!Number.isSafeInteger(value) || value < 0) throw Error("Invalid counter");
      return value;
    }));
    const total = counts.reduce((a,b) => a+b,0);
    buttons.forEach(button => {
      button.querySelector("[data-counter-number]").textContent = format(total);
      const details = button.parentElement.querySelector("[data-counter-breakdown]");
      details.textContent = counts.map((n,i) => text.names[i] + " : " + format(n)).join(" · ");
      button.setAttribute("aria-label", text.label + " : " + format(total) + ". " + text.detail);
    });
  } catch (_) {
    buttons.forEach(button => {
      button.querySelector("[data-counter-number]").textContent = "—";
      button.title = text.unavailable;
      button.setAttribute("aria-label", text.unavailable);
      button.disabled = true;
    });
  } finally { clearTimeout(timer); }
})();

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
