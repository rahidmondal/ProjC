import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proj.C",
  description: "Connect, Collaborate, and Code Together!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="theme">
          <UserProvider>
            <Navbar />
            <main className="min-h-screen  pt-0">
              {" "}
              {children}
            </main>
            <Footer />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
