import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface BookingRecord {
  bookingNumber: string;
  projectName: string;
  location: string;
  plotNumber: string;
  areaSqYards: number;
  facing: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  totalPaid: number;
  status: string;
  receipts: Array<{
    receiptNumber: string;
    date: string;
    amount: number;
    paymentMode: string;
    txnRef: string;
  }>;
}

const DEMO_BOOKINGS: Record<string, BookingRecord> = {
  '9848022338': {
    bookingNumber: 'BKG-2026-001',
    projectName: 'ISKON City - 2',
    location: 'Podalakur Road, Mattempadu, Nellore (NUDA Approved)',
    plotNumber: 'P-12',
    areaSqYards: 267,
    facing: 'East Facing (తూర్పు)',
    customerName: 'Rajesh Sharma',
    customerPhone: '+91 98480 22338',
    totalAmount: 2450000,
    totalPaid: 500000,
    status: 'ACTIVE_CONFIRMED',
    receipts: [
      {
        receiptNumber: 'REC-2026-081',
        date: '01-Sep-2026',
        amount: 200000,
        paymentMode: 'UPI',
        txnRef: 'UPI/9848022338/928371',
      },
      {
        receiptNumber: 'REC-2026-082',
        date: '04-Sep-2026',
        amount: 300000,
        paymentMode: 'NEFT / Bank Transfer',
        txnRef: 'NEFT-HDFC-0019284',
      },
    ],
  },
  '9440155667': {
    bookingNumber: 'BKG-2026-002',
    projectName: 'ISKON City - 2',
    location: 'Podalakur Road, Mattempadu, Nellore (NUDA Approved)',
    plotNumber: 'P-45',
    areaSqYards: 200,
    facing: 'North Facing (ఉత్తరం)',
    customerName: 'Suresh Verma',
    customerPhone: '+91 94401 55667',
    totalAmount: 1800000,
    totalPaid: 1800000,
    status: 'COMPLETED_FULL_PAID',
    receipts: [
      {
        receiptNumber: 'REC-2026-083',
        date: '20-Aug-2026',
        amount: 1800000,
        paymentMode: 'RTGS / SBI',
        txnRef: 'RTGS-SBIN-994821',
      },
    ],
  },
};

export const CustomerPortalPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    setSearched(true);
    if (DEMO_BOOKINGS[cleanPhone]) {
      setBooking(DEMO_BOOKINGS[cleanPhone]);
    } else {
      setBooking(null);
    }
  };

  const handlePrintReceipt = (receipt: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
          .receipt { border: 2px solid #0f172a; padding: 25px; border-radius: 8px; max-width: 650px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 22px; color: #1e3a8a; }
          .header p { margin: 4px 0 0; font-size: 11px; color: #64748b; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
          .highlight { font-size: 18px; font-weight: bold; color: #047857; margin: 15px 0; padding: 10px; background: #ecfdf5; border-radius: 6px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>ISKON DEVELOPERS & INFRA PVT LTD</h1>
            <p>NUDA & DTCP Approved Gated Townships • Nellore, Andhra Pradesh</p>
            <p>Head Office: RKRI Towers, Annamayya Circle, Nellore | Ph: +91 98480 12345</p>
          </div>
          <div class="row"><strong>Receipt No:</strong> ${receipt.receiptNumber}</div>
          <div class="row"><strong>Date:</strong> ${receipt.date}</div>
          <div class="row"><strong>Booking No:</strong> ${booking?.bookingNumber}</div>
          <div class="row"><strong>Customer Name:</strong> ${booking?.customerName}</div>
          <div class="row"><strong>Venture:</strong> ${booking?.projectName}</div>
          <div class="row"><strong>Plot Allotted:</strong> ${booking?.plotNumber} (${booking?.facing})</div>
          <div class="row"><strong>Payment Mode:</strong> ${receipt.paymentMode} (${receipt.txnRef})</div>
          <div class="highlight">Amount Received: ₹${receipt.amount.toLocaleString('en-IN')}/-</div>
          <div class="footer">
            <div>Printed On: ${new Date().toLocaleDateString('en-IN')}</div>
            <div>Authorized Accounts Signature</div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f8fafc', minHeight: '80vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            icon={<VerifiedIcon />}
            label="ISKON DEVELOPERS CUSTOMER SERVICES"
            color="primary"
            sx={{ fontWeight: 700, mb: 1 }}
          />
          <Typography variant="h4" fontWeight={800} gutterBottom color="text.primary">
            Customer Portal & Official Receipts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            కస్టమర్ పోర్టల్ • మీ ప్లాట్ బుకింగ్ వివరాలు & చెల్లింపు రసీదులు (Receipts) డౌన్‌లోడ్ చేసుకోండి.
          </Typography>
        </Box>

        {/* Search Card */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2.5 }}>
          <form onSubmit={handleSearch}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Enter Registered Mobile Number (రిజిస్టర్డ్ ఫోన్ నంబర్ నమోదు చేయండి):
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                fullWidth
                size="medium"
                placeholder="e.g. 9848022338 or 9440155667"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                sx={{ px: 4, fontWeight: 700, borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                Find My Booking
              </Button>
            </Stack>
          </form>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            * Demo verified customer numbers: <strong>9848022338</strong> (ISKON City - 2, Plot P-12) or <strong>9440155667</strong>
          </Typography>
        </Paper>

        {/* Results */}
        {searched && !booking && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            No booking record found for the entered mobile number. Please check the 10-digit number or contact Head Office helpline: <strong>+91 98480 12345</strong>.
          </Alert>
        )}

        {booking && (
          <Stack spacing={3}>
            {/* Booking Details Card */}
            <Card elevation={2} sx={{ borderRadius: 2.5, borderLeft: '6px solid #1e3a8a' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      BOOKING REF: {booking.bookingNumber}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="primary.main">
                      {booking.projectName} &bull; Plot {booking.plotNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="action" /> {booking.location}
                    </Typography>
                  </Box>
                  <Chip
                    label={booking.status === 'COMPLETED_FULL_PAID' ? 'Fully Paid & Registration Ready' : 'Active Installment Plan'}
                    color={booking.status === 'COMPLETED_FULL_PAID' ? 'success' : 'primary'}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Allotted Customer</Typography>
                    <Typography variant="body1" fontWeight={700}>{booking.customerName}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Dimensions</Typography>
                    <Typography variant="body1" fontWeight={700}>{booking.areaSqYards} Sq. Yds</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Facing Direction</Typography>
                    <Typography variant="body1" fontWeight={700}>{booking.facing}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                    <Typography variant="body1" fontWeight={700} color="error.main">
                      ₹{(booking.totalAmount - booking.totalPaid).toLocaleString('en-IN')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Official Receipts List */}
            <Card elevation={2} sx={{ borderRadius: 2.5 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptLongIcon color="primary" /> Official Payment Receipts (చెల్లింపు రసీదులు)
                </Typography>

                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Receipt No.</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Payment Mode</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booking.receipts.map((r) => (
                      <TableRow key={r.receiptNumber} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{r.receiptNumber}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.paymentMode}</Typography>
                          <Typography variant="caption" color="text.secondary">{r.txnRef}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                          ₹{r.amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PrintIcon fontSize="small" />}
                            onClick={() => handlePrintReceipt(r)}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
                          >
                            Print Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Container>
    </Box>
  );
};
