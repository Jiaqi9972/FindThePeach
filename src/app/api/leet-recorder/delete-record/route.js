export const dynamic = "force-dynamic";

import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  increment,
  deleteDoc,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const { problemId, currentDay } = await req.json();

    // 1. Get the reference of the record document
    const recordDocRef = doc(collection(db, "records"), currentDay);

    // 2. Get the snapshot of the record document
    const recordSnapshot = await getDoc(recordDocRef);

    if (!recordSnapshot.exists()) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Find the record to delete
    const recordData = recordSnapshot.data();
    const recordToDelete = recordData.records.find(
      (record) => record.problemId === problemId
    );

    if (!recordToDelete) {
      return new Response(
        JSON.stringify({ error: "Problem not found in records" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 4. Fetch the difficulty from the problems collection using problemId
    const problemDocRef = doc(collection(db, "problems"), problemId);
    const problemSnapshot = await getDoc(problemDocRef);

    if (!problemSnapshot.exists()) {
      return new Response(
        JSON.stringify({ error: "Problem not found in problems collection" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { difficulty } = problemSnapshot.data(); // Extract difficulty from the problem

    if (!difficulty) {
      return new Response(
        JSON.stringify({ error: "Difficulty not found for the problem" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 5. Delete the record
    await updateDoc(recordDocRef, {
      records: arrayRemove(recordToDelete),
    });

    // If the records array is empty after deletion, delete the entire document
    const updatedRecordSnapshot = await getDoc(recordDocRef);
    if (
      updatedRecordSnapshot.exists() &&
      updatedRecordSnapshot.data().records.length === 0
    ) {
      await deleteDoc(recordDocRef);
    }

    // 6. Decrement the count from the counts collection
    const month = currentDay.slice(0, 7); // Extract year-month from the date
    const countsDocRef = doc(collection(db, "counts"), month);
    const countsSnapshot = await getDoc(countsDocRef);

    if (countsSnapshot.exists()) {
      await updateDoc(countsDocRef, {
        [difficulty]: increment(-1), // Decrease the count for the specific difficulty
        Total: increment(-1), // Decrease the total count
      });
    }

    return new Response(
      JSON.stringify({ message: "Record successfully deleted" }),
      {
        status: 200,
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
