import { FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingFallbackProps {
  message?: string;
  minHeight?: string | number;
}

export const LoadingFallback: FC<LoadingFallbackProps> = ({
  message = 'Loading Enterprise System...',
  minHeight = '60vh',
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      gap={2}
      p={3}
    >
      <CircularProgress size={48} thickness={4} color="primary" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
