import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAppTheme } from '@real-estate-erp/ui';

const ShellLayout: FC = () => {
  const { toggleTheme, actualMode } = useAppTheme();

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" color="primary.main" gutterBottom fontWeight={600}>
          Real Estate ERP Admin Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Production Monorepo Core System Bootstrapped Successfully.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={toggleTheme}>
            Toggle Theme ({actualMode})
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ShellLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
