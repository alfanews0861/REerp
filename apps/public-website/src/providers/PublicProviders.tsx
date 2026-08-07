import { FC, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppThemeProvider, ErrorBoundary } from '@real-estate-erp/ui';

export interface PublicProvidersProps {
  children: ReactNode;
}

export const PublicProviders: FC<PublicProvidersProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider defaultMode="system">{children}</AppThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
