// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BookingsWorkspace from './BookingsWorkspace';
import PaymentsWorkspace from '../finance/PaymentsWorkspace';

afterEach(() => {
  cleanup();
});

vi.mock('@real-estate-erp/firebase', () => ({
  getFirebaseInstance: vi.fn(() => ({
    db: {},
  })),
  inventoryBookingService: {
    bookPlot: vi.fn(),
  },
  paymentService: {
    recordPayment: vi.fn(),
  },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  limit: vi.fn(),
  orderBy: vi.fn(),
}));

describe('BookingsWorkspace', () => {
  it('renders the header and action buttons', () => {
    render(<BookingsWorkspace />);
    expect(screen.getByText(/Plot Bookings Workspace/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Booking/i })).toBeInTheDocument();
  });

  it('renders the metric cards', () => {
    render(<BookingsWorkspace />);
    expect(screen.getByText(/Total Bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Reservations/i)).toBeInTheDocument();
  });

  it('renders seed bookings in the data table', () => {
    render(<BookingsWorkspace />);
    expect(screen.getByText(/Rajesh Sharma/i)).toBeInTheDocument();
    expect(screen.getByText(/Suresh Verma/i)).toBeInTheDocument();
  });
});

describe('PaymentsWorkspace', () => {
  it('renders the header and record payment button', () => {
    render(<PaymentsWorkspace />);
    expect(screen.getByText(/Payments & Collections Workspace/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Record Payment/i })).toBeInTheDocument();
  });

  it('renders the collections metrics', () => {
    render(<PaymentsWorkspace />);
    expect(screen.getByText(/Total Realized Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Receipts/i)).toBeInTheDocument();
  });

  it('renders seed payment records in the data table', () => {
    render(<PaymentsWorkspace />);
    expect(screen.getByText(/REC-2026-081/i)).toBeInTheDocument();
    expect(screen.getByText(/REC-2026-082/i)).toBeInTheDocument();
  });
});
