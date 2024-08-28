import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    // Get all documents from the 'counts' collection
    const countsCollectionRef = collection(db, "counts");
    const countsSnapshot = await getDocs(countsCollectionRef);

    // Map through the documents and construct the response data
    const counts = countsSnapshot.docs.map((doc) => ({
      id: doc.id, // This is the document name, which would be the 'yyyy-mm'
      ...doc.data(), // This spreads the fields like Easy, Medium, Hard, total
    }));

    return new Response(JSON.stringify(counts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch counts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
