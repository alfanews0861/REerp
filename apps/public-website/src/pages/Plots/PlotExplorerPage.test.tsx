// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PlotExplorerPage } from './PlotExplorerPage';
import { holdPlotOnline } from '../../services/publicDataService';

afterEach(() => {
  cleanup();
});

// Mock Firebase
vi.mock('@real-estate-erp/firebase', () => ({
  getFirebaseInstance: vi.fn(() => ({
    db: {},
  })),
  initFirebase: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  doc: vi.fn(),
  runTransaction: vi.fn().mockImplementation((_db, fn) => fn({
    get: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({}) }),
    set: vi.fn(),
    update: vi.fn(),
  })),
}));

describe('PlotExplorerPage & Online Plot Hold Booking Flow', () => {
  it('renders plot explorer with inventory list and hold buttons', async () => {
    render(
      <MemoryRouter>
        <PlotExplorerPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Browse Open Plots & Villa Sites/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Plot #P-01/i)).toBeInTheDocument();
    });

    const holdButtons = screen.getAllByRole('button', { name: /Hold Plot/i });
    expect(holdButtons.length).toBeGreaterThan(0);
  });

  it('opens TokenBookingModal when Hold Plot is clicked', async () => {
    render(
      <MemoryRouter>
        <PlotExplorerPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Plot #P-01/i)).toBeInTheDocument();
    });

    const holdButtons = screen.getAllByRole('button', { name: /Hold Plot/i });
    fireEvent.click(holdButtons[0]);

    // TokenBookingModal should open
    expect(screen.getByText(/Hold Plot #P-01 Online/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Token Advance Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Buyer Information/i)).toBeInTheDocument();
    expect(screen.getByText(/48-Hour Price & Plot Freeze/i)).toBeInTheDocument();
  });

  it('allows completing a simulated instant token booking with 48h hold lock', async () => {
    render(
      <MemoryRouter>
        <PlotExplorerPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Plot #P-01/i)).toBeInTheDocument();
    });

    const holdButtons = screen.getAllByRole('button', { name: /Hold Plot/i });
    fireEvent.click(holdButtons[0]);

    // Fill customer info
    const nameInput = screen.getByLabelText(/Full Name \*/i);
    const phoneInput = screen.getByLabelText(/Mobile Number \(WhatsApp\) \*/i);

    fireEvent.change(nameInput, { target: { value: 'Naveen Chandra' } });
    fireEvent.change(phoneInput, { target: { value: '9848011223' } });

    // Proceed to payment
    const proceedBtn = screen.getByRole('button', { name: /Proceed to Pay/i });
    fireEvent.click(proceedBtn);

    // Payment gateway simulator screen
    expect(screen.getByText(/Instant Token Advance Payable/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan QR with Any UPI App/i)).toBeInTheDocument();

    // Click simulate payment
    const payBtn = screen.getByRole('button', { name: /Simulate Pay/i });
    fireEvent.click(payBtn);

    // Confirmation screen
    await waitFor(() => {
      expect(screen.getByText(/Plot #P-01 Reserved!/i)).toBeInTheDocument();
      expect(screen.getByText(/Print Slip/i)).toBeInTheDocument();
    });
  });

  it('holdPlotOnline service creates 48-hour auto-expiry reservation', async () => {
    const res = await holdPlotOnline({
      plotId: 'test-plot-1',
      plotNumber: 'P-999',
      projectId: 'proj-1',
      projectName: 'Sunrise Enclave',
      customerName: 'Test Buyer',
      customerPhone: '9876543210',
      tokenAmount: 50000,
      paymentMethod: 'UPI',
      transactionRef: 'UPI/1234/567890',
    });

    expect(res.bookingNumber).toMatch(/^BKG-/);
    expect(res.receiptNumber).toMatch(/^REC-2026-/);
    expect(res.tokenAmount).toBe(50000);
    expect(res.status).toBe('RESERVED_HOLD');

    const bookingDate = new Date(res.bookingDate).getTime();
    const expiryDate = new Date(res.expiryDate).getTime();
    const diffHours = (expiryDate - bookingDate) / (1000 * 60 * 60);

    // Should be locked for 48 hours
    expect(Math.round(diffHours)).toBe(48);
  });
});
