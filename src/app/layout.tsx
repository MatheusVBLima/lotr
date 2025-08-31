import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/providers/theme-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Lord of the Rings Database",
  description: "Explore the world of Middle-earth with comprehensive data about books, movies, characters, and quotes from The Lord of the Rings and The Hobbit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
              {children}
                <Toaster />
              </QueryProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </ErrorBoundary>
      </body>
    </html>
  );
}
