import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const QuickActions: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add Lead
        </Button>
        <Button variant="contained" color="secondary" startIcon={<CalendarMonthIcon />}>
          Schedule Visit
        </Button>
        <Button variant="outlined" color="primary" startIcon={<CampaignIcon />}>
          Add Campaign
        </Button>
        <Button variant="outlined" color="primary" startIcon={<ReceiptIcon />}>
          Add Expense
        </Button>
        <Button variant="outlined" color="primary" startIcon={<AssignmentTurnedInIcon />}>
          Register Booking
        </Button>
      </Stack>
    </Box>
  );
};
