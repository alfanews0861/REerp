import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

interface CampaignItem {
  id: string;
  name: string;
  channel: string;
  status: 'Active' | 'Paused' | 'Completed';
  leads: number;
  spend: number;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  { id: 'camp-1', name: 'Summer Festive Offer 2026', channel: 'Facebook & Instagram Ads', status: 'Active', leads: 1240, spend: 45000 },
  { id: 'camp-2', name: 'Website Organic SEO & Blog', channel: 'Google Search / Organic', status: 'Active', leads: 890, spend: 0 },
  { id: 'camp-3', name: 'NRI Direct Investment Drive', channel: 'LinkedIn & Emailer', status: 'Active', leads: 640, spend: 32000 },
  { id: 'camp-4', name: 'Metro Hoarding & Outdoor Banners', channel: 'Print & Hoarding', status: 'Paused', leads: 420, spend: 120000 },
  { id: 'camp-5', name: 'Broker Referral Incentive Drive', channel: 'Channel Partners', status: 'Active', leads: 1013, spend: 65000 },
];

export const CampaignList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    channel: 'Digital Ads',
    budget: '',
  });

  const handleCreate = () => {
    if (!newCampaign.name.trim()) return;
    const item: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: newCampaign.name.trim(),
      channel: newCampaign.channel,
      status: 'Active',
      leads: 0,
      spend: Number(newCampaign.budget) || 0,
    };
    setCampaigns([item, ...campaigns]);
    setNewCampaign({ name: '', channel: 'Digital Ads', budget: '' });
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Marketing Campaigns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage multi-channel acquisition funnels, budgets, and lead conversion performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ fontWeight: 600 }}
        >
          Create Campaign
        </Button>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2.5, borderLeft: `5px solid ${theme.palette.primary.main}` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Active Campaigns</Typography>
                <CampaignIcon color="primary" />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {campaigns.filter((c) => c.status === 'Active').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Across 5 acquisition channels</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2.5, borderLeft: `5px solid ${theme.palette.info.main}` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Leads Generated</Typography>
                <PeopleIcon color="info" />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {campaigns.reduce((acc, curr) => acc + curr.leads, 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">↑ 14% vs last cycle</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2.5, borderLeft: `5px solid ${theme.palette.warning.main}` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Site Visits Delivered</Typography>
                <DirectionsWalkIcon color="warning" />
              </Box>
              <Typography variant="h4" fontWeight={700}>892</Typography>
              <Typography variant="caption" color="text.secondary">21.2% inquiry conversion</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderRadius: 2.5, borderLeft: `5px solid ${theme.palette.success.main}` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Campaign Blended ROI</Typography>
                <TrendingUpIcon color="success" />
              </Box>
              <Typography variant="h4" fontWeight={700} color="success.main">324%</Typography>
              <Typography variant="caption" color="success.main">Top performer: Festive Offer</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Campaigns Data Table */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Campaign Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Channel / Source</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Leads Captured</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Spend</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((camp) => (
              <TableRow key={camp.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{camp.name}</TableCell>
                <TableCell>{camp.channel}</TableCell>
                <TableCell>
                  <Chip
                    label={camp.status}
                    size="small"
                    color={camp.status === 'Active' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>{camp.leads.toLocaleString()}</TableCell>
                <TableCell>₹ {camp.spend.toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate('/marketing/campaigns/details')}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Campaign Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Marketing Campaign</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Campaign Name"
              fullWidth
              required
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            />
            <TextField
              select
              label="Marketing Channel"
              fullWidth
              value={newCampaign.channel}
              onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
            >
              <MenuItem value="Digital Ads">Digital Ads (Meta / Google)</MenuItem>
              <MenuItem value="Print & Hoardings">Print & Outdoor Hoardings</MenuItem>
              <MenuItem value="Channel Partners">Channel Partner / Broker Network</MenuItem>
              <MenuItem value="Email & SMS Blast">Email & SMS Campaign</MenuItem>
            </TextField>
            <TextField
              label="Allocated Budget (₹)"
              type="number"
              fullWidth
              value={newCampaign.budget}
              onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignList;
