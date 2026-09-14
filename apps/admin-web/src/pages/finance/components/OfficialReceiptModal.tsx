import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Stack,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import { numberToIndianWords } from '@real-estate-erp/utils';
import { PaymentRecord } from '../PaymentsWorkspace';
import { printReceiptDocument, generateReceiptHtml } from './OfficialReceiptPrint';

interface OfficialReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receipt: PaymentRecord | null;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  open,
  onClose,
  receipt,
}) => {
  if (!receipt) return null;

  const amountWords = numberToIndianWords(receipt.amount);

  const handleDownload = () => {
    const html = generateReceiptHtml(receipt);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${receipt.receiptNumber}_${receipt.customerName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Dear ${receipt.customerName},\n\n` +
      `We have received your payment of ₹${receipt.amount.toLocaleString('en-IN')} towards Plot ${receipt.plotNumber} in ${receipt.projectName}.\n` +
      `Receipt No: ${receipt.receiptNumber}\n` +
      `Payment Mode: ${receipt.paymentMethod}\n` +
      `Ref: ${receipt.transactionRef || 'N/A'}\n\n` +
      `Thank you for choosing ISKON Developers & Infra Pvt Ltd.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <VerifiedIcon color="success" />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Official Payment Receipt &bull; {receipt.receiptNumber}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc' }}>
        {/* Printable Document Sheet */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            border: '2px solid #0f172a',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Watermark */}
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: { xs: 40, sm: 64 },
              fontWeight: 900,
              color: 'rgba(22, 101, 52, 0.06)',
              letterSpacing: 4,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              userSelect: 'none',
              zIndex: 0,
            }}
          >
            PAID & VERIFIED
          </Typography>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Enterprise Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #0f172a',
                pb: 2,
                mb: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#0f172a',
                    color: '#f59e0b',
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  🏢
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0f172a">
                    ISKON DEVELOPERS & INFRA PVT. LTD.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={0.5}>
                    NUDA &bull; DTCP &bull; AP RERA APPROVED PREMIUM TOWNSHIPS
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="caption" display="block" color="text.secondary">
                  <strong>CIN:</strong> U70102AP2020PTC145678 | <strong>GSTIN:</strong> 37AABCI1429M1ZX
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP | <strong>RERA:</strong> AP RERA Approved
                </Typography>
              </Box>
            </Box>

            {/* Document Title Bar */}
            <Box
              sx={{
                bgcolor: '#f1f5f9',
                p: 1.5,
                borderRadius: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
                borderLeft: '5px solid #2563eb',
              }}
            >
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a" letterSpacing={0.5}>
                OFFICIAL PAYMENT RECEIPT
              </Typography>
              <Chip
                label="Verified & Credited"
                size="small"
                color="success"
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
              />
            </Box>

            {/* Profile Grid */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1.5, bgcolor: '#fafafa', height: '100%' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                    Customer & Receipt Details
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Receipt Number:</Typography>
                      <Typography variant="body2" fontWeight={800} color="primary.main">{receipt.receiptNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Date & Time:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(receipt.paymentDate).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Customer Name:</Typography>
                      <Typography variant="body2" fontWeight={700}>{receipt.customerName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Customer Phone:</Typography>
                      <Typography variant="body2">{receipt.customerPhone}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 1.5, bgcolor: '#fafafa', height: '100%' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
                    Property & Allocation Details
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={0.8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Booking Reference:</Typography>
                      <Typography variant="body2" fontWeight={600}>{receipt.bookingNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Venture Name:</Typography>
                      <Typography variant="body2" fontWeight={600}>{receipt.projectName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Allocated Plot No:</Typography>
                      <Typography variant="body2" fontWeight={800} color="primary.main">{receipt.plotNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Payment Mode & Ref:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {receipt.paymentMethod} {receipt.transactionRef ? `(${receipt.transactionRef})` : ''}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* Amount Received Box */}
            <Box
              sx={{
                bgcolor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 2,
                p: 2.5,
                mb: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" color="primary.dark" fontWeight={700} textTransform="uppercase" letterSpacing={0.8}>
                  Total Amount Received
                </Typography>
                <Typography variant="h3" fontWeight={900} color="primary.main">
                  ₹{receipt.amount.toLocaleString('en-IN')}/-
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, maxWidth: 360 }}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" display="block">
                  Amount in Words:
                </Typography>
                <Typography variant="body2" fontWeight={700} color="primary.dark" fontStyle="italic">
                  {amountWords}
                </Typography>
                {receipt.remarks && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    <strong>Note:</strong> {receipt.remarks}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Terms */}
            <Box sx={{ border: '1px dashed #cbd5e1', borderRadius: 1.5, p: 1.5, bgcolor: '#f8fafc', mb: 3 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Terms & Disclaimers:
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                1. Cheque/Draft payments are subject to bank clearing and realization.<br />
                2. Token advance holds reservation for 48 hours; allotment confirmation subject to execution of standard Agreement of Sale.<br />
                3. Computer-generated official transaction verified electronically with ref {receipt.id}.
              </Typography>
            </Box>

            {/* Signatures */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 1 }}>
              <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box sx={{ height: 40, borderBottom: '1.5px dashed #64748b', mb: 1 }} />
                <Typography variant="caption" fontWeight={700}>Customer Signature</Typography>
              </Box>

              <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    border: '2px solid #2563eb',
                    mx: 'auto',
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-10deg)',
                    bgcolor: 'rgba(37, 99, 235, 0.04)',
                    color: '#2563eb',
                    fontSize: 8,
                    fontWeight: 800,
                  }}
                >
                  ISKON<br />
                  ★ SEAL ★<br />
                  ACCOUNTS
                </Box>
                <Typography variant="caption" fontWeight={700}>Authorized Signatory</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            onClick={handleDownload}
            sx={{ borderRadius: 2 }}
          >
            Download HTML
          </Button>
          <Button
            startIcon={<WhatsAppIcon />}
            variant="outlined"
            color="success"
            onClick={handleWhatsApp}
            sx={{ borderRadius: 2 }}
          >
            Share via WhatsApp
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => printReceiptDocument(receipt)}
            sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            Print / Save PDF
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default OfficialReceiptModal;
