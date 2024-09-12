"use client";

import { DateContext } from "@/context/DateContext";
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DailyRecordComponent() {
  /*
      Get records for current date
  */
  const { currentDay, records } = useContext(DateContext);
  const [problemData, setProblemData] = useState({});

  const fetchProblemData = async (problemId) => {
    try {
      const res = await fetch(
        `/api/leet-recorder/get-problem-data?problemId=${problemId}`
      );
      if (res.ok) {
        const data = await res.json();
        setProblemData((prevData) => ({
          ...prevData,
          [problemId]: data,
        }));
      } else {
        console.log("Failed to fetch problem data");
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  };

  /*
      Delete single record
  */
  const deleteRecord = async (problemId, currentDay) => {
    try {
      const response = await fetch("/api/leet-recorder/delete-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problemId, currentDay }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Record deleted:", result);
      } else {
        const error = await response.json();
        console.error("Error deleting record:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const problemIds = records
      .find((record) => record.date === currentDay)
      ?.records.map((record) => record.problemId);

    problemIds?.forEach((problemId) => {
      if (!problemData[problemId]) {
        fetchProblemData(problemId);
      }
    });
  }, [currentDay, records, problemData]);

  return (
    <>
      {records.find((record) => record.date === currentDay) && (
        <div className="pt-12">
          <Table>
            <TableCaption>Records for {currentDay}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Problem Id</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Translated Title</TableHead>
                <TableHead>Delete Record</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records
                .find((record) => record.date === currentDay)
                ?.records.map((record) => (
                  <TableRow key={record.problemId}>
                    <TableCell className="font-medium">
                      {record.problemId}
                    </TableCell>
                    <TableCell>
                      {problemData[record.problemId]?.difficulty ||
                        "Loading..."}
                    </TableCell>
                    <TableCell>
                      {problemData[record.problemId] ? (
                        <a href={problemData[record.problemId].enLink}>
                          {problemData[record.problemId].title}
                        </a>
                      ) : (
                        "Loading..."
                      )}
                    </TableCell>
                    <TableCell>
                      {problemData[record.problemId] ? (
                        <a href={problemData[record.problemId].cnLink}>
                          {problemData[record.problemId].translatedTitle}
                        </a>
                      ) : (
                        "Loading..."
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure to delete this record?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteRecord(record.problemId, currentDay)
                              }
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
