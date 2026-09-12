// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PaymentsWorkspace from './PaymentsWorkspace';

afterEach(() => {
  cleanup();
});

// Mock Firebase
vi.mock('@real-estate-erp/firebase', () => ({
  getFirebaseInstance: vi.fn(() => ({
    db: {},
    auth: { currentUser: { uid: 'test-admin' } },
  })),
  paymentService: {
    recordPayment: vi.fn().mockResolvedValue({ id: 'mock-pay-id' }),
  },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  limit: vi.fn(),
  orderBy: vi.fn(),
}));

describe('PaymentsWorkspace & Official Receipt Generator', () => {
  it('renders payments workspace header and metrics', () => {
    render(<PaymentsWorkspace />);
    expect(screen.getByText(/Payments & Collections Workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Realized Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Receipts/i)).toBeInTheDocument();
  });

  it('renders seed payment records in the data table', () => {
    render(<PaymentsWorkspace />);
    expect(screen.getByText('REC-2026-081')).toBeInTheDocument();
    expect(screen.getAllByText('Rajesh Sharma').length).toBeGreaterThan(0);
    expect(screen.getByText('Suresh Verma')).toBeInTheDocument();
  });

  it('opens official printable receipt modal when receipt icon is clicked', () => {
    render(<PaymentsWorkspace />);
    const receiptButtons = screen.getAllByTitle('View Official Receipt');
    expect(receiptButtons.length).toBeGreaterThan(0);

    // Click the first receipt button
    fireEvent.click(receiptButtons[0]);

    // Receipt Modal should be visible
    expect(screen.getAllByText(/Official Payment Receipt/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/SRI CITY DEVELOPERS & INFRA PVT\. LTD\./i)).toBeInTheDocument();
    expect(screen.getByText(/Rupees Two Lakh Only/i)).toBeInTheDocument();
    expect(screen.getByText(/Print \/ Save PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Download HTML/i)).toBeInTheDocument();
  });

  it('allows filtering by payment method', () => {
    render(<PaymentsWorkspace />);
    const upiChip = screen.getByRole('button', { name: 'UPI' });
    fireEvent.click(upiChip);

    expect(screen.getByText('REC-2026-081')).toBeInTheDocument();
    expect(screen.queryByText('REC-2026-083')).not.toBeInTheDocument();
  });
});
