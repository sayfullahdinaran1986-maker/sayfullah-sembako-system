import { db } from "./firebase.js";
import { doc,getDoc,collection,addDoc,onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const id=new URLSearchParams(location.search).get("id");
const ref=doc(db,"customers",id);
const snap=await getDoc(ref);
custName.innerText=snap.data().name;
custWa.innerText=snap.data().wa;

let total=0,paid=0;

onSnapshot(collection(ref,"purchases"),s=>{
 items.innerHTML=""; total=0;
 let i=1;
 s.forEach(d=>{
  const x=d.data();
  total+=x.total;
  items.innerHTML+=`<tr>
   <td>${i++}</td><td>${x.date}</td><td>${x.item}</td>
   <td>${x.qty}</td><td>${x.price}</td><td>${x.total}</td>
   <td><button onclick="del('${d.id}')">X</button></td>
  </tr>`;
 });
 render();
});

onSnapshot(collection(ref,"payments"),s=>{
 payments.innerHTML=""; paid=0;
 s.forEach(d=>{
  const x=d.data();
  paid+=x.amount;
  payments.innerHTML+=`${x.date} - ${x.amount}<br>`;
 });
 render();
});

function render(){
 summary.innerText=`Total ${total} | Sisa ${total-paid}`;
}

window.addItem=async()=>{
 const item=prompt("Item"),qty=+prompt("Qty"),price=+prompt("Harga");
 await addDoc(collection(ref,"purchases"),{
  item,qty,price,total:qty*price,date:new Date().toLocaleDateString()
 });
}

window.addPayment=async()=>{
 const amt=+prompt("Bayar");
 await addDoc(collection(ref,"payments"),{
  amount:amt,date:new Date().toLocaleDateString()
 });
}

window.sendWA=()=>{
 const wa=custWa.innerText.replace(/^0/,"62");
 window.open(`https://wa.me/${wa}?text=Invoice%20Sayfullah`,"_blank");
}
