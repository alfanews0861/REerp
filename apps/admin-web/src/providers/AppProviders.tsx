import { FC, ReactNode, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, ErrorBoundary } from '@real-estate-erp/ui';
import { AuthProvider, SessionProvider, PermissionProvider } from '@real-estate-erp/firebase';
import { store } from '../store';

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultMode="light">
            <AuthProvider>
              <SessionProvider>
                <PermissionProvider>{children}</PermissionProvider>
              </SessionProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};
