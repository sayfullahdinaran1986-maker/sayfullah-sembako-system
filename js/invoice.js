import { db } from "./firebase.js";
import { doc, getDoc, collection, addDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const id = new URLSearchParams(location.search).get("id");
const ref = doc(db,"customers",id);

const custName = document.getElementById("custName");
const custWa = document.getElementById("custWa");
const items = document.getElementById("items");
const payments = document.getElementById("payments");
const summary = document.getElementById("summary");

const snap = await getDoc(ref);
custName.innerText = snap.data().name;
custWa.innerText = snap.data().wa;

let total = 0;
let paid = 0;

onSnapshot(collection(ref,"purchases"),s=>{
  items.innerHTML="";
  total=0;
  let i=1;
  s.forEach(d=>{
    const x=d.data();
    total+=x.total;
    const date = x.date?.toDate().toLocaleDateString() || "-";
    items.innerHTML+=`
    <tr>
      <td>${i++}</td>
      <td>${date}</td>
      <td>${x.item}</td>
      <td>${x.qty}</td>
      <td>${x.price.toLocaleString()}</td>
      <td>${x.total.toLocaleString()}</td>
      <td class="no-print">
        <button class="danger" onclick="delItem('${d.id}')">X</button>
      </td>
    </tr>`;
  });
  render();
});

onSnapshot(collection(ref,"payments"),s=>{
  payments.innerHTML="";
  paid=0;
  s.forEach(d=>{
    const x=d.data();
    paid+=x.amount;
    const date=x.date.toDate().toLocaleDateString();
    payments.innerHTML+=`
      <div class="payment-row">
        ${date} - Rp ${x.amount.toLocaleString()}
        <button class="danger" onclick="delPay('${d.id}')">X</button>
      </div>`;
  });
  render();
});

function render(){
  summary.innerText = `Total: Rp ${total.toLocaleString()} | Sisa: Rp ${(total-paid).toLocaleString()}`;
}

window.addItem = async()=>{
  const item=prompt("Item");
  const qty=Number(prompt("Qty"));
  const price=Number(prompt("Harga"));
  await addDoc(collection(ref,"purchases"),{
    item,qty,price,total:qty*price,date:new Date()
  });
}

window.addPayment = async()=>{
  const amt=Number(prompt("Bayar"));
  await addDoc(collection(ref,"payments"),{
    amount:amt,date:new Date()
  });
}

window.delItem = async(id2)=>{
  await deleteDoc(doc(ref,"purchases",id2));
}

window.delPay = async(id2)=>{
  await deleteDoc(doc(ref,"payments",id2));
}

window.sendWA = async()=>{
  const blob = await html2canvas(document.getElementById("invoice")).then(c=>c.toBlob());
  const file = new File([blob],"invoice.png",{type:"image/png"});
  const wa = snap.data().wa.replace(/^0/,"62");
  const url = URL.createObjectURL(file);
  window.open(`https://wa.me/${wa}?text=Invoice%20Anda:%20${location.href}`);
}
