(()=>{
'use strict';
const prefix='domino-rating-v1:';
const groups=new Map();
document.querySelectorAll('[data-domino-rating]').forEach(box=>{
 const id=box.dataset.dominoRating;
 if(!groups.has(id))groups.set(id,[]);
 groups.get(id).push(box);
});
function show(id,value,message){
 (groups.get(id)||[]).forEach(box=>{
  box.querySelectorAll('button[data-score]').forEach(button=>{
   const score=Number(button.dataset.score);
   button.classList.toggle('is-filled',score<=value);
   button.setAttribute('aria-pressed',String(score===value));
  });
  box.querySelector('.domino-rating-status').textContent=message||(value?'Votre note : '+value+'/5':'Choisissez de 1 à 5 étoiles.');
 });
}
groups.forEach((boxes,id)=>{
 let saved=0;
 try{saved=Number(localStorage.getItem(prefix+id));}catch{}
 if(!Number.isInteger(saved)||saved<1||saved>5)saved=0;
 show(id,saved);
 boxes.forEach(box=>{
  box.addEventListener('click',event=>{
   const button=event.target.closest('button[data-score]');
   if(!button||!box.contains(button))return;
   const value=Number(button.dataset.score);let stored=true;
   try{localStorage.setItem(prefix+id,String(value));}catch{stored=false;}
   show(id,value,stored?'Votre note : '+value+'/5. Vous pouvez la modifier.':'Votre note : '+value+'/5 (non enregistrée dans ce navigateur).');
  });
  box.addEventListener('keydown',event=>{
   const button=event.target.closest('button[data-score]');
   if(!button||!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
   event.preventDefault();
   const current=Number(button.dataset.score);
   const next=event.key==='Home'?1:event.key==='End'?5:Math.max(1,Math.min(5,current+(event.key==='ArrowRight'?1:-1)));
   box.querySelector('[data-score="'+next+'"]').focus();
  });
 });
});
window.addEventListener('storage',event=>{
 if(!event.key||!event.key.startsWith(prefix))return;
 const id=event.key.slice(prefix.length);const n=Number(event.newValue);
 show(id,Number.isInteger(n)&&n>=1&&n<=5?n:0);
});
})();