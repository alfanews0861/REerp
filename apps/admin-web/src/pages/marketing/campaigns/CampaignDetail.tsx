import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Stack,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';

export const CampaignDetail: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const funnelStages = [
    { label: 'Total Leads Captured', count: 1240, pct: 100, color: 'primary' as const },
    { label: 'Contacted by Telecallers', count: 980, pct: 79, color: 'info' as const },
    { label: 'Interested & Qualified', count: 420, pct: 42, color: 'secondary' as const },
    { label: 'Site Visits Conducted', count: 180, pct: 42, color: 'warning' as const },
    { label: 'Confirmed Bookings', count: 35, pct: 19, color: 'success' as const },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/marketing/campaigns')}
          >
            All Campaigns
          </Button>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                Summer Festive Offer 2026
              </Typography>
              <Chip label="Active" color="success" size="small" sx={{ fontWeight: 600 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Facebook & Instagram Meta Ads • Target: Hyderabad & NRI Segment
            </Typography>
          </Box>
        </Box>

        <Button variant="outlined" color="primary" startIcon={<EditIcon />}>
          Edit Campaign
        </Button>
      </Box>

      {/* Grid Content */}
      <Grid container spacing={3}>
        {/* Funnel Analytics */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon color="primary" /> Funnel Conversion Analytics
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              <Stack spacing={2.5}>
                {funnelStages.map((stage, i) => (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {stage.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>
                          {stage.count.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({stage.pct}%)
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stage.pct}
                      color={stage.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Financials & ROI */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon color="success" /> Financials & Campaign Efficiency
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="body2" color="text.secondary">Allocated Budget</Typography>
                  <Typography variant="subtitle1" fontWeight={700}>₹ 1,00,000</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="body2" color="text.secondary">Total Spend Utilized</Typography>
                  <Typography variant="subtitle1" fontWeight={700}>₹ 45,000</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="body2" color="text.secondary">Cost Per Lead (CPL)</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">₹ 36.29</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="body2" color="text.secondary">Cost Per Booking Acquisition</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="secondary.main">₹ 1,285</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                  <Typography variant="body1" fontWeight={700}>Gross Attributed Sales</Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">₹ 4.50 Cr</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDetail;
