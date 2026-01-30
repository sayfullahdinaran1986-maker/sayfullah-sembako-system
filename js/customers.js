import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const list=document.getElementById("list");

onSnapshot(collection(db,"customers"),s=>{
  list.innerHTML="";
  s.forEach(d=>{
    const c=d.data();
    list.innerHTML+=`<div>${c.name} - ${c.wa} 
    <a href="invoice.html?id=${d.id}">Buka</a></div>`;
  });
});

window.addCustomer=async()=>{
  const name=document.getElementById("name").value;
  const wa=document.getElementById("wa").value;
  if(!name||!wa) return alert("Lengkapi data");
  await addDoc(collection(db,"customers"),{name,wa});
};
