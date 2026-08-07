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
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
            <Typography variant="h5" color="error.main" gutterBottom fontWeight={600}>
              Application Exception
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              An unexpected error has occurred in the application view. Please reload or contact system support.
            </Typography>
            {this.state.error && (
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
            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Reload Application
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
