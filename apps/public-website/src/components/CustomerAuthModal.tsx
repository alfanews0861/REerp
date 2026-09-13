import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  signInWithGoogle,
  signInWithEmail,
  setupRecaptcha,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '@real-estate-erp/firebase';
import { ConfirmationResult } from 'firebase/auth';

const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

interface CustomerAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'google' | 'phone' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawPhone = phone.trim();
    if (!rawPhone) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }

    const digitsOnly = rawPhone.replace(/\D/g, '');
    let formattedPhone = rawPhone;
    if (!rawPhone.startsWith('+')) {
      formattedPhone = digitsOnly.length === 10 ? `+91${digitsOnly}` : `+${digitsOnly}`;
    }

    if (formattedPhone.length < 11) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const appVerifier = setupRecaptcha('customer-recaptcha-container', { size: 'invisible' });
      const result = await sendPhoneOtp(formattedPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(60);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not send SMS OTP. Please check your number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }
    if (!confirmationResult) {
      setErrorMessage('OTP session expired. Please request a new OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await verifyPhoneOtp(confirmationResult, otpCode.trim());
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signInWithEmail(email.trim(), password, true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign in failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !isLoading && onClose()} maxWidth="xs" fullWidth>
      <div id="customer-recaptcha-container" style={{ display: 'none' }} />
      <DialogTitle sx={{ m: 0, p: 2.5, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          Customer Portal Login
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={isLoading}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sign in with Google or Phone OTP to view your reserved plots, bookings, and site visits.
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        <ToggleButtonGroup
          value={method}
          exclusive
          onChange={(_, val) => {
            if (val) {
              setMethod(val);
              setErrorMessage(null);
            }
          }}
          size="small"
          fullWidth
          sx={{ mb: 2.5 }}
        >
          <ToggleButton value="google" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Google
          </ToggleButton>
          <ToggleButton value="phone" sx={{ textTransform: 'none', fontWeight: 600 }}>
            <SmsOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            Phone OTP
          </ToggleButton>
          <ToggleButton value="email" sx={{ textTransform: 'none', fontWeight: 600 }}>
            <MarkEmailReadOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            Email
          </ToggleButton>
        </ToggleButtonGroup>

        {/* GOOGLE METHOD */}
        {method === 'google' && (
          <Stack spacing={2} sx={{ py: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                borderColor: '#dadce0',
                color: '#3c4043',
                bgcolor: '#ffffff',
                '&:hover': {
                  bgcolor: '#f8f9fa',
                  borderColor: '#dadce0',
                },
              }}
            >
              {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign in with Google'}
            </Button>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              1-Click instant sign in with your Google Account.
            </Typography>
          </Stack>
        )}

        {/* PHONE OTP METHOD */}
        {method === 'phone' && (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <Stack spacing={2}>
                  <TextField
                    label="Mobile Phone Number"
                    type="tel"
                    fullWidth
                    required
                    placeholder="+91 98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoFocus
                    InputProps={{
                      startAdornment: <PhoneOutlinedIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Send OTP Code'}
                  </Button>
                </Stack>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sent to: <strong>{phone}</strong>
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<ArrowBackIcon fontSize="small" />}
                      onClick={() => setOtpSent(false)}
                      sx={{ textTransform: 'none' }}
                    >
                      Change
                    </Button>
                  </Box>

                  <TextField
                    label="6-Digit OTP Code"
                    type="text"
                    inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                    fullWidth
                    required
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    autoFocus
                    InputProps={{
                      startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Verify & Sign In'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    {resendTimer > 0 ? (
                      <Typography variant="caption" color="text.secondary">
                        Resend OTP in {resendTimer}s
                      </Typography>
                    ) : (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleSendOtp()}
                        disabled={isLoading}
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

        {/* EMAIL METHOD */}
        {method === 'email' && (
          <form onSubmit={handleEmailSignIn}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
