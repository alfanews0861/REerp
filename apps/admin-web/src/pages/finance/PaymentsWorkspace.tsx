import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { DataTable, MetricCard, SearchBox, StatusChip } from '@real-estate-erp/ui';
import { getFirebaseInstance, paymentService } from '@real-estate-erp/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { OfficialReceiptModal } from './components/OfficialReceiptModal';

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  receiptNumber: string;
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  plotNumber: string;
  projectName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI' | 'CARD' | 'OTHER';
  transactionRef?: string;
  status: 'verified' | 'pending' | 'rejected' | 'refunded';
  remarks?: string;
}

export const SEED_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-1001',
    receiptNumber: 'REC-2026-081',
    bookingId: 'bkg-1',
    bookingNumber: 'BKG-2026-001',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    customerPhone: '+91 98480 22338',
    plotNumber: 'P-12',
    projectName: 'ISKON City - 2',
    amount: 200000,
    paymentDate: '2026-09-01T10:35:00Z',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/9848022338/928371',
    status: 'verified',
    remarks: 'Initial token booking amount',
  },
  {
    id: 'pay-2',
    paymentNumber: 'PAY-1002',
    receiptNumber: 'REC-2026-082',
    bookingId: 'bkg-1',
    bookingNumber: 'BKG-2026-001',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    customerPhone: '+91 98480 22338',
    plotNumber: 'P-12',
    projectName: 'ISKON City - 2',
    amount: 300000,
    paymentDate: '2026-09-04T16:20:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'NEFT-HDFC-0019284',
    status: 'verified',
    remarks: 'First installment payment cleared',
  },
  {
    id: 'pay-3',
    paymentNumber: 'PAY-1003',
    receiptNumber: 'REC-2026-083',
    bookingId: 'bkg-2',
    bookingNumber: 'BKG-2026-002',
    customerId: 'cust-2',
    customerName: 'Suresh Verma',
    customerPhone: '+91 94401 55667',
    plotNumber: 'P-45',
    projectName: 'ISKON City - 2',
    amount: 1800000,
    paymentDate: '2026-08-20T14:30:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'RTGS-SBIN-994821',
    status: 'verified',
    remarks: 'Full outright settlement prior to registration',
  },
  {
    id: 'pay-4',
    paymentNumber: 'PAY-1004',
    receiptNumber: 'REC-2026-084',
    bookingId: 'bkg-3',
    bookingNumber: 'BKG-2026-003',
    customerId: 'cust-3',
    customerName: 'Anita Reddy',
    customerPhone: '+91 91234 56789',
    plotNumber: 'P-78',
    projectName: 'Dream City',
    amount: 300000,
    paymentDate: '2026-09-05T11:15:00Z',
    paymentMethod: 'CHEQUE',
    transactionRef: 'CHQ-882910-ICICI',
    status: 'verified',
    remarks: 'Token cheque cleared successfully',
  },
  {
    id: 'pay-5',
    paymentNumber: 'PAY-1005',
    receiptNumber: 'REC-2026-085',
    bookingId: 'bkg-4',
    bookingNumber: 'BKG-2026-004',
    customerId: 'cust-4',
    customerName: 'Kalyan Chakravarthy',
    customerPhone: '+91 98480 33441',
    plotNumber: 'IB-15',
    projectName: 'ISKON Brundhavanam',
    amount: 500000,
    paymentDate: '2026-09-02T16:45:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'NEFT-AXIS-9102834',
    status: 'verified',
    remarks: 'Booking advance token',
  },
  {
    id: 'pay-6',
    paymentNumber: 'PAY-1006',
    receiptNumber: 'REC-2026-086',
    bookingId: 'bkg-4',
    bookingNumber: 'BKG-2026-004',
    customerId: 'cust-4',
    customerName: 'Kalyan Chakravarthy',
    customerPhone: '+91 98480 33441',
    plotNumber: 'IB-15',
    projectName: 'ISKON Brundhavanam',
    amount: 1000000,
    paymentDate: '2026-09-08T12:30:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'RTGS-AXIS-0099182',
    status: 'verified',
    remarks: 'Agreement down-payment tranche',
  },
  {
    id: 'pay-7',
    paymentNumber: 'PAY-1007',
    receiptNumber: 'REC-2026-087',
    bookingId: 'bkg-5',
    bookingNumber: 'BKG-2026-005',
    customerId: 'cust-5',
    customerName: 'Dr. Haritha Rao',
    customerPhone: '+91 98480 44552',
    plotNumber: 'P-06',
    projectName: 'ISKON City - 2',
    amount: 300000,
    paymentDate: '2026-09-07T12:15:00Z',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/ICICI/882719284',
    status: 'verified',
    remarks: 'Token hold advance payment',
  },
  {
    id: 'pay-8',
    paymentNumber: 'PAY-1008',
    receiptNumber: 'REC-2026-088',
    bookingId: 'bkg-6',
    bookingNumber: 'BKG-2026-006',
    customerId: 'cust-6',
    customerName: 'Satyanarayana Murthy',
    customerPhone: '+91 98480 55663',
    plotNumber: 'ET-22',
    projectName: 'ISKON Elite Township',
    amount: 4200000,
    paymentDate: '2026-08-28T15:45:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'RTGS-KOTAK-778819',
    status: 'verified',
    remarks: 'Full settlement for registered sale deed',
  },
  {
    id: 'pay-9',
    paymentNumber: 'PAY-1009',
    receiptNumber: 'REC-2026-089',
    bookingId: 'bkg-7',
    bookingNumber: 'BKG-2026-007',
    customerId: 'cust-7',
    customerName: 'Venkat Raman',
    customerPhone: '+91 98480 66774',
    plotNumber: 'DC-33',
    projectName: 'Dream City',
    amount: 1950000,
    paymentDate: '2026-08-25T12:00:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'RTGS-SBIN-889921',
    status: 'verified',
    remarks: 'Outright payment for Dream City venture',
  },
  {
    id: 'pay-10',
    paymentNumber: 'PAY-1010',
    receiptNumber: 'REC-2026-090',
    bookingId: 'bkg-9',
    bookingNumber: 'BKG-2026-009',
    customerId: 'cust-9',
    customerName: 'Lakshmi Prasanna',
    customerPhone: '+91 98480 88996',
    plotNumber: 'IB-40',
    projectName: 'ISKON Brundhavanam',
    amount: 500000,
    paymentDate: '2026-09-04T14:30:00Z',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/HDFC/992817264',
    status: 'verified',
    remarks: 'Booking token payment',
  },
  {
    id: 'pay-11',
    paymentNumber: 'PAY-1011',
    receiptNumber: 'REC-2026-091',
    bookingId: 'bkg-9',
    bookingNumber: 'BKG-2026-009',
    customerId: 'cust-9',
    customerName: 'Lakshmi Prasanna',
    customerPhone: '+91 98480 88996',
    plotNumber: 'IB-40',
    projectName: 'ISKON Brundhavanam',
    amount: 500000,
    paymentDate: '2026-09-10T11:00:00Z',
    paymentMethod: 'CHEQUE',
    transactionRef: 'CHQ-991823-SBI',
    status: 'pending',
    remarks: 'Installment cheque submitted, awaiting clearance',
  },
  {
    id: 'pay-12',
    paymentNumber: 'PAY-1012',
    receiptNumber: 'REC-2026-092',
    bookingId: 'bkg-10',
    bookingNumber: 'BKG-2026-010',
    customerId: 'cust-10',
    customerName: 'Dr. Ashok Varma (NRI)',
    customerPhone: '+1 469 555 0192',
    plotNumber: 'IB-01 (Corner Villa Plot)',
    projectName: 'ISKON Brundhavanam',
    amount: 12000000,
    paymentDate: '2026-08-22T09:30:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'SWIFT-WIRE-CHASE-009182',
    status: 'verified',
    remarks: 'NRI USD Foreign Inward Remittance full settlement',
  },
  {
    id: 'pay-13',
    paymentNumber: 'PAY-1013',
    receiptNumber: 'REC-2026-093',
    bookingId: 'bkg-12',
    bookingNumber: 'BKG-2026-012',
    customerId: 'cust-12',
    customerName: 'Anitha Chowdary',
    customerPhone: '+91 98480 22339',
    plotNumber: 'ET-08',
    projectName: 'ISKON Elite Township',
    amount: 300000,
    paymentDate: '2026-09-10T16:15:00Z',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/ICICI/554819201',
    status: 'verified',
    remarks: 'Token advance for plot reservation',
  },
];

