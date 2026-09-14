import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ExpenseClaim, ExpenseCategory, ExpenseStatus } from '@real-estate-erp/types';
import { DataTable, MetricCard, SearchBox } from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { AddExpenseDialog } from './components/AddExpenseDialog';
import { ExpenseDetailsDialog } from './components/ExpenseDetailsDialog';

export const SEED_EXPENSES: ExpenseClaim[] = [
  {
    id: 'exp-1',
    claimNumber: 'EXP-2026-081',
    category: 'SITE_VISIT',
    title: 'Customer Site Visit Refreshments & Lunch - ISKON City - 2',
    description: 'Refreshments and lunch provided for 8 visiting NRI families at ISKON City - 2 Podalakur Road site office.',
    amount: 4850,
    expenseDate: '2026-09-06',
    paymentMode: 'UPI',
    status: 'APPROVED',
    submittedBy: {
      id: 'usr-se2',
      name: 'Vamshi Krishna',
      role: 'Sales Executive',
    },
    approvedBy: {
      id: 'usr-bm1',
      name: 'Srinivas Murthy (Branch Head)',
      approvedAt: '2026-09-06T17:30:00Z',
      remarks: 'Verified against visit log book.',
    },
    linkedSiteVisitId: 'ISKON City - 2 (Podalakur Road)',
    createdAt: '2026-09-06T14:20:00Z',
    updatedAt: '2026-09-06T17:30:00Z',
  },
  {
    id: 'exp-2',
    claimNumber: 'EXP-2026-082',
    category: 'VEHICLE_FUEL',
    title: 'Diesel Refill for Innova Crysta (Site Visit Fleet)',
    description: 'Full tank diesel refill (52.5 Litres) before customer site trip to ISKON City - 2.',
    amount: 5400,
    expenseDate: '2026-09-07',
    paymentMode: 'COMPANY_CARD',
    status: 'APPROVED',
    submittedBy: {
      id: 'usr-drv1',
      name: 'Ramesh Goud (Driver)',
      role: 'Fleet Driver',
    },
    approvedBy: {
      id: 'usr-bm1',
      name: 'Srinivas Murthy',
      approvedAt: '2026-09-07T11:00:00Z',
      remarks: 'Odometer reading verified (48,250 KM).',
    },
    linkedVehicleId: 'AP 26 UB 1001 (Innova Crysta)',
    createdAt: '2026-09-07T09:15:00Z',
    updatedAt: '2026-09-07T11:00:00Z',
  },
  {
    id: 'exp-3',
    claimNumber: 'EXP-2026-083',
    category: 'MARKETING_CAMPAIGN',
    title: 'Meta Ads Lead Generation Campaign - ISKON City - 2',
    description: 'Weekly sponsored ad spends on Facebook & Instagram targeting luxury plot buyers.',
    amount: 38500,
    expenseDate: '2026-09-05',
    paymentMode: 'COMPANY_CARD',
    status: 'PAID',
    submittedBy: {
      id: 'usr-003',
      name: 'Vikram Varma',
      role: 'Marketing Head',
    },
    approvedBy: {
      id: 'usr-001',
      name: 'Rajesh Kumar (MD)',
      approvedAt: '2026-09-05T16:00:00Z',
      remarks: 'Campaign generated 142 qualified leads.',
    },
    linkedCampaignId: 'ISKON City - 2 Digital Drive',
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T16:00:00Z',
  },
  {
    id: 'exp-4',
    claimNumber: 'EXP-2026-084',
    category: 'EMPLOYEE_CLAIM',
    title: 'Client Meeting Dinner & Commute Allowances',
    description: 'Dinner with HNI investor group at Madhapur for commercial layout inquiry.',
    amount: 2750,
    expenseDate: '2026-09-08',
    paymentMode: 'UPI',
    status: 'PENDING',
    submittedBy: {
      id: 'usr-sm2',
      name: 'Praveen Teja',
      role: 'Senior Sales Manager',
    },
    createdAt: '2026-09-08T19:40:00Z',
    updatedAt: '2026-09-08T19:40:00Z',
  },
  {
    id: 'exp-5',
    claimNumber: 'EXP-2026-085',
    category: 'VEHICLE_FUEL',
    title: 'Diesel Refill - Force Tempo Traveller 17 Seater',
    description: 'Diesel for weekend group site trip (Kovuru & Highway ventures).',
    amount: 6200,
    expenseDate: '2026-09-08',
    paymentMode: 'CASH',
    status: 'PENDING',
    submittedBy: {
      id: 'usr-drv2',
      name: 'Suresh Kumar',
      role: 'Fleet Driver',
    },
    linkedVehicleId: 'AP 26 EX 4050 (Tempo Traveller)',
    createdAt: '2026-09-08T16:30:00Z',
    updatedAt: '2026-09-08T16:30:00Z',
  },
  {
    id: 'exp-6',
    claimNumber: 'EXP-2026-086',
    category: 'SITE_DEVELOPMENT',
    title: 'Layout Marker Stones Painting & Signboards',
    description: 'Purchased reflective paint and paid 3 labour workers for boundary plot stones.',
    amount: 16500,
    expenseDate: '2026-09-04',
    paymentMode: 'BANK_TRANSFER',
    status: 'APPROVED',
    submittedBy: {
      id: 'usr-eng1',
      name: 'Mahesh Kumar',
      role: 'Project Site Engineer',
    },
    approvedBy: {
      id: 'usr-001b',
      name: 'K. Raghava Rao (Director)',
      approvedAt: '2026-09-04T18:00:00Z',
      remarks: 'Approved per developmental layout estimates.',
    },
    linkedSiteVisitId: 'Dream City (Kovuru Highway)',
    createdAt: '2026-09-04T11:00:00Z',
    updatedAt: '2026-09-04T18:00:00Z',
  },
  {
    id: 'exp-7',
    claimNumber: 'EXP-2026-087',
    category: 'MARKETING_CAMPAIGN',
    title: 'Drone Shoot & 4K Video Production for ISKON Brundhavanam',
    description: 'Professional aerial video shoot, project 3D render walk-through and YouTube editing.',
    amount: 45000,
    expenseDate: '2026-09-02',
    paymentMode: 'BANK_TRANSFER',
    status: 'PAID',
    submittedBy: {
      id: 'usr-me2',
      name: 'Divya Sree',
      role: 'Marketing Executive',
    },
    approvedBy: {
      id: 'usr-003',
      name: 'Vikram Varma (Marketing Head)',
      approvedAt: '2026-09-03T10:00:00Z',
      remarks: 'High quality video completed for digital campaigns.',
    },
    linkedCampaignId: 'Dream City Kovuru Launch Drive',
    createdAt: '2026-09-02T14:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'exp-8',
    claimNumber: 'EXP-2026-088',
    category: 'VEHICLE_FUEL',
    title: 'Fuel Refill - Maruti Ertiga (Customer Transit)',
    description: 'Petrol refill for NRI client pickup to ISKON City - 2 site.',
    amount: 3200,
    expenseDate: '2026-09-09',
    paymentMode: 'UPI',
    status: 'APPROVED',
    submittedBy: {
      id: 'usr-drv3',
      name: 'Venu Madhav',
      role: 'Fleet Driver',
    },
    approvedBy: {
      id: 'usr-bm1',
      name: 'Srinivas Murthy',
      approvedAt: '2026-09-09T18:00:00Z',
      remarks: 'Customer transit verified in vehicle log.',
    },
    linkedVehicleId: 'AP 26 HK 2020 (Ertiga)',
    createdAt: '2026-09-09T15:00:00Z',
    updatedAt: '2026-09-09T18:00:00Z',
  },
  {
    id: 'exp-9',
    claimNumber: 'EXP-2026-089',
    category: 'OFFICE_ADMIN',
    title: 'Brochure Printing & Master Plan Lamination',
    description: 'Printed 2,000 deluxe brochures and laminated 10 master layout plans.',
    amount: 22000,
    expenseDate: '2026-09-01',
    paymentMode: 'BANK_TRANSFER',
    status: 'PAID',
    submittedBy: {
      id: 'usr-007',
      name: 'Mahesh Babu M',
      role: 'Marketing Executive',
    },
    approvedBy: {
      id: 'usr-acc1',
      name: 'Lakshmi Narayana (Accounts Head)',
      approvedAt: '2026-09-01T17:00:00Z',
      remarks: 'GST tax invoice verified.',
    },
    createdAt: '2026-09-01T11:00:00Z',
    updatedAt: '2026-09-01T17:00:00Z',
  },
  {
    id: 'exp-10',
    claimNumber: 'EXP-2026-090',
    category: 'SITE_VISIT',
    title: 'Sunday Customer Breakfast & Mineral Water Cans',
    description: 'Breakfast and 15 water cans for 40 customers attending mega site visit drive.',
    amount: 6500,
    expenseDate: '2026-09-06',
    paymentMode: 'CASH',
    status: 'APPROVED',
    submittedBy: {
      id: 'usr-006',
      name: 'Anand Naidu',
      role: 'Sales Executive',
    },
    approvedBy: {
      id: 'usr-bm2',
      name: 'Kavitha Reddy',
      approvedAt: '2026-09-06T19:00:00Z',
      remarks: 'Bills attached and verified.',
    },
    linkedSiteVisitId: 'ISKON Brundhavanam (Chinthareddypalem)',
    createdAt: '2026-09-06T15:00:00Z',
    updatedAt: '2026-09-06T19:00:00Z',
  },
];

