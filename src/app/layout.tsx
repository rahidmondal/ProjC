"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import "./globals.css";
import Navbar from "./components/Navbar"; // ✅ Navbar remains in layout

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar /> {/* ✅ Moved out of conditional logic to avoid mismatches */}
        <main className="min-h-screen pt-16"> {/* ✅ Adjusted padding to avoid overlap */}
          {children}
        </main>
      </body>
    </html>
  );
}
