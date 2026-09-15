import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthContext, signInWithGoogle } from '@real-estate-erp/firebase';
import { CustomerAuthModal } from '../../components/CustomerAuthModal';
import { CustomerVehicleTrackerModal } from '../../components/CustomerVehicleTrackerModal';

interface CustomerProfileData {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  kycStatus: 'VERIFIED' | 'PENDING';
  registeredSince: string;
  assignedAdvisor: {
    name: string;
    phone: string;
    cadre: string;
  };
  bookings: Array<{
    bookingNumber: string;
    projectName: string;
    approval: string;
    location: string;
    plotNumber: string;
    areaSqYards: number;
    facing: string;
    dimensions: string;
    baseRatePerSqYd: number;
    totalAmount: number;
    amountPaid: number;
    status: string;
    allotmentDate: string;
    paymentSchedule: Array<{
      milestone: string;
      amountDue: number;
      dueDate: string;
      status: 'PAID' | 'DUE' | 'UPCOMING';
    }>;
  }>;
  receipts: Array<{
    receiptNumber: string;
    date: string;
    amount: number;
    paymentMode: string;
    txnRef: string;
    plotNumber: string;
    projectName: string;
  }>;
  documents: Array<{
    title: string;
    docType: string;
    issueDate: string;
    fileSize: string;
  }>;
  siteVisits: Array<{
    id: string;
    ventureName: string;
    date: string;
    time: string;
    travelMode: string;
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    status: string;
  }>;
  enquiries: Array<{
    id: string;
    subject: string;
    venture: string;
    date: string;
    status: string;
    response: string;
  }>;
}

