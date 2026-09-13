import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
  Snackbar,
  Stack,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuthContext } from '@real-estate-erp/firebase';
import { printReportDocument } from './OfficialReportPrint';

interface ReportDefinition {
  id: number;
  title: string;
  category: 'Sales' | 'Marketing' | 'Telecalling' | 'Site Visits' | 'Finance & Commissions';
  summary: string;
  columns: string[];
  data: { [key: string]: any }[];
}

const REPORTS_CATALOG: ReportDefinition[] = [
  {
    id: 1,
    title: 'Sales & Plot Revenue Performance',
    category: 'Sales',
    summary: 'Comprehensive breakdown of booked plots, square yardage, gross revenue and collection percentage by project.',
    columns: ['Project / Venture Name', 'Plots Sold', 'Total Sq. Yds', 'Gross Revenue', 'Collected Amount', 'Recovery %'],
    data: [
      { col0: 'Sunrise Enclave (Mokila)', col1: '64 Plots', col2: '14,200 sq.yds', col3: '₹ 22.40 Cr', col4: '₹ 14.80 Cr', col5: '66.1%' },
      { col0: 'Green Meadows (Shadnagar)', col1: '48 Plots', col2: '10,800 sq.yds', col3: '₹ 14.50 Cr', col4: '₹ 8.90 Cr', col5: '61.4%' },
      { col0: 'Palm Meadows (Jadcherla)', col1: '32 Plots', col2: '7,200 sq.yds', col3: '₹ 8.60 Cr', col4: '₹ 4.50 Cr', col5: '52.3%' },
      { col0: 'Emerald City (Maheshwaram)', col1: '18 Plots', col2: '4,100 sq.yds', col3: '₹ 3.15 Cr', col4: '₹ 1.60 Cr', col5: '50.8%' },
    ],
  },
  {
    id: 2,
    title: 'Lead Acquisition & Marketing ROI',
    category: 'Marketing',
    summary: 'Distribution of inbound leads, conversion to site visits, and average cost-per-lead (CPL) across marketing channels.',
    columns: ['Marketing Channel', 'Leads Generated', 'Site Visits Done', 'Plots Closed', 'Total Spend', 'Cost Per Lead (CPL)'],
    data: [
      { col0: 'Facebook & Instagram Meta Ads', col1: '1,890', col2: '420', col3: '28 Plots', col4: '₹ 68,500', col5: '₹ 36.24' },
      { col0: 'Google Search Ads & SEO', col1: '840', col2: '210', col3: '19 Plots', col4: '₹ 42,000', col5: '₹ 50.00' },
      { col0: 'Physical Walk-ins / Hoardings', col1: '620', col2: '310', col3: '24 Plots', col4: '₹ 95,000', col5: '₹ 153.22' },
      { col0: 'Channel Partner & Associate Referrals', col1: '480', col2: '240', col3: '36 Plots', col4: '₹ 15,000', col5: '₹ 31.25' },
    ],
  },
  {
    id: 3,
    title: 'Telecaller Productivity & Outbound Call Audit',
    category: 'Telecalling',
    summary: 'Evaluation of telecaller dial targets, reach rate, qualified leads, and direct site visits booked.',
    columns: ['Telecaller Name', 'Total Dials', 'Connected Calls', 'High-Intent Qualified', 'Site Visits Booked', 'Connect Rate %'],
    data: [
      { col0: 'Sunita Reddy (Team Lead)', col1: '1,420', col2: '1,250', col3: '142 Leads', col4: '48 Visits', col5: '88.0%' },
      { col0: 'Kiran Rao (Inbound Desk)', col1: '1,180', col2: '1,010', col3: '118 Leads', col4: '36 Visits', col5: '85.6%' },
      { col0: 'Meena Kumari (Campaign Outbound)', col1: '980', col2: '820', col3: '94 Leads', col4: '29 Visits', col5: '83.7%' },
      { col0: 'Sneha Latha (Digital Followups)', col1: '890', col2: '740', col3: '86 Leads', col4: '22 Visits', col5: '83.1%' },
    ],
  },
  {
    id: 4,
    title: 'Site Visits & Vehicle Fleet Transport',
    category: 'Site Visits',
    summary: 'Site visit frequency, vehicle distance traveled, driver efficiency, and client purchase intention outcome.',
    columns: ['Vehicle / Driver', 'Venture Location', 'Trips Completed', 'Total KM Run', 'Fuel Logged', 'Visit Outcome (Hot/Warm)'],
    data: [
      { col0: 'Innova Crysta (TS 09 UB 1001) / Ramesh', col1: 'Mokila (Sunrise Enclave)', col2: '42 Trips', col3: '3,150 KM', col4: '₹ 22,400', col5: '28 Hot (66.7%)' },
      { col0: 'Tempo Traveller (TS 08 EX 4050) / Suresh', col1: 'Shadnagar (Green Meadows)', col2: '36 Trips', col3: '4,200 KM', col4: '₹ 31,500', col5: '24 Hot (66.7%)' },
      { col0: 'Scorpio-N (TS 07 HK 9922) / Raju', col1: 'Jadcherla (Palm Meadows)', col2: '28 Trips', col3: '3,600 KM', col4: '₹ 26,000', col5: '16 Hot (57.1%)' },
    ],
  },
  {
    id: 5,
    title: 'Collections, Expenses & Agent Commission Ledger',
    category: 'Finance & Commissions',
    summary: 'Total realized financial receipts, office/marketing expenses, and multi-tier commission liabilities.',
    columns: ['Cadre / Account Segment', 'Gross Volume', 'Approved Payout', 'Paid to Date', 'Balance Pending', 'Status'],
    data: [
      { col0: 'Chief General Manager (CGM) Overrides', col1: '₹ 48.65 Cr', col2: '₹ 24.30 L', col3: '₹ 20.00 L', col4: '₹ 4.30 L', col5: 'APPROVED' },
      { col0: 'Senior Sales Managers (SSM)', col1: '₹ 28.40 Cr', col2: '₹ 28.40 L', col3: '₹ 24.00 L', col4: '₹ 4.40 L', col5: 'APPROVED' },
      { col0: 'Sales Executives / Associates (Rank 8)', col1: '₹ 32.10 Cr', col2: '₹ 64.20 L', col3: '₹ 52.00 L', col4: '₹ 12.20 L', col5: 'PROCESSING' },
      { col0: 'Fleet Fuel & Operational Travel Bills', col1: '₹ 8.45 L', col2: '₹ 8.45 L', col3: '₹ 7.20 L', col4: '₹ 1.25 L', col5: 'CLEARED' },
    ],
  },
];

