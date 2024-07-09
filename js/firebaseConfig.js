import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAPlJ72abuLpKxjdM5UYobRE0WlklEL7UU",
    authDomain: "phone-app-2c9ed.firebaseapp.com",
    projectId: "phone-app-2c9ed",
    storageBucket: "phone-app-2c9ed.appspot.com",
    messagingSenderId: "1001814685919",
    appId: "1:1001814685919:web:029594cfd3a030a375116a",
    measurementId: "G-XEWW6YL539"
  };


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
