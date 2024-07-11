import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getStorage, ref, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js"; // Đồng bộ phiên bản

const firebaseConfig = {
  apiKey: "AIzaSyACJOLAWT9rC1JPvJ1ul6V03TF60Pbfn2g",
  authDomain: "shoppy-9727b.firebaseapp.com",
  projectId: "shoppy-9727b",
  storageBucket: "shoppy-9727b.appspot.com",
  messagingSenderId: "63605122259",
  appId: "1:63605122259:web:ea1e1bbd34424036d3e026",
  measurementId: "G-QK10XB07G0"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
