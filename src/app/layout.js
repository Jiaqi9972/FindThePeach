import { Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { PostsProvider } from "@/context/PostsContext";
import { Toaster } from "@/components/ui/toaster";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata = {
  title: "Find the peach",
  description: "Personal Blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={firaCode.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostsProvider>
            {children}
            <Toaster />
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
