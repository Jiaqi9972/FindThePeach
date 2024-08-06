// pages/api/getData.js
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    console.log("hello");
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
