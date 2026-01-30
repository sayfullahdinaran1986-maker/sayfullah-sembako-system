import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ADMIN_PIN="4321";
const checkPIN=()=>prompt("PIN Admin")===ADMIN_PIN;

const nameInput=document.getElementById("name");
const waInput=document.getElementById("wa");
const list=document.getElementById("list");

window.addCustomer=async()=>{
 if(!nameInput.value||!waInput.value)return alert("Lengkapi data");
 await addDoc(collection(db,"customers"),{name:nameInput.value,wa:waInput.value,created:new Date()});
 nameInput.value="";waInput.value="";
};

onSnapshot(collection(db,"customers"),snap=>{
 list.innerHTML="";
 snap.forEach(d=>{
  const c=d.data();
  list.innerHTML+=`
   <div class="card">
    <div onclick="location.href='invoice.html?id=${d.id}'">
      <b>${c.name}</b><br><small>${c.wa}</small>
    </div>
    <div class="aksi">
      <button onclick="editCustomer('${d.id}','${c.name}','${c.wa}')">✏️</button>
      <button onclick="deleteCustomer('${d.id}')">🗑</button>
    </div>
   </div>`;
 });
});

window.editCustomer=async(id,name,wa)=>{
 if(!checkPIN())return;
 const n=prompt("Nama",name);
 const w=prompt("WhatsApp",wa);
 if(!n||!w)return;
 await updateDoc(doc(db,"customers",id),{name:n,wa:w});
};

window.deleteCustomer=async(id)=>{
 if(!checkPIN())return;
 if(confirm("Hapus pelanggan?")) await deleteDoc(doc(db,"customers",id));
};
