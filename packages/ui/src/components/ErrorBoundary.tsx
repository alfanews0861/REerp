import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in UI component:', error, errorInfo);

    // Auto-recover from stale dynamic chunk imports caused by new deployments
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('dynamically imported module') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem('last_chunk_reload_time') || 0);
      const now = Date.now();
      // Only auto-reload if we haven't reloaded in the last 15 seconds to prevent infinite reload loops
      if (now - lastReload > 15000) {
        sessionStorage.setItem('last_chunk_reload_time', String(now));
        window.location.reload();
      }
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    sessionStorage.removeItem('last_chunk_reload_time');
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('Importing a module script failed') ||
        this.state.error?.message?.includes('dynamically imported module');

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
          bgcolor="background.default"
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" color="primary.main" gutterBottom fontWeight={700}>
              {isChunkError ? 'Updating Application View' : 'Application Exception'}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {isChunkError
                ? 'A new version of this page is being loaded from the server. Please click below to refresh.'
                : 'An unexpected error has occurred in the application view. Please reload or contact system support.'}
            </Typography>
            {this.state.error && !isChunkError && (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                  mb: 3,
                }}
              >
                {this.state.error.message}
              </Box>
            )}
            <Button variant="contained" color="primary" onClick={this.handleReset} sx={{ fontWeight: 700, px: 3, py: 1 }}>
              {isChunkError ? 'Refresh & Load Latest View' : 'Reload Application'}
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
