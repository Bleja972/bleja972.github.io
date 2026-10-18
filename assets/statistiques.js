"use strict";
document.querySelectorAll("[data-counter-path]").forEach(async function(el){
const ctrl=new AbortController();const timer=setTimeout(function(){ctrl.abort()},8000);
try{const r=await fetch("https://lesjeuxdemathsetdefrancais.goatcounter.com/counter/"+encodeURIComponent(el.dataset.counterPath)+".json",{signal:ctrl.signal});const d=await r.json();if((!r.ok && r.status!==404)||d.count===undefined||!/^\\d[\\d\\s,.]*$/.test(String(d.count)))throw new Error("Counter unavailable");el.textContent=d.count;el.title="Données fournies par GoatCounter ; actualisation différée possible.";}
catch(e){el.textContent="indisponible";el.title="Le compteur doit être autorisé dans les paramètres GoatCounter. Les nouvelles données peuvent être différées.";}
finally{clearTimeout(timer);}
});