import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyAdk--C9dnZHxElwk56qNzwUI9Pp9_ZDRE",
 authDomain: "sayfullah-sembako-system.firebaseapp.com",
 projectId: "sayfullah-sembako-system",
 storageBucket: "sayfullah-sembako-system.firebasestorage.app",
 messagingSenderId: "123138142607",
 appId: "1:123138142607:web:3f5fadd22f99f5d3731bfa"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
