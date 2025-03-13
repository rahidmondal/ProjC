"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import "./globals.css";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);

  // ✅ Ensure component is only rendered after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300">
        {mounted ? (
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        ) : null}
      </body>
    </html>
  );
}
