import { FC, lazy, Suspense, ComponentType, LazyExoticComponent } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import {
  PrivateRoute,
  GuestRoute,
  PublicRoute,
  RoleRoute,
} from '@real-estate-erp/ui';
import { AppShell } from '../layouts/AppShell';

/**
 * Resilient lazy loader that automatically retries dynamic chunk imports
 * upon network blips or new deployment version transitions.
 */
function lazyRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2
): LazyExoticComponent<T> {
  return lazy(async () => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await factory();
      } catch (err: any) {
        if (i === retries) {
          const isChunkError =
            err?.message?.includes('Failed to fetch dynamically imported module') ||
            err?.message?.includes('Importing a module script failed') ||
            err?.message?.includes('dynamically imported module');
          if (isChunkError) {
            const lastReload = Number(sessionStorage.getItem('last_chunk_reload_time') || 0);
            if (Date.now() - lastReload > 15000) {
              sessionStorage.setItem('last_chunk_reload_time', String(Date.now()));
              window.location.reload();
            }
          }
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, 350 * (i + 1)));
      }
    }
    throw new Error('Component failed to load');
  });
}

// Resilient Lazy loading for all modules
const ExecutiveDashboard = lazyRetry(() => import('../pages/dashboard/ExecutiveDashboard'));
const CommandCenter = lazyRetry(() => import('../pages/dashboard/CommandCenter'));
const LeadsWorkspace = lazyRetry(() => import('../pages/crm/leads/LeadsWorkspace'));
const SiteVisitsWorkspace = lazyRetry(() => import('../pages/crm/site-visits/SiteVisitsWorkspace'));
const Customer360View = lazyRetry(() => import('../pages/crm/Customer360View'));
const ProjectsWorkspace = lazyRetry(() => import('../pages/projects/ProjectsWorkspace'));
const PlotInventory = lazyRetry(() => import('../pages/plots/PlotInventory'));
const PlotDetails = lazyRetry(() => import('../pages/plots/PlotDetails'));
const CampaignList = lazyRetry(() => import('../pages/marketing/campaigns/CampaignList'));
const CampaignDetail = lazyRetry(() => import('../pages/marketing/campaigns/CampaignDetail'));
const NetworkWorkspace = lazyRetry(() => import('../pages/marketing/network/NetworkWorkspace'));
const CommissionLedgerPage = lazyRetry(() => import('../pages/marketing/commission/CommissionLedgerPage'));
const CommissionRulesPage = lazyRetry(() => import('../pages/marketing/commission/CommissionRulesPage'));
const TelecallerWorkspace = lazyRetry(() => import('../pages/marketing/telecaller/TelecallerWorkspace'));
const MarketingReports = lazyRetry(() => import('../pages/reports/MarketingReports'));
const AnalyticsWorkspace = lazyRetry(() => import('../pages/analytics/AnalyticsWorkspace'));
const BookingsWorkspace = lazyRetry(() => import('../pages/sales/BookingsWorkspace'));
const PaymentsWorkspace = lazyRetry(() => import('../pages/finance/PaymentsWorkspace'));
const ExpensesWorkspace = lazyRetry(() => import('../pages/expenses/ExpensesWorkspace'));
const VehiclesWorkspace = lazyRetry(() => import('../pages/vehicles/VehiclesWorkspace'));
const UserManagementWorkspace = lazyRetry(() => import('../pages/administration/UserManagementWorkspace'));
const AttendanceWorkspace = lazyRetry(() => import('../pages/employees/AttendanceWorkspace'));
const LoginScreen = lazyRetry(() => import('../pages/auth/LoginScreen'));
const ProfileRegistrationPage = lazyRetry(() => import('../pages/auth/ProfileRegistrationPage'));
const UserProfilePage = lazyRetry(() => import('../pages/profile/UserProfilePage'));
const CommunicationsWorkspace = lazyRetry(() => import('../pages/communications/CommunicationsWorkspace'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

export const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Profile Onboarding / Registration (First time only) */}
        <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route path="/register-profile" element={<ProfileRegistrationPage />} />
        </Route>

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
            <Route path="/profile" element={<UserProfilePage />} />
            
            {/* Internal Messaging & Communications Center */}
            <Route path="/messages" element={<CommunicationsWorkspace />} />
            <Route path="/communications" element={<CommunicationsWorkspace />} />
            
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
            <Route element={<RoleRoute allowedRoles={['super_admin', 'director', 'branch_manager', 'marketing_manager', 'marketing_executive', 'sales_manager', 'sales_executive', 'accountant', 'telecaller', 'driver']} unauthorizedTo="/dashboard" />}>
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
