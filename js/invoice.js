import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const id = new URLSearchParams(location.search).get("id");
const ref = doc(db, "customers", id);

// Load customer
const snap = await getDoc(ref);
custName.innerText = snap.data().name;
custWa.innerText = snap.data().wa;

let total = 0;
let paid = 0;

// ================== PURCHASES ==================
onSnapshot(collection(ref, "purchases"), (s) => {
  items.innerHTML = "";
  total = 0;
  let i = 1;

  s.forEach((d) => {
    const x = d.data();
    total += x.total;

    let date = x.date;
    if (x.date?.seconds) {
      date = new Date(x.date.seconds * 1000).toLocaleDateString();
    }

    items.innerHTML += `
      <tr>
        <td>${i++}</td>
        <td>${date}</td>
        <td>${x.item}</td>
        <td>${x.qty}</td>
        <td>${x.price.toLocaleString()}</td>
        <td>${x.total.toLocaleString()}</td>
        <td>
          <button onclick="deleteItem('${d.id}')">❌</button>
        </td>
      </tr>
    `;
  });

  render();
});

// ================== PAYMENTS ==================
onSnapshot(collection(ref, "payments"), (s) => {
  payments.innerHTML = "";
  paid = 0;

  s.forEach((d) => {
    const x = d.data();
    paid += x.amount;

    let date = x.date;
    if (x.date?.seconds) {
      date = new Date(x.date.seconds * 1000).toLocaleDateString();
    }

    payments.innerHTML += `
      ${date} - Rp ${x.amount.toLocaleString()}
      <button onclick="deletePayment('${d.id}')">❌</button><br>
    `;
  });

  render();
});

// ================== RENDER ==================
function render() {
  summary.innerText = `Total: Rp ${total.toLocaleString()} | Sisa: Rp ${(total - paid).toLocaleString()}`;
}

// ================== ADD ITEM ==================
window.addItem = async () => {
  const item = prompt("Nama Item");
  const qty = Number(prompt("Qty"));
  const price = Number(prompt("Harga"));

  if (!item || !qty || !price) return alert("Data tidak lengkap");

  await addDoc(collection(ref, "purchases"), {
    item,
    qty,
    price,
    total: qty * price,
    date: new Date()
  });
};

// ================== ADD PAYMENT ==================
window.addPayment = async () => {
  const amt = Number(prompt("Nominal bayar"));
  if (!amt) return;

  await addDoc(collection(ref, "payments"), {
    amount: amt,
    date: new Date()
  });
};

// ================== DELETE ==================
window.deleteItem = async (id) => {
  if (!confirm("Hapus item ini?")) return;
  await deleteDoc(doc(ref, "purchases", id));
};

window.deletePayment = async (id) => {
  if (!confirm("Hapus pembayaran ini?")) return;
  await deleteDoc(doc(ref, "payments", id));
};

// ================== WHATSAPP ==================
window.sendWA = () => {
  const wa = custWa.innerText.replace(/^0/, "62");
  const msg = encodeURIComponent(`Halo ${custName.innerText}, ini invoice dari Sayfullah. Total Rp ${total.toLocaleString()}, Sisa Rp ${(total-paid).toLocaleString()}`);
  window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
};
