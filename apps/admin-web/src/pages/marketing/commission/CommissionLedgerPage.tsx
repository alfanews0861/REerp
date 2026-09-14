import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface LedgerEntry {
  id: string;
  bookingId: string;
  member: string;
  position: string;
  project: string;
  plotNumber: string;
  saleAmount: string;
  commissionRate: string;
  grossAmount: number;
  tdsDeduction: number;
  netPayable: number;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  date: string;
}

export const initialLedger: LedgerEntry[] = [
  {
    id: 'LED-801',
    bookingId: 'BKG-2026-001',
    member: 'Anand Naidu',
    position: 'Sales Manager (SM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-12',
    saleAmount: '₹24,50,000',
    commissionRate: '3.0%',
    grossAmount: 73500,
    tdsDeduction: 3675,
    netPayable: 69825,
    status: 'APPROVED',
    date: '2026-09-02',
  },
  {
    id: 'LED-802',
    bookingId: 'BKG-2026-001',
    member: 'Priya Sharma',
    position: 'Senior Sales Manager (SSM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-12',
    saleAmount: '₹24,50,000',
    commissionRate: '1.0%',
    grossAmount: 24500,
    tdsDeduction: 1225,
    netPayable: 23275,
    status: 'APPROVED',
    date: '2026-09-02',
  },
  {
    id: 'LED-803',
    bookingId: 'BKG-2026-001',
    member: 'Vikram Rao',
    position: 'General Manager (GM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-12',
    saleAmount: '₹24,50,000',
    commissionRate: '0.5%',
    grossAmount: 12250,
    tdsDeduction: 612,
    netPayable: 11638,
    status: 'DISBURSED',
    date: '2026-09-04',
  },
  {
    id: 'LED-804',
    bookingId: 'BKG-2026-002',
    member: 'Vamshi Krishna',
    position: 'Sales Manager (SM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-45',
    saleAmount: '₹18,00,000',
    commissionRate: '3.0%',
    grossAmount: 54000,
    tdsDeduction: 2700,
    netPayable: 51300,
    status: 'DISBURSED',
    date: '2026-08-22',
  },
  {
    id: 'LED-805',
    bookingId: 'BKG-2026-002',
    member: 'Kavitha Reddy',
    position: 'Chief General Manager (CGM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-45',
    saleAmount: '₹18,00,000',
    commissionRate: '0.5%',
    grossAmount: 9000,
    tdsDeduction: 450,
    netPayable: 8550,
    status: 'DISBURSED',
    date: '2026-08-25',
  },
  {
    id: 'LED-806',
    bookingId: 'BKG-2026-003',
    member: 'Sudhakar Goud',
    position: 'Senior Sales Manager (SSM)',
    project: 'Dream City (Kovuru Highway)',
    plotNumber: 'P-78',
    saleAmount: '₹31,00,000',
    commissionRate: '2.5%',
    grossAmount: 77500,
    tdsDeduction: 3875,
    netPayable: 73625,
    status: 'PENDING',
    date: '2026-09-08',
  },
  {
    id: 'LED-807',
    bookingId: 'BKG-2026-003',
    member: 'Suresh Babu',
    position: 'Chief General Manager (CGM)',
    project: 'Dream City (Kovuru Highway)',
    plotNumber: 'P-78',
    saleAmount: '₹31,00,000',
    commissionRate: '0.5%',
    grossAmount: 15500,
    tdsDeduction: 775,
    netPayable: 14725,
    status: 'PENDING',
    date: '2026-09-08',
  },
  {
    id: 'LED-808',
    bookingId: 'BKG-2026-004',
    member: 'Praveen Teja',
    position: 'Senior Sales Manager (SSM)',
    project: 'ISKON Brundhavanam (Chinthareddypalem)',
    plotNumber: 'PC-15',
    saleAmount: '₹55,00,000',
    commissionRate: '2.5%',
    grossAmount: 137500,
    tdsDeduction: 6875,
    netPayable: 130625,
    status: 'APPROVED',
    date: '2026-09-05',
  },
  {
    id: 'LED-809',
    bookingId: 'BKG-2026-004',
    member: 'Murali Mohan',
    position: 'Chief General Manager (CGM)',
    project: 'ISKON Brundhavanam (Chinthareddypalem)',
    plotNumber: 'PC-15',
    saleAmount: '₹55,00,000',
    commissionRate: '0.5%',
    grossAmount: 27500,
    tdsDeduction: 1375,
    netPayable: 26125,
    status: 'APPROVED',
    date: '2026-09-05',
  },
  {
    id: 'LED-810',
    bookingId: 'BKG-2026-005',
    member: 'Ravi Teja Sharma',
    position: 'Associate',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-06',
    saleAmount: '₹32,00,000',
    commissionRate: '2.0%',
    grossAmount: 64000,
    tdsDeduction: 3200,
    netPayable: 60800,
    status: 'PENDING',
    date: '2026-09-09',
  },
  {
    id: 'LED-811',
    bookingId: 'BKG-2026-006',
    member: 'Sneha Latha',
    position: 'Sales Manager (SM)',
    project: 'ISKON Elite Township (Annamayya Circle Extn)',
    plotNumber: 'RM-22',
    saleAmount: '₹42,00,000',
    commissionRate: '3.0%',
    grossAmount: 126000,
    tdsDeduction: 6300,
    netPayable: 119700,
    status: 'APPROVED',
    date: '2026-09-03',
  },
  {
    id: 'LED-812',
    bookingId: 'BKG-2026-007',
    member: 'Swathi Naidu',
    position: 'Associate',
    project: 'Dream City (Kovuru Highway)',
    plotNumber: 'GV-33',
    saleAmount: '₹19,50,000',
    commissionRate: '2.0%',
    grossAmount: 39000,
    tdsDeduction: 1950,
    netPayable: 37050,
    status: 'DISBURSED',
    date: '2026-08-30',
  },
  {
    id: 'LED-813',
    bookingId: 'BKG-2026-008',
    member: 'Rajesh Gupta',
    position: 'Senior Sales Manager (SSM)',
    project: 'ISKON City - 2 (Podalakur Road)',
    plotNumber: 'P-88',
    saleAmount: '₹26,00,000',
    commissionRate: '2.5%',
    grossAmount: 65000,
    tdsDeduction: 3250,
    netPayable: 61750,
    status: 'REJECTED',
    date: '2026-08-15',
  },
  {
    id: 'LED-814',
    bookingId: 'BKG-2026-009',
    member: 'Shravan Reddy',
    position: 'Associate',
    project: 'ISKON Brundhavanam (Chinthareddypalem)',
    plotNumber: 'PC-40',
    saleAmount: '₹48,00,000',
    commissionRate: '2.0%',
    grossAmount: 96000,
    tdsDeduction: 4800,
    netPayable: 91200,
    status: 'APPROVED',
    date: '2026-09-06',
  },
  {
    id: 'LED-815',
    bookingId: 'BKG-2026-010',
    member: 'Ramesh Varma',
    position: 'Sr. Chief General Manager (Sr CGM)',
    project: 'ISKON Brundhavanam (Chinthareddypalem)',
    plotNumber: 'PC-01',
    saleAmount: '₹1,20,00,000',
    commissionRate: '0.5%',
    grossAmount: 60000,
    tdsDeduction: 3000,
    netPayable: 57000,
    status: 'DISBURSED',
    date: '2026-08-28',
  },
];

