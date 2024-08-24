import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Find the peach",
  description: "Personal Blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
