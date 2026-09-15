import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Alert,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CalculateCommissionModalProps {
  open: boolean;
  onClose: () => void;
  onCommissionsGenerated: (newEntries: any[]) => void;
}

const ISKON_VENTURES = [
  { id: 'proj-1', name: 'ISKON City - 2 (Podalakur Road)' },
  { id: 'proj-2', name: 'Dream City (Nellore-Bombay Highway)' },
  { id: 'proj-3', name: 'ISKON Brundhavanam (Chinthareddypalem)' },
  { id: 'proj-4', name: 'ISKON Elite Township (Annamayya Circle Extn)' },
];

export const CalculateCommissionModal: React.FC<CalculateCommissionModalProps> = ({
  open,
  onClose,
  onCommissionsGenerated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [bookingNumber, setBookingNumber] = useState('BKG-2026-015');
  const [ventureName, setVentureName] = useState('ISKON City - 2 (Podalakur Road)');
  const [plotNumber, setPlotNumber] = useState('P-105');
  const [saleAmount, setSaleAmount] = useState<number>(2800000);
  const [leadOwnerName, setLeadOwnerName] = useState('K. Mallikarjun (Marketing Executive)');

  // Cadre Slabs
  const cadreTiers = [
    { position: 'Marketing Executive / Field Associate', name: leadOwnerName, rate: 3.0 },
    { position: 'Sales Manager (SM)', name: 'Anand Naidu', rate: 1.5 },
    { position: 'General Manager (GM)', name: 'Vikram Rao', rate: 1.0 },
    { position: 'Sr. Chief General Manager (Sr CGM)', name: 'Ramesh Varma', rate: 0.5 },
  ];

  const calculatedTiers = cadreTiers.map((tier) => {
    const gross = Math.round((saleAmount * tier.rate) / 100);
    const tds = Math.round(gross * 0.05); // 5% TDS
    const net = gross - tds;
    return {
      ...tier,
      gross,
      tds,
      net,
    };
  });

  const totalGross = calculatedTiers.reduce((acc, t) => acc + t.gross, 0);
  const totalTds = calculatedTiers.reduce((acc, t) => acc + t.tds, 0);
  const totalNet = calculatedTiers.reduce((acc, t) => acc + t.net, 0);

  const handleGenerate = async () => {
    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const generatedEntries = calculatedTiers.map((tier, idx) => ({
      id: `LED-${Date.now().toString().slice(-4)}-${idx + 1}`,
      bookingId: bookingNumber,
      member: tier.name,
      position: tier.position,
      project: ventureName,
      plotNumber: plotNumber,
      saleAmount: `₹${saleAmount.toLocaleString('en-IN')}`,
      commissionRate: `${tier.rate}%`,
      grossAmount: tier.gross,
      tdsDeduction: tier.tds,
      netPayable: tier.net,
      status: 'APPROVED' as const,
      date: now.split('T')[0],
    }));

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        for (const entry of generatedEntries) {
          await addDoc(collection(db, 'commissionRecords'), {
            ...entry,
            companyId: 'comp-1',
            branchId: 'branch-nellore',
            createdAt: now,
            updatedAt: now,
            serverTimestamp: serverTimestamp(),
          });
        }
      }
      onCommissionsGenerated(generatedEntries);
      onClose();
    } catch (err: any) {
      console.warn('Firestore commission record warning:', err);
      // Still update UI if Firestore has network blip
      onCommissionsGenerated(generatedEntries);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CalculateIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Run Cadre Commission Split (కమీషన్ లెక్కింపు)
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Booking Number"
              fullWidth
              size="small"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="ISKON Venture"
              fullWidth
              size="small"
              value={ventureName}
              onChange={(e) => setVentureName(e.target.value)}
            >
              {ISKON_VENTURES.map((v) => (
                <MenuItem key={v.id} value={v.name}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Plot Number"
              fullWidth
              size="small"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Total Sale Value (₹)"
              type="number"
              fullWidth
              size="small"
              value={saleAmount}
              onChange={(e) => setSaleAmount(Math.max(0, Number(e.target.value)))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Direct Executive Name"
              fullWidth
              size="small"
              value={leadOwnerName}
              onChange={(e) => setLeadOwnerName(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Calculated Hierarchy Breakdown Table */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon fontSize="small" color="primary" /> Multi-Tier Cadre Distribution (ఆంధ్రప్రదేశ్ & తెలంగాణ క్యాడర్ హైరార్కీ)
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Cadre Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Member Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Rate</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Gross (₹)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">5% TDS (₹)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Net Payable (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculatedTiers.map((tier, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{tier.position}</Typography>
                  </TableCell>
                  <TableCell>{tier.name}</TableCell>
                  <TableCell align="right">{tier.rate}%</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>₹{tier.gross.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>-₹{tier.tds.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₹{tier.net.toLocaleString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                <TableCell colSpan={3} sx={{ fontWeight: 800 }}>Total Outflow (6.0%)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>₹{totalGross.toLocaleString('en-IN')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'error.main' }}>-₹{totalTds.toLocaleString('en-IN')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'success.main' }}>₹{totalNet.toLocaleString('en-IN')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 1.75 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={<VerifiedIcon />}
          sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}
        >
          {submitting ? 'Generating...' : 'Approve & Post to Ledger (ఆమోదించు)'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
