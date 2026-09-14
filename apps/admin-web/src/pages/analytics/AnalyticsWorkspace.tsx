import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import FileDownload from '@mui/icons-material/FileDownload';
import Speed from '@mui/icons-material/Speed';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Color Palettes ---
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const FUNNEL_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#10b981'];

// --- Types ---
type TimeRange = '7d' | '30d' | 'quarter' | 'year' | 'all';
type ProjectFilter = 'all' | 'iskon-city-2' | 'dream-city' | 'iskon-brundhavanam' | 'iskon-elite';

interface FunnelStage {
  stage: string;
  count: number;
  rateFromPrevious: number;
  rateFromTotal: number;
  dropOffRate: number;
  avgDurationDays: number;
}

export const AnalyticsWorkspace: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedProject, setSelectedProject] = useState<ProjectFilter>('all');

  // --- Dynamic Analytics Data based on filter ---
  const multiplier = useMemo(() => {
    switch (timeRange) {
      case '7d': return 0.25;
      case '30d': return 1.0;
      case 'quarter': return 2.8;
      case 'year': return 11.2;
      case 'all': return 14.5;
      default: return 1.0;
    }
  }, [timeRange]);

  const projectWeight = useMemo(() => {
    switch (selectedProject) {
      case 'iskon-city-2': return 0.45;
      case 'dream-city': return 0.30;
      case 'iskon-brundhavanam': return 0.15;
      case 'iskon-elite': return 0.10;
      default: return 1.0;
    }
  }, [selectedProject]);

  const scale = multiplier * projectWeight;

  // KPI Calculations
  const totalLeads = Math.round(4820 * scale);
  const contactedLeads = Math.round(3615 * scale);
  const visitsScheduled = Math.round(2025 * scale);
  const visitsCompleted = Math.round(1350 * scale);
  const tokenNegotiations = Math.round(432 * scale);
  const totalBookings = Math.round(248 * scale);
  const grossRevenueCr = Number((68.4 * scale).toFixed(2));
  const leadToVisitRate = Number(((visitsCompleted / (totalLeads || 1)) * 100).toFixed(1));
  const visitToBookingRate = Number(((totalBookings / (visitsCompleted || 1)) * 100).toFixed(1));
  const overallConversionRate = Number(((totalBookings / (totalLeads || 1)) * 100).toFixed(2));

  // Funnel Stages Data
  const funnelStages: FunnelStage[] = [
    {
      stage: '1. Inquiries / Leads Captured',
      count: totalLeads,
      rateFromPrevious: 100,
      rateFromTotal: 100,
      dropOffRate: 0,
      avgDurationDays: 0.5,
    },
    {
      stage: '2. Contacted & Qualified',
      count: contactedLeads,
      rateFromPrevious: 75.0,
      rateFromTotal: 75.0,
      dropOffRate: 25.0,
      avgDurationDays: 1.2,
    },
    {
      stage: '3. Site Visit Scheduled',
      count: visitsScheduled,
      rateFromPrevious: 56.0,
      rateFromTotal: 42.0,
      dropOffRate: 44.0,
      avgDurationDays: 3.5,
    },
    {
      stage: '4. Site Visit Completed',
      count: visitsCompleted,
      rateFromPrevious: 66.7,
      rateFromTotal: 28.0,
      dropOffRate: 33.3,
      avgDurationDays: 5.8,
    },
    {
      stage: '5. Negotiation & Token Received',
      count: tokenNegotiations,
      rateFromPrevious: 32.0,
      rateFromTotal: 9.0,
      dropOffRate: 68.0,
      avgDurationDays: 9.4,
    },
    {
      stage: '6. Final Booking & Registered',
      count: totalBookings,
      rateFromPrevious: 57.4,
      rateFromTotal: overallConversionRate,
      dropOffRate: 42.6,
      avgDurationDays: 16.2,
    },
  ];

  // Revenue & Target Trend
  const revenueTrendData = [
    { month: 'Apr', target: 5.0, actual: 4.8, bookings: Math.round(18 * projectWeight) },
    { month: 'May', target: 6.0, actual: 6.2, bookings: Math.round(22 * projectWeight) },
    { month: 'Jun', target: 7.0, actual: 6.9, bookings: Math.round(26 * projectWeight) },
    { month: 'Jul', target: 7.5, actual: 8.1, bookings: Math.round(31 * projectWeight) },
    { month: 'Aug', target: 8.5, actual: 9.4, bookings: Math.round(36 * projectWeight) },
    { month: 'Sep', target: 10.0, actual: 11.2, bookings: Math.round(42 * projectWeight) },
    { month: 'Oct', target: 11.0, actual: 10.8, bookings: Math.round(39 * projectWeight) },
    { month: 'Nov', target: 12.0, actual: 13.5, bookings: Math.round(48 * projectWeight) },
    { month: 'Dec', target: 14.0, actual: 15.2, bookings: Math.round(54 * projectWeight) },
  ];

  // Lead Acquisition Sources
  const leadSourceData = [
    { name: 'Meta / Facebook Ads', leads: Math.round(1950 * scale), bookings: Math.round(82 * scale), cpl: '₹380', convRate: '4.2%' },
    { name: 'Google Ads / Search', leads: Math.round(1120 * scale), bookings: Math.round(68 * scale), cpl: '₹620', convRate: '6.1%' },
    { name: 'Channel Partners / Network', leads: Math.round(840 * scale), bookings: Math.round(59 * scale), cpl: '₹150', convRate: '7.0%' },
    { name: 'Direct Walk-in / Site', leads: Math.round(480 * scale), bookings: Math.round(24 * scale), cpl: '₹0', convRate: '5.0%' },
    { name: 'Customer Referrals', leads: Math.round(290 * scale), bookings: Math.round(21 * scale), cpl: '₹50', convRate: '7.2%' },
    { name: 'Outdoor Hoardings / Print', leads: Math.round(140 * scale), bookings: Math.round(4 * scale), cpl: '₹1,200', convRate: '2.8%' },
  ];

  // Project Absorption
  const projectAbsorptionData = [
    { name: 'ISKON City - 2 (Nellore)', totalPlots: 450, booked: 365, reserved: 35, available: 50 },
    { name: 'Dream City (Kovur)', totalPlots: 280, booked: 210, reserved: 30, available: 40 },
    { name: 'ISKON Brundhavanam (Nellore)', totalPlots: 180, booked: 125, reserved: 15, available: 40 },
    { name: 'ISKON Elite Township (Nellore)', totalPlots: 150, booked: 98, reserved: 18, available: 34 },
  ];

  // Agent Leaderboard Matrix
  const agentPerformanceData = [
    { name: 'K. Ramesh (Senior Mgr)', role: 'Sales Closer', assigned: Math.round(140 * multiplier), visits: Math.round(62 * multiplier), booked: Math.round(18 * multiplier), conv: '29.0%' },
    { name: 'P. Sneha (Field Exec)', role: 'Site Specialist', assigned: Math.round(125 * multiplier), visits: Math.round(54 * multiplier), booked: Math.round(15 * multiplier), conv: '27.7%' },
    { name: 'M. Suresh (Relationship)', role: 'Network Mgr', assigned: Math.round(110 * multiplier), visits: Math.round(48 * multiplier), booked: Math.round(12 * multiplier), conv: '25.0%' },
    { name: 'V. Anitha (Telecaller Lead)', role: 'Inbound Qualifier', assigned: Math.round(380 * multiplier), visits: Math.round(95 * multiplier), booked: Math.round(14 * multiplier), conv: '14.7%' },
    { name: 'D. Rajesh (Telecaller)', role: 'Outbound Caller', assigned: Math.round(340 * multiplier), visits: Math.round(72 * multiplier), booked: Math.round(10 * multiplier), conv: '13.8%' },
  ];

  // Export CSV summary
  const handleExportCSV = () => {
    const csvRows = [
      ['RealEstate ERP - Sales & Conversion Funnel Report'],
      [`Generated At: ${new Date().toLocaleString()}`],
      [`Time Period: ${timeRange}`, `Project: ${selectedProject}`],
      [],
      ['Funnel Stage', 'Count', 'Stage Retention %', 'Overall Conversion %', 'Drop-off %', 'Avg Cycle (Days)'],
      ...funnelStages.map(s => [s.stage, s.count, `${s.rateFromPrevious}%`, `${s.rateFromTotal}%`, `${s.dropOffRate}%`, s.avgDurationDays]),
      [],
      ['Lead Source', 'Total Leads', 'Total Bookings', 'CPL', 'Conversion Rate %'],
      ...leadSourceData.map(s => [s.name, s.leads, s.bookings, s.cpl, s.convRate]),
      [],
      ['Sales Rep', 'Role', 'Leads Assigned', 'Visits Completed', 'Bookings Closed', 'Conversion %'],
      ...agentPerformanceData.map(a => [a.name, a.role, a.assigned, a.visits, a.booked, a.conv]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_analytics_${timeRange}_${selectedProject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header & Controls */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>
            Sales & Conversion Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Live Lead-to-Booking Funnel Velocity, Channel Attribution & Revenue Analytics
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#ffffff', borderRadius: 1 }}>
            <InputLabel id="time-filter-label">Time Period</InputLabel>
            <Select
              labelId="time-filter-label"
              value={timeRange}
              label="Time Period"
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">Financial Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180, backgroundColor: '#ffffff', borderRadius: 1 }}>
            <InputLabel id="project-filter-label">Project</InputLabel>
            <Select
              labelId="project-filter-label"
              value={selectedProject}
              label="Project"
              onChange={(e) => setSelectedProject(e.target.value as ProjectFilter)}
            >
              <MenuItem value="all">All Projects</MenuItem>
              <MenuItem value="iskon-city-2">ISKON City - 2 (Nellore)</MenuItem>
              <MenuItem value="dream-city">Dream City (Kovur / Highway)</MenuItem>
              <MenuItem value="iskon-brundhavanam">ISKON Brundhavanam (Chinthareddypalem)</MenuItem>
              <MenuItem value="iskon-elite">ISKON Elite Township (Annamayya Circle)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            onClick={handleExportCSV}
            sx={{ textTransform: 'none', px: 2, fontWeight: 600 }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Top Level KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Leads
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              {totalLeads.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                +14.2% MoM
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #8b5cf6' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Site Visits Done
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              {visitsCompleted.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600 }}>
              {leadToVisitRate}% of Total Leads
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Bookings
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              {totalBookings.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
              {visitToBookingRate}% Visit Conversion
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Booking Value
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              ₹{grossRevenueCr} Cr
            </Typography>
            <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>
              +22.5% vs Target
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #ec4899' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Overall Conv. Rate
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              {overallConversionRate}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Inquiry to Registered
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #06b6d4' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg. Sales Cycle
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5, color: '#0f172a' }}>
              16.2 Days
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Speed sx={{ fontSize: 15, color: '#06b6d4' }} />
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 600 }}>
                -2.4 days faster
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* SECTION 1: Sales Conversion Funnel */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Sales Conversion Funnel (Lead to Booking)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Stage-by-stage progression, conversion retention, and pipeline drop-off velocity
            </Typography>
          </Box>
          <Chip label="High Conversion Velocity" color="success" size="small" />
        </Box>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Visual Funnel Cards & Progress Bars */}
          <Grid item xs={12} lg={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {funnelStages.map((stage, idx) => (
                <Box
                  key={stage.stage}
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: FUNNEL_COLORS[idx],
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 'bold',
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1e293b' }}>
                        {stage.stage}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#0f172a' }}>
                        {stage.count.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {stage.rateFromTotal}% of top
                      </Typography>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.max(4, stage.rateFromTotal)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: FUNNEL_COLORS[idx],
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Stage Retention: <strong>{stage.rateFromPrevious}%</strong>
                    </Typography>
                    {stage.dropOffRate > 0 && (
                      <Typography variant="caption" sx={{ color: '#ef4444' }}>
                        Drop-off: <strong>{stage.dropOffRate}%</strong>
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: '#0284c7' }}>
                      Avg. duration: <strong>{stage.avgDurationDays}d</strong>
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Funnel Stage Bar Representation */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ height: 380, p: 2, backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#475569', mb: 2 }}>
                Funnel Pipeline Volume (Stage Breakdown)
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={funnelStages}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="stage" tick={false} width={10} />
                  <Tooltip
                    formatter={(value: any) => [Number(value || 0).toLocaleString(), 'Leads/Units']}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {funnelStages.map((_, index) => (
                      <Cell key={`bar-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* AI Funnel Insight Callout */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1d4ed8', mb: 0.5 }}>
                💡 Key Funnel Opportunity:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e40af', fontSize: '0.85rem' }}>
                Site visit to token conversion is <strong>32.0%</strong>. Leads responding to telecallers within 15 minutes of initial ad inquiry show a <strong>2.4x higher visit show-up rate</strong>.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* SECTION 2: Recharts Analytics (Revenue Trends & Lead Source Breakdown) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue & Bookings Trend */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
                  Revenue & Bookings Trend (Actual vs Target)
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Monthly revenue generation in ₹ Crores alongside plot booking counts
                </Typography>
              </Box>
              <Chip label="Target Achieved: 108%" color="primary" size="small" variant="outlined" />
            </Box>

            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" label={{ value: '₹ Cr', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Units', angle: 90, position: 'insideRight' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="actual"
                    name="Actual Revenue (₹ Cr)"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorActual)"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="target"
                    name="Target Revenue (₹ Cr)"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorTarget)"
                  />
                  <Bar yAxisId="right" dataKey="bookings" name="Bookings Count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Lead Source Breakdown (Donut Chart) */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Lead Sources & Channels
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              Share of inquiries across marketing channels
            </Typography>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="leads"
                  >
                    {leadSourceData.map((_, index) => (
                      <Cell key={`source-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [Number(value || 0).toLocaleString(), 'Leads']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Source legend with conversion % */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {leadSourceData.slice(0, 4).map((source, index) => (
                <Box key={source.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[index] }} />
                    <Typography variant="caption" sx={{ color: '#334155' }}>
                      {source.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#0f172a' }}>
                      {source.convRate} conv
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* SECTION 3: Project Velocity & Channel ROI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Project Plot Inventory Absorption */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Project Sales Velocity & Inventory Absorption
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              Total plots vs booked and available inventory by project
            </Typography>

            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectAbsorptionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="booked" name="Booked Plots" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="reserved" name="Token Reserved" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="available" name="Available" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Channel ROI and Cost Metrics */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Channel Economics & Cost-per-Lead (CPL)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              Attribution matrix comparing acquisition cost and closing rate
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Channel</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Leads</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Bookings</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>CPL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Conv %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leadSourceData.map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>{row.name}</TableCell>
                      <TableCell align="right">{row.leads.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#10b981' }}>{row.bookings}</TableCell>
                      <TableCell align="right" sx={{ color: '#64748b' }}>{row.cpl}</TableCell>
                      <TableCell align="right">
                        <Chip label={row.convRate} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* SECTION 4: Team Performance & Closing Matrix */}
      <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Sales Executive & Telecaller Conversion Leaderboard
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Individual agent attribution, site visit generation, and closing velocity
            </Typography>
          </Box>
          <Chip label="Top Performer: K. Ramesh (29.0%)" color="success" size="small" />
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Executive / Rep</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Leads Handled</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Site Visits Done</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Bookings Closed</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Visit-to-Close %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentPerformanceData.map((agent) => (
                <TableRow key={agent.name} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{agent.name}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{agent.role}</TableCell>
                  <TableCell align="right">{agent.assigned}</TableCell>
                  <TableCell align="right">{agent.visits}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#10b981' }}>{agent.booked}</TableCell>
                  <TableCell align="right">
                    <Chip label={agent.conv} size="small" color={parseFloat(agent.conv) > 20 ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AnalyticsWorkspace;
