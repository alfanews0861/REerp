import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Lead } from '@real-estate-erp/types';
import { useDispatch } from 'react-redux';
import { setSelectedLeadId } from '../../../../store/leadsSlice';

interface LeadTimelineViewProps {
  leads: Lead[];
}

interface TimelineBucket {
  label: string;
  leads: Lead[];
}

export const LeadTimelineView: React.FC<LeadTimelineViewProps> = ({ leads }) => {
  const dispatch = useDispatch();

  const buckets: TimelineBucket[] = useMemo(() => {
    const sorted = [...leads].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const todayLeads: Lead[] = [];
    const yesterdayLeads: Lead[] = [];
    const thisWeekLeads: Lead[] = [];
    const thisMonthLeads: Lead[] = [];
    const olderLeads: Lead[] = [];

    sorted.forEach((l) => {
      const d = l.createdAt ? new Date(l.createdAt) : new Date();
      const dateStr = d.toISOString().split('T')[0];

      if (dateStr === todayStr) {
        todayLeads.push(l);
      } else if (dateStr === yesterdayStr) {
        yesterdayLeads.push(l);
      } else if (d >= sevenDaysAgo) {
        thisWeekLeads.push(l);
      } else if (d >= thirtyDaysAgo) {
        thisMonthLeads.push(l);
      } else {
        olderLeads.push(l);
      }
    });

    const result: TimelineBucket[] = [];
    if (todayLeads.length > 0) result.push({ label: 'Today (New Inquiries)', leads: todayLeads });
    if (yesterdayLeads.length > 0) result.push({ label: 'Yesterday', leads: yesterdayLeads });
    if (thisWeekLeads.length > 0) result.push({ label: 'Past 7 Days', leads: thisWeekLeads });
    if (thisMonthLeads.length > 0) result.push({ label: 'Earlier This Month', leads: thisMonthLeads });
    if (olderLeads.length > 0) result.push({ label: 'Prior Records', leads: olderLeads });

    return result.length > 0 ? result : [{ label: 'All Leads Chronology', leads: sorted }];
  }, [leads]);

  const handleOpenWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${name}, thank you for your interest in our ventures.`);
    window.open(`https://wa.me/${clean.startsWith('91') ? clean : '91' + clean}?text=${text}`, '_blank');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100%' }}>
      <Box sx={{ maxWidth: 880, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Lead Acquisition & Activity Stream
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chronological journey of incoming inquiries across all digital and walk-in marketing channels
          </Typography>
        </Box>

        {buckets.map((bucket) => (
          <Box key={bucket.label} sx={{ mb: 4 }}>
            {/* Timeline Header Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={bucket.label}
                color="primary"
                sx={{ fontWeight: 700, fontSize: '0.85rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                ({bucket.leads.length} events)
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Timeline Items */}
            <Stack spacing={2} sx={{ pl: 2, borderLeft: '2px dashed #cbd5e1', ml: 1.5 }}>
              {bucket.leads.map((lead) => {
                const isHot = (lead.aiIntentScore || 0) >= 70;
                return (
                  <Paper
                    key={lead.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: isHot ? '#fca5a5' : '#e2e8f0',
                      borderRadius: 2,
                      bgcolor: '#fff',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -23,
                        top: 20,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: isHot ? 'error.main' : 'primary.main',
                        border: '2px solid #fff',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {lead.fullName}
                          </Typography>
                          <Chip label={lead.status} size="small" variant="outlined" color="primary" />
                          {isHot && (
                            <Chip label="🔥 Hot Lead" size="small" color="error" sx={{ fontWeight: 600 }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Captured via {lead.source || 'Digital Ads'} • {lead.city || 'Hyderabad'}
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Phone: {lead.phone} • Email: {lead.email || 'N/A'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CampaignIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Budget: {lead.budgetMin ? `₹${(lead.budgetMin / 100000).toFixed(1)}L - ₹${((lead.budgetMax || 0) / 100000).toFixed(1)}L` : 'Flexible'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => dispatch(setSelectedLeadId(lead.id))}
                        >
                          View Details
                        </Button>
                        <Tooltip title="Send WhatsApp">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenWhatsApp(lead.phone, lead.fullName)}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => window.open(`tel:${lead.phone}`)}
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
