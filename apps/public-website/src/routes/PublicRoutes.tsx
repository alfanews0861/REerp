import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const PublicHome: FC = () => {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" color="primary.main" gutterBottom fontWeight={600}>
          Real Estate Public Web Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the Enterprise Real Estate Portal.
        </Typography>
      </Paper>
    </Box>
  );
};

export const PublicRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
