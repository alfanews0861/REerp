import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSelectedLeadId } from '../../../../store/leadsSlice';
import { Lead } from '@real-estate-erp/types';

interface LeadsPreviewPanelProps {
  leads: Lead[];
}

export const LeadsPreviewPanel: React.FC<LeadsPreviewPanelProps> = ({ leads }) => {
  const dispatch = useDispatch();
  const { selectedLeadId } = useSelector((state: RootState) => state.leads);
  const [tab, setTab] = useState(0);

  const lead = leads.find(l => l.id === selectedLeadId);

  if (!lead) return null;

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0, borderLeft: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Lead Details</Typography>
        <IconButton onClick={() => dispatch(setSelectedLeadId(null))} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.default' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 2 }}>{lead.fullName.substring(0,2).toUpperCase()}</Avatar>
        <Typography variant="h6">{lead.fullName}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> {lead.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} /> {lead.email || 'N/A'}
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
        <Tab label="Details" />
        <Tab label="Timeline" />
        <Tab label="Notes" />
      </Tabs>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="subtitle2" color="primary">Properties</Typography>
            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Source</Typography>
                <Typography variant="body2">{lead.source}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body2">{lead.status}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">City</Typography>
                <Typography variant="body2">{lead.city}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Budget Min</Typography>
                <Typography variant="body2">{lead.budgetMin ? `₹${lead.budgetMin.toLocaleString()}` : 'N/A'}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="primary">AI Insights</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Score: {lead.aiIntentScore}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{lead.aiRecommendation}</Typography>
          </Box>
        )}
        {tab === 1 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            Timeline coming soon...
          </Typography>
        )}
        {tab === 2 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            Notes coming soon...
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
