"use client";

import { DateContext } from "@/context/DateContext";
import { useContext, useEffect, useState } from "react";

export default function CountsComponent() {
  /*
      Get monthly and total counts
  */
  const { currentMonth } = useContext(DateContext);
  const [counts, setCounts] = useState({});
  const [totalCounts, setTotalCounts] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Total: 0,
  });
  const [monthCounts, setMonthCounts] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Total: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/leet-recorder/get-nums");
        const result = await response.json();

        setCounts((prevCounts) => ({
          ...prevCounts,
          ...result.reduce((acc, item) => {
            const key = item.id;
            acc[key] = {
              Easy: item.Easy || 0,
              Medium: item.Medium || 0,
              Hard: item.Hard || 0,
              Total: item.Total || 0,
            };
            return acc;
          }, {}),
        }));

        // Calculate totals for all months
        const totalAllMonths = Object.values(result).reduce(
          (acc, curr) => ({
            Easy: acc.Easy + curr.Easy,
            Medium: acc.Medium + curr.Medium,
            Hard: acc.Hard + curr.Hard,
            Total: acc.Total + curr.Total,
          }),
          { Easy: 0, Medium: 0, Hard: 0, Total: 0 }
        );
        setTotalCounts(totalAllMonths);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const formattedMonth = currentMonth.toISOString().slice(0, 7); // Format to "yyyy-mm"
    const monthData = counts[formattedMonth];

    if (monthData) {
      setMonthCounts(monthData);
    } else {
      setMonthCounts({ Easy: 0, Medium: 0, Hard: 0, Total: 0 });
    }
  }, [currentMonth, counts]);

  return (
    <div className="flex flex-row gap-8 pb-12 text-xl">
      <h2 className="flex flex-col">
        <span>Total</span>
        <span>Solved: {totalCounts.Total}</span>
        <span style={{ color: "#28a745" }}>Easy: {totalCounts.Easy}</span>
        <span style={{ color: "#f0ad4e" }}>Medium: {totalCounts.Medium}</span>
        <span style={{ color: "#dc3545" }}>Hard: {totalCounts.Hard}</span>
      </h2>
      <h2 className="flex flex-col">
        <span>{currentMonth.toISOString().slice(0, 7)}</span>
        <span>Solved: {monthCounts.Total} </span>
        <span style={{ color: "#28a745" }}>Easy: {monthCounts.Easy} </span>
        <span style={{ color: "#f0ad4e" }}>Medium: {monthCounts.Medium} </span>
        <span style={{ color: "#dc3545" }}>Hard: {monthCounts.Hard} </span>
      </h2>
    </div>
  );
}