export const CommissionLedgerPage: React.FC = () => {
  const [ledger, setLedger] = useState<LedgerEntry[]>(initialLedger);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [dialogAction, setDialogAction] = useState<'APPROVE' | 'REJECT' | 'DISBURSE' | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT / RTGS');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredLedger = ledger.filter((item) => {
    const matchSearch =
      item.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      item.member.toLowerCase().includes(search.toLowerCase()) ||
      item.project.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalGrossPending = ledger
    .filter((l) => l.status === 'PENDING')
    .reduce((sum, l) => sum + l.grossAmount, 0);

  const totalDisbursed = ledger
    .filter((l) => l.status === 'DISBURSED')
    .reduce((sum, l) => sum + l.netPayable, 0);

  const handleOpenAction = (entry: LedgerEntry, action: 'APPROVE' | 'REJECT' | 'DISBURSE') => {
    setSelectedEntry(entry);
    setDialogAction(action);
    setPaymentRef(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmAction = () => {
    if (!selectedEntry || !dialogAction) return;

    let targetStatus: LedgerEntry['status'] = 'PENDING';
    if (dialogAction === 'APPROVE') targetStatus = 'APPROVED';
    if (dialogAction === 'REJECT') targetStatus = 'REJECTED';
    if (dialogAction === 'DISBURSE') targetStatus = 'DISBURSED';

    setLedger(
      ledger.map((item) =>
        item.id === selectedEntry.id ? { ...item, status: targetStatus } : item
      )
    );

    setActionSuccess(`Entry ${selectedEntry.id} successfully updated to ${targetStatus}`);
    setDialogAction(null);
    setSelectedEntry(null);
  };

  const getStatusChip = (status: LedgerEntry['status']) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending Review" color="warning" size="small" />;
      case 'APPROVED':
        return <Chip label="Approved" color="info" size="small" />;
      case 'DISBURSED':
        return <Chip label="Paid / Disbursed" color="success" size="small" />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Commission Ledger & Payouts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Audit trail of broker commissions, TDS compliance deductions, and bank disbursement triggers.
          </Typography>
        </Box>
      </Stack>

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {/* Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pending Approval
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="warning.main">
                    ₹{totalGrossPending.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <HourglassEmptyIcon color="warning" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Disbursed Net
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    ₹{totalDisbursed.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total TDS Withheld (5%)
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ₹{ledger.reduce((s, l) => s + l.tdsDeduction, 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ledger Claims
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {ledger.length} Claims
                  </Typography>
                </Box>
                <AccountBalanceWalletIcon color="secondary" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search by Booking ID, Member, or Project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="PENDING">Pending Review</MenuItem>
              <MenuItem value="APPROVED">Approved for Payout</MenuItem>
              <MenuItem value="DISBURSED">Paid / Disbursed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Entry & Booking</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Network Member</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Property Sold</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Gross Amount</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>TDS (5%)</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Net Payable</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLedger
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="700">
                      {item.bookingId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.id} • {item.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, fontSize: '0.85rem' }}>
                        {item.member.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {item.member}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.position}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.project}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.plotNumber} • Value: {item.saleAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      ₹{item.grossAmount.toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rate: {item.commissionRate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main">
                      -₹{item.tdsDeduction.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="700" color="success.main">
                      ₹{item.netPayable.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {item.status === 'PENDING' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenAction(item, 'APPROVE')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenAction(item, 'REJECT')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {item.status === 'APPROVED' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenAction(item, 'DISBURSE')}
                        >
                          Disburse
                        </Button>
                      )}
                      {(item.status === 'DISBURSED' || item.status === 'REJECTED') && (
                        <Typography variant="caption" color="text.secondary">
                          Closed
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredLedger.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Action Dialog */}
      <Dialog open={Boolean(dialogAction)} onClose={() => setDialogAction(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: '700' }}>
          {dialogAction === 'APPROVE' && 'Approve Commission Claim'}
          {dialogAction === 'DISBURSE' && 'Disburse Commission Payout'}
          {dialogAction === 'REJECT' && 'Reject Commission Claim'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedEntry && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Member:</strong> {selectedEntry.member} ({selectedEntry.position})
              </Typography>
              <Typography variant="body2">
                <strong>Booking:</strong> {selectedEntry.bookingId} - {selectedEntry.project}
              </Typography>
              <Typography variant="body2">
                <strong>Net Payable Amount:</strong>{' '}
                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  ₹{selectedEntry.netPayable.toLocaleString('en-IN')}
                </span>
              </Typography>

              {dialogAction === 'DISBURSE' && (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                      value={paymentMode}
                      label="Payment Mode"
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <MenuItem value="NEFT / RTGS">NEFT / RTGS Direct Bank Transfer</MenuItem>
                      <MenuItem value="Cheque">Company Cheque</MenuItem>
                      <MenuItem value="UPI / IMPS">Corporate UPI Transfer</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Transaction / Cheque Reference Number"
                    fullWidth
                    size="small"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                </>
              )}

              {dialogAction === 'REJECT' && (
                <Alert severity="warning">
                  Are you sure you want to reject this commission claim? This action will mark it as void in the audit trail.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogAction(null)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={
              dialogAction === 'REJECT' ? 'error' : dialogAction === 'DISBURSE' ? 'primary' : 'success'
            }
            onClick={handleConfirmAction}
          >
            Confirm {dialogAction}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionLedgerPage;
