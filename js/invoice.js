import { db } from "./firebase.js";
import { doc,getDoc,collection,addDoc,onSnapshot,updateDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ADMIN_PIN="4321";
const checkPIN=()=>prompt("PIN Admin")===ADMIN_PIN;

const rupiah=n=>"Rp "+n.toLocaleString("id-ID");
const id=new URLSearchParams(location.search).get("id");
const ref=doc(db,"customers",id);
const snap=await getDoc(ref);
cust.innerHTML=`<b>${snap.data().name}</b><br>${snap.data().wa}`;

let total=0,paid=0;

onSnapshot(collection(ref,"purchases"),s=>{
 items.innerHTML="";total=0;let i=1;
 s.forEach(d=>{
  const x=d.data();total+=x.total;
  items.innerHTML+=`
   <tr>
    <td>${i++}</td><td>${x.date?.toDate().toLocaleDateString()}</td><td>${x.item}</td><td>${x.qty}</td>
    <td>${rupiah(x.price)}</td><td>${rupiah(x.total)}</td>
    <td class="aksi">
      <button onclick="editItem('${d.id}','${x.item}',${x.qty},${x.price})">✏️</button>
      <button onclick="deleteItem('${d.id}')">🗑</button>
    </td>
   </tr>`;
 });
 summary.innerText="Total: "+rupiah(total)+" | Sisa: "+rupiah(total-paid);
});

onSnapshot(collection(ref,"payments"),s=>{
 payments.innerHTML="";paid=0;
 s.forEach(d=>{
  const x=d.data();paid+=x.amount;
  payments.innerHTML+=`
   <div class="payrow">
    <span>${x.date.toDate().toLocaleDateString()} - ${rupiah(x.amount)}</span>
    <span>
      <button onclick="editPayment('${d.id}',${x.amount})">✏️</button>
      <button onclick="deletePayment('${d.id}')">🗑</button>
    </span>
   </div>`;
 });
 summary.innerText="Total: "+rupiah(total)+" | Sisa: "+rupiah(total-paid);
});

window.addItem=async()=>{
 const item=prompt("Item"),qty=+prompt("Qty"),price=+prompt("Harga");
 await addDoc(collection(ref,"purchases"),{item,qty,price,total:qty*price,date:new Date()});
};

window.addPayment=async()=>{
 const amt=+prompt("Bayar");
 await addDoc(collection(ref,"payments"),{amount:amt,date:new Date()});
};

window.editItem=async(pid,item,qty,price)=>{
 if(!checkPIN())return;
 const ni=prompt("Item",item),nq=prompt("Qty",qty),np=prompt("Harga",price);
 await updateDoc(doc(db,"customers",id,"purchases",pid),{item:ni,qty:+nq,price:+np,total:nq*np});
};

window.deleteItem=async(pid)=>{
 if(!checkPIN())return;
 if(confirm("Hapus item?")) await deleteDoc(doc(db,"customers",id,"purchases",pid));
};

window.editPayment=async(pid,amt)=>{
 if(!checkPIN())return;
 const na=prompt("Bayar",amt);
 await updateDoc(doc(db,"customers",id,"payments",pid),{amount:+na});
};

window.deletePayment=async(pid)=>{
 if(!checkPIN())return;
 if(confirm("Hapus pembayaran?")) await deleteDoc(doc(db,"customers",id,"payments",pid));
};

window.sendWA = async ()=>{
  const canvas = await html2canvas(document.getElementById("invoice"),{scale:2});
  const img = canvas.toDataURL("image/png");
  const link=document.createElement("a");
  link.href=img;
  link.download="invoice.png";
  link.click();
  const wa=snap.data().wa.replace(/^0/,"62");
  setTimeout(()=>window.open(`https://wa.me/${wa}?text=Invoice%20Sayfullah`),800);
};
