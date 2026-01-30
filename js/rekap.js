import { db } from "./firebase.js";
import { collection,getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const table=document.getElementById("rekap");
const customers=await getDocs(collection(db,"customers"));
for(const c of customers.docs){
 let total=0,paid=0;
 const p=await getDocs(collection(db,"customers",c.id,"purchases"));
 p.forEach(x=>total+=x.data().total);
 const pay=await getDocs(collection(db,"customers",c.id,"payments"));
 pay.forEach(x=>paid+=x.data().amount);
 table.innerHTML+=`<tr><td>${c.data().name}</td><td>${total}</td><td>${paid}</td><td>${total-paid}</td></tr>`;
}
