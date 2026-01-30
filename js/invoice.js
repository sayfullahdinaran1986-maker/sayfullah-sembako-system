import { db } from "./firebase.js";
import {
  doc, getDoc, collection, addDoc, deleteDoc, updateDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const id = new URLSearchParams(location.search).get("id");
const ref = doc(db, "customers", id);

const snap = await getDoc(ref);
custName.innerText = snap.data().name;
custWa.innerText = snap.data().wa;

let total = 0;
let paid = 0;

// =================== LOAD ITEMS ===================
onSnapshot(collection(ref, "purchases"), s => {
  items.innerHTML = "";
  total = 0;
  let i = 1;

  s.forEach(d => {
    const x = d.data();
    total += x.total;

    items.innerHTML += `
    <tr>
      <td>${i++}</td>
      <td>${x.date.toDate().toLocaleDateString()}</td>
      <td>${x.item}</td>
      <td>${x.qty}</td>
      <td>Rp ${x.price.toLocaleString()}</td>
      <td>Rp ${x.total.toLocaleString()}</td>
      <td class="no-print">
        <button onclick="editItem('${d.id}','${x.item}',${x.qty},${x.price})">✏️</button>
        <button onclick="deleteItem('${d.id}')">🗑️</button>
      </td>
    </tr>`;
  });
  render();
});

// =================== LOAD PAYMENTS ===================
onSnapshot(collection(ref, "payments"), s => {
  payments.innerHTML = "";
  paid = 0;

  s.forEach(d => {
    const x = d.data();
    paid += x.amount;
    payments.innerHTML += `
    ${x.date.toDate().toLocaleDateString()} - Rp ${x.amount.toLocaleString()}
    <button onclick="deletePayment('${d.id}')">🗑️</button><br>`;
  });
  render();
});

function render(){
  summary.innerText = `Total: Rp ${total.toLocaleString()} | Sisa: Rp ${(total-paid).toLocaleString()}`;
}

// =================== ACTIONS ===================
window.addItem = async () => {
  const item = prompt("Item");
  const qty = Number(prompt("Qty"));
  const price = Number(prompt("Harga"));

  if(!item||!qty||!price) return;

  await addDoc(collection(ref,"purchases"),{
    item, qty, price,
    total: qty * price,
    date: new Date()
  });
};

window.addPayment = async () => {
  const amt = Number(prompt("Bayar"));
  if(!amt) return;

  await addDoc(collection(ref,"payments"),{
    amount: amt,
    date: new Date()
  });
};

window.editItem = async (id,item,qty,price)=>{
  const ni = prompt("Item",item);
  const nq = Number(prompt("Qty",qty));
  const np = Number(prompt("Harga",price));
  if(!ni||!nq||!np) return;

  await updateDoc(doc(ref,"purchases",id),{
    item:ni, qty:nq, price:np, total:nq*np
  });
};

window.deleteItem = async id=>{
  if(confirm("Hapus item?"))
    await deleteDoc(doc(ref,"purchases",id));
};

window.deletePayment = async id=>{
  if(confirm("Hapus pembayaran?"))
    await deleteDoc(doc(ref,"payments",id));
};

// =================== WHATSAPP PNG ===================
window.sendWA = async ()=>{
  const canvas = await html2canvas(document.querySelector(".invoice"));
  const blob = await new Promise(r=>canvas.toBlob(r));
  const file = new File([blob],"invoice.png",{type:"image/png"});

  const wa = snap.data().wa.replace(/^0/,"62");
  const url = `https://wa.me/${wa}?text=Invoice%20Anda`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "invoice.png";
  a.click();

  window.open(url,"_blank");
};
