// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import ExecutiveDashboard from './ExecutiveDashboard';
import { useDashboardData } from './hooks/useDashboardData';

// Mock the hook
vi.mock('./hooks/useDashboardData', () => ({
  useDashboardData: vi.fn(),
}));

const createMockStore = (initialUser = { uid: 'usr-1', role: 'director', displayName: 'Director User' }) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: initialUser as any,
        session: null,
        isAuthenticated: true,
        isLoading: false,
        token: 'token',
        customClaims: null,
        error: null,
        isRemembered: true,
      },
    },
  });
};

const renderWithTheme = (ui: React.ReactElement, store = createMockStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

describe('ExecutiveDashboard', () => {
  it('renders dashboard with cadre perspective view', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: {
        summary: { todayLeads: 45, todayCalls: 120, todayFollowups: 34, todaySiteVisits: 12, todayBookings: 3, todayRevenue: 250000 },
        leadFunnel: { newLeads: 500, assigned: 450, contacted: 400, interested: 250, siteVisit: 100, negotiation: 50, booked: 20, lost: 150 },
        salesFunnel: { pipelineValue: 5000000, expectedRevenue: 1200000, closedDeals: 15, conversionRate: 4.5 },
        leadSource: [],
        campaignPerformance: [],
        dailyLeads: [],
        weeklySales: [],
        monthlyRevenue: [],
        bookingTrend: [],
        marketingPerformance: 85,
        campaignROI: 125,
        siteVisits: 145,
        bookings: 24,
        collections: 1200000,
        vehicleStatus: '8/10 Available',
        pendingApprovals: 12,
        todayFollowupsList: [],
        topPerformingEmployee: 'Sarah',
        topCampaign: 'Summer',
        topProject: 'Villa',
        pendingTasks: 8,
        upcomingSiteVisits: 5,
        notifications: [],
        recentActivities: [],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithTheme(<ExecutiveDashboard />);
    expect(screen.getByText(/Executive Management Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Sales Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Realized Collections/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cadre Perspective View/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Generate Reports/i })).not.toBeInTheDocument();
  });

  it('renders telecaller hub when logged in as telecaller and hides cadre switcher', () => {
    const telecallerStore = createMockStore({ uid: 'usr-tc1', role: 'telecaller', displayName: 'Sunita Reddy' });
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithTheme(<ExecutiveDashboard />, telecallerStore);
    expect(screen.getByText(/Telecaller Calling & Qualification Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Call Target/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Cadre Perspective View/i)).not.toBeInTheDocument();
  });
});

