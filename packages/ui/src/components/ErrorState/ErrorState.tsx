import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message = 'An error occurred.', onRetry }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="error" gutterBottom>Error</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{message}</Typography>
      {onRetry && <Button variant="outlined" color="primary" onClick={onRetry}>Retry</Button>}
    </Box>
  );
};
