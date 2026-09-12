import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight="600">
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/crm/leads')}
        >
          Add Lead
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CalendarMonthIcon />}
          onClick={() => navigate('/crm/site-visits')}
        >
          Schedule Visit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CampaignIcon />}
          onClick={() => navigate('/marketing/campaigns')}
        >
          Add Campaign
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ReceiptIcon />}
          onClick={() => navigate('/expenses')}
        >
          Add Expense
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AssignmentTurnedInIcon />}
          onClick={() => navigate('/bookings')}
        >
          Register Booking
        </Button>
      </Stack>
    </Box>
  );
};
