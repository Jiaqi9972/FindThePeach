"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { eachDayOfInterval, format } from "date-fns";
import Papa from "papaparse";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Footer from "@/components/Footer";
import { auth } from "@/config/firebase";
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
import RecordForm from "@/components/leet-recorder/RecordForm";

const recordFormSchema = z.object({
  problemId: z.string().min(0, { message: "Problem ID is required" }),
  cnLink: z.string().url("Invalid CN Link URL").optional(),
  enLink: z.string().url("Invalid EN Link URL").optional(),
  title: z.string().min(0, { message: "Title is required" }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], "Invalid difficulty level"),
  translatedTitle: z.string().optional(),
  date: z.string().min(0, { message: "Date is required" }),
  remarks: z.string().optional(),
});

const fileFormSchema = z.object({
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Please upload a valid CSV file.",
    }),
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LeetRecorderPage() {
  const user = auth.currentUser;
  const { toast } = useToast();

  /*
      Record Form
      type the cnlink or enlink and get the details automatically
  */
  const recordForm = useForm({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      problemId: "",
      cnLink: "",
      enLink: "",
      title: "",
      difficulty: "Easy",
      translatedTitle: "",
      date: format(new Date(), "yyyy-MM-dd"),
      remarks: "",
    },
  });

  /*
      Function to get leetcode problem details and update the form
   */
  const cnLink = recordForm.watch("cnLink");
  const enLink = recordForm.watch("enLink");

  useEffect(() => {
    const fetchLeetcodeData = async (link) => {
      if (!link) return;

      try {
        const response = await fetch(
          `/api/leet-recorder/get-leetcode-data?link=${link}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.question) {
            const {
              questionFrontendId,
              title,
              titleSlug,
              translatedTitle,
              difficulty,
            } = data.question;

            recordForm.setValue("problemId", questionFrontendId);
            recordForm.setValue("title", title);
            recordForm.setValue("translatedTitle", translatedTitle);
            recordForm.setValue("difficulty", difficulty);
            recordForm.setValue(
              "cnLink",
              link.includes("leetcode.cn")
                ? link
                : `https://leetcode.cn/problems/${titleSlug}/`
            );
            recordForm.setValue(
              "enLink",
              link.includes("leetcode.com")
                ? link
                : `https://leetcode.com/problems/${titleSlug}/`
            );
          }
        } else {
          console.error("Failed to fetch problem data");
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
      }
    };

    if (cnLink) fetchLeetcodeData(cnLink);
    else if (enLink) fetchLeetcodeData(enLink);
  }, [cnLink, enLink, recordForm]);

  /*
      Upload records csv file
  */
  const fileForm = useForm({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      file: null,
    },
  });

  /*
      Add single record
  */
  const onSubmitRecord = async (data) => {
    try {
      const response = await fetch("/api/leet-recorder/add-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data successfully saved:", result);
        toast({
          description: "Record successfully saved",
        });
        recordForm.reset();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          description: `Error saving data: ${error.error}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Error saving data: ${error.error}`,
      });
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

  /*
      Add multiple records with csv file
  */
  const onSubmitFile = async (data) => {
    const file = data.file[0];

    if (!file) {
      toast({
        variant: "destructive",
        description: "No file selected",
      });
      return;
    }

    let totalRecords = 0;
    let successCount = 0;
    let failureCount = 0;

    // process file with papa
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const records = results.data;
        totalRecords = records.length;

        // send api
        for (const record of records) {
          const {
            problem_id: problemId,
            cn_link: cnLink,
            en_link: enLink,
            title,
            translated_title: translatedTitle,
            difficulty,
            date,
            remarks,
          } = record;

          const payload = {
            problemId,
            cnLink,
            enLink,
            title,
            translatedTitle,
            difficulty,
            date,
            remarks,
          };

          try {
            const response = await fetch("/api/leet-recorder/add-record", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              successCount++;
            } else {
              failureCount++;
              console.error(`Failed to upload record for ${title}.`);
            }
          } catch (error) {
            failureCount++;
            console.error(`Error uploading record for ${title}:`, error);
          }
        }

        // show the result
        toast({
          description: `Total Records: ${totalRecords}, Success: ${successCount}, Failure: ${failureCount}`,
        });

        fileForm.reset();
      },
      error: (error) => {
        toast({
          variant: "destructive",
          description: `Error parsing CSV: ${error.error}`,
        });
      },
    });
  };

  /*
      Handle chart
  */
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [currentDay, setCurrentDay] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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

  /*
      Get records for current date
  */
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

  /*
      Get monthly and total counts
  */
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
    <div>
      <Header />
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-4">
        {/* {user && (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="fixed bottom-16 left-4">
                  Upload CSV Record
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="pb-2">Upload CSV</SheetTitle>
                  <SheetDescription className="pb-2">
                    Select a CSV file to upload and process the LeetCode problem
                    records.
                  </SheetDescription>
                </SheetHeader>
                <Form {...fileForm}>
                  <form
                    onSubmit={fileForm.handleSubmit(onSubmitFile)}
                    className="space-y-4"
                  >
                    <FormField
                      control={fileForm.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload CSV File</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".csv"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SheetClose asChild>
                      <Button type="submit">Upload and Process File</Button>
                    </SheetClose>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="fixed bottom-4 left-4">
                  Add record
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="pb-2">
                  <SheetTitle>Add Record</SheetTitle>
                  <SheetDescription>
                    Fill out the form below to add a new LeetCode problem
                    record.
                  </SheetDescription>
                </SheetHeader>

                <Form {...recordForm}>
                  <form
                    onSubmit={recordForm.handleSubmit(onSubmitRecord)}
                    className="space-y-4"
                  >
                    <FormField
                      control={recordForm.control}
                      name="problemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter problem ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="cnLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CN Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://leetcode.cn/problems/some-problem"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="enLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EN Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://leetcode.com/problems/some-problem"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Easy, Medium, or Hard"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="translatedTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Translated Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter translated title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="remarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remarks</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter remarks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SheetClose asChild>
                      <Button type="submit">Submit</Button>
                    </SheetClose>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </>
        )} */}

        {user && <RecordForm />}

        <div className="flex flex-row gap-8 pb-12 text-xl">
          <h2 className="flex flex-col">
            <span>Total</span>
            <span>Solved: {totalCounts.Total}</span>
            <span style={{ color: "#28a745" }}>Easy: {totalCounts.Easy}</span>
            <span style={{ color: "#f0ad4e" }}>
              Medium: {totalCounts.Medium}
            </span>
            <span style={{ color: "#dc3545" }}>Hard: {totalCounts.Hard}</span>
          </h2>
          <h2 className="flex flex-col">
            <span>{currentMonth.toISOString().slice(0, 7)}</span>
            <span>Solved: {monthCounts.Total} </span>
            <span style={{ color: "#28a745" }}>Easy: {monthCounts.Easy} </span>
            <span style={{ color: "#f0ad4e" }}>
              Medium: {monthCounts.Medium}{" "}
            </span>
            <span style={{ color: "#dc3545" }}>Hard: {monthCounts.Hard} </span>
          </h2>
        </div>

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
      </main>
      <Footer />
    </div>
  );
}

export default LeetRecorderPage;
