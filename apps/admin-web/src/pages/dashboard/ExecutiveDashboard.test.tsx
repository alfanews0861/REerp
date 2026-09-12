// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ExecutiveDashboard from './ExecutiveDashboard';
import { useDashboardData } from './hooks/useDashboardData';

// Mock the hook
vi.mock('./hooks/useDashboardData', () => ({
  useDashboardData: vi.fn(),
}));

const renderWithTheme = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ExecutiveDashboard', () => {
  it('renders loading state initially', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderWithTheme(<ExecutiveDashboard />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', () => {
    vi.mocked(useDashboardData).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Network error'),
      refetch: vi.fn(),
    } as any);

    renderWithTheme(<ExecutiveDashboard />);
    expect(screen.getAllByText(/Error/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it('renders dashboard when data is loaded', () => {
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
    expect(screen.getByText(/Enterprise Executive Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Summary/i)).toBeInTheDocument();
  });
});
