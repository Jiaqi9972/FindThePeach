"use client";

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
import { useEffect } from "react";
import { format } from "date-fns";
import Papa from "papaparse";
import { useToast } from "@/components/ui/use-toast";

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

export default function RecordForm() {
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

  return (
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
              Fill out the form below to add a new LeetCode problem record.
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
                      <Input placeholder="Easy, Medium, or Hard" {...field} />
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
                      <Input placeholder="Enter translated title" {...field} />
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
  );
}
