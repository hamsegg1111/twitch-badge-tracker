let filter="all", query="", sort="deadline";
const $=s=>document.querySelector(s), grid=$("#grid"), empty=$("#empty");
function daysLeft(d){return Math.ceil((new Date(d)-Date.now())/86400000)}
function dateText(d){return new Date(d).toLocaleString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}
function soon(b){let d=daysLeft(b.deadline);return d>=0&&d<=5}
function filtered(){
 let a=badges.filter(b=>{
   let text=(b.name+" "+b.game+" "+b.condition+" "+b.typeName).toLowerCase();
   let okq=text.includes(query.toLowerCase());
   let okf=filter==="all"||(filter==="soon"?soon(b):b.type===filter);
   return okq&&okf;
 });
 a.sort((x,y)=>sort==="name"?x.name.localeCompare(y.name):sort==="type"?x.type.localeCompare(y.type):new Date(x.deadline)-new Date(y.deadline));
 return a;
}
function render(){
 let a=filtered(); grid.innerHTML="";
 empty.hidden=a.length!==0;
 a.forEach(b=>{
  let d=daysLeft(b.deadline);
  let cls=soon(b)?"urgent":b.status==="進行中"?"live":"";
  grid.insertAdjacentHTML("beforeend",`
  <article class="card" data-id="${b.id}">
   <div class="card-top"><span class="tag ${cls}">${b.status}</span><span class="left">${d>=0?d+" 天":"已結束"}</span></div>
   <div class="badge-img"><img src="${b.image}" alt="${b.name}" onerror="this.style.opacity=.2"></div>
   <div class="type">${b.typeName}</div><h3>${b.name}</h3><p class="game">${b.game}</p>
   <p class="condition">${b.condition}</p>
   <div class="deadline">截止：<b>${dateText(b.deadline)}</b></div>
  </article>`);
 });
 document.querySelectorAll(".card").forEach(c=>c.onclick=()=>openModal(+c.dataset.id));
 $("#resultText").textContent=`顯示 ${a.length} / ${badges.length} 個徽章`;
}
function openModal(id){
 let b=badges.find(x=>x.id===id);
 $("#modalBody").innerHTML=`<div class="modal-img"><img src="${b.image}" alt="${b.name}"></div><span class="tag">${b.typeName}</span><h2>${b.name}</h2><p class="modal-game">${b.game}</p><hr><p><b>取得條件</b><br>${b.condition}</p><p><b>截止時間</b><br>${dateText(b.deadline)}</p><p>${b.desc}</p>`;
 $("#modal").hidden=false;
}
$("#close").onclick=()=>$("#modal").hidden=true;
$(".modal-bg").onclick=()=>$("#modal").hidden=true;
$("#search").oninput=e=>{query=e.target.value;render()};
$("#sort").onchange=e=>{sort=e.target.value;render()};
document.querySelectorAll("#filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render()});
$("#obsBtn").onclick=()=>document.body.classList.toggle("obs");
$("#totalCount").textContent=badges.length;
$("#activeCount").textContent=badges.filter(b=>daysLeft(b.deadline)>=0).length;
$("#soonCount").textContent=badges.filter(soon).length;
$("#freeCount").textContent=badges.filter(b=>b.type==="watch").length;
render();
setInterval(render,60000);