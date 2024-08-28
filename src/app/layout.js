import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { PostsProvider } from "@/context/PostsContext";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/provider/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Find the peach",
  description: "Personal Blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <PostsProvider>
              {children}
              <Toaster />
            </PostsProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
