import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  Chip,
  Stack,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockClockIcon from '@mui/icons-material/LockClock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SecurityIcon from '@mui/icons-material/Security';
import { PublicPlot } from '../data/venturesData';
import { holdPlotOnline, OnlineBookingResult } from '../services/publicDataService';
import { numberToIndianWords } from '@real-estate-erp/utils';

interface TokenBookingModalProps {
  open: boolean;
  onClose: () => void;
  plot: PublicPlot | null;
  onBookingSuccess?: (result: OnlineBookingResult) => void;
}

const PRESET_TOKENS = [10000, 25000, 50000, 100000];

export const TokenBookingModal: React.FC<TokenBookingModalProps> = ({
  open,
  onClose,
  plot,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<'DETAILS' | 'PAYMENT' | 'CONFIRMED'>('DETAILS');
  const [tokenAmount, setTokenAmount] = useState<number>(25000);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPan, setCustomerPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState<OnlineBookingResult | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(599); // 10 min session

  useEffect(() => {
    if (open) {
      setStep('DETAILS');
      setTokenAmount(25000);
      setBookingResult(null);
      setSecondsRemaining(599);
    }
  }, [open, plot]);

  // Countdown timer for payment session
  useEffect(() => {
    if (step !== 'PAYMENT') return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!plot) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleProceedToPayment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your Full Name and Mobile Number.');
      return;
    }
    setStep('PAYMENT');
  };

  const handleSimulatePayment = async () => {
    try {
      setIsProcessing(true);
      // Simulate real gateway processing delay
      const delay = process.env.NODE_ENV === 'test' ? 10 : 1200;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const res = await holdPlotOnline({
        plotId: plot.id,
        plotNumber: plot.plotNumber,
        projectId: plot.projectId,
        projectName: plot.projectName,
        customerName,
        customerPhone,
        customerEmail,
        customerPan,
        tokenAmount,
        paymentMethod,
        transactionRef: `UPI/${customerPhone.slice(-4)}/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      setBookingResult(res);
      setStep('CONFIRMED');
      if (onBookingSuccess) {
        onBookingSuccess(res);
      }
    } catch {
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintBookingReceipt = () => {
    if (!bookingResult) return;
    const printWindow = window.open('', '_blank', 'width=850,height=700');
    if (printWindow) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Online Booking Slip - ${bookingResult.bookingNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; }
            .box { border: 2px solid #0f172a; border-radius: 8px; padding: 24px; max-width: 650px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; text-align: center; }
            .header h1 { font-size: 20px; margin: 0; color: #0f172a; }
            .header p { font-size: 11px; color: #64748b; margin-top: 4px; }
            .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-top: 8px; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; }
            .highlight { background: #eff6ff; border: 1.5px solid #bfdbfe; padding: 14px; border-radius: 6px; margin: 16px 0; text-align: center; }
            .highlight h2 { font-size: 24px; color: #1e40af; margin: 4px 0 0 0; }
            .terms { font-size: 10px; color: #64748b; border: 1px dashed #cbd5e1; padding: 10px; border-radius: 6px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="header">
              <h1>SRI CITY DEVELOPERS & INFRA PVT. LTD.</h1>
              <p>HMDA & RERA Approved Townships | Hyderabad, Telangana</p>
              <div class="badge">48-HOUR INSTANT PLOT HOLD CONFIRMED</div>
            </div>
            <div class="row"><strong>Booking No:</strong> <span>${bookingResult.bookingNumber}</span></div>
            <div class="row"><strong>Receipt No:</strong> <span>${bookingResult.receiptNumber}</span></div>
            <div class="row"><strong>Date & Time:</strong> <span>${new Date(bookingResult.bookingDate).toLocaleString('en-IN')}</span></div>
            <div class="row"><strong>Hold Expiry:</strong> <span style="color: #dc2626; font-weight: 700;">${new Date(bookingResult.expiryDate).toLocaleString('en-IN')}</span></div>
            <hr style="margin: 12px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
            <div class="row"><strong>Allottee:</strong> <span>${bookingResult.customerName} (${bookingResult.customerPhone})</span></div>
            <div class="row"><strong>Venture:</strong> <span>${bookingResult.projectName}</span></div>
            <div class="row"><strong>Plot Number:</strong> <span style="font-weight: 800; color: #1e3a8a;">${bookingResult.plotNumber}</span></div>
            <div class="row"><strong>Payment Mode:</strong> <span>${bookingResult.paymentMethod} (${bookingResult.transactionRef})</span></div>
            
            <div class="highlight">
              <span style="font-size: 11px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Token Advance Received</span>
              <h2>₹${bookingResult.tokenAmount.toLocaleString('en-IN')}/-</h2>
              <div style="font-size: 11px; font-style: italic; color: #1e40af; margin-top: 4px;">${numberToIndianWords(bookingResult.tokenAmount)}</div>
            </div>

            <div class="terms">
              <strong>Notice & 48-Hour Price Lock Policy:</strong><br/>
              This plot is reserved exclusively for you for 48 hours. Please complete your physical site verification and execution of Agreement of Sale within this duration.
            </div>
          </div>
        </body>
        </html>
      `;
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400);
    }
  };

  const handleShareWhatsApp = () => {
    if (!bookingResult) return;
    const msg = encodeURIComponent(
      `🎉 Plot Hold Confirmed!\n\n` +
      `Plot No: ${bookingResult.plotNumber}\n` +
      `Venture: ${bookingResult.projectName}\n` +
      `Booking ID: ${bookingResult.bookingNumber}\n` +
      `Token Advance: ₹${bookingResult.tokenAmount.toLocaleString('en-IN')}\n` +
      `48H Hold Expiry: ${new Date(bookingResult.expiryDate).toLocaleString()}\n\n` +
      `Sri City Developers & Infra Pvt Ltd`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Title */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LockClockIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {step === 'CONFIRMED' ? 'Plot Reserved Successfully!' : `Hold Plot #${plot.plotNumber} Online`}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* STEP 1: DETAILS */}
        {step === 'DETAILS' && (
          <Stack spacing={2.5}>
            {/* Plot Summary Card */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                  Plot #{plot.plotNumber} &bull; {plot.projectName}
                </Typography>
                <Chip label="48h Lock" size="small" color="success" sx={{ fontWeight: 700 }} />
              </Box>
              <Grid container spacing={1} sx={{ fontSize: '0.85rem' }}>
                <Grid item xs={6}>Facing: <strong>{plot.facing}</strong></Grid>
                <Grid item xs={6}>Area: <strong>{plot.areaSqYds} Sq.Yds</strong></Grid>
                <Grid item xs={6}>Dimensions: <strong>{plot.dimensions}</strong></Grid>
                <Grid item xs={6}>Total Price: <strong>₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs</strong></Grid>
              </Grid>
            </Box>

            {/* Token Selection */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Select Token Advance Amount (₹)
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                {PRESET_TOKENS.map((amount) => (
                  <Chip
                    key={amount}
                    label={`₹${(amount / 1000).toFixed(0)}k`}
                    clickable
                    color={tokenAmount === amount ? 'primary' : 'default'}
                    onClick={() => setTokenAmount(amount)}
                    sx={{ fontWeight: 700, px: 1 }}
                  />
                ))}
              </Stack>
              <TextField
                label="Custom Token Amount (₹)"
                type="number"
                size="small"
                fullWidth
                value={tokenAmount}
                onChange={(e) => setTokenAmount(Number(e.target.value))}
                helperText={`In Words: ${numberToIndianWords(tokenAmount)}`}
              />
            </Box>

            <Divider />

            {/* Customer Details */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Buyer Information
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  label="Full Name *"
                  size="small"
                  fullWidth
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
                <TextField
                  label="Mobile Number (WhatsApp) *"
                  size="small"
                  fullWidth
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98480 12345"
                  required
                />
                <TextField
                  label="Email Address (Optional)"
                  size="small"
                  fullWidth
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.com"
                />
                <TextField
                  label="PAN / Aadhaar Number (Optional)"
                  size="small"
                  fullWidth
                  value={customerPan}
                  onChange={(e) => setCustomerPan(e.target.value)}
                  placeholder="e.g. ABCDE1234F"
                />
              </Stack>
            </Box>

            {/* Lock Guarantee Banner */}
            <Alert severity="info" icon={<SecurityIcon />}>
              <strong>48-Hour Price &amp; Plot Freeze:</strong> Upon advance payment, Plot #{plot.plotNumber} is instantly reserved and removed from the public inventory for 48 hours.
            </Alert>
          </Stack>
        )}

        {/* STEP 2: PAYMENT GATEWAY SIMULATOR */}
        {step === 'PAYMENT' && (
          <Stack spacing={2.5}>
            {/* Payment Summary */}
            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700}>
                Instant Token Advance Payable
              </Typography>
              <Typography variant="h4" fontWeight={900} color="primary.main">
                ₹{tokenAmount.toLocaleString('en-IN')}/-
              </Typography>
              <Typography variant="caption" color="error.main" fontWeight={700} sx={{ mt: 0.5, display: 'block' }}>
                ⏱ Session expires in: {timeFormatted}
              </Typography>
            </Box>

            {/* Payment Mode Selection */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Choose Payment Method
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <FormControlLabel value="UPI" control={<Radio />} label="UPI (QR / GPay / PhonePe)" />
                <FormControlLabel value="CARD" control={<Radio />} label="Card" />
                <FormControlLabel value="NET_BANKING" control={<Radio />} label="Net Banking" />
              </RadioGroup>
            </Box>

            {/* Simulated UPI QR Code */}
            {paymentMethod === 'UPI' && (
              <Box
                sx={{
                  border: '1.5px dashed #94a3b8',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#fafafa',
                }}
              >
                <QrCode2Icon sx={{ fontSize: 130, color: '#1e3a8a', mb: 1 }} />
                <Typography variant="body2" fontWeight={700} gutterBottom>
                  Scan QR with Any UPI App
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Supports Google Pay, PhonePe, Paytm, BHIM, CRED
                </Typography>
                <Chip
                  label="UPI ID: sricityinfra@hdfcbank"
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                />
              </Box>
            )}

            {paymentMethod !== 'UPI' && (
              <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Instant secure payment gateway simulator enabled for testing. Clicking "Confirm &amp; Pay" will process payment through our encrypted banking channel.
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === 'CONFIRMED' && bookingResult && (
          <Stack spacing={2.5} alignItems="center" sx={{ textAlign: 'center', py: 2 }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                bgcolor: '#dcfce7',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={800} color="#166534">
                Plot #{bookingResult.plotNumber} Reserved!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Your 48-hour price lock is active. Our sales relationship manager will reach out shortly.
              </Typography>
            </Box>

            <Box sx={{ width: '100%', p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Booking Reference:</Typography>
                  <Typography variant="caption" fontWeight={700}>{bookingResult.bookingNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Official Receipt:</Typography>
                  <Typography variant="caption" fontWeight={700} color="primary.main">{bookingResult.receiptNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Amount Paid:</Typography>
                  <Typography variant="caption" fontWeight={800} color="success.main">
                    ₹{bookingResult.tokenAmount.toLocaleString('en-IN')}/-
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">48H Hold Expiry:</Typography>
                  <Typography variant="caption" fontWeight={700} color="error.main">
                    {new Date(bookingResult.expiryDate).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
        {step === 'DETAILS' && (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleProceedToPayment} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
              Proceed to Pay ₹{tokenAmount.toLocaleString('en-IN')}
            </Button>
          </>
        )}

        {step === 'PAYMENT' && (
          <>
            <Button onClick={() => setStep('DETAILS')}>Back</Button>
            <Button
              variant="contained"
              color="success"
              disabled={isProcessing}
              startIcon={isProcessing ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
              onClick={handleSimulatePayment}
              sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
            >
              {isProcessing ? 'Authorizing Payment...' : `Simulate Pay ₹${tokenAmount.toLocaleString('en-IN')}`}
            </Button>
          </>
        )}

        {step === 'CONFIRMED' && (
          <>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrintBookingReceipt}
                sx={{ borderRadius: 2 }}
              >
                Print Slip
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={handleShareWhatsApp}
                sx={{ borderRadius: 2 }}
              >
                Share
              </Button>
            </Stack>
            <Button variant="contained" onClick={onClose} sx={{ borderRadius: 2, px: 3 }}>
              Done
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TokenBookingModal;
