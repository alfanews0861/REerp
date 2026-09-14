import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ExploreIcon from '@mui/icons-material/Explore';
import { Lead } from '@real-estate-erp/types';
import { useDispatch } from 'react-redux';
import { setSelectedLeadId } from '../../../../store/leadsSlice';

interface LeadMapViewProps {
  leads: Lead[];
}

interface RegionCluster {
  name: string;
  count: number;
  hotCount: number;
  leads: Lead[];
  coordinates: string;
}

export const LeadMapView: React.FC<LeadMapViewProps> = ({ leads }) => {
  const dispatch = useDispatch();
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const clusters: RegionCluster[] = useMemo(() => {
    const map = new Map<string, Lead[]>();

    leads.forEach((lead) => {
      const region = lead.city?.trim() || 'Nellore (General)';
      if (!map.has(region)) {
        map.set(region, []);
      }
      map.get(region)!.push(lead);
    });

    const result: RegionCluster[] = [];
    map.forEach((regionLeads, name) => {
      const hot = regionLeads.filter((l) => (l.aiIntentScore || 0) >= 70).length;
      result.push({
        name,
        count: regionLeads.length,
        hotCount: hot,
        leads: regionLeads,
        coordinates: '14.4426° N, 79.9865° E',
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }, [leads]);

  const activeLeads = useMemo(() => {
    if (selectedRegion === 'ALL') return leads;
    return leads.filter((l) => (l.city?.trim() || 'Nellore (General)') === selectedRegion);
  }, [leads, selectedRegion]);

  const totalHotLeads = useMemo(() => {
    return leads.filter((l) => (l.aiIntentScore || 0) >= 70).length;
  }, [leads]);

  const handleOpenWhatsApp = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${name}, thank you for your interest in our premium ventures.`);
    window.open(`https://wa.me/${clean.startsWith('91') ? clean : '91' + clean}?text=${text}`, '_blank');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100%' }}>
      {/* Header Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PlaceIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Total Inquired Geographies</Typography>
                <Typography variant="h5" fontWeight={700}>{clusters.length} Regions</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <WhatshotIcon color="error" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">High-Intent Leads</Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">{totalHotLeads} Hot Leads</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ExploreIcon color="secondary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">Active Cluster Filter</Typography>
                <Typography variant="h5" fontWeight={700} color="secondary.main">
                  {selectedRegion === 'ALL' ? 'All Locations' : selectedRegion}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Interactive Region Clusters Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Filter by Location Hub / Region:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Chip
            label={`All Regions (${leads.length})`}
            color={selectedRegion === 'ALL' ? 'primary' : 'default'}
            variant={selectedRegion === 'ALL' ? 'filled' : 'outlined'}
            onClick={() => setSelectedRegion('ALL')}
            sx={{ fontWeight: 600, cursor: 'pointer' }}
          />
          {clusters.map((cluster) => (
            <Chip
              key={cluster.name}
              icon={<LocationOnIcon />}
              label={`${cluster.name} (${cluster.count})${cluster.hotCount > 0 ? ` • ${cluster.hotCount} 🔥` : ''}`}
              color={selectedRegion === cluster.name ? 'primary' : 'default'}
              variant={selectedRegion === cluster.name ? 'filled' : 'outlined'}
              onClick={() => setSelectedRegion(cluster.name)}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Regional Lead Cards */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Showing {activeLeads.length} Leads in {selectedRegion === 'ALL' ? 'All Geographies' : selectedRegion}
      </Typography>

      <Grid container spacing={2}>
        {activeLeads.map((lead) => {
          const isHot = (lead.aiIntentScore || 0) >= 70;
          return (
            <Grid item xs={12} sm={6} md={4} key={lead.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: isHot ? '#fca5a5' : '#e2e8f0',
                  borderRadius: 2.5,
                  bgcolor: isHot ? '#fffbfb' : '#fff',
                  transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <CardContent sx={{ pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {lead.fullName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                        <LocationOnIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                          {lead.city || 'Nellore'}
                        </Typography>
                      </Box>
                    </Box>
                    {isHot ? (
                      <Chip label={`Intent ${lead.aiIntentScore}`} size="small" color="error" sx={{ fontWeight: 700 }} />
                    ) : (
                      <Chip label={`Score ${lead.aiIntentScore || 40}`} size="small" variant="outlined" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Phone: {lead.phone}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={lead.status} size="small" color="primary" variant="outlined" />
                    <Typography variant="caption" color="text.secondary">
                      Source: {lead.source}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => dispatch(setSelectedLeadId(lead.id))}
                    >
                      Inspect
                    </Button>
                    <Box>
                      <Tooltip title="Direct WhatsApp">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenWhatsApp(lead.phone, lead.fullName)}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Direct Call">
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