const DEFAULT_PORTFOLIO: CustomerProfileData = {
  customerId: 'ISK-CUST-8891',
  name: 'Rajesh Sharma',
  phone: '+91 98480 22338',
  email: 'rajesh.sharma@example.com',
  address: 'Flat 402, Sai Balaji Enclave, Magunta Layout, Nellore - 524003',
  kycStatus: 'VERIFIED',
  registeredSince: '14-Jul-2025',
  assignedAdvisor: {
    name: 'K. Srinivasulu',
    phone: '+91 98480 22334',
    cadre: 'Senior Sales Manager (సీనియర్ సేల్స్ మేనేజర్)',
  },
  bookings: [
    {
      bookingNumber: 'BKG-2026-001',
      projectName: 'ISKON City - 2',
      approval: 'NUDA Approved (L.P. No: 42/2023)',
      location: 'Podalakur Road, Mattempadu, Nellore',
      plotNumber: 'Plot No. 12',
      areaSqYards: 267,
      facing: 'East Facing (తూర్పు ముఖం - 100% Vaastu)',
      dimensions: '40\' 0" x 60\' 0"',
      baseRatePerSqYd: 11500,
      totalAmount: 3070500,
      amountPaid: 1500000,
      status: 'ACTIVE_AGREEMENT_COMPLETED',
      allotmentDate: '01-Sep-2026',
      paymentSchedule: [
        { milestone: 'Token Advance (బుకింగ్ టోకెన్)', amountDue: 200000, dueDate: '01-Sep-2026', status: 'PAID' },
        { milestone: 'Agreement Allotment (అగ్రిమెంట్)', amountDue: 1300000, dueDate: '04-Sep-2026', status: 'PAID' },
        { milestone: 'Development Milestone (డెవలప్‌మెంట్ డ్యూ)', amountDue: 1000000, dueDate: '15-Oct-2026', status: 'DUE' },
        { milestone: 'Final Registration & Handover', amountDue: 570500, dueDate: '30-Nov-2026', status: 'UPCOMING' },
      ],
    },
  ],
  receipts: [
    {
      receiptNumber: 'REC-2026-081',
      date: '01-Sep-2026',
      amount: 200000,
      paymentMode: 'UPI / PhonePe',
      txnRef: 'UPI/9848022338/928371',
      plotNumber: 'Plot No. 12',
      projectName: 'ISKON City - 2',
    },
    {
      receiptNumber: 'REC-2026-082',
      date: '04-Sep-2026',
      amount: 1300000,
      paymentMode: 'NEFT / HDFC Bank Escrow',
      txnRef: 'NEFT-HDFC-0019284',
      plotNumber: 'Plot No. 12',
      projectName: 'ISKON City - 2',
    },
  ],
  documents: [
    {
      title: 'Provisional Plot Allotment Letter (తాత్కాలిక కేటాయింపు పత్రం)',
      docType: 'Official Company Letter',
      issueDate: '01-Sep-2026',
      fileSize: '1.4 MB PDF',
    },
    {
      title: 'NUDA Approved Master Layout Map (L.P. No 42/2023)',
      docType: 'Statutory Approval Copy',
      issueDate: '15-May-2024',
      fileSize: '3.8 MB PDF',
    },
    {
      title: 'Clear Title Deed & Encumbrance Certificate (EC Summary)',
      docType: 'Legal Verification',
      issueDate: '10-Aug-2026',
      fileSize: '2.1 MB PDF',
    },
    {
      title: 'ISKON City - 2 Official Venture Brochure & Amenities Guide',
      docType: 'Project Brochure',
      issueDate: '01-Aug-2026',
      fileSize: '4.5 MB PDF',
    },
  ],
  siteVisits: [
    {
      id: 'SV-2026-104',
      ventureName: 'ISKON City - 2 (Podalakur Road)',
      date: '28-Aug-2026',
      time: '10:30 AM',
      travelMode: 'Company AC Cab (Doorstep Pickup)',
      vehicleNumber: 'AP 26 TE 1234 (Toyota Innova)',
      driverName: 'Ramesh (డ్రైవర్ రమేష్)',
      driverPhone: '+91 98480 22334',
      status: 'COMPLETED - PLOT SELECTED',
    },
    {
      id: 'SV-2026-089',
      ventureName: 'Dream City (Nellore-Bombay Highway)',
      date: '15-Jul-2026',
      time: '04:00 PM',
      travelMode: 'Executive Car',
      vehicleNumber: 'AP 26 BH 5678 (Maruti Ertiga)',
      driverName: 'Suresh',
      driverPhone: '+91 98480 22334',
      status: 'COMPLETED - EXPLORATORY',
    },
  ],
  enquiries: [
    {
      id: 'ENQ-901',
      subject: 'Inquiry regarding 40ft road commercial corner plots in Phase 2',
      venture: 'ISKON City - 2',
      date: '25-Aug-2026',
      status: 'RESOLVED',
      response: 'Senior Advisor shared commercial pricing and scheduled doorstep AC Cab site visit.',
    },
    {
      id: 'ENQ-745',
      subject: 'Request for DTCP layout approval order and bank loan tie-up list',
      venture: 'Dream City',
      date: '10-Jul-2026',
      status: 'DOCUMENT_SHARED',
      response: 'SBI & HDFC approved project files dispatched to customer email & WhatsApp.',
    },
  ],
};

