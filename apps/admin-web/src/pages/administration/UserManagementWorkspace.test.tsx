// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UserManagementWorkspace from './UserManagementWorkspace';

// Mock Firebase functions and firestore
vi.mock('@real-estate-erp/firebase', () => ({
  getFirebaseInstance: vi.fn(() => ({ db: {}, auth: {} })),
  signUpWithEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn((_col, _callback) => {
    // Return unsubscribe mock
    return () => {};
  }),
}));

describe('UserManagementWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders staff & user management header and KPI metrics', () => {
    render(<UserManagementWorkspace />);

    expect(screen.getByText('Staff & User Management')).toBeInTheDocument();
    expect(screen.getByText('Total Staff')).toBeInTheDocument();
    expect(screen.getByText('Admins')).toBeInTheDocument();
    expect(screen.getByText('Managers')).toBeInTheDocument();
    expect(screen.getByText('Telecallers')).toBeInTheDocument();
    expect(screen.getByText('Field Agents')).toBeInTheDocument();
  });

  it('renders default staff members in the data table', () => {
    render(<UserManagementWorkspace />);

    expect(screen.getByText('Rajesh Kumar (Director)')).toBeInTheDocument();
    expect(screen.getByText('admin@reerp.com')).toBeInTheDocument();
    expect(screen.getByText('Sunita Reddy')).toBeInTheDocument();
    expect(screen.getByText('Anand Naidu')).toBeInTheDocument();
  });

  it('filters staff by role tab', async () => {
    render(<UserManagementWorkspace />);

    // Click Telecallers tab
    const telecallerTab = screen.getByRole('tab', { name: /Telecallers/i });
    fireEvent.click(telecallerTab);

    await waitFor(() => {
      expect(screen.getByText('Sunita Reddy')).toBeInTheDocument();
      expect(screen.getByText('Kiran Rao')).toBeInTheDocument();
      expect(screen.queryByText('Rajesh Kumar (Director)')).not.toBeInTheDocument();
    });
  });

  it('opens Add Staff Member dialog when button is clicked', () => {
    render(<UserManagementWorkspace />);

    const addButton = screen.getByRole('button', { name: /Add Staff Member/i });
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Corporate Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temporary Password/i)).toBeInTheDocument();
  });

  it('opens Edit Role & Permissions dialog for a staff member', async () => {
    render(<UserManagementWorkspace />);

    // Find all edit buttons
    const editButtons = screen.getAllByTestId('EditIcon');
    fireEvent.click(editButtons[0].closest('button')!);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Role & Permissions')).toBeInTheDocument();
      expect(screen.getByText('Custom Permission Overrides:')).toBeInTheDocument();
      expect(screen.getByText('Approve Plot Bookings & Reservations')).toBeInTheDocument();
    });
  });

  it('toggles user status between active and suspended', async () => {
    render(<UserManagementWorkspace />);

    // First user is active, clicking block button should toggle
    const blockButtons = screen.getAllByTestId('BlockIcon');
    fireEvent.click(blockButtons[0].closest('button')!);

    await waitFor(() => {
      expect(screen.getByText(/Account status for Rajesh Kumar \(Director\) updated to SUSPENDED/i)).toBeInTheDocument();
    });
  });
});