export const ExpensesWorkspace: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(SEED_EXPENSES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentTab, setCurrentTab] = useState<number>(0);

  // Dialog States
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as ExpenseClaim[];
            const fetchedIds = new Set(fetched.map((p) => p.id));
            const merged = [...fetched, ...SEED_EXPENSES.filter((p) => !fetchedIds.has(p.id))];
            setExpenses(merged);
          }
        }
      } catch (err) {
        console.warn('Firestore fetch expenses fallback to seeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleExpenseAdded = (newExpense: ExpenseClaim) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleOpenDetails = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    setDetailsDialogOpen(true);
  };

  const handleStatusUpdate = (claimId: string, newStatus: ExpenseStatus, remarks?: string) => {
    setExpenses((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ExpenseClaim = {
            ...c,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          if (newStatus === 'APPROVED') {
            updated.approvedBy = {
              id: 'usr-admin',
              name: 'Accounts & Admin Team',
              approvedAt: new Date().toISOString(),
              remarks,
            };
          } else if (newStatus === 'REJECTED') {
            updated.rejectedReason = remarks;
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalSpends = expenses.reduce((sum, e) => sum + e.amount, 0);
    const pendingClaims = expenses.filter((e) => e.status === 'PENDING');
    const pendingAmount = pendingClaims.reduce((sum, e) => sum + e.amount, 0);
    const approvedAmount = expenses
      .filter((e) => e.status === 'APPROVED' || e.status === 'PAID')
      .reduce((sum, e) => sum + e.amount, 0);
    const fleetAndVisitCosts = expenses
      .filter((e) => e.category === 'VEHICLE_FUEL' || e.category === 'SITE_VISIT')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalSpends: `₹${totalSpends.toLocaleString('en-IN')}`,
      pendingCount: pendingClaims.length,
      pendingAmount: `₹${pendingAmount.toLocaleString('en-IN')}`,
      approvedAmount: `₹${approvedAmount.toLocaleString('en-IN')}`,
      fleetAndVisitCosts: `₹${fleetAndVisitCosts.toLocaleString('en-IN')}`,
    };
  }, [expenses]);

  // Tab Filtering
  const filteredExpenses = useMemo(() => {
    return expenses.filter((claim) => {
      // Tab constraint
      if (currentTab === 1 && claim.status !== 'PENDING') return false;
      if (
        currentTab === 2 &&
        claim.category !== 'VEHICLE_FUEL' &&
        claim.category !== 'SITE_VISIT'
      )
        return false;
      if (currentTab === 3 && claim.category !== 'MARKETING_CAMPAIGN') return false;
      if (currentTab === 4 && claim.category !== 'EMPLOYEE_CLAIM') return false;

      // Search
      const matchSearch =
        !searchTerm.trim() ||
        claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.linkedVehicleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.linkedSiteVisitId?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchCategory =
        categoryFilter === 'ALL' || claim.category === categoryFilter;

      // Status
      const matchStatus = statusFilter === 'ALL' || claim.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [expenses, currentTab, searchTerm, categoryFilter, statusFilter]);

  const getCategoryChip = (category: ExpenseCategory) => {
    switch (category) {
      case 'SITE_VISIT':
        return <Chip size="small" icon={<DirectionsCarIcon />} label="Site Visit" color="primary" variant="outlined" />;
      case 'VEHICLE_FUEL':
        return <Chip size="small" icon={<LocalGasStationIcon />} label="Vehicle Fuel" color="warning" variant="outlined" />;
      case 'MARKETING_CAMPAIGN':
        return <Chip size="small" icon={<CampaignIcon />} label="Marketing Spends" color="secondary" variant="outlined" />;
      case 'EMPLOYEE_CLAIM':
        return <Chip size="small" icon={<PersonIcon />} label="Employee Claim" color="info" variant="outlined" />;
      default:
        return <Chip size="small" icon={<ReceiptLongIcon />} label={category.replace('_', ' ')} variant="outlined" />;
    }
  };

  const getStatusChip = (status: ExpenseStatus) => {
    const color =
      status === 'APPROVED'
        ? 'success'
        : status === 'PAID'
        ? 'primary'
        : status === 'REJECTED'
        ? 'error'
        : 'warning';
    return <Chip label={status} size="small" color={color} sx={{ fontWeight: 700 }} />;
  };

  const columns = [
    {
      id: 'claimNumber',
      label: 'Claim ID & Date',
      sortable: true,
      render: (row: ExpenseClaim) => (
        <Box>
          <Typography variant="body2" fontWeight={700} color="primary">
            {row.claimNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.expenseDate}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      render: (row: ExpenseClaim) => getCategoryChip(row.category),
    },
    {
      id: 'title',
      label: 'Title & Context',
      render: (row: ExpenseClaim) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.title}
          </Typography>
          {(row.linkedVehicleId || row.linkedSiteVisitId || row.linkedCampaignId) && (
            <Typography variant="caption" color="text.secondary" display="block">
              Ref: {row.linkedVehicleId || row.linkedSiteVisitId || row.linkedCampaignId}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'amount',
      label: 'Amount (₹)',
      sortable: true,
      render: (row: ExpenseClaim) => (
        <Typography variant="body2" fontWeight={700} color="text.primary">
          ₹{row.amount.toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      id: 'paymentMode',
      label: 'Mode',
      render: (row: ExpenseClaim) => (
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {row.paymentMode.replace('_', ' ')}
        </Typography>
      ),
    },
    {
      id: 'submittedBy',
      label: 'Submitted By',
      render: (row: ExpenseClaim) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.submittedBy.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.submittedBy.role}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Approval Status',
      sortable: true,
      render: (row: ExpenseClaim) => getStatusChip(row.status),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: ExpenseClaim) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails(row);
            }}
          >
            Review
          </Button>
          {row.status === 'PENDING' && (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(row.id, 'APPROVED', 'Quick Approved');
              }}
            >
              Approve
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Expenses & Claims Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage site visit expenditures, fleet vehicle fuel bills, marketing spends, and employee reimbursement claims
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ px: 2, py: 0.75, fontWeight: 600, borderRadius: 2, fontSize: '0.85rem' }}
        >
          Submit Expense Claim
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Spends Recorded"
            value={metrics.totalSpends}
            subtitle="All Recorded Expenses"
            icon={<ReceiptLongIcon />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Approvals"
            value={metrics.pendingCount}
            unit="Claims"
            subtitle={`Total: ${metrics.pendingAmount}`}
            icon={<ReceiptLongIcon />}
            color="#d97706"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Approved & Settled"
            value={metrics.approvedAmount}
            subtitle="Disbursed & Settled"
            icon={<CheckCircleIcon />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Site Visits & Fleet Fuel"
            value={metrics.fleetAndVisitCosts}
            subtitle="Travel & Fuel Spends"
            icon={<LocalGasStationIcon />}
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      {/* Workspace Navigation Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, val) => setCurrentTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Expenses" />
          <Tab
            label={
              <Badge badgeContent={metrics.pendingCount} color="warning" sx={{ pr: 1 }}>
                Pending Approvals
              </Badge>
            }
          />
          <Tab label="Site Visits & Fleet Fuel" />
          <Tab label="Marketing Spends" />
          <Tab label="Employee Reimbursements" />
        </Tabs>

        {/* Filters Toolbar */}
        <Box sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, maxWidth: { md: 450 } }}>
              <SearchBox
                placeholder="Search claims by ID, title, employee, vehicle..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <TextField
                select
                size="small"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                <MenuItem value="SITE_VISIT">Site Visits</MenuItem>
                <MenuItem value="VEHICLE_FUEL">Vehicle Fuel</MenuItem>
                <MenuItem value="MARKETING_CAMPAIGN">Marketing Spends</MenuItem>
                <MenuItem value="EMPLOYEE_CLAIM">Employee Claims</MenuItem>
                <MenuItem value="SITE_DEVELOPMENT">Site Development</MenuItem>
                <MenuItem value="OFFICE_ADMIN">Office Admin</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {/* Expenses DataTable */}
        <Box sx={{ p: 2 }}>
          <DataTable
            {...({
              columns,
              data: filteredExpenses,
              loading,
              onRowClick: (row: ExpenseClaim) => handleOpenDetails(row),
            } as any)}
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <AddExpenseDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />

      <ExpenseDetailsDialog
        claim={selectedClaim}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default ExpensesWorkspace;
