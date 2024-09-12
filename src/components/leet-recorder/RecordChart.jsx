"use client";

import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { eachDayOfInterval, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { DateContext } from "@/context/DateContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RecordChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { currentMonth, setCurrentMonth, setCurrentDay, setRecords } =
    useContext(DateContext);
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  useEffect(() => {
    const fetchRecordsByMonth = async (month) => {
      const year = month.getFullYear();
      const monthFormatted = String(month.getMonth() + 1).padStart(2, "0");

      const res = await fetch(
        `/api/leet-recorder/get-records-by-month?year=${year}&month=${monthFormatted}`
      );

      if (res.ok) {
        const data = await res.json();
        setRecords(data);

        const monthDates = generateMonthDates(month);
        const chartData = transformRecordsToChartData(data, monthDates);
        setChartData(chartData);
      } else {
        console.error("Failed to fetch records");
      }
    };

    fetchRecordsByMonth(currentMonth);
  }, [currentMonth]);

  const generateMonthDates = (month) => {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysArray = eachDayOfInterval({
      start: startOfMonth,
      end: endOfMonth,
    });
    return daysArray.map((day) => format(day, "yyyy-MM-dd"));
  };

  const transformRecordsToChartData = (records, monthDates) => {
    const labels = monthDates;
    const data = monthDates.map((date) => {
      const record = records.find((r) => r.date === date);
      return record ? record.records.length : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Nums",
          data: data,
          backgroundColor: "#9caec9",
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Records for ${format(currentMonth, "MMMM yyyy")}`,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const handleBarClick = (elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedDate = chartData.labels[index];
      setCurrentDay(selectedDate);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between w-full max-w-4xl">
      <Button
        variant="outline"
        onClick={handlePrevMonth}
        className="p-2"
        size="icon"
      >
        <ChevronLeft />
      </Button>
      <div className="flex-1 mx-2 min-w-[200px] max-w-[900px] min-h-[400px] max-h-[500px]">
        <Bar
          options={{
            ...options,
            onClick: (evt, elements) => handleBarClick(elements),
            maintainAspectRatio: false,
          }}
          data={chartData}
        />
      </div>
      <Button
        variant="outline"
        onClick={handleNextMonth}
        className="p-2"
        size="icon"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
