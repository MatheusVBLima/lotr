import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get locale from middleware header
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  
  console.log(`🏗️ [LAYOUT] Rendering layout with locale: ${locale}`);

  // Get messages manually without validation
  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
    console.log(`📄 [LAYOUT] Messages loaded for locale: ${locale}`);
  } catch (error) {
    console.log(`⚠️ [LAYOUT] Failed to load messages for ${locale}, using empty messages`);
    messages = {};
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}