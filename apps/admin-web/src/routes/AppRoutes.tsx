import { FC, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import {
  PrivateRoute,
  GuestRoute,
  PublicRoute,
  RoleRoute,
} from '@real-estate-erp/ui';
import { AppShell } from '../layouts/AppShell';

// Lazy loading for all modules
const ExecutiveDashboard = lazy(() => import('../pages/dashboard/ExecutiveDashboard'));
const CommandCenter = lazy(() => import('../pages/dashboard/CommandCenter'));
const LeadsWorkspace = lazy(() => import('../pages/crm/leads/LeadsWorkspace'));
const SiteVisitsWorkspace = lazy(() => import('../pages/crm/site-visits/SiteVisitsWorkspace'));
const Customer360View = lazy(() => import('../pages/crm/Customer360View'));
const ProjectsWorkspace = lazy(() => import('../pages/projects/ProjectsWorkspace'));
const PlotInventory = lazy(() => import('../pages/plots/PlotInventory'));
const PlotDetails = lazy(() => import('../pages/plots/PlotDetails'));
const CampaignList = lazy(() => import('../pages/marketing/campaigns/CampaignList'));
const CampaignDetail = lazy(() => import('../pages/marketing/campaigns/CampaignDetail'));
const NetworkWorkspace = lazy(() => import('../pages/marketing/network/NetworkWorkspace'));
const CommissionLedgerPage = lazy(() => import('../pages/marketing/commission/CommissionLedgerPage'));
const CommissionRulesPage = lazy(() => import('../pages/marketing/commission/CommissionRulesPage'));
const TelecallerWorkspace = lazy(() => import('../pages/marketing/telecaller/TelecallerWorkspace'));
const MarketingReports = lazy(() => import('../pages/reports/MarketingReports'));
const AnalyticsWorkspace = lazy(() => import('../pages/analytics/AnalyticsWorkspace'));
const BookingsWorkspace = lazy(() => import('../pages/sales/BookingsWorkspace'));
const PaymentsWorkspace = lazy(() => import('../pages/finance/PaymentsWorkspace'));
const ExpensesWorkspace = lazy(() => import('../pages/expenses/ExpensesWorkspace'));
const VehiclesWorkspace = lazy(() => import('../pages/vehicles/VehiclesWorkspace'));
const UserManagementWorkspace = lazy(() => import('../pages/administration/UserManagementWorkspace'));
const AttendanceWorkspace = lazy(() => import('../pages/employees/AttendanceWorkspace'));
const LoginScreen = lazy(() => import('../pages/auth/LoginScreen'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

export const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/public" element={<LoginScreen />} />
        </Route>

        {/* Guest Only Routes (e.g. Login) */}
        <Route element={<GuestRoute redirectTo="/dashboard" />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>

        {/* Private Authenticated Routes with AppShell */}
        <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ExecutiveDashboard />} />
            
            {/* Leadership / Command Center */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager']} unauthorizedTo="/dashboard" />}>
              <Route path="/dashboard/command-center" element={<CommandCenter />} />
            </Route>
            
            {/* CRM */}
            <Route path="/crm/leads" element={<LeadsWorkspace />} />
            <Route path="/crm/site-visits" element={<SiteVisitsWorkspace />} />
            <Route path="/crm/customers" element={<Customer360View />} />
            <Route path="/crm/customers/:id" element={<Customer360View />} />
            
            {/* Projects & Plots */}
            <Route path="/projects" element={<ProjectsWorkspace />} />
            <Route path="/plots" element={<PlotInventory />} />
            <Route path="/plots/:id" element={<PlotDetails />} />
            
            {/* Marketing */}
            <Route path="/marketing/campaigns" element={<CampaignList />} />
            <Route path="/marketing/campaigns/details" element={<CampaignDetail />} />
            <Route path="/marketing/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/marketing/site-visits" element={<SiteVisitsWorkspace />} />
            <Route path="/marketing/telecaller" element={<TelecallerWorkspace />} />
            
            {/* Marketing Network & Commissions */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager', 'marketing_manager', 'accountant']} unauthorizedTo="/dashboard" />}>
              <Route path="/marketing/network" element={<NetworkWorkspace />} />
              <Route path="/marketing/commission" element={<CommissionLedgerPage />} />
              <Route path="/marketing/commission/rules" element={<CommissionRulesPage />} />
            </Route>
            
            {/* Sales & Bookings */}
            <Route path="/bookings" element={<BookingsWorkspace />} />

            {/* Finance & Expenses */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager', 'accountant']} unauthorizedTo="/dashboard" />}>
              <Route path="/payments" element={<PaymentsWorkspace />} />
              <Route path="/expenses" element={<ExpensesWorkspace />} />
            </Route>
            
            {/* HR / Operations */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager']} unauthorizedTo="/dashboard" />}>
              <Route path="/employees/attendance" element={<AttendanceWorkspace />} />
            </Route>

            {/* Vehicles / Fleet */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager', 'driver']} unauthorizedTo="/dashboard" />}>
              <Route path="/vehicles" element={<VehiclesWorkspace />} />
            </Route>
            
            {/* Reports & Analytics */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager', 'marketing_manager', 'sales_manager', 'accountant']} unauthorizedTo="/dashboard" />}>
              <Route path="/reports" element={<MarketingReports />} />
              <Route path="/reports/marketing" element={<MarketingReports />} />
              <Route path="/analytics" element={<AnalyticsWorkspace />} />
            </Route>

            {/* System Administration & Settings (Strict: Super Admin & Director Only) */}
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director']} unauthorizedTo="/dashboard" />}>
              <Route path="/settings" element={<UserManagementWorkspace />} />
              <Route path="/settings/users" element={<UserManagementWorkspace />} />
              <Route path="/administration" element={<UserManagementWorkspace />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
