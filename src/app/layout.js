import { Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { PostsProvider } from "@/context/PostsContext";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata = {
  title: "Find the peach",
  description: "Personal Blog",
  icons: {
    icon: "/favicon.ico",
  },
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
            <div className="relative">
              <Header />
              {children}
              <Footer />
              <Toaster />
            </div>
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
