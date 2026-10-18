"use strict";
document.querySelectorAll("[data-counter-path]").forEach(async function(el){
const ctrl=new AbortController();const timer=setTimeout(function(){ctrl.abort()},8000);
try{const r=await fetch("https://lesjeuxdemathsetdefrancais.goatcounter.com/counter/"+encodeURIComponent(el.dataset.counterPath)+".json",{signal:ctrl.signal});if(!r.ok)throw new Error("Counter unavailable");const d=await r.json();if(d.count===undefined)throw new Error("Missing count");el.textContent=d.count;}
catch(e){el.textContent="indisponible";el.title="Le compteur doit être autorisé dans les paramètres GoatCounter. Les nouvelles données peuvent être différées.";}
finally{clearTimeout(timer);}
});