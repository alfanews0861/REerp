import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import {
  useAppTheme,
  PrivateRoute,
  GuestRoute,
  PublicRoute,
  RoleRoute,
  PermissionRoute,
  PermissionGuard,
  RoleGuard,
} from '@real-estate-erp/ui';
import { useCurrentUser, useRole, usePermissions, useAuth } from '@real-estate-erp/hooks';

const PublicHome: FC = () => {
  const { toggleTheme, actualMode } = useAppTheme();

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" color="primary.main" gutterBottom fontWeight={600}>
          Real Estate ERP Enterprise Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Authentication & Role-Based Access Control Foundation Active.
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

const DashboardView: FC = () => {
  const { user } = useCurrentUser();
  const { role, roleLevel } = useRole();
  const { permissions } = usePermissions();
  const { signOut } = useAuth();

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, width: '100%' }}>
        <Typography variant="h4" color="primary.main" gutterBottom fontWeight={600}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome back, {user?.displayName || user?.email}!
        </Typography>

        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip label={`Role: ${role || 'N/A'}`} color="primary" />
          <Chip label={`Level: ${roleLevel}`} color="secondary" />
          <Chip label={`Tenant: ${user?.tenantId || 'Default'}`} variant="outlined" />
        </Box>

        <Typography variant="h6" gutterBottom>
          Effective Permissions ({permissions.length})
        </Typography>
        <Box display="flex" gap={0.5} flexWrap="wrap" mb={3}>
          {permissions.map((perm) => (
            <Chip key={perm} label={perm} size="small" variant="outlined" />
          ))}
        </Box>

        <RoleGuard minRole="sales_manager">
          <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 2 }}>
            <Typography variant="subtitle2" color="success.main">
              Sales Manager+ Exclusive Controls Visible
            </Typography>
          </Paper>
        </RoleGuard>

        <PermissionGuard permission="company:create">
          <Paper sx={{ p: 2, bgcolor: 'action.selected', mb: 2 }}>
            <Typography variant="subtitle2" color="primary.main">
              Company Creation Privilege Active
            </Typography>
          </Paper>
        </PermissionGuard>

        <Button variant="outlined" color="error" onClick={signOut}>
          Sign Out
        </Button>
      </Paper>
    </Box>
  );
};

export const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/public" element={<PublicHome />} />
      </Route>

      {/* Guest Only Routes (e.g. Login) */}
      <Route element={<GuestRoute redirectTo="/dashboard" />}>
        <Route path="/login" element={<PublicHome />} />
      </Route>

      {/* Private Authenticated Routes */}
      <Route element={<PrivateRoute redirectTo="/login" />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />

        {/* Role Protected Sub-Route Example */}
        <Route element={<RoleRoute allowedRoles={['super_admin', 'director']} />}>
          <Route path="/admin/settings" element={<DashboardView />} />
        </Route>

        {/* Permission Protected Sub-Route Example */}
        <Route element={<PermissionRoute permission="reports:export" />}>
          <Route path="/reports/export" element={<DashboardView />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
