import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Divider,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MetricCard } from '@real-estate-erp/ui';
import { DashboardService } from '../../services/DashboardService';
import { ExecutiveDashboardData } from '@real-estate-erp/types';
import { useNavigate } from 'react-router-dom';

export const CommandCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'SALES' | 'MARKETING' | 'INVENTORY' | 'AFTER_SALES' | 'AI_INSIGHTS'>('SALES');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState('THIS_MONTH');

  useEffect(() => {
    DashboardService.getCommandCenterData().then(setData);
  }, []);

  if (!data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const kpis = [
    {
      title: 'Total Bookings',
      value: data.kpis.bookings,
      path: '/bookings',
      icon: <TrendingUpIcon />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      subtitle: 'Active & Confirmed Deals',
    },
    {
      title: 'Gross Sales',
      value: `₹ ${(data.kpis.grossSales / 10000000).toFixed(2)} Cr`,
      path: '/payments',
      icon: <CurrencyRupeeIcon />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      subtitle: 'Total Contract Value',
    },
    {
      title: 'Collected Amount',
      value: `₹ ${(data.kpis.collectedAmount / 10000000).toFixed(2)} Cr`,
      path: '/payments',
      icon: <ReceiptLongIcon />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
      subtitle: 'Realized Revenue Receipts',
    },
    {
      title: 'Open Customer Cases',
      value: data.kpis.afterSalesOpenCases,
      path: '/crm/customers',
      icon: <SupportAgentIcon />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      subtitle: 'Support & After-Sales',
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, mb: 2, gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Management Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Real-time executive oversight, operational indicators, and AI strategic signals
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
              <MenuItem value="ALL">All Projects</MenuItem>
              <MenuItem value="SUNRISE">Sunrise Enclave</MenuItem>
              <MenuItem value="GREEN">Green Meadows</MenuItem>
              <MenuItem value="ROYAL">Royal Palms</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
              <MenuItem value="THIS_MONTH">This Month</MenuItem>
              <MenuItem value="LAST_MONTH">Last Month</MenuItem>
              <MenuItem value="THIS_QUARTER">This Quarter</MenuItem>
              <MenuItem value="YEAR_TO_DATE">Year to Date</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {kpis.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <MetricCard
              title={kpi.title}
              value={kpi.value}
              subtitle={kpi.subtitle}
              icon={kpi.icon}
              gradient={kpi.gradient}
              onClick={() => navigate(kpi.path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Domain Tabs */}
      <Paper elevation={1} sx={{ borderRadius: 2.5, mb: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab value="SALES" label="Sales Operations" sx={{ fontWeight: 600 }} />
          <Tab value="MARKETING" label="Marketing & Growth" sx={{ fontWeight: 600 }} />
          <Tab value="INVENTORY" label="Inventory & Plots" sx={{ fontWeight: 600 }} />
          <Tab value="AFTER_SALES" label="After-Sales & CRM" sx={{ fontWeight: 600 }} />
          <Tab
            value="AI_INSIGHTS"
            label="AI Analytics & Signals"
            icon={<AutoAwesomeIcon fontSize="small" />}
            iconPosition="end"
            sx={{ fontWeight: 600, color: theme.palette.secondary.main }}
          />
        </Tabs>

        {/* Tab Contents */}
        <Box sx={{ p: 3 }}>
          {activeTab === 'AI_INSIGHTS' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="h6" fontWeight={700}>
                AI Intelligence & Strategic Signals
              </Typography>
              {data.insights.map((insight, idx) => (
                <Card key={idx} variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="primary">
                      {insight.metric}
                    </Typography>
                    <Chip
                      label={`${insight.severity} SEVERITY`}
                      size="small"
                      color={insight.severity === 'HIGH' || insight.severity === 'CRITICAL' ? 'error' : 'warning'}
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Observation:</strong> {insight.observation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Evidence:</strong> {insight.evidence}
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1.5 }}>
                    <Typography variant="body2">
                      <strong>Possible Cause:</strong> {insight.possibleCause}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 0.5 }}>
                      <strong>Recommended Action:</strong> {insight.recommendedAction}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Generated by {insight.provider} at {insight.generatedAt ? new Date(insight.generatedAt).toLocaleString() : 'N/A'}
                    </Typography>
                  </Paper>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {activeTab.replace('_', ' ')} Executive Drill-down
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Consolidated operational indicators, throughput charts, and conversion funnels for {activeTab.toLowerCase()}.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Target Completion</Typography>
                      <Typography variant="h5" fontWeight={700} color="primary">84.5%</Typography>
                      <Typography variant="caption" color="success.main">↑ 5.2% vs target</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Average Cycle Time</Typography>
                      <Typography variant="h5" fontWeight={700}>18 Days</Typography>
                      <Typography variant="caption" color="text.secondary">Lead to Booking</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Operational Efficiency</Typography>
                      <Typography variant="h5" fontWeight={700} color="success.main">92.0%</Typography>
                      <Typography variant="caption" color="success.main">SLA Met</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(activeTab === 'MARKETING' ? '/reports/marketing' : activeTab === 'INVENTORY' ? '/plots' : activeTab === 'AFTER_SALES' ? '/crm/customers' : '/reports')}
                >
                  View Full {activeTab.replace('_', ' ')} Workspace
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CommandCenter;