export const MarketingReports: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { user } = useAuthContext();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const activeUser = authUser || user;
  const currentRole = (activeUser?.role || 'director').toLowerCase();

  const isManagement =
    currentRole === 'super_admin' ||
    currentRole === 'director' ||
    currentRole === 'branch_manager' ||
    currentRole === 'management' ||
    currentRole === 'marketing_manager';

  // Allowed categories based on user cadre
  const allowedCategories = useMemo<string[]>(() => {
    if (isManagement) {
      return ['Sales', 'Marketing', 'Telecalling', 'Site Visits', 'Finance & Commissions'];
    }
    if (currentRole.includes('telecaller')) {
      return ['Telecalling'];
    }
    if (currentRole.includes('accountant') || currentRole.includes('finance')) {
      return ['Finance & Commissions'];
    }
    if (currentRole.includes('driver') || currentRole.includes('fleet')) {
      return ['Site Visits'];
    }
    if (currentRole.includes('sales') || currentRole.includes('executive') || currentRole.includes('agent')) {
      return ['Sales', 'Site Visits'];
    }
    return ['Sales', 'Marketing', 'Telecalling', 'Site Visits', 'Finance & Commissions'];
  }, [currentRole, isManagement]);

  // Filter reports catalog based on allowed categories and URL param
  const visibleReports = useMemo(() => {
    return REPORTS_CATALOG.filter((r) => {
      if (!allowedCategories.includes(r.category)) return false;
      if (categoryParam && categoryParam.trim() !== '') {
        return r.category.toLowerCase() === categoryParam.toLowerCase();
      }
      return true;
    });
  }, [allowedCategories, categoryParam]);

  const [selectedReportId, setSelectedReportId] = useState<number>(() => visibleReports[0]?.id || 1);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH');
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);

  // Sync selectedReportId when visibleReports changes
  useEffect(() => {
    if (visibleReports.length > 0 && !visibleReports.some((r) => r.id === selectedReportId)) {
      setSelectedReportId(visibleReports[0].id);
    }
  }, [visibleReports, selectedReportId]);

  const activeReport = visibleReports.find((r) => r.id === selectedReportId) || visibleReports[0] || REPORTS_CATALOG[0];

  const handleExportCSV = () => {
    if (!activeReport) return;
    const headers = activeReport.columns.join(',');
    const rows = activeReport.data.map((item) =>
      activeReport.columns.map((_, i) => `"${item[`col${i}`] || ''}"`).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMsg(`Report "${activeReport.title}" exported as CSV successfully!`);
  };

  const handlePrint = () => {
    printReportDocument({
      title: activeReport.title,
      category: activeReport.category,
      summary: activeReport.summary,
      columns: activeReport.columns,
      data: activeReport.data,
      projectFilter: selectedProject,
      periodFilter: selectedPeriod,
      generatedBy: activeUser?.displayName || 'Administrator',
    });
  };

  const handleCategoryFilter = (cat: string | null) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, mb: 3, gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
            <Chip
              label={isManagement ? 'DIRECTOR / MANAGEMENT AUDIT' : `ROLE SCOPE: ${currentRole.replace('_', ' ').toUpperCase()}`}
              size="small"
              color={isManagement ? 'primary' : 'secondary'}
              sx={{ fontWeight: 800, fontSize: '0.72rem' }}
            />
            {categoryParam && (
              <Chip
                label={`Filter: ${categoryParam}`}
                size="small"
                onDelete={() => handleCategoryFilter(null)}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Stack>
          <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            📊 {isManagement ? 'Enterprise Intelligence & Reports' : `${currentRole.replace('_', ' ').toUpperCase()} Reports Portal`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isManagement
              ? 'Multi-cadre departmental reports and organizational metrics overview'
              : 'Role-tailored operational reporting and activity performance metrics'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: '#ffffff', borderRadius: 1.5 }}>
            <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
              <MenuItem value="ALL">All Ventures</MenuItem>
              <MenuItem value="MOKILA">Sunrise Enclave (Mokila)</MenuItem>
              <MenuItem value="SHADNAGAR">Green Meadows (Shadnagar)</MenuItem>
              <MenuItem value="JADCHERLA">Palm Meadows (Jadcherla)</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#ffffff', borderRadius: 1.5 }}>
            <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <MenuItem value="THIS_MONTH">This Month</MenuItem>
              <MenuItem value="LAST_MONTH">Last Month</MenuItem>
              <MenuItem value="THIS_QUARTER">This Quarter</MenuItem>
              <MenuItem value="YEAR_TO_DATE">Financial Year (FY26)</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleExportCSV} sx={{ fontWeight: 700, borderRadius: 2 }}>
            Export CSV
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ fontWeight: 700, borderRadius: 2, bgcolor: '#ffffff' }}>
            Print / PDF
          </Button>
        </Box>
      </Box>

      {/* Category Selection Tabs for Management */}
      {isManagement && (
        <Paper elevation={0} sx={{ p: 1.5, mb: 3, borderRadius: 2.5, border: '1px solid #e2e8f0', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
            <FilterListIcon fontSize="small" /> FILTER CADRE:
          </Typography>
          <Button
            size="small"
            variant={!categoryParam ? 'contained' : 'text'}
            onClick={() => handleCategoryFilter(null)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            All Reports ({REPORTS_CATALOG.length})
          </Button>
          {allowedCategories.map((cat) => (
            <Button
              key={cat}
              size="small"
              variant={categoryParam?.toLowerCase() === cat.toLowerCase() ? 'contained' : 'text'}
              onClick={() => handleCategoryFilter(cat)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {cat}
            </Button>
          ))}
        </Paper>
      )}

      {/* Top Domain KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {(!currentRole.includes('telecaller') && !currentRole.includes('driver')) && (
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: '#ffffff',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                Total Realized Sales (YTD)
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ my: 0.5 }}>
                ₹ 48.65 Cr
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                162 Plots Booked Across Active Ventures
              </Typography>
            </Paper>
          </Grid>
        )}

        {(!currentRole.includes('driver') && !currentRole.includes('accountant')) && (
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                Average Cost Per Lead (CPL)
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ my: 0.5 }}>
                ₹ 36.24
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                ↓ 14% Lower Cost than Industry Benchmark
              </Typography>
            </Paper>
          </Grid>
        )}

        {(currentRole.includes('telecaller') || isManagement) && (
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: '#ffffff',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                Telecaller Connect Rate
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ my: 0.5 }}>
                86.2%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                4,470 Inbound/Outbound Calls Successfully Logged
              </Typography>
            </Paper>
          </Grid>
        )}

        {(currentRole.includes('driver') || currentRole.includes('accountant')) && (
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
                color: '#ffffff',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                Site Visits & Logistics Runs
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ my: 0.5 }}>
                106 Trips
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                10,950 KM Logged Across 3 Vehicles
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Main Content: Report Selector & Table */}
      <Grid container spacing={3}>
        {/* Left Side: Report Catalog */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
                📑 Available Reports ({visibleReports.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select a domain report to inspect live data
              </Typography>
            </Box>
            <List disablePadding>
              {visibleReports.map((report) => (
                <ListItemButton
                  key={report.id}
                  selected={activeReport.id === report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid #f1f5f9',
                    '&.Mui-selected': {
                      bgcolor: '#eff6ff',
                      borderLeft: '4px solid #2563eb',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: activeReport.id === report.id ? '#2563eb' : '#64748b' }}>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={report.title}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: activeReport.id === report.id ? 800 : 600, color: activeReport.id === report.id ? '#1e40af' : '#1e293b' }}
                  />
                  <Chip label={report.category} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right Side: Active Report Display */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 3, p: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                {activeReport.title}
              </Typography>
              <Chip label={`Category: ${activeReport.category}`} color="primary" sx={{ fontWeight: 700 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {activeReport.summary}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    {activeReport.columns.map((col, idx) => (
                      <TableCell key={idx} sx={{ fontWeight: 800, color: '#334155', fontSize: '0.85rem' }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeReport.data.map((row, rIdx) => (
                    <TableRow key={rIdx} hover>
                      {activeReport.columns.map((_, cIdx) => (
                        <TableCell key={cIdx} sx={{ fontWeight: cIdx === 0 ? 700 : 500 }}>
                          {row[`col${cIdx}`]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(snackbarMsg)}
        autoHideDuration={3500}
        onClose={() => setSnackbarMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarMsg(null)} sx={{ width: '100%', fontWeight: 600 }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MarketingReports;