export const PaymentsWorkspace: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>(SEED_PAYMENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  // Form states for new payment
  const [newPayment, setNewPayment] = useState<{
    bookingNumber: string;
    customerName: string;
    plotNumber: string;
    projectName: string;
    amount: number;
    paymentMethod: PaymentRecord['paymentMethod'];
    transactionRef: string;
    remarks: string;
  }>({
    bookingNumber: 'BKG-2026-001',
    customerName: 'Rajesh Sharma',
    plotNumber: 'P-12',
    projectName: 'ISKON City - 2',
    amount: 100000,
    paymentMethod: 'UPI',
    transactionRef: '',
    remarks: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { db } = getFirebaseInstance();
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PaymentRecord[];
        setPayments(list);
      }
    } catch {
      // Fallback to seed payments
      setPayments(SEED_PAYMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchSearch =
        p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        p.customerPhone.includes(search) ||
        p.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
        (p.transactionRef && p.transactionRef.toLowerCase().includes(search.toLowerCase()));
      const matchMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, search, methodFilter]);

  const metrics = useMemo(() => {
    const totalCollected = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const verifiedCount = payments.filter(p => p.status === 'verified').length;
    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const totalReceipts = payments.length;
    return { totalCollected, verifiedCount, pendingCount, totalReceipts };
  }, [payments]);

  const handleRecordPayment = async () => {
    const created: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentNumber: `PAY-${Date.now()}`,
      receiptNumber: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: 'bkg-1',
      bookingNumber: newPayment.bookingNumber,
      customerId: 'cust-1',
      customerName: newPayment.customerName,
      customerPhone: '+91 98480 22338',
      plotNumber: newPayment.plotNumber,
      projectName: newPayment.projectName,
      amount: Number(newPayment.amount),
      paymentDate: new Date().toISOString(),
      paymentMethod: newPayment.paymentMethod,
      transactionRef: newPayment.transactionRef || `REF-${Date.now()}`,
      status: 'verified',
      remarks: newPayment.remarks,
    };

    try {
      await paymentService.recordPayment({
        bookingId: created.bookingId,
        amount: created.amount,
        paymentMethod: created.paymentMethod,
        transactionRef: created.transactionRef,
        remarks: created.remarks,
      }, 'admin-user');
    } catch {
      // Local fallback
    }

    setPayments([created, ...payments]);
    setCreateDialogOpen(false);
    setNewPayment({
      bookingNumber: 'BKG-2026-001',
      customerName: 'Rajesh Sharma',
      plotNumber: 'P-12',
      projectName: 'ISKON City - 2',
      amount: 100000,
      paymentMethod: 'UPI',
      transactionRef: '',
      remarks: '',
    });
  };

  const handleVerify = (paymentId: string) => {
    setPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, status: 'verified' as const } : p))
    );
  };

  const columns = [
    { id: 'receiptNumber', label: 'Receipt No.', sortable: true },
    {
      id: 'bookingNumber',
      label: 'Booking & Plot',
      format: (_: unknown, row?: PaymentRecord) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{row?.bookingNumber}</Typography>
          <Typography variant="caption" color="text.secondary">{row?.plotNumber} ({row?.projectName})</Typography>
        </Box>
      ),
    },
    {
      id: 'customerName',
      label: 'Customer Details',
      format: (_: unknown, row?: PaymentRecord) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>{row?.customerName}</Typography>
          <Typography variant="caption" color="text.secondary">{row?.customerPhone}</Typography>
        </Box>
      ),
    },
    {
      id: 'amount',
      label: 'Amount (₹)',
      sortable: true,
      format: (val: unknown) => (
        <Typography variant="body2" fontWeight={700} color="success.main">
          ₹{Number(val || 0).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      id: 'paymentMethod',
      label: 'Method & Ref',
      format: (_: unknown, row?: PaymentRecord) => (
        <Box>
          <Chip label={row?.paymentMethod} size="small" variant="outlined" />
          {row?.transactionRef && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              {row.transactionRef}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Verification',
      format: (val: unknown) => {
        const s = String(val || '');
        const chipStatus = s === 'verified' ? 'completed' : s === 'rejected' ? 'cancelled' : 'pending';
        return <StatusChip status={chipStatus} />;
      },
    },
    {
      id: 'paymentDate',
      label: 'Date',
      format: (val: unknown) => (val ? new Date(String(val)).toLocaleDateString() : ''),
    },
    {
      id: 'id',
      label: 'Actions',
      format: (_: unknown, row?: PaymentRecord) => {
        if (!row) return null;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              title="View Official Receipt"
              onClick={() => {
                setSelectedReceipt(row);
                setReceiptDialogOpen(true);
              }}
            >
              <ReceiptLongIcon fontSize="small" />
            </IconButton>
            {row.status === 'pending' && (
              <IconButton
                size="small"
                color="success"
                title="Verify Payment"
                onClick={() => handleVerify(row.id)}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Payments & Collections Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage customer installments, banking reconciliation, and printable enterprise receipts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ py: 0.75, px: 2, borderRadius: 2, fontSize: '0.85rem' }}
        >
          Record Payment
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Realized Revenue"
            value={`₹${(metrics.totalCollected / 100000).toFixed(1)} L`}
            subtitle="Inward Bank Realizations"
            trend={{ value: 14, isPositive: true }}
            icon={<CurrencyRupeeIcon />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Verified Receipts"
            value={metrics.verifiedCount}
            subtitle="Cleared & Reconciled"
            trend={{ value: 8, isPositive: true }}
            icon={<CheckCircleIcon />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Verification"
            value={metrics.pendingCount}
            subtitle="Cheques & Slips in Review"
            trend={{ value: 2, isPositive: false }}
            icon={<HourglassEmptyIcon />}
            color="#d97706"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Receipts Issued"
            value={metrics.totalReceipts}
            subtitle="All Transaction Vouchers"
            trend={{ value: 10, isPositive: true }}
            icon={<TrendingUpIcon />}
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      {/* Main Table Paper */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ width: 340 }}>
            <SearchBox
              placeholder="Search by receipt no, customer, UTR..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {['ALL', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CASH'].map(method => (
              <Chip
                key={method}
                label={method === 'ALL' ? 'ALL METHODS' : method}
                clickable
                color={methodFilter === method ? 'primary' : 'default'}
                onClick={() => setMethodFilter(method)}
              />
            ))}
          </Stack>
        </Box>

        <DataTable
          {...({
            columns,
            data: filteredPayments,
            keyField: 'id',
            loading,
            emptyMessage: 'No payment records found.',
          } as unknown as React.ComponentProps<typeof DataTable>)}
        />
      </Paper>

      {/* Record Payment Modal */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Record Customer Payment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Booking Number"
              select
              value={newPayment.bookingNumber}
              onChange={e => setNewPayment({ ...newPayment, bookingNumber: e.target.value })}
              fullWidth
            >
              <MenuItem value="BKG-2026-001">BKG-2026-001 - Rajesh Sharma (P-12)</MenuItem>
              <MenuItem value="BKG-2026-002">BKG-2026-002 - Suresh Verma (P-45)</MenuItem>
              <MenuItem value="BKG-2026-003">BKG-2026-003 - Anita Reddy (P-78)</MenuItem>
            </TextField>
            <TextField
              label="Payment Amount (₹)"
              type="number"
              value={newPayment.amount}
              onChange={e => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
              fullWidth
              required
            />
            <TextField
              label="Payment Method"
              select
              value={newPayment.paymentMethod}
              onChange={e =>
                setNewPayment({
                  ...newPayment,
                  paymentMethod: e.target.value as PaymentRecord['paymentMethod'],
                })
              }
              fullWidth
            >
              <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
              <MenuItem value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS/IMPS)</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CARD">Debit / Credit Card</MenuItem>
            </TextField>
            <TextField
              label="Bank Reference / UTR / Cheque Number"
              value={newPayment.transactionRef}
              onChange={e => setNewPayment({ ...newPayment, transactionRef: e.target.value })}
              fullWidth
              placeholder="e.g. UTR-982104921"
            />
            <TextField
              label="Notes & Remarks"
              value={newPayment.remarks}
              onChange={e => setNewPayment({ ...newPayment, remarks: e.target.value })}
              fullWidth
              placeholder="e.g. Installment 2 of 4"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleRecordPayment}>
            Generate Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Official Printable Receipt Modal */}
      <OfficialReceiptModal
        open={receiptDialogOpen}
        onClose={() => setReceiptDialogOpen(false)}
        receipt={selectedReceipt}
      />
    </Box>
  );
};

export default PaymentsWorkspace;
