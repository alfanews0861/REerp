import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import KeyIcon from '@mui/icons-material/Key';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  signInWithEmail,
  signUpWithEmail,
  sendPasswordResetEmail,
  signInWithGoogle,
  setupRecaptcha,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '@real-estate-erp/firebase';
import { ConfirmationResult } from 'firebase/auth';
import { UserRole } from '@real-estate-erp/types';

// Google Brand Icon SVG
const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const REGISTER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'sales_executive', label: 'Sales Executive', description: 'Handles site visits, client follow-ups, and bookings' },
  { value: 'telecaller', label: 'Telecaller', description: 'Outbound calls, lead qualification, and scheduling' },
  { value: 'marketing_executive', label: 'Marketing Executive', description: 'Campaign tracking and lead generation' },
  { value: 'marketing_manager', label: 'Marketing Manager', description: 'Manages marketing operations and teams' },
  { value: 'sales_manager', label: 'Sales Manager', description: 'Oversees sales closings and agent assignments' },
  { value: 'accountant', label: 'Accountant', description: 'Manages vouchers, receipts, and payments' },
  { value: 'driver', label: 'Driver', description: 'Fleet operations and site visit transportation' },
  { value: 'customer', label: 'Customer / Client', description: 'View personal bookings, payments, and plots' },
];

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: 0 = Sign In, 1 = Register
  const [activeTab, setActiveTab] = useState<number>(0);

  // Sign in method: 'email' | 'phone'
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');

  // Email login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('sales_executive');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // OTP Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatAuthError = (err: unknown): string => {
    const errorString = String(err);
    if (errorString.includes('auth/invalid-credential') || errorString.includes('auth/wrong-password') || errorString.includes('auth/user-not-found')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (errorString.includes('auth/email-already-in-use')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (errorString.includes('auth/weak-password')) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.';
    }
    if (errorString.includes('auth/user-disabled')) {
      return 'This employee account has been suspended. Please contact your system administrator.';
    }
    if (errorString.includes('auth/too-many-requests')) {
      return 'Access temporarily blocked due to multiple failed attempts. Please try again later.';
    }
    if (errorString.includes('auth/invalid-email')) {
      return 'Please provide a valid email address.';
    }
    if (errorString.includes('auth/invalid-phone-number')) {
      return 'Please provide a valid phone number with country code (e.g. +91 9876543210).';
    }
    if (errorString.includes('auth/invalid-verification-code') || errorString.includes('auth/code-expired')) {
      return 'Invalid or expired OTP code. Please verify and try again.';
    }
    if (errorString.includes('auth/popup-closed-by-user')) {
      return 'Google Sign-In popup was closed. Please try again.';
    }
    if (errorString.includes('auth/network-request-failed')) {
      return 'Network connection error. Please verify your internet connection.';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Authentication failed. Please try again.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signInWithEmail(email.trim(), password, rememberMe);
      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    setRegError(null);

    try {
      await signInWithGoogle();
      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      const errorMsg = formatAuthError(err);
      if (activeTab === 1) {
        setRegError(errorMsg);
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawPhone = phone.trim();
    if (!rawPhone) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }

    const digitsOnly = rawPhone.replace(/\D/g, '');
    let formattedPhone = rawPhone;
    if (!rawPhone.startsWith('+')) {
      if (digitsOnly.length === 10) {
        formattedPhone = `+91${digitsOnly}`;
      } else {
        formattedPhone = `+${digitsOnly}`;
      }
    }

    if (formattedPhone.length < 11) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsPhoneLoading(true);
    setErrorMessage(null);

    try {
      const appVerifier = setupRecaptcha('recaptcha-container', { size: 'invisible' });
      const confirmation = await sendPhoneOtp(formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(60);
    } catch (err: unknown) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your phone.');
      return;
    }
    if (!confirmationResult) {
      setErrorMessage('OTP session expired. Please request a new OTP code.');
      return;
    }

    setIsPhoneLoading(true);
    setErrorMessage(null);

    try {
      await verifyPhoneOtp(confirmationResult, otpCode.trim());
      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid work or personal email address.');
      return;
    }
    if (!regPassword) {
      setRegError('Please create a secure password.');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type password carefully.');
      return;
    }

    setRegLoading(true);

    try {
      await signUpWithEmail(
        regEmail.trim(),
        regPassword,
        regName.trim(),
        regRole,
        regPhone.trim() || undefined
      );
      setRegSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate(fromLocation, { replace: true });
      }, 800);
    } catch (err: unknown) {
      setRegError(formatAuthError(err));
    } finally {
      setRegLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetError('Please enter a valid work email address.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    try {
      await sendPasswordResetEmail(resetEmail.trim());
      setResetSuccess(`Password reset instructions have been sent to ${resetEmail}. Check your inbox or spam folder.`);
    } catch (err: unknown) {
      setResetError(formatAuthError(err));
    } finally {
      setResetLoading(false);
    }
  };

  const fillDemoRole = (roleEmail: string, rolePass: string) => {
    setActiveTab(0);
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
        position: 'relative',
      }}
    >
      {/* Invisible container for phone reCAPTCHA */}
      <div id="recaptcha-container" style={{ display: 'none' }} />

      <Card
        elevation={4}
        sx={{
          maxWidth: 520,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header Banner */}
        <Box
          sx={{
            py: 3,
            px: 4,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <BusinessIcon fontSize="medium" sx={{ color: '#ffffff' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 0.5, color: '#ffffff' }}>
            RealEstate ERP
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: '#ffffff' }}>
            Enterprise Operations, Sales & Management Console
          </Typography>
        </Box>

        {/* Tab Switcher: Sign In vs Register */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => {
              setActiveTab(val);
              setErrorMessage(null);
              setRegError(null);
              setRegSuccess(null);
            }}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<LoginIcon fontSize="small" />}
              iconPosition="start"
              label="Sign In"
              sx={{ fontWeight: 600, textTransform: 'none', py: 1.5 }}
            />
            <Tab
              icon={<HowToRegIcon fontSize="small" />}
              iconPosition="start"
              label="New Registration"
              sx={{ fontWeight: 600, textTransform: 'none', py: 1.5 }}
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3.5 }}>
          {/* TAB 0: SIGN IN FORM */}
          {activeTab === 0 && (
            <>
              {/* Sign In Mode Switcher (Email vs Phone OTP) */}
              <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                  value={signInMethod}
                  exclusive
                  onChange={(_, val) => {
                    if (val) {
                      setSignInMethod(val);
                      setErrorMessage(null);
                    }
                  }}
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 0.8,
                    },
                  }}
                >
                  <ToggleButton value="email" aria-label="email login">
                    <MarkEmailReadOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    Corporate Email
                  </ToggleButton>
                  <ToggleButton value="phone" aria-label="phone login">
                    <SmsOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    Phone Number OTP
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              )}

              {/* METHOD 1: EMAIL & PASSWORD SIGN IN */}
              {signInMethod === 'email' && (
                <form onSubmit={handleLogin} noValidate>
                  <Stack spacing={2.2}>
                    <TextField
                      id="login-email"
                      label="Corporate Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      id="login-password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">Remember device</Typography>}
                      />

                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setResetEmail(email);
                          setResetError(null);
                          setResetSuccess(null);
                          setForgotPasswordOpen(true);
                        }}
                        sx={{ textTransform: 'none', fontWeight: 500 }}
                      >
                        Forgot password?
                      </Button>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={isLoading || isGoogleLoading}
                      sx={{ py: 1.2, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                  </Stack>
                </form>
              )}

              {/* METHOD 2: PHONE NUMBER OTP SIGN IN */}
              {signInMethod === 'phone' && (
                <>
                  {!otpSent ? (
                    <form onSubmit={handleSendPhoneOtp} noValidate>
                      <Stack spacing={2.2}>
                        <TextField
                          id="login-phone"
                          label="Mobile Phone Number"
                          type="tel"
                          variant="outlined"
                          fullWidth
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          autoComplete="tel"
                          autoFocus
                          helperText="We will send a 6-digit verification code via SMS"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneOutlinedIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          disabled={isPhoneLoading}
                          sx={{ py: 1.2, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
                        >
                          {isPhoneLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification OTP'}
                        </Button>
                      </Stack>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOtp} noValidate>
                      <Stack spacing={2.2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            OTP sent to: <strong>{phone}</strong>
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<ArrowBackIcon fontSize="small" />}
                            onClick={() => {
                              setOtpSent(false);
                              setOtpCode('');
                              setErrorMessage(null);
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Edit
                          </Button>
                        </Box>

                        <TextField
                          id="login-otp"
                          label="6-Digit OTP Code"
                          type="text"
                          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                          variant="outlined"
                          fullWidth
                          required
                          placeholder="123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          autoFocus
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <KeyIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          disabled={isPhoneLoading}
                          sx={{ py: 1.2, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
                        >
                          {isPhoneLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                          {resendTimer > 0 ? (
                            <Typography variant="caption" color="text.secondary">
                              Resend code in {resendTimer}s
                            </Typography>
                          ) : (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleSendPhoneOtp()}
                              disabled={isPhoneLoading}
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                              Resend OTP
                            </Button>
                          )}
                        </Box>
                      </Stack>
                    </form>
                  )}
                </>
              )}

              {/* DIVIDER: OR CONTINUE WITH */}
              <Divider sx={{ my: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 500 }}>
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              {/* GOOGLE SIGN IN BUTTON */}
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading || isPhoneLoading}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.1,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f8f9fa',
                    borderColor: theme.palette.text.secondary,
                  },
                }}
              >
                {isGoogleLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign in with Google'}
              </Button>

              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setActiveTab(1)}
                    sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}
                  >
                    Register here
                  </Button>
                </Typography>
              </Box>

              {/* Quick Demo Credentials Helper */}
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                  QUICK TEST CREDENTIALS:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label="Admin"
                    size="small"
                    icon={<KeyIcon />}
                    onClick={() => fillDemoRole('admin@reerp.com', 'Admin@2026')}
                    clickable
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label="Manager"
                    size="small"
                    onClick={() => fillDemoRole('manager@reerp.com', 'Manager@2026')}
                    clickable
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label="Telecaller"
                    size="small"
                    onClick={() => fillDemoRole('telecaller@reerp.com', 'Telecaller@2026')}
                    clickable
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label="Field Agent"
                    size="small"
                    onClick={() => fillDemoRole('agent@reerp.com', 'Agent@2026')}
                    clickable
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              </Box>
            </>
          )}

          {/* TAB 1: REGISTRATION FORM */}
          {activeTab === 1 && (
            <>
              {regError && (
                <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setRegError(null)}>
                  {regError}
                </Alert>
              )}

              {regSuccess && (
                <Alert severity="success" sx={{ mb: 2.5 }}>
                  {regSuccess}
                </Alert>
              )}

              {/* Quick Google Registration */}
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                onClick={handleGoogleLogin}
                disabled={regLoading || isGoogleLoading}
                startIcon={<GoogleIcon />}
                sx={{
                  mb: 2.5,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                }}
              >
                {isGoogleLoading ? <CircularProgress size={20} color="inherit" /> : '1-Click Register with Google'}
              </Button>

              <Divider sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 500 }}>
                  OR REGISTER WITH EMAIL & ROLE
                </Typography>
              </Divider>

              <form onSubmit={handleRegister} noValidate>
                <Stack spacing={2}>
                  <TextField
                    id="reg-name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    autoComplete="name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    id="reg-email"
                    label="Work or Personal Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    id="reg-phone"
                    label="Mobile Number (Optional)"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    placeholder="+91 98480 12345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    autoComplete="tel"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    id="reg-role"
                    select
                    label="Designation / System Role"
                    fullWidth
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    helperText={REGISTER_ROLES.find((r) => r.value === regRole)?.description}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {REGISTER_ROLES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id="reg-password"
                    label="Create Password (Min 8 chars)"
                    type={showRegPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            edge="end"
                          >
                            {showRegPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    id="reg-confirm-password"
                    label="Confirm Password"
                    type={showRegPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={regLoading || !!regSuccess}
                    sx={{ py: 1.2, fontWeight: 600, textTransform: 'none', fontSize: '1rem', mt: 1 }}
                  >
                    {regLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Access'}
                  </Button>

                  <Box sx={{ textAlign: 'center', pt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already registered?{' '}
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setActiveTab(0)}
                        sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}
                      >
                        Sign in instead
                      </Button>
                    </Typography>
                  </Box>
                </Stack>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter your verified registered email address and we will dispatch a secure link to reset your account password.
          </DialogContentText>

          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetSuccess}
            </Alert>
          )}

          {resetError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetError}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="reset-email"
            label="Work Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            disabled={resetLoading || !!resetSuccess}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setForgotPasswordOpen(false)} color="inherit" disabled={resetLoading}>
            Close
          </Button>
          {!resetSuccess && (
            <Button
              onClick={handleResetPassword}
              variant="contained"
              color="primary"
              disabled={resetLoading}
            >
              {resetLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginScreen;
