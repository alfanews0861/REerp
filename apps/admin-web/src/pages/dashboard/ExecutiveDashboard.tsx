import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MetricCard } from '@real-estate-erp/ui';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardWidgets } from './components/DashboardWidgets';
import { QuickActions } from './components/QuickActions';
import { useNavigate } from 'react-router-dom';

// Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ExecutiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { data } = useDashboardData();

  const userRole = (authUser?.role || 'director').toLowerCase();
  const isManagement =
    userRole === 'super_admin' ||
    userRole === 'director' ||
    userRole === 'branch_manager' ||
    userRole === 'management' ||
    userRole === 'admin';

  const getDefaultRoleView = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('telecaller')) return 'telecaller';
    if (r.includes('sales_manager') || r.includes('team_lead')) return 'sales_manager';
    if (r.includes('executive') || r.includes('agent') || r.includes('marketing')) return 'field_agent';
    if (r.includes('accountant') || r.includes('finance')) return 'accountant';
    if (r.includes('driver') || r.includes('fleet')) return 'driver';
    return 'management';
  };

  const [selectedRoleView, setSelectedRoleView] = useState<string>(() => getDefaultRoleView(userRole));

  React.useEffect(() => {
    if (!isManagement) {
      setSelectedRoleView(getDefaultRoleView(userRole));
    }
  }, [userRole, isManagement]);

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 } }}>
      {/* Top Banner & Role Switcher */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2.5,
          borderRadius: 2.5,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          boxShadow: '0 6px 18px -4px rgba(15, 23, 42, 0.15)',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={isManagement ? 7 : 12}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.75 }}>
              <Chip
                label={`ACTIVE CADRE: ${selectedRoleView.replace('_', ' ').toUpperCase()}`}
                size="small"
                sx={{
                  bgcolor: '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.05em',
                  height: 22,
                }}
              />
              {authUser?.displayName && (
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Logged in as <strong style={{ color: '#e2e8f0' }}>{authUser.displayName}</strong>
                </Typography>
              )}
            </Stack>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', mb: 0.25, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
              {selectedRoleView === 'management' && 'Executive Management Command Center'}
              {selectedRoleView === 'sales_manager' && 'Sales Manager & Team Lead Dashboard'}
              {selectedRoleView === 'field_agent' && 'Field Marketing & Sales Executive Portal'}
              {selectedRoleView === 'telecaller' && 'Telecaller Calling & Qualification Hub'}
              {selectedRoleView === 'accountant' && 'Finance, Accounts & Collections Ledger'}
              {selectedRoleView === 'driver' && 'Fleet & Site Visit Transport Control'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Real-time KPIs, operational milestones, and role-tailored performance indicators
            </Typography>
          </Grid>

          {isManagement && (
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 220, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                <InputLabel id="cadre-perspective-label" sx={{ color: '#94a3b8' }}>Cadre Perspective View</InputLabel>
                <Select
                  labelId="cadre-perspective-label"
                  id="cadre-perspective-select"
                  value={selectedRoleView}
                  label="Cadre Perspective View"
                  onChange={(e) => setSelectedRoleView(e.target.value)}
                  sx={{
                    color: '#ffffff',
                    '.MuiSvgIcon-root': { color: '#ffffff' },
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <MenuItem value="management">👑 Management (Director/GM/Admin)</MenuItem>
                  <MenuItem value="sales_manager">👔 Sales Manager / Team Lead</MenuItem>
                  <MenuItem value="field_agent">🏃 Field Marketing & Sales Agent</MenuItem>
                  <MenuItem value="telecaller">🎧 Telecaller Desk</MenuItem>
                  <MenuItem value="accountant">💰 Accountant & Finance</MenuItem>
                  <MenuItem value="driver">🚗 Fleet & Logistics Driver</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* 1. MANAGEMENT / DIRECTORS VIEW */}
      {selectedRoleView === 'management' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            🏢 Enterprise High-Level Metrics
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Gross Sales Value"
                value="₹ 48.65 Cr"
                subtitle="142 Plots Booked Total"
                icon={<CurrencyRupeeIcon />}
                gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
                trend={{ value: 18, isPositive: true }}
                onClick={() => navigate('/bookings')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Realized Collections"
                value="₹ 29.80 Cr"
                subtitle="61.2% Recovery Rate"
                icon={<ReceiptLongIcon />}
                gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                trend={{ value: 12, isPositive: true }}
                onClick={() => navigate('/finance/payments')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Plot Inventory Available"
                value={284}
                unit="Plots"
                subtitle="Across 4 Active Ventures"
                icon={<TrendingUpIcon />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
                onClick={() => navigate('/plots')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Marketing Leads"
                value="3,842"
                subtitle="320 Qualified for Site Visits"
                icon={<GroupsIcon />}
                gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                trend={{ value: 24, isPositive: true }}
                onClick={() => navigate('/crm/leads')}
              />
            </Grid>
          </Grid>

          <QuickActions />
          {data && <DashboardCharts data={data} />}
          {data && <DashboardWidgets data={data} />}
        </Box>
      )}

      {/* 2. SALES MANAGER / TEAM LEAD VIEW */}
      {selectedRoleView === 'sales_manager' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            👔 Sales Pipeline & Team Leadership Dashboard
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Team Pipeline Value"
                value="₹ 14.20 Cr"
                subtitle="38 Prospects in Closing"
                icon={<TrendingUpIcon />}
                gradient="linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                trend={{ value: 15, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Site Visits Scheduled"
                value={28}
                unit="Visits"
                subtitle="This Weekend Pipeline"
                icon={<DirectionsWalkIcon />}
                gradient="linear-gradient(135deg, #059669 0%, #065f46 100%)"
                trend={{ value: 30, isPositive: true }}
                onClick={() => navigate('/crm/site-visits')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Sales Associates"
                value={16}
                unit="Agents"
                subtitle="12 Hit Monthly Targets"
                icon={<GroupsIcon />}
                gradient="linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
                onClick={() => navigate('/marketing/network')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Monthly Target Achieved"
                value="84.5%"
                subtitle="Target: ₹ 16.00 Cr"
                icon={<EmojiEventsIcon />}
                gradient="linear-gradient(135deg, #d97706 0%, #92400e 100%)"
                trend={{ value: 9, isPositive: true }}
              />
            </Grid>
          </Grid>

          {/* Team Performance Table */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              🏆 Top Performing Sales Associates & Cadres
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Agent Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cadre Level</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Leads Assigned</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Site Visits Done</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Bookings Closed</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Revenue Generated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Vamshi Krishna', cadre: 'Senior Sales Manager', leads: 42, visits: 18, bookings: 5, revenue: '₹ 2.45 Cr' },
                    { name: 'Mahesh Kumar', cadre: 'Sales Executive (Rank 8)', leads: 36, visits: 14, bookings: 4, revenue: '₹ 1.80 Cr' },
                    { name: 'Ananya Sharma', cadre: 'Team Leader', leads: 29, visits: 12, bookings: 3, revenue: '₹ 1.40 Cr' },
                    { name: 'Deepika Rani', cadre: 'Sales Executive (Rank 8)', leads: 25, visits: 10, bookings: 2, revenue: '₹ 95.00 L' },
                  ].map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell><Chip label={row.cadre} size="small" variant="outlined" color="primary" /></TableCell>
                      <TableCell>{row.leads}</TableCell>
                      <TableCell>{row.visits}</TableCell>
                      <TableCell><strong style={{ color: '#16a34a' }}>{row.bookings}</strong></TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* 3. FIELD MARKETING & SALES EXECUTIVE VIEW */}
      {selectedRoleView === 'field_agent' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            🏃 Field Agent & Marketing Executive Portal
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="My Assigned Leads"
                value={24}
                unit="Leads"
                subtitle="6 High-Intent Prospects"
                icon={<GroupsIcon />}
                gradient="linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                onClick={() => navigate('/crm/leads')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Site Visits Today"
                value={3}
                unit="Tours"
                subtitle="Podalakur & Kovuru Corridors"
                icon={<DirectionsWalkIcon />}
                gradient="linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
                onClick={() => navigate('/crm/site-visits')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="My Earned Commission"
                value="₹ 1,85,000"
                subtitle="Approved for Payout"
                icon={<AccountBalanceWalletIcon />}
                gradient="linear-gradient(135deg, #d97706 0%, #b45309 100%)"
                onClick={() => navigate('/marketing/commission')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Geo Attendance"
                value="Punched In"
                subtitle="Site Office (09:15 AM)"
                icon={<CheckCircleIcon />}
                gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  📍 Today's Scheduled Site Visits
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {[
                    { client: 'Rajesh Goud', phone: '+91 98480 12345', project: 'ISKON City - 2 (Podalakur Road)', time: '10:30 AM', cab: 'AP 26 UB 1001' },
                    { client: 'Venkata Rao', phone: '+91 99887 66554', project: 'Dream City (Kovuru Highway)', time: '02:00 PM', cab: 'AP 26 EX 4050' },
                  ].map((v, i) => (
                    <Box key={i} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight={700}>{v.client}</Typography>
                        <Chip label={v.time} size="small" color="primary" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">{v.phone} • {v.project}</Typography>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>Cab Assigned: {v.cab}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  ⚡ Quick Field Actions
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Button variant="outlined" fullWidth startIcon={<DirectionsWalkIcon />} onClick={() => navigate('/crm/site-visits')}>
                    Book New Site Visit for Client
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<AccountBalanceWalletIcon />} onClick={() => navigate('/marketing/commission')}>
                    View Detailed Commission Ledger
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<AssessmentIcon />} onClick={() => navigate('/reports')}>
                    Download My Activity Report
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 4. TELECALLER DESK VIEW */}
      {selectedRoleView === 'telecaller' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            🎧 Telecaller Calling Console & Daily Performance
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Today's Call Target"
                value="68 / 80"
                subtitle="85% Daily Target Completed"
                icon={<PhoneInTalkIcon />}
                gradient="linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Follow-ups Scheduled"
                value={18}
                unit="Leads"
                subtitle="4 Overdue / Priority Alerts"
                icon={<ScheduleIcon />}
                gradient="linear-gradient(135deg, #0284c7 0%, #075985 100%)"
                onClick={() => navigate('/marketing/telecaller')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="High-Intent Qualified"
                value={12}
                unit="Leads"
                subtitle="Forwarded to Sales Execs"
                icon={<CheckCircleIcon />}
                gradient="linear-gradient(135deg, #16a34a 0%, #166534 100%)"
                trend={{ value: 20, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Site Visits Booked"
                value={6}
                unit="Visits"
                subtitle="Direct Telecaller Booking"
                icon={<DirectionsCarIcon />}
                gradient="linear-gradient(135deg, #d97706 0%, #9a3412 100%)"
                trend={{ value: 33, isPositive: true }}
                onClick={() => navigate('/marketing/telecaller')}
              />
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                📞 Pending Telecaller Queue (Priority Dial List)
              </Typography>
              <Button variant="contained" color="success" size="small" onClick={() => navigate('/marketing/telecaller')}>
                Open Full Calling Workspace
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Prospect Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Intent Score</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Kavitha Reddy', phone: '+91 98480 11223', source: 'Facebook Ad', score: 'HIGH (88%)' },
                    { name: 'Ravi Teja', phone: '+91 99887 76655', source: 'Website Inquiry', score: 'HIGH (92%)' },
                    { name: 'Srinivasa Rao', phone: '+91 94401 23456', source: 'Hoarding Campaign', score: 'MEDIUM (65%)' },
                  ].map((lead, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell><Chip label={lead.score} size="small" color="error" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" color="success" startIcon={<PhoneInTalkIcon />} onClick={() => navigate('/marketing/telecaller')}>
                          Dial Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* 5. ACCOUNTANT / FINANCE VIEW */}
      {selectedRoleView === 'accountant' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            💰 Finance, Vouchers & Collections Ledger
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Today's Collections"
                value="₹ 38.50 L"
                subtitle="14 Cheques & Bank Inflows"
                icon={<CurrencyRupeeIcon />}
                gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
                onClick={() => navigate('/finance/payments')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Pending Approvals"
                value={5}
                unit="Vouchers"
                subtitle="₹ 8.20 L Requires Clearance"
                icon={<ReceiptLongIcon />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Agent Commissions Due"
                value="₹ 12.40 L"
                subtitle="For Current Cycle"
                icon={<AccountBalanceWalletIcon />}
                gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                onClick={() => navigate('/marketing/commission')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Monthly Expenses"
                value="₹ 6.80 L"
                subtitle="Fuel, Site Travel & Marketing"
                icon={<TrendingUpIcon />}
                gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
                onClick={() => navigate('/expenses')}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 6. DRIVER / FLEET LOGISTICS VIEW */}
      {selectedRoleView === 'driver' && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>
            🚗 Fleet Dispatch & Site Visit Transport Control
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Fleet Trips"
                value={4}
                unit="Cabs"
                subtitle="In Transit to Ventures"
                icon={<DirectionsCarIcon />}
                gradient="linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                onClick={() => navigate('/crm/site-visits')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Kilometers Run Today"
                value="480 KM"
                subtitle="Avg 120 KM per Vehicle"
                icon={<TrendingUpIcon />}
                gradient="linear-gradient(135deg, #059669 0%, #065f46 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Fuel Expenses Logged"
                value="₹ 8,450"
                subtitle="All Receipts Uploaded"
                icon={<ReceiptLongIcon />}
                gradient="linear-gradient(135deg, #d97706 0%, #92400e 100%)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Completed Site Visits"
                value={8}
                unit="Trips"
                subtitle="100% On-Time Drops"
                icon={<CheckCircleIcon />}
                gradient="linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ExecutiveDashboard;

