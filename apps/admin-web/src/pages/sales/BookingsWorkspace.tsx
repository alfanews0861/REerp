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
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DataTable, MetricCard, SearchBox, StatusChip } from '@real-estate-erp/ui';
import { getFirebaseInstance, inventoryBookingService, paymentService } from '@real-estate-erp/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { OfficialAllotmentModal } from './components/OfficialAllotmentModal';

export interface BookingItem {
  id: string;
  bookingNumber: string;
  projectId: string;
  projectName: string;
  plotId: string;
  plotNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  tokenAmount: number;
  totalPaidAmount: number;
  status: 'draft' | 'active' | 'expired' | 'cancelled' | 'completed';
  bookingDate: string;
  expiryDate?: string;
  paymentPlanType?: string;
}

export const SEED_BOOKINGS: BookingItem[] = [
  {
    id: 'bkg-1',
    bookingNumber: 'BKG-2026-001',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave (Mokila)',
    plotId: 'plot-12',
    plotNumber: 'P-12',
    customerId: 'cust-1',
    customerName: 'Rajesh Sharma',
    customerPhone: '+91 98480 22338',
    totalAmount: 2500000,
    discountAmount: 50000,
    finalAmount: 2450000,
    tokenAmount: 200000,
    totalPaidAmount: 500000,
    status: 'active',
    bookingDate: '2026-09-01T10:30:00Z',
    expiryDate: '2026-09-25T18:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-2',
    bookingNumber: 'BKG-2026-002',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave (Mokila)',
    plotId: 'plot-45',
    plotNumber: 'P-45',
    customerId: 'cust-2',
    customerName: 'Suresh Verma',
    customerPhone: '+91 94401 55667',
    totalAmount: 1800000,
    discountAmount: 0,
    finalAmount: 1800000,
    tokenAmount: 1800000,
    totalPaidAmount: 1800000,
    status: 'completed',
    bookingDate: '2026-08-20T14:15:00Z',
    paymentPlanType: 'outright',
  },
  {
    id: 'bkg-3',
    bookingNumber: 'BKG-2026-003',
    projectId: 'proj-2',
    projectName: 'Green Valley Phase 2 (Shadnagar)',
    plotId: 'plot-78',
    plotNumber: 'P-78',
    customerId: 'cust-3',
    customerName: 'Anita Reddy',
    customerPhone: '+91 91234 56789',
    totalAmount: 3200000,
    discountAmount: 100000,
    finalAmount: 3100000,
    tokenAmount: 300000,
    totalPaidAmount: 300000,
    status: 'active',
    bookingDate: '2026-09-05T11:00:00Z',
    expiryDate: '2026-09-20T18:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-4',
    bookingNumber: 'BKG-2026-004',
    projectId: 'proj-3',
    projectName: 'Palm County (Kollur)',
    plotId: 'plot-pc15',
    plotNumber: 'PC-15',
    customerId: 'cust-4',
    customerName: 'Kalyan Chakravarthy',
    customerPhone: '+91 98480 33441',
    totalAmount: 5600000,
    discountAmount: 100000,
    finalAmount: 5500000,
    tokenAmount: 500000,
    totalPaidAmount: 1500000,
    status: 'active',
    bookingDate: '2026-09-02T16:20:00Z',
    expiryDate: '2026-09-30T18:00:00Z',
    paymentPlanType: 'bank_loan',
  },
  {
    id: 'bkg-5',
    bookingNumber: 'BKG-2026-005',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave (Mokila)',
    plotId: 'plot-06',
    plotNumber: 'P-06',
    customerId: 'cust-5',
    customerName: 'Dr. Haritha Rao',
    customerPhone: '+91 98480 44552',
    totalAmount: 3250000,
    discountAmount: 50000,
    finalAmount: 3200000,
    tokenAmount: 300000,
    totalPaidAmount: 300000,
    status: 'active',
    bookingDate: '2026-09-07T12:00:00Z',
    expiryDate: '2026-09-22T18:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-6',
    bookingNumber: 'BKG-2026-006',
    projectId: 'proj-4',
    projectName: 'Royal Meadows (Shankarpally)',
    plotId: 'plot-rm22',
    plotNumber: 'RM-22',
    customerId: 'cust-6',
    customerName: 'Satyanarayana Murthy',
    customerPhone: '+91 98480 55663',
    totalAmount: 4300000,
    discountAmount: 100000,
    finalAmount: 4200000,
    tokenAmount: 4200000,
    totalPaidAmount: 4200000,
    status: 'completed',
    bookingDate: '2026-08-28T15:30:00Z',
    paymentPlanType: 'outright',
  },
  {
    id: 'bkg-7',
    bookingNumber: 'BKG-2026-007',
    projectId: 'proj-2',
    projectName: 'Green Valley Phase 2 (Shadnagar)',
    plotId: 'plot-gv33',
    plotNumber: 'GV-33',
    customerId: 'cust-7',
    customerName: 'Venkat Raman',
    customerPhone: '+91 98480 66774',
    totalAmount: 2000000,
    discountAmount: 50000,
    finalAmount: 1950000,
    tokenAmount: 1950000,
    totalPaidAmount: 1950000,
    status: 'completed',
    bookingDate: '2026-08-25T11:45:00Z',
    paymentPlanType: 'outright',
  },
  {
    id: 'bkg-8',
    bookingNumber: 'BKG-2026-008',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave (Mokila)',
    plotId: 'plot-88',
    plotNumber: 'P-88',
    customerId: 'cust-8',
    customerName: 'Naveen Kumar V',
    customerPhone: '+91 98480 77885',
    totalAmount: 2600000,
    discountAmount: 0,
    finalAmount: 2600000,
    tokenAmount: 100000,
    totalPaidAmount: 100000,
    status: 'cancelled',
    bookingDate: '2026-08-10T10:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-9',
    bookingNumber: 'BKG-2026-009',
    projectId: 'proj-3',
    projectName: 'Palm County (Kollur)',
    plotId: 'plot-pc40',
    plotNumber: 'PC-40',
    customerId: 'cust-9',
    customerName: 'Lakshmi Prasanna',
    customerPhone: '+91 98480 88996',
    totalAmount: 4900000,
    discountAmount: 100000,
    finalAmount: 4800000,
    tokenAmount: 500000,
    totalPaidAmount: 1000000,
    status: 'active',
    bookingDate: '2026-09-04T14:00:00Z',
    expiryDate: '2026-09-25T18:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-10',
    bookingNumber: 'BKG-2026-010',
    projectId: 'proj-3',
    projectName: 'Palm County (Kollur)',
    plotId: 'plot-pc01',
    plotNumber: 'PC-01 (Corner Villa Plot)',
    customerId: 'cust-10',
    customerName: 'Dr. Ashok Varma (NRI)',
    customerPhone: '+1 469 555 0192',
    totalAmount: 12200000,
    discountAmount: 200000,
    finalAmount: 12000000,
    tokenAmount: 12000000,
    totalPaidAmount: 12000000,
    status: 'completed',
    bookingDate: '2026-08-22T09:00:00Z',
    paymentPlanType: 'outright',
  },
  {
    id: 'bkg-11',
    bookingNumber: 'BKG-2026-011',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave (Mokila)',
    plotId: 'plot-15',
    plotNumber: 'P-15',
    customerId: 'cust-11',
    customerName: 'Sudhakar Goud',
    customerPhone: '+91 98480 11225',
    totalAmount: 2800000,
    discountAmount: 0,
    finalAmount: 2800000,
    tokenAmount: 100000,
    totalPaidAmount: 100000,
    status: 'expired',
    bookingDate: '2026-08-01T11:00:00Z',
    expiryDate: '2026-08-15T18:00:00Z',
    paymentPlanType: 'installment',
  },
  {
    id: 'bkg-12',
    bookingNumber: 'BKG-2026-012',
    projectId: 'proj-4',
    projectName: 'Royal Meadows (Shankarpally)',
    plotId: 'plot-rm08',
    plotNumber: 'RM-08',
    customerId: 'cust-12',
    customerName: 'Anitha Chowdary',
    customerPhone: '+91 98480 22339',
    totalAmount: 3800000,
    discountAmount: 50000,
    finalAmount: 3750000,
    tokenAmount: 300000,
    totalPaidAmount: 300000,
    status: 'draft',
    bookingDate: '2026-09-10T16:00:00Z',
    paymentPlanType: 'bank_loan',
  },
];

