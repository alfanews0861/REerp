import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthContext, lookupReferralCode, completeUserProfile } from '@real-estate-erp/firebase';
import { CadreLevel, CADRE_DISPLAY_NAMES, ReferralLookupResult } from '@real-estate-erp/types';

export const ProfileRegistrationPage: React.FC = () => {
  const { user, refreshClaims, refreshProfile } = useAuthContext();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email] = useState(user?.email || '');
  const [registrationType, setRegistrationType] = useState<'marketing_agent' | 'office_staff'>('marketing_agent');
  
  // Reference Code State
  const [refCodeInput, setRefCodeInput] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [lookupResult, setLookupResult] = useState<ReferralLookupResult | null>(null);

  // KYC State
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [city, setCity] = useState('Nellore');
  const [branch, setBranch] = useState('Nellore Main Hub');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If user profile is already completed, redirect to dashboard
  useEffect(() => {
    if (user && user.isProfileCompleted === true && !isSubmitted) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isSubmitted, navigate]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user?.displayName && !fullName) setFullName(user.displayName);
    if (user?.phoneNumber && !phone) setPhone(user.phoneNumber);
  }, [user]);

  // Handle Reference Code Check
  const handleCheckRefCode = async (codeToVerify?: string) => {
    const code = (codeToVerify || refCodeInput).trim().toUpperCase();
    if (!code) {
      setLookupResult({ valid: false, code: '', error: 'Please enter a Reference Code' });
      return;
    }

    setIsCheckingCode(true);
    setLookupResult(null);
    try {
      const res = await lookupReferralCode(code);
      setLookupResult(res);
      if (res.valid && res.sponsorBranch) {
        setBranch(res.sponsorBranch);
      }
    } catch {
      setLookupResult({ valid: false, code, error: 'Failed to verify reference code' });
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleSelectQuickCode = (code: string) => {
    setRefCodeInput(code);
    handleCheckRefCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSubmitError('Please enter your full name');
      return;
    }
    if (registrationType === 'marketing_agent' && !lookupResult?.valid) {
      setSubmitError('Please enter and verify a valid Reference Code from your upline manager or leader.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uid = user?.uid;
      if (!uid) {
        throw new Error('User authentication session expired. Please log in again.');
      }
      await completeUserProfile(uid, {
        displayName: fullName.trim(),
        phoneNumber: phone.trim() || undefined,
        registrationType,
        referredByCode: lookupResult?.valid ? lookupResult.code : undefined,
        referredByUid: lookupResult?.sponsorUid || undefined,
        referredByName: lookupResult?.sponsorName || undefined,
        referredByCadre: lookupResult?.sponsorCadre || undefined,
        hierarchyPath: lookupResult?.sponsorUid ? [lookupResult.sponsorUid] : [],
        kycDetails: {
          panNumber: panNumber.trim().toUpperCase() || undefined,
          aadharNumber: aadharNumber.trim() || undefined,
          city: city.trim() || 'Nellore',
          branch: branch.trim() || 'Nellore Main Hub',
          bankAccount: bankAccount.trim() || undefined,
          ifscCode: ifscCode.trim().toUpperCase() || undefined,
        },
      });

      if (refreshProfile) {
        await refreshProfile();
      }
      if (refreshClaims) {
        await refreshClaims();
      }

      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Top Navbar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, maxWidth: 900, mx: 'auto', width: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 42, height: 42, bgcolor: 'primary.main', borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30,64,175,0.25)' }}>
            <BusinessIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.1, color: '#0f172a' }}>
              RealEstate ERP
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
              Onboarding & Cadre Reference Portal
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main Form Container */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          bgcolor: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
        }}
      >
        {isSubmitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#0f172a' }}>
              Profile Submitted Successfully!
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', mb: 3, maxWidth: 600, mx: 'auto' }}>
              {registrationType === 'marketing_agent'
                ? `Your registration has been linked under ${lookupResult?.sponsorName || 'your Leader'}. Your reporting manager will review and assign your Cadre. Redirecting to workspace...`
                : 'Your Office Staff application has been submitted and is under review by Company Management & Director. Redirecting to workspace...'}
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/dashboard', { replace: true })} sx={{ fontWeight: 700, px: 4, py: 1.2 }}>
              Go to Workspace Now
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header / Intro */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Chip
                label="New Associate Profile Registration"
                color="primary"
                size="small"
                sx={{ mb: 1.5, fontWeight: 700, px: 1 }}
              />
              <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: '#0f172a' }}>
                Complete Your Official Profile
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 650, mx: 'auto', fontSize: '0.95rem' }}>
                Enter your reference code to link your reporting hierarchy. Your reporting manager will assign and manage your Cadre based on your performance.
              </Typography>
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Section 1: Registration Role Type */}
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
              <BadgeIcon color="primary" /> 1. Select Registration Type
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                mb: 4,
                borderRadius: 2.5,
                bgcolor: '#f8fafc',
                borderColor: '#e2e8f0',
              }}
            >
              <RadioGroup
                value={registrationType}
                onChange={(e) => setRegistrationType(e.target.value as 'marketing_agent' | 'office_staff')}
              >
                <FormControlLabel
                  value="marketing_agent"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#0f172a' }}>
                        Marketing Network Agent (Sales Associate / Leader)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Field sales, plot bookings, downline network building, and commissions. Requires Upline Reference Code.
                      </Typography>
                    </Box>
                  }
                />
                <Divider sx={{ my: 1.5, borderColor: '#e2e8f0' }} />
                <FormControlLabel
                  value="office_staff"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#0f172a' }}>
                        Corporate Office Staff (Accounts, Telecaller, Admin, Ops)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Internal operations and branch administration. Approval strictly authorized by Management / Director.
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Paper>

            {/* Section 2: Reference Code & Reporting Hierarchy */}
            {registrationType === 'marketing_agent' && (
              <>
                <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
                  <BusinessIcon color="primary" /> 2. Upline Reference Code (Sponsor / Manager)
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    mb: 4,
                    borderRadius: 2.5,
                    bgcolor: '#f8fafc',
                    borderColor: '#e2e8f0',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
                    Enter the Reference Code given by your recruiter or reporting leader (e.g., CGM, GM, Sales Manager).
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Reference / Referral Code"
                      placeholder="e.g. REF-CGM-101 or REF-GM-102"
                      value={refCodeInput}
                      onChange={(e) => {
                        setRefCodeInput(e.target.value.toUpperCase());
                        setLookupResult(null);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon fontSize="small" sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#fff',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleCheckRefCode()}
                      disabled={isCheckingCode || !refCodeInput.trim()}
                      startIcon={isCheckingCode ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                      sx={{ height: 56, minWidth: 160, fontWeight: 700 }}
                    >
                      {isCheckingCode ? 'Verifying...' : 'Verify Code'}
                    </Button>
                  </Stack>

                  {/* Quick Select Demo Referral Codes */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', mr: 1, fontWeight: 600 }}>
                      Quick Select Leaders:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                      <Chip label="Ramesh Varma (CGM)" size="small" onClick={() => handleSelectQuickCode('REF-CGM-101')} clickable color="info" variant="outlined" />
                      <Chip label="Vikram Rao (GM)" size="small" onClick={() => handleSelectQuickCode('REF-GM-102')} clickable color="info" variant="outlined" />
                      <Chip label="Priya Sharma (SM)" size="small" onClick={() => handleSelectQuickCode('REF-SM-103')} clickable color="info" variant="outlined" />
                      <Chip label="Direct / Board (DIR)" size="small" onClick={() => handleSelectQuickCode('REF-DIR-100')} clickable color="info" variant="outlined" />
                    </Stack>
                  </Box>

                  {/* Verification Results */}
                  {lookupResult && (
                    <Box sx={{ mt: 2 }}>
                      {lookupResult.valid ? (
                        <Card sx={{ bgcolor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 2 }}>
                          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <CheckCircleIcon sx={{ color: '#059669', fontSize: 32 }} />
                              <Box>
                                <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#065f46' }}>
                                  Verified Sponsor: {lookupResult.sponsorName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#047857' }}>
                                  Cadre: <strong>{lookupResult.sponsorCadre ? CADRE_DISPLAY_NAMES[lookupResult.sponsorCadre as CadreLevel] || lookupResult.sponsorCadre : 'Senior Leader'}</strong> • Branch: {lookupResult.sponsorBranch || 'Main Hub'}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>{lookupResult.error}</Alert>
                      )}
                    </Box>
                  )}
                </Paper>
              </>
            )}

            {/* Section 3: Personal & Contact Information */}
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
              <PersonIcon color="primary" /> 3. Personal & Contact Details
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Phone Number"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Linked to your authenticated login"
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Operating City / Region"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned Branch / Hub"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
            </Grid>

            {/* Section 4: KYC & Payout Details */}
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
              <AccountBalanceIcon color="primary" /> 4. KYC & Payout Information (Optional)
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Card Number"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Card Number"
                  placeholder="12-digit Aadhaar No"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Number"
                  placeholder="For Direct Commission Payouts"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank IFSC Code"
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                />
              </Grid>
            </Grid>

            {/* Submit Actions */}
            <Box sx={{ pt: 3, borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                sx={{
                  py: 1.6,
                  px: 4.5,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(30, 64, 175, 0.35)',
                }}
              >
                {isSubmitting ? 'Registering Profile...' : 'Submit Profile & Continue'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ProfileRegistrationPage;

