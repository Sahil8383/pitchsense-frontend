'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { ToastProvider } from '@/contexts/ToastContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  );
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ToastProvider>
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            {children}
            <ToastContainer />
          </ToastProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
