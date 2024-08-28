import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return new Response("Missing problemId", { status: 400 });
    }

    const docRef = doc(db, "problems", problemId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return new Response(
        JSON.stringify({ id: problemId, ...docSnap.data() }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response("Problem not found", { status: 404 });
    }
  } catch (error) {
    return new Response("Error fetching problem data", { status: 500 });
  }
}
