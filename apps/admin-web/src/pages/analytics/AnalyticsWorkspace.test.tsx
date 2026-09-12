// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AnalyticsWorkspace from './AnalyticsWorkspace';

afterEach(() => {
  cleanup();
});

// Mock recharts for jsdom
vi.mock('recharts', () => {
  return {
    ResponsiveContainer: () => <div data-testid="responsive-container" />,
    AreaChart: () => <div data-testid="area-chart" />,
    Area: () => null,
    BarChart: () => <div data-testid="bar-chart" />,
    Bar: () => null,
    PieChart: () => <div data-testid="pie-chart" />,
    Pie: () => null,
    Cell: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
  };
});

describe('AnalyticsWorkspace', () => {
  it('renders analytics title, subtitle and action buttons', () => {
    render(<AnalyticsWorkspace />);
    expect(screen.getByText(/Sales & Conversion Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Lead-to-Booking Funnel Velocity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
  });

  it('renders all key KPI summary metric cards', () => {
    render(<AnalyticsWorkspace />);
    expect(screen.getAllByText(/Total Leads/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Site Visits Done/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total Bookings/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Booking Value/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Overall Conv. Rate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Avg. Sales Cycle/i).length).toBeGreaterThan(0);
  });

  it('renders Sales Conversion Funnel stages', () => {
    render(<AnalyticsWorkspace />);
    expect(screen.getByText(/1. Inquiries \/ Leads Captured/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Contacted & Qualified/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Site Visit Scheduled/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Site Visit Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Negotiation & Token Received/i)).toBeInTheDocument();
    expect(screen.getByText(/6. Final Booking & Registered/i)).toBeInTheDocument();
  });

  it('renders agent leaderboard matrix', () => {
    render(<AnalyticsWorkspace />);
    expect(screen.getAllByText(/K. Ramesh/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/P. Sneha/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sales Executive & Telecaller Conversion Leaderboard/i)).toBeInTheDocument();
  });
});
