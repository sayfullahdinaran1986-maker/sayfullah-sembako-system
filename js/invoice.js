import { db } from "./firebase.js";
import { doc, getDoc, collection, addDoc, deleteDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const id = new URLSearchParams(location.search).get("id");
const ref = doc(db,"customers",id);

const snap = await getDoc(ref);
custName.innerText = snap.data().name;
custWa.innerText = snap.data().wa;

let total = 0;
let paid = 0;

onSnapshot(collection(ref,"purchases"), s=>{
  items.innerHTML="";
  total=0;
  let i=1;
  s.forEach(d=>{
    const x=d.data();
    total += x.total;
    items.innerHTML+=`
    <tr>
      <td>${i++}</td>
      <td>${x.date.toDate().toLocaleDateString()}</td>
      <td>${x.item}</td>
      <td>${x.qty}</td>
      <td>Rp ${x.price.toLocaleString()}</td>
      <td>Rp ${x.total.toLocaleString()}</td>
      <td class="no-print">
        <button onclick="editItem('${d.id}',${x.qty},${x.price},'${x.item}')">✏️</button>
        <button onclick="deleteItem('${d.id}')">🗑</button>
      </td>
    </tr>`;
  });
  render();
});

onSnapshot(collection(ref,"payments"), s=>{
  payments.innerHTML="";
  paid=0;
  s.forEach(d=>{
    const x=d.data();
    paid+=x.amount;
    payments.innerHTML+=`${x.date.toDate().toLocaleDateString()} - Rp ${x.amount.toLocaleString()}<br>`;
  });
  render();
});

function render(){
  summary.innerText = `Total: Rp ${total.toLocaleString()} | Sisa: Rp ${(total-paid).toLocaleString()}`;
}

window.addItem=async()=>{
  const item=prompt("Item");
  const qty=+prompt("Qty");
  const price=+prompt("Harga");
  await addDoc(collection(ref,"purchases"),{
    item,qty,price,total:qty*price,date:new Date()
  });
}

window.addPayment=async()=>{
  const amt=+prompt("Bayar");
  await addDoc(collection(ref,"payments"),{
    amount:amt,date:new Date()
  });
}

window.deleteItem=async(id2)=>{
  if(confirm("Hapus?")) await deleteDoc(doc(ref,"purchases",id2));
}

window.editItem=async(id2,qty,price,item)=>{
  const nItem=prompt("Item",item);
  const nQty=+prompt("Qty",qty);
  const nPrice=+prompt("Harga",price);
  await updateDoc(doc(ref,"purchases",id2),{
    item:nItem,qty:nQty,price:nPrice,total:nQty*nPrice
  });
}

window.sendWhatsApp=async()=>{
  const canvas = await html2canvas(document.getElementById("invoiceArea"));
  const img = canvas.toDataURL("image/png");
  const wa = custWa.innerText.replace(/^0/,"62");
  const link = `https://wa.me/${wa}?text=Invoice%20Anda%0A${location.href}`;
  window.open(link,"_blank");
}
