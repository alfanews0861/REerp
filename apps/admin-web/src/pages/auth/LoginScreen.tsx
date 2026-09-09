import React, { useState } from 'react';
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
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmail, sendPasswordResetEmail } from '@real-estate-erp/firebase';
import { useThemeMode } from '@real-estate-erp/ui';

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode } = useThemeMode();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const formatAuthError = (err: unknown): string => {
    const errorString = String(err);
    if (errorString.includes('auth/invalid-credential') || errorString.includes('auth/wrong-password') || errorString.includes('auth/user-not-found')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (errorString.includes('auth/user-disabled')) {
      return 'This employee account has been suspended. Please contact your system administrator.';
    }
    if (errorString.includes('auth/too-many-requests')) {
      return 'Access temporarily blocked due to multiple failed login attempts. Please reset your password or try again later.';
    }
    if (errorString.includes('auth/invalid-email')) {
      return 'Please provide a valid email address.';
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
      {/* Theme Toggle Top Right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          color="inherit"
          aria-label="toggle theme"
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Card
        elevation={4}
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header Banner */}
        <Box
          sx={{
            py: 3.5,
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
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <BusinessIcon fontSize="large" sx={{ color: '#ffffff' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 0.5, color: '#ffffff' }}>
            RealEstate ERP
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, color: '#ffffff' }}>
            Enterprise Management & Operations Console
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleLogin} noValidate>
            <Stack spacing={2.5}>
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
                disabled={isLoading}
                sx={{ py: 1.3, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>

          {/* Quick Demo Credentials Helper */}
          <Box sx={{ mt: 3.5, pt: 2.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
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
