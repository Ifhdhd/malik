
function showLoader(){document.getElementById('loader').style.display='flex';}
function hideLoader(){document.getElementById('loader').style.display='none';}

function saveConfig(){
 localStorage.setItem('dbUrl',document.getElementById('dbUrl').value.trim());
 alert("URL disimpan.");
}
function resetConfig(){
 document.getElementById('dbUrl').value="";
 document.getElementById('dbSecret').value="";
}

function loadData(){
 let url=document.getElementById('dbUrl').value.trim();
 let secret=document.getElementById('dbSecret').value.trim();
 if(!url){alert("Isi URL");return;}
 showLoader();
 fetch(url+'.json?auth='+secret)
 .then(r=>r.json())
 .then(d=>{
   hideLoader();
   if(!d){document.getElementById('userList').innerHTML="Tidak ada data";return;}
   let out="";
   Object.keys(d).forEach(k=>{
     if(typeof d[k]==='object'){
       out+=`<div style='padding:10px;border-bottom:1px solid #333'>
         <input type='checkbox' class='ck' data-key='${k}'> ${k}
       </div>`;
     }
   });
   document.getElementById('userList').innerHTML=out;
 });
}

function getSel(){return [...document.querySelectorAll('.ck:checked')].map(e=>e.dataset.key);}
function openMultiEdit(){
 if(getSel().length===0){alert("Pilih data");return;}
 document.getElementById('multiModal').classList.add('show');
}
function closeMulti(){document.getElementById('multiModal').classList.remove('show');}

function applyMultiEdit(){
 let url=document.getElementById('dbUrl').value.trim();
 let secret=document.getElementById('dbSecret').value.trim();
 let u=document.getElementById('multi_username').value.trim();
 let p=document.getElementById('multi_password').value.trim();
 let e=document.getElementById('multi_expiry').value.trim();

 showLoader();
 getSel().forEach(k=>{
   let up={};
   if(u) up.username=u;
   if(p) up.password=p;
   if(e) up.expiry=e;
   fetch(url+'/'+k+'.json?auth='+secret,{method:"PATCH",body:JSON.stringify(up)});
 });
 hideLoader();
 closeMulti();
 loadData();
}
