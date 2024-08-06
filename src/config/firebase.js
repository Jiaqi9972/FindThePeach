// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA2bTA3KHpAgalaojOsFLaVMcRy_5jV7s",
  authDomain: "findthepeach-bc3f4.firebaseapp.com",
  projectId: "findthepeach-bc3f4",
  storageBucket: "findthepeach-bc3f4.appspot.com",
  messagingSenderId: "861779778407",
  appId: "1:861779778407:web:398379a4ba894203dfadc2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
