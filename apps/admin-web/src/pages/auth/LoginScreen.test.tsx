// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import * as firebaseAuth from '@real-estate-erp/firebase';

// Mock firebase functions
vi.mock('@real-estate-erp/firebase', () => ({
  signInWithEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  getFirebaseInstance: vi.fn(() => ({ auth: {}, db: {} })),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: { pathname: '/dashboard' } } }),
  };
});

const renderLogin = () =>
  render(
    <BrowserRouter>
      <LoginScreen />
    </BrowserRouter>
  );

describe('LoginScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders enterprise login interface with branding and inputs', () => {
    renderLogin();

    expect(screen.getByText('RealEstate ERP')).toBeInTheDocument();
    expect(screen.getByLabelText(/Corporate Email/i)).toBeInTheDocument();
    expect(document.getElementById('login-password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Remember device/i)).toBeInTheDocument();
  });

  it('toggles password visibility when visibility icon is clicked', () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(/^Password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('populates fields when a demo role chip is clicked', () => {
    renderLogin();

    const adminChip = screen.getByText('Admin');
    fireEvent.click(adminChip);

    const emailInput = screen.getByLabelText(/Corporate Email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^Password/i) as HTMLInputElement;

    expect(emailInput.value).toBe('admin@reerp.com');
    expect(passwordInput.value).toBe('Admin@2026');
  });

  it('calls signInWithEmail and navigates on valid credentials', async () => {
    vi.mocked(firebaseAuth.signInWithEmail).mockResolvedValue(
      {} as unknown as import('firebase/auth').UserCredential
    );

    renderLogin();

    const emailInput = screen.getByLabelText(/Corporate Email/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'director@reerp.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePass@123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(firebaseAuth.signInWithEmail).toHaveBeenCalledWith(
        'director@reerp.com',
        'SecurePass@123',
        true
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('displays helpful error alert when authentication fails', async () => {
    vi.mocked(firebaseAuth.signInWithEmail).mockRejectedValue(
      new Error('Firebase: Error (auth/invalid-credential).')
    );

    renderLogin();

    const emailInput = screen.getByLabelText(/Corporate Email/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@reerp.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password. Please check your credentials and try again./i)
      ).toBeInTheDocument();
    });
  });

  it('opens password reset dialog and triggers sendPasswordResetEmail', async () => {
    vi.mocked(firebaseAuth.sendPasswordResetEmail).mockResolvedValue(undefined);

    renderLogin();

    const forgotButton = screen.getByRole('button', { name: /Forgot password\?/i });
    fireEvent.click(forgotButton);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();

    const resetEmailInput = screen.getByLabelText(/Work Email Address/i);
    fireEvent.change(resetEmailInput, { target: { value: 'test@reerp.com' } });

    const sendButton = screen.getByRole('button', { name: /Send Reset Link/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@reerp.com');
      expect(
        screen.getByText(/Password reset instructions have been sent to test@reerp.com/i)
      ).toBeInTheDocument();
    });
  });
});
