import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lead } from '@real-estate-erp/types';

interface LeadMapViewProps {
  leads: Lead[];
}

export const LeadMapView: React.FC<LeadMapViewProps> = ({ leads: _leads }) => {
  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: 'background.default' }}>
      <Typography variant="h5" color="text.secondary">Map View (Coming Soon)</Typography>
    </Box>
  );
};