export const BookingsWorkspace: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>(SEED_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'completed' | 'cancelled' | 'expired'>('ALL');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [allotmentModalOpen, setAllotmentModalOpen] = useState(false);

  // Form states for new booking
  const [newBookingData, setNewBookingData] = useState({
    projectName: 'Sunrise Enclave',
    plotNumber: '',
    customerName: '',
    customerPhone: '',
    totalAmount: 2000000,
    discountAmount: 0,
    paymentAmount: 200000,
    paymentMethod: 'CASH' as const,
  });

  // Form states for payment
  const [paymentData, setPaymentData] = useState({
    amount: 100000,
    paymentMethod: 'BANK_TRANSFER' as const,
    transactionRef: '',
    remarks: '',
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { db } = getFirebaseInstance();
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BookingItem[];
        setBookings(list);
      }
    } catch {
      // Fallback to seed bookings
      setBookings(SEED_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchSearch =
        b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.customerPhone.includes(search) ||
        b.plotNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.projectName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter(b => b.status === 'active').length;
    const totalSaleValue = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.finalAmount || 0), 0);
    const totalCollected = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalPaidAmount || 0), 0);
    return { total, active, totalSaleValue, totalCollected };
  }, [bookings]);

  const handleCreateBooking = async () => {
    const finalSale = newBookingData.totalAmount - newBookingData.discountAmount;
    const created: BookingItem = {
      id: `bkg-${Date.now()}`,
      bookingNumber: `BKG-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: 'proj-1',
      projectName: newBookingData.projectName,
      plotId: `plot-${newBookingData.plotNumber}`,
      plotNumber: newBookingData.plotNumber,
      customerId: `cust-${Date.now()}`,
      customerName: newBookingData.customerName,
      customerPhone: newBookingData.customerPhone,
      totalAmount: newBookingData.totalAmount,
      discountAmount: newBookingData.discountAmount,
      finalAmount: finalSale,
      tokenAmount: newBookingData.paymentAmount,
      totalPaidAmount: newBookingData.paymentAmount,
      status: 'active',
      bookingDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      paymentPlanType: 'installment',
    };

    try {
      await inventoryBookingService.bookPlot({
        plotId: created.plotId,
        customerId: created.customerId,
        customerName: created.customerName,
        customerPhone: created.customerPhone,
        salesExecutiveId: 'exec-1',
        salesExecutiveName: 'Admin Sales',
        branchId: 'branch-1',
        projectId: created.projectId,
        projectName: created.projectName,
        plotNumber: created.plotNumber,
        plotSizeSqFt: 1200,
        agreedPricePerSqFt: finalSale / 1200,
        totalPlotAmount: newBookingData.totalAmount,
        discountAmount: newBookingData.discountAmount,
        finalSaleAmount: finalSale,
        paymentAmount: newBookingData.paymentAmount,
        paymentMethod: newBookingData.paymentMethod,
      }, 'admin-user');
    } catch {
      // Handled gracefully in mock / offline
    }

    setBookings([created, ...bookings]);
    setCreateDialogOpen(false);
    setNewBookingData({
      projectName: 'Sunrise Enclave',
      plotNumber: '',
      customerName: '',
      customerPhone: '',
      totalAmount: 2000000,
      discountAmount: 0,
      paymentAmount: 200000,
      paymentMethod: 'CASH',
    });
  };

  const handleRecordPayment = async () => {
    if (!selectedBooking) return;
    try {
      await paymentService.recordPayment({
        bookingId: selectedBooking.id,
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        transactionRef: paymentData.transactionRef,
        remarks: paymentData.remarks,
      }, 'admin-user');
    } catch {
      // Local fallback
    }

    const updated = bookings.map(b => {
      if (b.id === selectedBooking.id) {
        const newPaid = b.totalPaidAmount + Number(paymentData.amount);
        const isCompleted = newPaid >= b.finalAmount;
        return {
          ...b,
          totalPaidAmount: newPaid,
          status: isCompleted ? ('completed' as const) : b.status,
        };
      }
      return b;
    });

    setBookings(updated);
    setPaymentDialogOpen(false);
  };

  const columns = [
    { id: 'bookingNumber', label: 'Booking No.', sortable: true },
    {
      id: 'plotNumber',
      label: 'Plot & Project',
      format: (_: unknown, row?: BookingItem) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{row?.plotNumber}</Typography>
          <Typography variant="caption" color="text.secondary">{row?.projectName}</Typography>
        </Box>
      ),
    },
    {
      id: 'customerName',
      label: 'Customer Details',
      format: (_: unknown, row?: BookingItem) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>{row?.customerName}</Typography>
          <Typography variant="caption" color="text.secondary">{row?.customerPhone}</Typography>
        </Box>
      ),
    },
    {
      id: 'finalAmount',
      label: 'Sale Value',
      sortable: true,
      format: (val: unknown) => `₹${Number(val || 0).toLocaleString('en-IN')}`,
    },
    {
      id: 'totalPaidAmount',
      label: 'Paid / Balance',
      format: (_: unknown, row?: BookingItem) => {
        if (!row) return null;
        const balance = row.finalAmount - row.totalPaidAmount;
        return (
          <Box>
            <Typography variant="body2" color="success.main" fontWeight={600}>
              ₹{row.totalPaidAmount.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" color={balance > 0 ? 'warning.main' : 'text.secondary'}>
              Bal: ₹{balance.toLocaleString('en-IN')}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      format: (val: unknown) => {
        const s = String(val || '');
        const chipStatus = (s === 'completed' || s === 'active' || s === 'cancelled')
          ? s
          : 'cancelled';
        return <StatusChip status={chipStatus} />;
      },
    },
    {
      id: 'bookingDate',
      label: 'Date',
      format: (val: unknown) => (val ? new Date(String(val)).toLocaleDateString() : ''),
    },
    {
      id: 'id',
      label: 'Actions',
      format: (_: unknown, row?: BookingItem) => {
        if (!row) return null;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              title="View Details"
              onClick={() => {
                setSelectedBooking(row);
                setDetailsDialogOpen(true);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="info"
              title="Official Allotment Letter"
              onClick={() => {
                setSelectedBooking(row);
                setAllotmentModalOpen(true);
              }}
            >
              <AssignmentTurnedInIcon fontSize="small" />
            </IconButton>
            {row.status === 'active' && (
              <IconButton
                size="small"
                color="success"
                title="Record Payment"
                onClick={() => {
                  setSelectedBooking(row);
                  setPaymentData({
                    amount: Math.min(100000, row.finalAmount - row.totalPaidAmount),
                    paymentMethod: 'BANK_TRANSFER',
                    transactionRef: '',
                    remarks: '',
                  });
                  setPaymentDialogOpen(true);
                }}
              >
                <PaymentIcon fontSize="small" />
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
            Plot Bookings Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage customer plot reservations, advance payments, and booking lifecycles.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          New Booking
        </Button>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Bookings"
            value={metrics.total}
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Reservations"
            value={metrics.active}
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Sales Value"
            value={`₹${(metrics.totalSaleValue / 100000).toFixed(1)} L`}
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Advance Collected"
            value={`₹${(metrics.totalCollected / 100000).toFixed(1)} L`}
            trend={{ value: 15, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Main Table Paper */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ width: 320 }}>
            <SearchBox
              placeholder="Search by customer, plot, phone..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            {(['ALL', 'active', 'completed', 'cancelled'] as const).map(status => (
              <Chip
                key={status}
                label={status.toUpperCase()}
                clickable
                color={statusFilter === status ? 'primary' : 'default'}
                onClick={() => setStatusFilter(status)}
              />
            ))}
          </Stack>
        </Box>

        <DataTable
          {...({
            columns,
            data: filteredBookings,
            keyField: 'id',
            loading,
            emptyMessage: 'No bookings found matching your criteria.',
          } as unknown as React.ComponentProps<typeof DataTable>)}
        />
      </Paper>

      {/* Create Booking Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Create New Plot Booking</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              select
              value={newBookingData.projectName}
              onChange={e => setNewBookingData({ ...newBookingData, projectName: e.target.value })}
              fullWidth
            >
              <MenuItem value="Sunrise Enclave">Sunrise Enclave</MenuItem>
              <MenuItem value="Green Valley Phase 2">Green Valley Phase 2</MenuItem>
              <MenuItem value="Lakeview Heights">Lakeview Heights</MenuItem>
            </TextField>
            <TextField
              label="Plot Number (e.g. P-15)"
              value={newBookingData.plotNumber}
              onChange={e => setNewBookingData({ ...newBookingData, plotNumber: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Customer Full Name"
              value={newBookingData.customerName}
              onChange={e => setNewBookingData({ ...newBookingData, customerName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Customer Phone"
              value={newBookingData.customerPhone}
              onChange={e => setNewBookingData({ ...newBookingData, customerPhone: e.target.value })}
              fullWidth
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Total Plot Amount (₹)"
                  type="number"
                  value={newBookingData.totalAmount}
                  onChange={e => setNewBookingData({ ...newBookingData, totalAmount: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Discount (₹)"
                  type="number"
                  value={newBookingData.discountAmount}
                  onChange={e => setNewBookingData({ ...newBookingData, discountAmount: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Token Payment Amount (₹)"
                  type="number"
                  value={newBookingData.paymentAmount}
                  onChange={e => setNewBookingData({ ...newBookingData, paymentAmount: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Payment Method"
                  select
                  value={newBookingData.paymentMethod}
                  onChange={e =>
                    setNewBookingData({
                      ...newBookingData,
                      paymentMethod: e.target.value as typeof newBookingData.paymentMethod,
                    })
                  }
                  fullWidth
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="UPI">UPI / GPay</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateBooking}
            disabled={!newBookingData.plotNumber || !newBookingData.customerName}
          >
            Confirm Reservation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              Booking Details: {selectedBooking.bookingNumber}
            </Typography>
            <IconButton onClick={() => setDetailsDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Status:</Typography>
                <StatusChip
                  status={
                    selectedBooking.status === 'completed' ||
                    selectedBooking.status === 'active' ||
                    selectedBooking.status === 'cancelled'
                      ? selectedBooking.status
                      : 'cancelled'
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Project & Plot:</Typography>
                <Typography fontWeight={600}>{selectedBooking.projectName} ({selectedBooking.plotNumber})</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Customer Name:</Typography>
                <Typography fontWeight={600}>{selectedBooking.customerName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Phone Number:</Typography>
                <Typography fontWeight={500}>{selectedBooking.customerPhone}</Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Agreed Sale Value:</Typography>
                <Typography fontWeight={700}>₹{selectedBooking.finalAmount.toLocaleString('en-IN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Total Amount Paid:</Typography>
                <Typography fontWeight={700} color="success.main">
                  ₹{selectedBooking.totalPaidAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Balance Payable:</Typography>
                <Typography fontWeight={700} color="warning.main">
                  ₹{(selectedBooking.finalAmount - selectedBooking.totalPaidAmount).toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Payment Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (selectedBooking.totalPaidAmount / selectedBooking.finalAmount) * 100)}
                  sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                />
              </Box>

              {selectedBooking.expiryDate && selectedBooking.status === 'active' && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Booking valid until {new Date(selectedBooking.expiryDate).toLocaleDateString()}
                </Alert>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Record Payment Dialog */}
      {selectedBooking && (
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Record Payment</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Booking: <strong>{selectedBooking.bookingNumber}</strong> ({selectedBooking.customerName})
              </Typography>
              <TextField
                label="Payment Amount (₹)"
                type="number"
                value={paymentData.amount}
                onChange={e => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                fullWidth
                required
              />
              <TextField
                label="Payment Method"
                select
                value={paymentData.paymentMethod}
                onChange={e =>
                  setPaymentData({
                    ...paymentData,
                    paymentMethod: e.target.value as typeof paymentData.paymentMethod,
                  })
                }
                fullWidth
              >
                <MenuItem value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</MenuItem>
                <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
                <MenuItem value="CHEQUE">Cheque</MenuItem>
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="CARD">Debit/Credit Card</MenuItem>
              </TextField>
              <TextField
                label="Transaction Reference / Cheque No."
                value={paymentData.transactionRef}
                onChange={e => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                fullWidth
                placeholder="UTR / Ref Number"
              />
              <TextField
                label="Remarks"
                value={paymentData.remarks}
                onChange={e => setPaymentData({ ...paymentData, remarks: e.target.value })}
                fullWidth
                placeholder="e.g. Second installment"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={handleRecordPayment}>
              Save Payment
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Official Printable Allotment Letter Modal */}
      <OfficialAllotmentModal
        open={allotmentModalOpen}
        onClose={() => setAllotmentModalOpen(false)}
        booking={selectedBooking}
      />
    </Box>
  );
};

export default BookingsWorkspace;
