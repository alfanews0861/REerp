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
  Divider,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataTable, MetricCard, SearchBox, StatusChip } from '@real-estate-erp/ui';
import { getFirebaseInstance, paymentService } from '@real-estate-erp/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

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

const SEED_PAYMENTS: PaymentRecord[] = [
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
    projectName: 'Sunrise Enclave',
    amount: 200000,
    paymentDate: '2026-09-01T10:35:00Z',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/9848022338/928371',
    status: 'verified',
    remarks: 'Booking token payment',
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
    projectName: 'Sunrise Enclave',
    amount: 300000,
    paymentDate: '2026-09-04T16:20:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'NEFT-HDFC-0019284',
    status: 'verified',
    remarks: 'First installment payment',
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
    projectName: 'Sunrise Enclave',
    amount: 1800000,
    paymentDate: '2026-08-20T14:30:00Z',
    paymentMethod: 'BANK_TRANSFER',
    transactionRef: 'RTGS-SBIN-994821',
    status: 'verified',
    remarks: 'Full outright settlement',
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
    projectName: 'Green Valley Phase 2',
    amount: 300000,
    paymentDate: '2026-09-05T11:15:00Z',
    paymentMethod: 'CHEQUE',
    transactionRef: 'CHQ-882910-ICICI',
    status: 'pending',
    remarks: 'Token cheque submitted, clearing pending',
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
    projectName: 'Sunrise Enclave',
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
      projectName: 'Sunrise Enclave',
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
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Payments & Collections Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage customer installments, banking reconciliation, and printable enterprise receipts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2 }}
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
            trend={{ value: 14, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Verified Receipts"
            value={metrics.verifiedCount}
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Verification"
            value={metrics.pendingCount}
            trend={{ value: 2, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Receipts Issued"
            value={metrics.totalReceipts}
            trend={{ value: 10, isPositive: true }}
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
      {selectedReceipt && (
        <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              Official Payment Receipt
            </Typography>
            <IconButton onClick={() => setReceiptDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ p: 2, border: '2px solid #e2e8f0', borderRadius: 2, bgcolor: '#fafafa' }}>
              {/* Receipt Header */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={800} color="primary.main" letterSpacing={1}>
                  REAL ESTATE ENTERPRISE ERP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Registered Corporate Office: Financial District, Hyderabad | Tel: +91 40 1234 5678
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ textDecoration: 'underline' }}>
                  RECEIPT OF PAYMENT
                </Typography>
              </Box>

              {/* Receipt Meta */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Receipt No:</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedReceipt.receiptNumber}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">Date:</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(selectedReceipt.paymentDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Customer & Plot Info */}
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Received From:</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedReceipt.customerName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Contact Phone:</Typography>
                  <Typography variant="body2">{selectedReceipt.customerPhone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Plot & Project:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Plot {selectedReceipt.plotNumber}, {selectedReceipt.projectName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Booking Reference:</Typography>
                  <Typography variant="body2">{selectedReceipt.bookingNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Payment Mode:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedReceipt.paymentMethod} {selectedReceipt.transactionRef ? `(${selectedReceipt.transactionRef})` : ''}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Amount Highlight */}
              <Box sx={{ bgcolor: '#e0e7ff', p: 1.5, borderRadius: 1, textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" color="primary.dark" fontWeight={600}>
                  AMOUNT RECEIVED
                </Typography>
                <Typography variant="h4" color="primary.main" fontWeight={800}>
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </Typography>
                {selectedReceipt.remarks && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Remarks: {selectedReceipt.remarks}
                  </Typography>
                )}
              </Box>

              {/* Footer Signatures */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3, pt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">System Generated Document</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">Verified electronically</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ height: 30, borderBottom: '1px solid #94a3b8', width: 140, mb: 0.5 }} />
                  <Typography variant="caption" fontWeight={600}>Authorized Signatory</Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button startIcon={<PrintIcon />} variant="outlined" onClick={() => window.print()}>
              Print Receipt
            </Button>
            <Button variant="contained" onClick={() => setReceiptDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PaymentsWorkspace;
