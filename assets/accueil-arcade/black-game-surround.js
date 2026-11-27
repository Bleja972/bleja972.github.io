/* Only recolour green outer chrome; keep game artwork and controls. */
(() => {
  const language = (document.documentElement.lang || '').toLowerCase().split('-')[0];
  const playerLanguage = new URLSearchParams(location.search).get('lang');
  if (!['en','es'].includes(language) && !['en','es'].includes(playerLanguage)) return;
  const seen = new WeakSet();
  const selectors = 'html,body,body > header,body > nav,body > footer,body > main,body > .wrap,body > .shell,body > .app,body > .page,body > .container,body > .wrapper,body > .game-wrapper,body > .game-container,body > #game-container,body > .wrap > header,body > .shell > header,body > .page > header,body > .container > header,body > .app > .shell > header,.decouvrir-autre-jeu';
  const green = value => [...value.matchAll(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/g)].some(m => { const r=+m[1],g=+m[2],b=+m[3]; return g>r+12 && g>b*.90 && g>25; });
  function apply(doc) {
    if (!doc?.documentElement || !doc.body) return;
    if (!doc.getElementById('bleja-black-surround-style')) {
      const style=doc.createElement('style'); style.id='bleja-black-surround-style';
      style.textContent='.bleja-black-surround{background-color:#000!important;background-image:none!important}.bleja-black-surround-light-text{color:#f4f5ff!important}.bleja-black-surround-light-text>h1,.bleja-black-surround-light-text>h2,.bleja-black-surround-light-text>p,.bleja-black-surround-light-text>nav>a:not([class]){color:#f4f5ff!important}';
      doc.head.append(style);
    }
    const w=doc.defaultView;
    for(const el of doc.querySelectorAll(selectors)) {
      if(el.classList.contains('bleja-black-surround')) continue;
      const cs=w.getComputedStyle(el);
      if(/url\(|image-set\(|paint\(/i.test(cs.backgroundImage)) continue;
      if(!green(cs.backgroundColor+' '+cs.backgroundImage)) continue;
      el.classList.add('bleja-black-surround');
      const rgb=cs.color.match(/rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/);
      if(rgb && .2126*+rgb[1]+.7152*+rgb[2]+.0722*+rgb[3]<130) el.classList.add('bleja-black-surround-light-text');
    }
    for(const frame of doc.querySelectorAll('iframe')) {
      const inside=()=>{try{apply(frame.contentDocument)}catch{}};
      if(!seen.has(frame)){seen.add(frame);frame.addEventListener('load',inside)}
      inside();
    }
  }
  const run=()=>apply(document);
  const start=()=>{run();requestAnimationFrame(run);window.addEventListener('load',run,{once:true});new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches('iframe')||n.querySelector('iframe')))))run()}).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();