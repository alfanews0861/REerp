import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';

import { useAuthContext, updateUserProfileDetails } from '@real-estate-erp/firebase';
import { CADRE_DISPLAY_NAMES, CadreLevel } from '@real-estate-erp/types';
import { printIdCardDocument } from './OfficialIdCardPrint';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Preset photo options if user wants quick high-quality avatar
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
];

export const UserProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Edit Profile Modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(user?.photoURL || '');
  const [editCity, setEditCity] = useState(user?.kycDetails?.city || 'Hyderabad');
  const [editBranch, setEditBranch] = useState(user?.kycDetails?.branch || 'Hyderabad Main Hub');
  const [editAddress, setEditAddress] = useState(user?.kycDetails?.address || '');
  const [editEmergency, setEditEmergency] = useState(user?.kycDetails?.emergencyContact || '');
  const [editPan, setEditPan] = useState(user?.kycDetails?.panNumber || '');
  const [editAadhar, setEditAadhar] = useState(user?.kycDetails?.aadharNumber || '');
  const [editBankName, setEditBankName] = useState(user?.kycDetails?.bankName || '');
  const [editBankAccount, setEditBankAccount] = useState(user?.kycDetails?.bankAccount || '');
  const [editIfsc, setEditIfsc] = useState(user?.kycDetails?.ifscCode || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync edit states when user changes
  React.useEffect(() => {
    if (user) {
      setEditName(user.displayName || '');
      setEditPhone(user.phoneNumber || '');
      setEditPhotoUrl(user.photoURL || '');
      setEditCity(user.kycDetails?.city || 'Hyderabad');
      setEditBranch(user.kycDetails?.branch || 'Hyderabad Main Hub');
      setEditAddress(user.kycDetails?.address || '');
      setEditEmergency(user.kycDetails?.emergencyContact || '');
      setEditPan(user.kycDetails?.panNumber || '');
      setEditAadhar(user.kycDetails?.aadharNumber || '');
      setEditBankName(user.kycDetails?.bankName || '');
      setEditBankAccount(user.kycDetails?.bankAccount || '');
      setEditIfsc(user.kycDetails?.ifscCode || '');
    }
  }, [user]);

  const referralCode = user?.referralCode || `REF-${(user?.uid || 'USER').substring(0, 6).toUpperCase()}`;
  const referralLink = `https://reerp-website.web.app/join?ref=${referralCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(referralLink)}`;

  const cadreLabel = user?.cadre
    ? CADRE_DISPLAY_NAMES[user.cadre as CadreLevel] || user.cadre.toUpperCase()
    : (user?.role || 'ASSOCIATE').replace('_', ' ').toUpperCase();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`${label} copied to clipboard!`);
  };

  const handlePrintCard = () => {
    printIdCardDocument(user);
  };

  const handleShareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.displayName || 'Associate'} - RealEstate ERP ID Card`,
          text: `Connect with ${user?.displayName} (${cadreLabel}) on Prime Real Estate ERP. Referral Code: ${referralCode}`,
          url: referralLink,
        });
      } catch {
        handleCopy(referralLink, 'Referral Link');
      }
    } else {
      handleCopy(referralLink, 'Referral Link');
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      await updateUserProfileDetails(user.uid, {
        displayName: editName.trim(),
        phoneNumber: editPhone.trim() || undefined,
        photoURL: editPhotoUrl.trim() || undefined,
        kycDetails: {
          city: editCity.trim() || 'Hyderabad',
          branch: editBranch.trim() || 'Hyderabad Main Hub',
          address: editAddress.trim() || undefined,
          emergencyContact: editEmergency.trim() || undefined,
          panNumber: editPan.trim().toUpperCase() || undefined,
          aadharNumber: editAadhar.trim() || undefined,
          bankName: editBankName.trim() || undefined,
          bankAccount: editBankAccount.trim() || undefined,
          ifscCode: editIfsc.trim().toUpperCase() || undefined,
        },
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      setSaveSuccessMsg('Profile details updated successfully!');
      setOpenEditModal(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', pb: 6 }}>
      {/* Top Welcome & Summary Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Watermark Decoration */}
        <Box
          sx={{
            position: 'absolute',
            right: -20,
            bottom: -30,
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <BusinessIcon sx={{ fontSize: 240, color: '#fff' }} />
        </Box>

        <Grid container spacing={3} alignItems="center">
          {/* User Photo / Avatar */}
          <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user?.photoURL}
                alt={user?.displayName || 'User Photo'}
                sx={{
                  width: { xs: 96, sm: 112 },
                  height: { xs: 96, sm: 112 },
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  bgcolor: '#2563eb',
                  border: '4px solid #f59e0b',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                }}
              >
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Tooltip title="Update Profile Photo">
                <IconButton
                  size="small"
                  onClick={() => setOpenEditModal(true)}
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    bgcolor: '#f59e0b',
                    color: '#000',
                    '&:hover': { bgcolor: '#fbbf24' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* User Info Details */}
          <Grid item xs={12} sm>
            <Stack spacing={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'center', sm: 'center' }}
                flexWrap="wrap"
              >
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                  {user?.displayName || 'Official Associate'}
                </Typography>
                <Chip
                  icon={<VerifiedUserIcon sx={{ fontSize: '1rem !important', color: '#10b981 !important' }} />}
                  label="VERIFIED MEMBER"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  icon={<MilitaryTechIcon sx={{ color: '#f59e0b !important', fontSize: '1.1rem !important' }} />}
                  label={cadreLabel}
                  size="small"
                  sx={{
                    bgcolor: '#f59e0b',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
                <Chip
                  label={user?.role?.replace('_', ' ').toUpperCase() || 'SALES EXECUTIVE'}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: '#93c5fd',
                    borderColor: '#3b82f6',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
                <Chip
                  icon={<LocationOnIcon sx={{ color: '#cbd5e1 !important', fontSize: '0.9rem !important' }} />}
                  label={user?.kycDetails?.city || 'Hyderabad'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: '#e2e8f0',
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
              </Stack>

              {/* Reference Code & Actions Row */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'center', sm: 'center' }}
                sx={{ pt: 1 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    border: '1px dashed rgba(245, 158, 11, 0.6)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>
                    MY REFERENCE CODE:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                    {referralCode}
                  </Typography>
                  <Tooltip title="Copy Referral Code">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(referralCode, 'Referral Code')}
                      sx={{ color: '#fbbf24', p: 0.3 }}
                    >
                      <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditModal(true)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  }}
                >
                  Edit Profile Info
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.9rem',
              py: 2,
              textTransform: 'none',
            },
          }}
        >
          <Tab icon={<BadgeIcon />} iconPosition="start" label="Digital ID Card" />
          <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Details" />
          <Tab icon={<BusinessIcon />} iconPosition="start" label="Cadre & Hierarchy" />
          <Tab icon={<AccountBalanceIcon />} iconPosition="start" label="KYC & Banking" />
        </Tabs>

        {/* Tab 1: Digital Associate ID Card */}
        <CustomTabPanel value={activeTab} index={0}>
          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            {/* The ID Card Display Container (Sized strictly for mobile screen containment) */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* ID Card Wrapper with strict responsive viewport limits */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '340px', // Perfect standard ID Card width for mobile viewport
                  minHeight: '480px',
                  maxHeight: 'calc(100vh - 120px)', // NEVER exceed the screen height!
                  perspective: '1000px',
                  mx: 'auto',
                }}
              >
                {/* ID Card Outer Shell */}
                <Box
                  id="printable-id-card"
                  sx={{
                    width: '100%',
                    bgcolor: '#0f172a',
                    borderRadius: '20px',
                    boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    p: 2.5,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    background: isFlipped
                      ? 'linear-gradient(165deg, #1e293b 0%, #0f172a 60%, #1e1b4b 100%)'
                      : 'linear-gradient(165deg, #090d16 0%, #0f172a 40%, #1e3a8a 100%)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {/* Top Golden Ribbon / Accent */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                    }}
                  />

                  {/* FRONT SIDE VIEW */}
                  {!isFlipped ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Card Header */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1.5,
                              bgcolor: '#f59e0b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                            }}
                          >
                            <BusinessIcon sx={{ color: '#0f172a', fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={900}
                              sx={{ lineHeight: 1.1, letterSpacing: '0.5px', color: '#ffffff' }}
                            >
                              PRIME ESTATES
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '1px' }}
                            >
                              OFFICIAL ASSOCIATE
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          icon={<FingerprintIcon sx={{ fontSize: '0.8rem !important', color: '#10b981 !important' }} />}
                          label="ACTIVE"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            fontWeight: 800,
                            borderRadius: 1,
                          }}
                        />
                      </Stack>

                      {/* Photo Section */}
                      <Box sx={{ textAlign: 'center', my: 1 }}>
                        <Box sx={{ display: 'inline-block', position: 'relative' }}>
                          <Avatar
                            src={user?.photoURL}
                            alt={user?.displayName || 'User Photo'}
                            sx={{
                              width: 88,
                              height: 88,
                              mx: 'auto',
                              border: '3px solid #f59e0b',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                              bgcolor: '#2563eb',
                              fontSize: '2rem',
                              fontWeight: 800,
                            }}
                          >
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                          </Avatar>
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -2,
                              right: 4,
                              bgcolor: '#10b981',
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              border: '2px solid #0f172a',
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ mt: 1.2, color: '#ffffff', lineHeight: 1.2 }}
                        >
                          {user?.displayName || 'Associate Name'}
                        </Typography>

                        <Chip
                          label={cadreLabel}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor: '#f59e0b',
                            color: '#0f172a',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            height: 22,
                            borderRadius: 1,
                          }}
                        />
                      </Box>

                      {/* Details Box */}
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          p: 1.5,
                          my: 1.5,
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block' }}>
                              ASSOCIATE ID
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.8rem' }}>
                              {referralCode}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block' }}>
                              MOBILE NO
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.8rem' }}>
                              {user?.phoneNumber || '+91 98480 12345'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block' }}>
                              BRANCH / HUB
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.75rem' }}>
                              {user?.kycDetails?.branch || 'Hyderabad Hub'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', display: 'block' }}>
                              VALID THRU
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.75rem' }}>
                              DEC 2028
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* QR Code & Scan Footer */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          bgcolor: 'rgba(0, 0, 0, 0.3)',
                          p: 1.2,
                          borderRadius: 2,
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                      >
                        <Box
                          component="img"
                          src={qrCodeUrl}
                          alt="Scan QR"
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: '#ffffff',
                            p: 0.5,
                            borderRadius: 1.5,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#fbbf24',
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              display: 'block',
                              lineHeight: 1.2,
                            }}
                          >
                            SCAN TO VERIFY / JOIN
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>
                            Instant Referral Onboarding
                          </Typography>
                        </Box>
                        <SecurityIcon sx={{ color: '#f59e0b', fontSize: 24, opacity: 0.7 }} />
                      </Stack>
                    </Box>
                  ) : (
                    /* BACK SIDE VIEW */
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      {/* Security Bar */}
                      <Box>
                        <Box
                          sx={{
                            height: 24,
                            bgcolor: '#000000',
                            mx: -2.5,
                            mt: 0.5,
                            mb: 2,
                            borderTop: '1px solid #334155',
                            borderBottom: '1px solid #334155',
                          }}
                        />
                        
                        <Typography
                          variant="caption"
                          sx={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.5px' }}
                        >
                          TERMS & CARD POLICY
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#cbd5e1',
                            fontSize: '0.62rem',
                            display: 'block',
                            lineHeight: 1.3,
                            mt: 0.5,
                          }}
                        >
                          • This card confirms official association with Prime Real Estate Group.
                          <br />
                          • Non-transferable. Valid across all projects, booking desks, and site visits.
                          <br />
                          • If found, please return to the nearest company branch or call support.
                        </Typography>
                      </Box>

                      {/* Emergency & Sponsor Info */}
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          p: 1.5,
                          my: 1,
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', display: 'block' }}>
                          REPORTING LEADER / SPONSOR
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.75rem' }}>
                          {user?.referredByName || 'Direct Corporate Board'}
                        </Typography>

                        <Divider sx={{ my: 0.8, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', display: 'block' }}>
                          EMERGENCY CONTACT
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f87171', fontSize: '0.75rem' }}>
                          {user?.kycDetails?.emergencyContact || '+91 98480 99999'}
                        </Typography>
                      </Box>

                      {/* Head Office & Signatory */}
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.58rem', display: 'block' }}>
                              HEAD OFFICE:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#e2e8f0', fontSize: '0.58rem', display: 'block' }}>
                              Financial District, Gachibowli, Hyderabad
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#fbbf24', fontSize: '0.58rem' }}>
                              www.primeestates.com | +91 98480 11111
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                borderBottom: '1px solid #f59e0b',
                                pb: 0.3,
                                px: 1,
                                fontStyle: 'italic',
                                fontFamily: 'cursive',
                                fontSize: '0.85rem',
                                color: '#f59e0b',
                              }}
                            >
                              Satyadev V.
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: '#94a3b8' }}>
                              Authorized Signatory
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* ID Card Action Buttons */}
              <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, width: '100%', maxWidth: '340px' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FlipCameraAndroidIcon />}
                  onClick={() => setIsFlipped(!isFlipped)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    '&:hover': { borderColor: '#0f172a', bgcolor: '#f8fafc' },
                  }}
                >
                  {isFlipped ? 'Show Front' : 'Flip to Back'}
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShareIcon />}
                  onClick={handleShareCard}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: '#2563eb',
                    '&:hover': { bgcolor: '#1d4ed8' },
                  }}
                >
                  Share ID
                </Button>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, width: '100%', maxWidth: '340px' }}>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  startIcon={<PrintIcon />}
                  onClick={handlePrintCard}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#475569' }}
                >
                  Print ID Card
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleCopy(referralLink, 'Digital Card QR Link')}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#475569' }}
                >
                  Copy QR Link
                </Button>
              </Stack>
            </Grid>

            {/* Quick Overview & Usage Guide */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 2.5, bgcolor: '#f8fafc', mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" gutterBottom>
                    Digital Associate Card Features
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          Mobile Screen Optimized
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Perfect 340px portrait proportion. Fits cleanly inside any smartphone screen without scrolling or cropping.
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <QrCode2Icon sx={{ color: 'primary.main', fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          Live Referral QR Code
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Clients and downline agents can scan the QR code to enroll directly under your reference code: <strong>{referralCode}</strong>.
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <VerifiedUserIcon sx={{ color: 'warning.main', fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          Official Authorization
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Shows your appointed Cadre (<strong>{cadreLabel}</strong>), official branch hub, and authorized signatory.
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Direct Sponsor & Lead Share Banner */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: '#eff6ff',
                  borderColor: '#bfdbfe',
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} color="#1e40af" gutterBottom>
                  Your Associate Direct Enrollment Link:
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={referralLink}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleCopy(referralLink, 'Enrollment Link')}
                        sx={{ color: 'primary.main' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                  sx={{ bgcolor: '#fff', mt: 1 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab 2: Personal Details */}
        <CustomTabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    FULL DISPLAY NAME
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.displayName || 'Not Set'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    REGISTERED EMAIL
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.email || 'Not Set'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    PHONE NUMBER
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.phoneNumber || 'Not Set'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    OPERATING CITY / REGION
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.city || 'Hyderabad'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    PERMANENT ADDRESS
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.address || 'Plot No. 12, Sri Nagar Colony, Hyderabad'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    EMERGENCY CONTACT
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#ef4444" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.emergencyContact || '+91 98480 99999'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditModal(true)}
                  sx={{ fontWeight: 700, px: 3 }}
                >
                  Edit Personal Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab 3: Cadre & Hierarchy Network */}
        <CustomTabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#fffbeb', borderColor: '#fde68a' }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MilitaryTechIcon sx={{ color: '#f59e0b', fontSize: 36 }} />
                    <Box>
                      <Typography variant="caption" color="#92400e" fontWeight={800}>
                        CURRENT CADRE LEVEL
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#78350f">
                        {cadreLabel}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="#b45309" sx={{ mt: 1, display: 'block' }}>
                    Assigned By: <strong>{user?.assignedCadreByName || user?.appointedByName || 'Corporate Management'}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <BusinessIcon sx={{ color: '#16a34a', fontSize: 36 }} />
                    <Box>
                      <Typography variant="caption" color="#166534" fontWeight={800}>
                        REPORTING UPLINE / SPONSOR
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#14532d">
                        {user?.referredByName || 'Corporate Board'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="#15803d" sx={{ mt: 1, display: 'block' }}>
                    Sponsor Code: <strong>{user?.referredByCode || 'REF-DIR-100'}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    COMPENSATION MODEL
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.compensationType || 'COMMISSION BASED (CADRE SLABS)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Direct commission payouts calculated automatically upon plot booking confirmations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    ASSIGNED BRANCH HUB
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.branch || 'Hyderabad Main Hub'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Registered under regional zonal division.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Tab 4: KYC & Banking Information */}
        <CustomTabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      PAN CARD NUMBER
                    </Typography>
                    <Chip label="VERIFIED" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.panNumber || 'ABCDE1234F'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      AADHAAR NUMBER
                    </Typography>
                    <Chip label="VERIFIED" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.aadharNumber
                      ? `XXXX-XXXX-${user.kycDetails.aadharNumber.slice(-4)}`
                      : 'XXXX-XXXX-8921'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    BANK NAME & BRANCH
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.bankName || 'HDFC Bank, Gachibowli Branch'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>
                    ACCOUNT NUMBER & IFSC
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ mt: 0.5 }}>
                    {user?.kycDetails?.bankAccount || '50100234891023'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    IFSC: {user?.kycDetails?.ifscCode || 'HDFC0001234'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditModal(true)}
                  sx={{ fontWeight: 700, px: 3 }}
                >
                  Update KYC & Bank Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Paper>

      {/* Edit Profile Modal Dialog */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
          Edit Profile & KYC Details
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {/* Photo Selection / Upload */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a" gutterBottom>
                Profile Photo / Avatar
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={editPhotoUrl}
                  sx={{ width: 64, height: 64, border: '2px solid #f59e0b', fontSize: '1.5rem', fontWeight: 800 }}
                >
                  {editName ? editName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ textTransform: 'none', fontWeight: 700, mb: 1 }}
                  >
                    Upload Photo from Device
                    <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                  </Button>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or enter Image URL (https://...)"
                    value={editPhotoUrl}
                    onChange={(e) => setEditPhotoUrl(e.target.value)}
                  />
                </Box>
              </Stack>

              {/* Preset Avatars */}
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Or choose a preset profile picture:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  {PRESET_AVATARS.map((url, idx) => (
                    <Avatar
                      key={idx}
                      src={url}
                      onClick={() => setEditPhotoUrl(url)}
                      sx={{
                        width: 34,
                        height: 34,
                        cursor: 'pointer',
                        border: editPhotoUrl === url ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        opacity: editPhotoUrl === url ? 1 : 0.7,
                        '&:hover': { opacity: 1 },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>

            <Divider />

            {/* Personal Details */}
            <TextField
              fullWidth
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City / Region"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Branch / Hub"
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Permanent Address"
              multiline
              rows={2}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />

            <Divider />

            {/* KYC & Banking */}
            <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
              KYC & Bank Account Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Card Number"
                  value={editPan}
                  onChange={(e) => setEditPan(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Card Number"
                  value={editAadhar}
                  onChange={(e) => setEditAadhar(e.target.value)}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Bank Name"
              value={editBankName}
              placeholder="e.g. HDFC Bank"
              onChange={(e) => setEditBankName(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Number"
                  value={editBankAccount}
                  onChange={(e) => setEditBankAccount(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank IFSC Code"
                  value={editIfsc}
                  onChange={(e) => setEditIfsc(e.target.value.toUpperCase())}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditModal(false)} sx={{ fontWeight: 600, color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isSaving || !editName.trim()}
            onClick={handleSaveProfile}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {isSaving ? 'Saving Changes...' : 'Save Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar alerts */}
      <Snackbar
        open={Boolean(copySuccess || saveSuccessMsg)}
        autoHideDuration={3000}
        onClose={() => {
          setCopySuccess(null);
          setSaveSuccessMsg(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontWeight: 700, borderRadius: 2 }}>
          {copySuccess || saveSuccessMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfilePage;
