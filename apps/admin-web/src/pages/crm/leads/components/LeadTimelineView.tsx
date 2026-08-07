import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lead } from '@real-estate-erp/types';

interface LeadTimelineViewProps {
  leads: Lead[];
}

export const LeadTimelineView: React.FC<LeadTimelineViewProps> = ({ leads: _leads }) => {
  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: 'background.default' }}>
      <Typography variant="h5" color="text.secondary">Timeline View (Coming Soon)</Typography>
    </Box>
  );
};
