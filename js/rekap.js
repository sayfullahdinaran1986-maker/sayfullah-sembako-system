import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const table = document.getElementById("rekap");

const customers = await getDocs(collection(db,"customers"));

for(const c of customers.docs){
  const cid = c.id;
  const name = c.data().name;

  let total = 0;
  let paid = 0;

  const purchases = await getDocs(collection(db,"customers",cid,"purchases"));
  purchases.forEach(p=> total += p.data().total );

  const payments = await getDocs(collection(db,"customers",cid,"payments"));
  payments.forEach(p=> paid += p.data().amount );

  const sisa = total - paid;

  table.innerHTML += `
    <tr onclick="location.href='invoice.html?id=${cid}'">
      <td>${name}</td>
      <td>Rp ${total.toLocaleString()}</td>
      <td>Rp ${paid.toLocaleString()}</td>
      <td><b>Rp ${sisa.toLocaleString()}</b></td>
    </tr>
  `;
}