export const CustomerPortalPage: React.FC = () => {
  const { user, signOut } = useAuthContext();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Dynamic customer profile personalized to authenticated user
  const profile: CustomerProfileData = {
    ...DEFAULT_PORTFOLIO,
    name: user?.displayName || (user?.phoneNumber ? `Client (${user.phoneNumber})` : DEFAULT_PORTFOLIO.name),
    phone: user?.phoneNumber || DEFAULT_PORTFOLIO.phone,
    email: user?.email || DEFAULT_PORTFOLIO.email,
  };

  const handlePrintReceipt = (receipt: typeof DEFAULT_PORTFOLIO['receipts'][0]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.receiptNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; background: #f8fafc; }
          .receipt { border: 2px solid #1e3a8a; padding: 30px; border-radius: 12px; max-width: 680px; margin: auto; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 24px; color: #1e3a8a; letter-spacing: -0.5px; }
          .header p { margin: 4px 0 0; font-size: 11px; color: #64748b; font-weight: 600; }
          .badge { display: inline-block; padding: 4px 10px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; border-radius: 12px; margin-top: 8px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; line-height: 1.5; }
          .row strong { color: #334155; }
          .highlight { font-size: 20px; font-weight: 800; color: #047857; margin: 20px 0; padding: 14px; background: #f0fdf4; border: 1px dashed #10b981; border-radius: 8px; text-align: center; }
          .footer { margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
          .seal { text-align: right; }
          .seal-box { display: inline-block; border: 2px solid #1e3a8a; border-radius: 50%; width: 70px; height: 70px; line-height: 70px; text-align: center; font-size: 9px; font-weight: bold; color: #1e3a8a; }
          @media print { body { background: #ffffff; padding: 0; } .receipt { border: 1px solid #000; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>ISKON DEVELOPERS</h1>
            <p>NUDA & DTCP APPROVED GATED TOWNSHIPS | NELLORE, AP</p>
            <p>Corporate Office: RKRI Towers, Mini Byepass Road, Nellore - 524 004</p>
            <span class="badge">OFFICIAL PAYMENT RECEIPT (అధికారిక చెల్లింపు రసీదు)</span>
          </div>

          <div class="row">
            <span><strong>Receipt No:</strong> ${receipt.receiptNumber}</span>
            <span><strong>Date:</strong> ${receipt.date}</span>
          </div>
          <div class="row">
            <span><strong>Customer Name:</strong> ${profile.name}</span>
            <span><strong>Customer ID:</strong> ${profile.customerId}</span>
          </div>
          <div class="row">
            <span><strong>Project:</strong> ${receipt.projectName}</span>
            <span><strong>Plot No:</strong> ${receipt.plotNumber}</span>
          </div>
          <div class="row">
            <span><strong>Payment Mode:</strong> ${receipt.paymentMode}</span>
            <span><strong>Transaction Ref:</strong> ${receipt.txnRef}</span>
          </div>

          <div class="highlight">
            AMOUNT RECEIVED: ₹${receipt.amount.toLocaleString('en-IN')}
            <div style="font-size: 12px; font-weight: normal; color: #475569; margin-top: 4px;">Credited to Company Real Estate Escrow Account</div>
          </div>

          <div class="row" style="font-size: 11px; color: #64748b; font-style: italic;">
            * This is a computer-generated verified electronic receipt. Subject to bank realization for cheques/DDs.
          </div>

          <div class="footer">
            <div>
              <p style="margin: 0;">Authorized Signatory: <strong>ISKON Accounts Division</strong></p>
              <p style="margin: 3px 0 0;">Customer Care: +91 98480 22334</p>
            </div>
            <div class="seal">
              <div class="seal-box">SEAL / STAMP</div>
            </div>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadDoc = (docTitle: string) => {
    alert(`Downloading official verified copy of:\n"${docTitle}"\n\nGenerated for: ${profile.name} (${profile.customerId})`);
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '85vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* If user is NOT logged in: Show Privacy & Security Login Gateway */}
        {!user ? (
          <Box sx={{ maxWidth: 640, mx: 'auto', mt: { xs: 2, md: 4 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 36px -6px rgba(15, 23, 42, 0.08)',
                bgcolor: '#ffffff',
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  mb: 2.5,
                  borderRadius: '50%',
                  bgcolor: '#eef2ff',
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 36, color: '#1e3a8a' }} />
              </Box>

              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: '1rem !important', color: '#1e3a8a !important' }} />}
                label="ISKON SECURE CUSTOMER SERVICES"
                size="small"
                sx={{
                  bgcolor: '#e0e7ff',
                  color: '#1e3a8a',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  mb: 2,
                  py: 1.6,
                }}
              />

              <Typography variant="h4" fontWeight={800} color="#0f172a" gutterBottom sx={{ fontSize: { xs: '1.4rem', sm: '1.85rem' } }}>
                Customer Portal Login (కస్టమర్ పోర్టల్ లాగిన్)
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6, px: { xs: 1, sm: 2 } }}>
                మీ ప్లాట్ బుకింగ్ సమాచారం, అధికారిక పేమెంట్ రసీదులు, రిజిస్ట్రేషన్ లీగల్ కాపీలు మరియు సైట్ విజిట్ వివరాల గోప్యతను కాపాడేందుకు లాగిన్ తప్పనిసరి.
              </Typography>

              <Stack spacing={2} sx={{ maxWidth: 380, mx: 'auto', mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => signInWithGoogle()}
                  startIcon={
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  }
                  sx={{
                    py: 1.3,
                    bgcolor: '#ffffff',
                    color: '#1e293b',
                    border: '1.5px solid #cbd5e1',
                    boxShadow: 'none',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    borderRadius: 2.5,
                    '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' },
                  }}
                >
                  Sign in with Google
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color="primary"
                  onClick={() => setAuthModalOpen(true)}
                  startIcon={<PhoneIcon />}
                  sx={{
                    py: 1.3,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    borderRadius: 2.5,
                    bgcolor: '#1e3a8a',
                    '&:hover': { bgcolor: '#172554' },
                  }}
                >
                  Login with Mobile OTP (ఫోన్ ఓటీపీ లాగిన్)
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  100% SECURE & RERA COMPLIANT
                </Typography>
              </Divider>

              <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                    <Typography variant="caption" fontWeight={600} color="#334155">
                      Strict Privacy Control
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                    <Typography variant="caption" fontWeight={600} color="#334155">
                      Verified Escrow Receipts
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                    <Typography variant="caption" fontWeight={600} color="#334155">
                      NUDA/DTCP Approved
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        ) : (
          /* AUTHENTICATED CUSTOMER PORTFOLIO DASHBOARD */
          <Box>
            {/* Header Profile Banner */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                mb: 3.5,
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                color: '#ffffff',
                boxShadow: '0 10px 30px -5px rgba(30, 58, 138, 0.25)',
              }}
            >
              <Grid container spacing={2.5} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={7}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: { xs: 56, md: 68 },
                        height: { xs: 56, md: 68 },
                        bgcolor: '#3b82f6',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        border: '3px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.3 }}>
                          {profile.name}
                        </Typography>
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important', color: '#10b981 !important' }} />}
                          label={profile.kycStatus}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.2)',
                            color: '#a7f3d0',
                            fontWeight: 700,
                            fontSize: '0.68rem',
                            height: 22,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ color: '#93c5fd', fontSize: '0.82rem' }}>
                        Customer ID: <strong>{profile.customerId}</strong> • Member since {profile.registeredSince}
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} sx={{ mt: 1, color: '#cbd5e1', fontSize: '0.78rem' }}>
                        <span>📞 {profile.phone}</span>
                        <span>✉️ {profile.email}</span>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      maxWidth: 320,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 700, display: 'block', mb: 0.3 }}>
                      YOUR ASSIGNED RELATIONSHIP ADVISOR
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="#ffffff">
                      {profile.assignedAdvisor.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block' }}>
                      {profile.assignedAdvisor.cadre}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#67e8f9', mt: 0.5 }}>
                      📞 {profile.assignedAdvisor.phone}
                    </Typography>
                  </Paper>

                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => signOut()}
                    startIcon={<LogoutIcon fontSize="small" />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: '#fca5a5',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      mt: 0.5,
                      '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                    }}
                  >
                    Logout from Customer Portal
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Quick KPI Counters */}
            <Grid container spacing={2} sx={{ mb: 3.5 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      BOOKED PLOTS (ప్లాట్లు)
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#1e3a8a">
                      {profile.bookings.length} Unit
                    </Typography>
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                      {profile.bookings[0]?.projectName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      TOTAL AMOUNT (మొత్తం ధర)
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#0f172a">
                      ₹{(profile.bookings[0]?.totalAmount / 100000).toFixed(2)}L
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{profile.bookings[0]?.baseRatePerSqYd.toLocaleString('en-IN')}/sq.yd
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card sx={{ borderRadius: 2.5, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="success.dark" fontWeight={700}>
                      TOTAL PAID (చెల్లించినది)
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="success.main">
                      ₹{(profile.bookings[0]?.amountPaid / 100000).toFixed(2)}L
                    </Typography>
                    <Typography variant="caption" color="success.dark" fontWeight={600}>
                      {profile.receipts.length} Official Receipts
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card sx={{ borderRadius: 2.5, border: '1px solid #fed7aa', bgcolor: '#fffbeb', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="caption" color="warning.dark" fontWeight={700}>
                      BALANCE DUE (మిగిలిన మొత్తం)
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="#d97706">
                      ₹{((profile.bookings[0]?.totalAmount - profile.bookings[0]?.amountPaid) / 100000).toFixed(2)}L
                    </Typography>
                    <Typography variant="caption" color="warning.dark">
                      Milestone Schedule Active
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Navigation Tabs */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    py: 1.8,
                    minHeight: 52,
                  },
                }}
              >
                <Tab icon={<LocationOnIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="My Plots & Schedule (నా ప్లాట్ బుకింగ్స్)" />
                <Tab icon={<ReceiptLongIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Official Receipts (${profile.receipts.length})`} />
                <Tab icon={<DescriptionIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Documents & Deeds (${profile.documents.length})`} />
                <Tab icon={<DirectionsCarIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Site Visits (${profile.siteVisits.length})`} />
                <Tab icon={<QuestionAnswerIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Inquiries & Messages (ఎంక్వైరీలు)" />
                <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile Details (వివరాలు)" />
              </Tabs>

              {/* Tab 0: My Plots & Bookings */}
              {activeTab === 0 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {profile.bookings.map((b, idx) => (
                    <Card key={idx} variant="outlined" sx={{ borderRadius: 2.5, mb: 3, borderColor: '#cbd5e1' }}>
                      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="h6" fontWeight={800} color="#1e3a8a">
                                {b.projectName} - {b.plotNumber}
                              </Typography>
                              <Chip label={b.approval} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              📍 {b.location}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Chip label="ACTIVE BOOKING" color="success" size="small" sx={{ fontWeight: 800, mb: 0.5 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Allotted on {b.allotmentDate}
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3, bgcolor: '#f8fafc', p: 2, borderRadius: 2 }}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">Plot Extent (విస్తీర్ణం)</Typography>
                            <Typography variant="subtitle2" fontWeight={800}>{b.areaSqYards} Sq.Yards</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">Facing (దిశ / వాస్తు)</Typography>
                            <Typography variant="subtitle2" fontWeight={800}>{b.facing}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">Dimensions (కొలతలు)</Typography>
                            <Typography variant="subtitle2" fontWeight={800}>{b.dimensions}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">Base Rate (ధర)</Typography>
                            <Typography variant="subtitle2" fontWeight={800}>₹{b.baseRatePerSqYd.toLocaleString('en-IN')}/sq.yd</Typography>
                          </Grid>
                        </Grid>

                        {/* Payment Milestone Schedule */}
                        <Typography variant="subtitle2" fontWeight={800} color="#0f172a" gutterBottom>
                          Milestone Payment Schedule (చెల్లింపు షెడ్యూల్)
                        </Typography>
                        <Table size="small" sx={{ mb: 2 }}>
                          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>Milestone</TableCell>
                              <TableCell sx={{ fontWeight: 700 }} align="right">Amount Due</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                              <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {b.paymentSchedule.map((ps, i) => (
                              <TableRow key={i}>
                                <TableCell sx={{ fontWeight: 600 }}>{ps.milestone}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>₹{ps.amountDue.toLocaleString('en-IN')}</TableCell>
                                <TableCell>{ps.dueDate}</TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={ps.status}
                                    size="small"
                                    color={ps.status === 'PAID' ? 'success' : ps.status === 'DUE' ? 'warning' : 'default'}
                                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Tab 1: Official Receipts */}
              {activeTab === 1 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      Official Escrow Payment Receipts (అధికారిక చెల్లింపు రసీదులు)
                    </Typography>
                    <Chip label="100% Tax Compliant & Verified" size="small" color="success" sx={{ fontWeight: 700 }} />
                  </Box>

                  <Table size="medium">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Receipt No</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Payment Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Project / Plot</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Payment Mode & Ref</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Amount (₹)</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.receipts.map((r, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {r.receiptNumber}
                          </TableCell>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>{r.projectName} ({r.plotNumber})</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{r.paymentMode}</Typography>
                            <Typography variant="caption" color="text.secondary">{r.txnRef}</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: 'success.main', fontSize: '1rem' }}>
                            ₹{r.amount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<PrintIcon fontSize="small" />}
                              onClick={() => handlePrintReceipt(r)}
                              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                            >
                              Print Stamped Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Tab 2: Documents & Legal Deeds */}
              {activeTab === 2 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                    Official Legal Documents & Layout Approvals (లీగల్ పత్రాలు)
                  </Typography>

                  <Grid container spacing={2}>
                    {profile.documents.map((doc, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Card variant="outlined" sx={{ borderRadius: 2.5, borderColor: '#e2e8f0' }}>
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack direction="row" spacing={1.5} alignItems="flex-start">
                              <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, color: '#1d4ed8' }}>
                                <DescriptionIcon fontSize="medium" />
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.4 }}>
                                  {doc.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                  Type: <strong>{doc.docType}</strong> • Issued: {doc.issueDate}
                                </Typography>
                                <Typography variant="caption" color="primary.main" fontWeight={600}>
                                  File Size: {doc.fileSize}
                                </Typography>

                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<DownloadIcon fontSize="small" />}
                                    onClick={() => handleDownloadDoc(doc.title)}
                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                                  >
                                    Download Copy
                                  </Button>
                                </Box>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Tab 3: Site Visits */}
              {activeTab === 3 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      Site Visit History & Logistics (సైట్ విజిట్స్)
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<DirectionsCarIcon />}
                      onClick={() => setTrackerModalOpen(true)}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                    >
                      Track Live Cab (లైవ్ క్యాబ్ ట్రాకింగ్)
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {profile.siteVisits.map((sv, i) => (
                      <Card key={i} variant="outlined" sx={{ borderRadius: 2.5, borderColor: '#cbd5e1' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={800} color="#1e3a8a">
                                {sv.ventureName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                📅 Date: <strong>{sv.date}</strong> at <strong>{sv.time}</strong>
                              </Typography>
                            </Box>
                            <Chip label={sv.status} color="success" size="small" sx={{ fontWeight: 800 }} />
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Travel Mode</Typography>
                              <Typography variant="body2" fontWeight={700}>{sv.travelMode}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Vehicle Details</Typography>
                              <Typography variant="body2" fontWeight={700}>{sv.vehicleNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Chauffeur Contact</Typography>
                              <Typography variant="body2" fontWeight={700}>{sv.driverName} ({sv.driverPhone})</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Tab 4: Inquiries & Messages */}
              {activeTab === 4 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      My Inquiries & WhatsApp Communications (ఎంక్వైరీలు)
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => window.open(`https://wa.me/919848022334?text=Hello%20ISKON%20Developers,%20I%20am%20${encodeURIComponent(profile.name)}%20(ID:%20${profile.customerId}).`, '_blank')}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                    >
                      WhatsApp Relationship Manager
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {profile.enquiries.map((enq, i) => (
                      <Card key={i} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e2e8f0' }}>
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                              {enq.subject}
                            </Typography>
                            <Chip label={enq.status} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            Venture: {enq.venture} • Submitted on {enq.date}
                          </Typography>
                          <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, borderLeft: '3px solid #3b82f6' }}>
                            <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: 'block', mb: 0.3 }}>
                              OFFICIAL RESPONSE FROM ISKON DEVELOPERS:
                            </Typography>
                            <Typography variant="body2" color="#334155" sx={{ fontSize: '0.82rem' }}>
                              {enq.response}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Tab 5: Profile Details */}
              {activeTab === 5 && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 2 }}>
                    Customer Account & KYC Details (ఖాతా వివరాలు)
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>FULL NAME</Typography>
                        <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>{profile.name}</Typography>

                        <Typography variant="caption" color="text.secondary" fontWeight={700}>REGISTERED MOBILE NUMBER</Typography>
                        <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>{profile.phone}</Typography>

                        <Typography variant="caption" color="text.secondary" fontWeight={700}>EMAIL ADDRESS</Typography>
                        <Typography variant="body1" fontWeight={700}>{profile.email}</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>RESIDENTIAL ADDRESS</Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>{profile.address}</Typography>

                        <Typography variant="caption" color="text.secondary" fontWeight={700}>KYC VERIFICATION</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            Aadhaar & PAN KYC Verified (ఆధార్ & పాన్ ధృవీకరించబడింది)
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Customer Auth Modal */}
        <CustomerAuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        {/* Vehicle Tracker Modal */}
        <CustomerVehicleTrackerModal
          open={trackerModalOpen}
          onClose={() => setTrackerModalOpen(false)}
          defaultCustomerPhone={user?.phoneNumber || ''}
        />
      </Container>
    </Box>
  );
};
