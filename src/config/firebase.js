// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
const app = getApps().length ? getApps() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { db, auth };
export default app;
