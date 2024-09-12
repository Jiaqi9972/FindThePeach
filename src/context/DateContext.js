"use client";

import { createContext, useState } from "react";
import { format } from "date-fns";

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [records, setRecords] = useState([]);

  return (
    <DateContext.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        currentDay,
        setCurrentDay,
        records,
        setRecords,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
