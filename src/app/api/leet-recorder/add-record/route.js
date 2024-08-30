export const dynamic = "force-dynamic";

import { db } from "@/config/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession(req);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.json();

    const {
      problemId,
      cnLink,
      enLink,
      title,
      translatedTitle,
      difficulty,
      date,
      remarks,
    } = formData;

    // save to the 'problems' collection
    const problemDocRef = doc(collection(db, "problems"), problemId);
    await setDoc(problemDocRef, {
      problemId,
      cnLink,
      enLink,
      title,
      translatedTitle,
      difficulty,
    });

    // save to the 'records' collection
    const recordDocRef = doc(collection(db, "records"), date); // use the data as the document name

    const recordSnapshot = await getDoc(recordDocRef);

    if (recordSnapshot.exists()) {
      // if exists, update the document
      await updateDoc(recordDocRef, {
        records: arrayUnion({
          problemId,
          remarks,
        }),
      });
    } else {
      // if not exists, create new document
      await setDoc(recordDocRef, {
        date,
        records: [
          {
            problemId,
            remarks,
          },
        ],
      });
    }

    // Update counts collection
    const month = date.slice(0, 7); // Extract the year-month from the date
    const countsDocRef = doc(collection(db, "counts"), month);
    const countsSnapshot = await getDoc(countsDocRef);

    if (countsSnapshot.exists()) {
      // Update the counts based on difficulty

      const result = await updateDoc(countsDocRef, {
        [difficulty]: increment(1),
        Total: increment(1),
      });
      console.log("Update successful:", result);
    } else {
      // Initialize the counts document
      await setDoc(countsDocRef, {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Total: 1,
        [difficulty]: 1,
      });
    }

    return new Response(
      JSON.stringify({ message: "Data successfully saved to Firestore!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
