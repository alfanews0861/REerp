import { FC, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import {
  PrivateRoute,
  GuestRoute,
  PublicRoute,
} from '@real-estate-erp/ui';
import { AppShell } from '../layouts/AppShell';

// Lazy loading for all modules
const Placeholder = lazy(() => import('../pages/PlaceholderPage'));
const ExecutiveDashboard = lazy(() => import('../pages/dashboard/ExecutiveDashboard'));
const CommandCenter = lazy(() => import('../pages/dashboard/CommandCenter'));
const LeadsWorkspace = lazy(() => import('../pages/crm/leads/LeadsWorkspace'));
const SiteVisitsWorkspace = lazy(() => import('../pages/crm/site-visits/SiteVisitsWorkspace'));
const Customer360View = lazy(() => import('../pages/crm/Customer360View'));
const PlotInventory = lazy(() => import('../pages/plots/PlotInventory'));
const PlotDetails = lazy(() => import('../pages/plots/PlotDetails'));
const CampaignList = lazy(() => import('../pages/marketing/campaigns/CampaignList'));
const CampaignDetail = lazy(() => import('../pages/marketing/campaigns/CampaignDetail'));
const NetworkWorkspace = lazy(() => import('../pages/marketing/network/NetworkWorkspace'));
const CommissionLedgerPage = lazy(() => import('../pages/marketing/commission/CommissionLedgerPage'));
const CommissionRulesPage = lazy(() => import('../pages/marketing/commission/CommissionRulesPage'));
const TelecallerWorkspace = lazy(() => import('../pages/marketing/telecaller/TelecallerWorkspace'));
const MarketingReports = lazy(() => import('../pages/reports/MarketingReports'));
const BookingsWorkspace = lazy(() => import('../pages/sales/BookingsWorkspace'));
const PaymentsWorkspace = lazy(() => import('../pages/finance/PaymentsWorkspace'));
const UserManagementWorkspace = lazy(() => import('../pages/administration/UserManagementWorkspace'));
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
            <Route path="/dashboard/command-center" element={<CommandCenter />} />
            
            {/* CRM */}
            <Route path="/crm/leads" element={<LeadsWorkspace />} />
            <Route path="/crm/site-visits" element={<SiteVisitsWorkspace />} />
            <Route path="/crm/customers" element={<Customer360View />} />
            <Route path="/crm/customers/:id" element={<Customer360View />} />
            
            {/* Projects & Plots */}
            <Route path="/projects" element={<Placeholder />} />
            <Route path="/plots" element={<PlotInventory />} />
            <Route path="/plots/:id" element={<PlotDetails />} />
            
            {/* Marketing */}
            <Route path="/marketing/campaigns" element={<CampaignList />} />
            <Route path="/marketing/campaigns/details" element={<CampaignDetail />} />
            <Route path="/marketing/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/marketing/site-visits" element={<SiteVisitsWorkspace />} />
            <Route path="/marketing/network" element={<NetworkWorkspace />} />
            <Route path="/marketing/commission" element={<CommissionLedgerPage />} />
            <Route path="/marketing/commission/rules" element={<CommissionRulesPage />} />
            <Route path="/marketing/telecaller" element={<TelecallerWorkspace />} />
            
            {/* Sales & Finance */}
            <Route path="/bookings" element={<BookingsWorkspace />} />
            <Route path="/payments" element={<PaymentsWorkspace />} />
            <Route path="/expenses" element={<Placeholder />} />
            
            {/* HR & Ops */}
            <Route path="/employees/attendance" element={<Placeholder />} />
            <Route path="/vehicles" element={<Placeholder />} />
            
            {/* Reports & Settings */}
            <Route path="/reports" element={<MarketingReports />} />
            <Route path="/reports/marketing" element={<MarketingReports />} />
            <Route path="/analytics" element={<Placeholder />} />
            <Route path="/settings" element={<UserManagementWorkspace />} />
            <Route path="/settings/users" element={<UserManagementWorkspace />} />
            <Route path="/administration" element={<UserManagementWorkspace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
