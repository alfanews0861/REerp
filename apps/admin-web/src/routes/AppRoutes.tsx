import { FC, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import {
  useThemeMode,
  PrivateRoute,
  GuestRoute,
  PublicRoute,
} from '@real-estate-erp/ui';
import { AppShell } from '../layouts/AppShell';

// Lazy loading placeholder for all modules
const Placeholder = lazy(() => import('../pages/PlaceholderPage'));
const ExecutiveDashboard = lazy(() => import('../pages/dashboard/ExecutiveDashboard'));
const LeadsWorkspace = lazy(() => import('../pages/crm/leads/LeadsWorkspace'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

const PublicHome: FC = () => {
  const { mode, setMode } = useThemeMode();
  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'corporate' : 'light');
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" color="primary.main" gutterBottom fontWeight={600}>
          Enterprise Login
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Please sign in to access the Admin Shell.
        </Typography>
        <Button variant="contained" color="primary" onClick={toggleTheme}>
          Toggle Theme ({mode})
        </Button>
      </Paper>
    </Box>
  );
};

export const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/public" element={<PublicHome />} />
        </Route>

        {/* Guest Only Routes (e.g. Login) */}
        <Route element={<GuestRoute redirectTo="/dashboard" />}>
          <Route path="/login" element={<PublicHome />} />
        </Route>

        {/* Private Authenticated Routes with AppShell */}
        <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ExecutiveDashboard />} />
            
            {/* CRM */}
            <Route path="/crm/leads" element={<LeadsWorkspace />} />
            <Route path="/crm/customers" element={<Placeholder />} />
            
            {/* Projects & Plots */}
            <Route path="/projects" element={<Placeholder />} />
            <Route path="/plots" element={<Placeholder />} />
            
            {/* Marketing */}
            <Route path="/marketing/campaigns" element={<Placeholder />} />
            <Route path="/marketing/site-visits" element={<Placeholder />} />
            
            {/* Sales & Finance */}
            <Route path="/bookings" element={<Placeholder />} />
            <Route path="/payments" element={<Placeholder />} />
            <Route path="/expenses" element={<Placeholder />} />
            
            {/* HR & Ops */}
            <Route path="/employees/attendance" element={<Placeholder />} />
            <Route path="/vehicles" element={<Placeholder />} />
            
            {/* Reports & Settings */}
            <Route path="/reports" element={<Placeholder />} />
            <Route path="/analytics" element={<Placeholder />} />
            <Route path="/settings" element={<Placeholder />} />
            <Route path="/administration" element={<Placeholder />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
