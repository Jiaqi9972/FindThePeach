import { db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { startOfMonth, endOfMonth, format } from "date-fns";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return new Response(
      JSON.stringify({ error: "Year and month are required" }),
      { status: 400 }
    );
  }

  try {
    const start = format(startOfMonth(new Date(year, month - 1)), "yyyy-MM-dd");
    const end = format(endOfMonth(new Date(year, month - 1)), "yyyy-MM-dd");

    const recordsQuery = query(
      collection(db, "records"),
      where("date", ">=", start),
      where("date", "<=", end)
    );

    const querySnapshot = await getDocs(recordsQuery);

    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch records" }), {
      status: 500,
    });
  }
}
