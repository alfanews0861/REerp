import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { numberToIndianWords } from '@real-estate-erp/utils';
import { BookingItem } from '../BookingsWorkspace';
import { printAllotmentLetter, generateAllotmentLetterHtml } from './OfficialAllotmentPrint';

interface OfficialAllotmentModalProps {
  open: boolean;
  onClose: () => void;
  booking: BookingItem | null;
}

export const OfficialAllotmentModal: React.FC<OfficialAllotmentModalProps> = ({
  open,
  onClose,
  booking,
}) => {
  if (!booking) return null;

  const finalAmountWords = numberToIndianWords(booking.finalAmount);
  const tokenAmountWords = numberToIndianWords(booking.tokenAmount);
  const balanceOutstanding = Math.max(0, booking.finalAmount - booking.totalPaidAmount);

  const handleDownload = () => {
    const html = generateAllotmentLetterHtml(booking);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Allotment_Letter_${booking.bookingNumber}_${booking.plotNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AssignmentTurnedInIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Provisional Allotment Letter &bull; {booking.bookingNumber}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc' }}>
        <Box
          sx={{
            bgcolor: '#ffffff',
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            border: '2px solid #0f172a',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          {/* Watermark */}
          <Typography
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: { xs: 40, sm: 60 },
              fontWeight: 900,
              color: 'rgba(30, 58, 138, 0.05)',
              letterSpacing: 4,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              userSelect: 'none',
              zIndex: 0,
            }}
          >
            PROVISIONAL ALLOTMENT
          </Typography>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', pb: 2, mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a">
                  ISKON DEVELOPERS & INFRA PVT. LTD.
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  NUDA &bull; DTCP &bull; AP RERA APPROVED GATED TOWNSHIPS
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" display="block" color="text.secondary">
                  CIN: U70102AP2020PTC145678 | GST: 37AABCI1429M1ZX
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP
                </Typography>
              </Box>
            </Box>

            {/* Reference */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2"><strong>Ref:</strong> ALLOT/{booking.bookingNumber}</Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>To:</strong> {booking.customerName} ({booking.customerPhone})<br />
              <strong>Customer Ref:</strong> {booking.customerId}
            </Typography>

            {/* Subject */}
            <Box sx={{ bgcolor: '#f1f5f9', p: 1.5, borderRadius: 1.5, borderLeft: '4px solid #1e3a8a', mb: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} color="#1e3a8a">
                SUBJECT: PROVISIONAL ALLOTMENT OF PLOT NO. {booking.plotNumber} IN {booking.projectName.toUpperCase()}
              </Typography>
            </Box>

            <Typography variant="body2" paragraph>
              Dear <strong>{booking.customerName}</strong>,
            </Typography>
            <Typography variant="body2" paragraph>
              We are delighted to confirm that based on your booking application and advance token payment, you have been provisionally allotted the residential plot detailed below:
            </Typography>

            {/* Schedule Table */}
            <Table size="small" sx={{ mb: 2.5, border: '1px solid #e2e8f0' }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, width: '40%' }}>Project / Layout</TableCell>
                  <TableCell><strong>{booking.projectName}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700 }}>Allotted Plot Number</TableCell>
                  <TableCell><strong style={{ color: '#1e3a8a', fontSize: '1.05rem' }}>{booking.plotNumber}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700 }}>Total Agreed Sale Value</TableCell>
                  <TableCell>
                    <strong>₹{booking.finalAmount.toLocaleString('en-IN')}/-</strong> ({finalAmountWords})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700 }}>Advance Token Paid</TableCell>
                  <TableCell>
                    <strong style={{ color: '#166534' }}>₹{booking.totalPaidAmount.toLocaleString('en-IN')}/-</strong> ({tokenAmountWords})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700 }}>Balance Outstanding Payable</TableCell>
                  <TableCell><strong style={{ color: '#dc2626' }}>₹{balanceOutstanding.toLocaleString('en-IN')}/-</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700 }}>Status</TableCell>
                  <TableCell>
                    <Chip label={booking.status.toUpperCase()} size="small" color={booking.status === 'completed' ? 'success' : 'primary'} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box sx={{ border: '1px dashed #cbd5e1', borderRadius: 1.5, p: 1.5, bgcolor: '#f8fafc', mb: 3 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Terms of Allotment:
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                1. Subject to execution of the Agreement of Sale within 15 days.<br />
                2. Balance consideration to be paid as per the agreed schedule or approved home loan.<br />
                3. Final registration deed executed upon full settlement of sale consideration and statutory duties.
              </Typography>
            </Box>

            {/* Signatures */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 1 }}>
              <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box sx={{ height: 36, borderBottom: '1.5px dashed #64748b', mb: 0.5 }} />
                <Typography variant="caption" fontWeight={700}>Allottee Signature</Typography>
              </Box>

              <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: '2px solid #1e3a8a',
                    mx: 'auto',
                    mb: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-10deg)',
                    color: '#1e3a8a',
                    fontSize: 8,
                    fontWeight: 800,
                  }}
                >
                  ISKON<br />
                  ★ SEAL ★<br />
                  ALLOTMENT
                </Box>
                <Typography variant="caption" fontWeight={700}>Authorized Signatory</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleDownload} sx={{ borderRadius: 2 }}>
          Download HTML
        </Button>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => printAllotmentLetter(booking)}
            sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            Print / Save PDF
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default OfficialAllotmentModal;
