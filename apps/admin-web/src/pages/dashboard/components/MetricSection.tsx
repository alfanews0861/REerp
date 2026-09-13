import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { MetricCard } from '@real-estate-erp/ui';
import { DashboardData } from '../services/mockDashboardService';

import ContactsIcon from '@mui/icons-material/Contacts';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SyncIcon from '@mui/icons-material/Sync';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface MetricSectionProps {
  data: DashboardData;
}

export const MetricSection: React.FC<MetricSectionProps> = ({ data }) => {
  const { summary } = data;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        ⚡ Today's Live Key Performance Indicators
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Leads"
            value={summary.todayLeads}
            subtitle="+18% vs Yesterday"
            icon={<ContactsIcon />}
            gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Telecalling Calls"
            value={summary.todayCalls}
            subtitle="88% Reach Rate"
            icon={<PhoneInTalkIcon />}
            gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Follow-ups"
            value={summary.todayFollowups}
            subtitle="Scheduled Today"
            icon={<SyncIcon />}
            gradient="linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Site Visits"
            value={summary.todaySiteVisits}
            subtitle="14 Fleet Cabs Active"
            icon={<DirectionsWalkIcon />}
            gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Plot Bookings"
            value={summary.todayBookings}
            subtitle="4 Tokens Paid"
            icon={<BookOnlineIcon />}
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            trend={{ value: 25, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Collections"
            value={`₹ ${(summary.todayRevenue / 100000).toFixed(1)} L`}
            subtitle="Realized Today"
            icon={<AttachMoneyIcon />}
            gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
            trend={{ value: 14, isPositive: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
