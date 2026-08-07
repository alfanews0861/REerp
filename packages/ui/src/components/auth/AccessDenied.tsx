import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export interface AccessDeniedProps {
  title?: string;
  message?: string;
  onGoBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = '403 - Access Denied',
  message = 'You do not have the required permissions to access this page or resource.',
  onGoBack,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center', borderRadius: 2 }}>
        <Box mb={2}>
          <LockOutlinedIcon color="error" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h5" color="error" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        {onGoBack && (
          <Button variant="contained" color="primary" onClick={onGoBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        )}
      </Paper>
    </Box>
  );
};
