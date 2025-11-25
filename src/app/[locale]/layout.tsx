import { QueryProvider } from "@/components/providers/query-provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  console.log(`🌐 [LOCALE LAYOUT] Rendering with locale: ${locale}`);

  // Get messages for client components
  const messages = await getMessages();

  return (
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
  );
}
