import React from 'react';
import { Grid, List, ListItem, ListItemText, ListItemAvatar, Typography, Box, Divider } from '@mui/material';
import { DashboardWidget, Avatar, StatusChip, PriorityChip } from '@real-estate-erp/ui';
import { DashboardData } from '../services/mockDashboardService';

import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DashboardWidgetsProps {
  data: DashboardData;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ data }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Top Performers & Metrics */}
      <Grid item xs={12} md={4}>
        <DashboardWidget title="Highlights">
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar><PersonIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Top Employee" secondary={data.topPerformingEmployee} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar><CampaignIconWidget /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Top Campaign" secondary={data.topCampaign} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemAvatar>
                <Avatar><BusinessIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText primary="Top Project" secondary={data.topProject} />
            </ListItem>
          </List>
        </DashboardWidget>
      </Grid>

      {/* Pending Items */}
      <Grid item xs={12} md={4}>
        <DashboardWidget title="Pending Actions">
          <List>
            <ListItem>
              <ListItemText primary="Pending Tasks" />
              <PriorityChip priority="high" label={data.pendingTasks.toString()} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Pending Approvals" />
              <PriorityChip priority="medium" label={data.pendingApprovals.toString()} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Upcoming Site Visits" />
              <StatusChip status="active" label={data.upcomingSiteVisits.toString()} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Vehicle Status" />
              <Typography variant="body2">{data.vehicleStatus}</Typography>
            </ListItem>
          </List>
        </DashboardWidget>
      </Grid>

      {/* Funnels Overview */}
      <Grid item xs={12} md={4}>
        <DashboardWidget title="Funnel Overview">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Lead Conversion Rate</Typography>
            <Typography variant="h5">{(data.leadFunnel.booked / data.leadFunnel.newLeads * 100).toFixed(1)}%</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Sales Conversion Rate</Typography>
            <Typography variant="h5">{data.salesFunnel.conversionRate}%</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Pipeline Value</Typography>
            <Typography variant="h5">${data.salesFunnel.pipelineValue.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Expected Revenue</Typography>
            <Typography variant="h5" color="primary.main">${data.salesFunnel.expectedRevenue.toLocaleString()}</Typography>
          </Box>
        </DashboardWidget>
      </Grid>

      {/* Notifications & Recent Activity */}
      <Grid item xs={12} md={6}>
        <DashboardWidget title="Recent Activities">
          <List>
            {data.recentActivities.map((activity) => (
              <ListItem key={activity.id}>
                <ListItemAvatar>
                  <Avatar><CheckCircleIcon color="success" /></Avatar>
                </ListItemAvatar>
                <ListItemText primary={activity.action} secondary={`${activity.user} - ${activity.time}`} />
              </ListItem>
            ))}
          </List>
        </DashboardWidget>
      </Grid>

      <Grid item xs={12} md={6}>
        <DashboardWidget title="Notifications">
          <List>
            {data.notifications.map((note, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar><NotificationsIcon color="primary" /></Avatar>
                </ListItemAvatar>
                <ListItemText primary={note} />
              </ListItem>
            ))}
          </List>
        </DashboardWidget>
      </Grid>
    </Grid>
  );
};

// Helper component since CampaignIcon is not imported at the top
const CampaignIconWidget = () => <TrendingUpIcon />;
