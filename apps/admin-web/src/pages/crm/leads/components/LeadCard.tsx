import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Lead } from '@real-estate-erp/types';

export const LeadCard: React.FC<{ lead: Lead; isDragging: boolean }> = ({ lead, isDragging }) => (
  <Card elevation={isDragging ? 8 : 1} sx={{ cursor: 'grab' }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="subtitle1" fontWeight={500}>{lead.fullName}</Typography>
      <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', px: 1, py: 0.5, borderRadius: 1 }}>
          Score: {lead.aiIntentScore}
        </Typography>
        <Typography variant="caption" color="text.secondary">{lead.city}</Typography>
      </Box>
    </CardContent>
  </Card>
);
