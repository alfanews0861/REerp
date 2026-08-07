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
      <Typography variant="h6" gutterBottom>
        Today's Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Leads"
            value={summary.todayLeads}
            icon={<ContactsIcon fontSize="large" />}
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Calls"
            value={summary.todayCalls}
            icon={<PhoneInTalkIcon fontSize="large" />}
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Followups"
            value={summary.todayFollowups}
            icon={<SyncIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Site Visits"
            value={summary.todaySiteVisits}
            icon={<DirectionsWalkIcon fontSize="large" />}
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Bookings"
            value={summary.todayBookings}
            icon={<BookOnlineIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <MetricCard
            title="Today's Revenue"
            value={`$${summary.todayRevenue.toLocaleString()}`}
            icon={<AttachMoneyIcon fontSize="large" />}
            trend={{ value: 2, isPositive: false }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
