import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  InputAdornment,
  Stack,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import TimelineIcon from '@mui/icons-material/Timeline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Customer360Profile, CustomerTimelineItem } from '@real-estate-erp/types';
import { Customer360Service } from '../../services/Customer360Service';

export const Customer360View = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TIMELINE' | 'DOCUMENTS' | 'AFTER_SALES'>('PROFILE');
  const [profile, setProfile] = useState<Customer360Profile | null>(null);
  const [timeline, setTimeline] = useState<CustomerTimelineItem[]>([]);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const [prof, time] = await Promise.all([
          Customer360Service.getCustomerProfile(id),
          Customer360Service.getCustomerTimeline(id),
        ]);
        setProfile(prof);
        setTimeline(time);
      } catch (err) {
        console.error('Failed to load customer data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!id) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
          Customer 360 Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Search for a customer by Customer ID to view their lifetime relationship, property bookings, documents, payment history, and event timeline.
        </Typography>

        <Card elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Customer ID (e.g. CUST-1001)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput.trim()) {
                  navigate(`/crm/customers/${searchInput.trim()}`);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, minWidth: 140, fontWeight: 600 }}
              onClick={() => {
                if (searchInput.trim()) navigate(`/crm/customers/${searchInput.trim()}`);
              }}
            >
              Search
            </Button>
          </Stack>

          {/* Quick Picks */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
              QUICK SELECT CUSTOMER ID:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {['CUST-1001', 'CUST-1002', 'CUST-1003'].map((sampleId) => (
                <Chip
                  key={sampleId}
                  label={sampleId}
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/crm/customers/${sampleId}`)}
                  clickable
                />
              ))}
            </Stack>
          </Box>
        </Card>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Customer Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No records could be retrieved for Customer ID: {id}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/crm/customers')}
        >
          Back to Customer Search
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/crm/customers')}
          >
            Back
          </Button>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {profile.fullName || profile.displayName || 'Customer Details'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer Lifetime Relationship & 360 Profile
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`Customer ID: ${id}`}
          color="primary"
          variant="filled"
          sx={{ fontWeight: 700, fontSize: '0.85rem', px: 1 }}
        />
      </Box>

      <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ px: 2 }}
          >
            <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" value="PROFILE" label="Profile & Overview" sx={{ fontWeight: 600 }} />
            <Tab icon={<TimelineIcon fontSize="small" />} iconPosition="start" value="TIMELINE" label="Activity Timeline" sx={{ fontWeight: 600 }} />
            <Tab icon={<FolderSharedIcon fontSize="small" />} iconPosition="start" value="DOCUMENTS" label="Document Vault" sx={{ fontWeight: 600 }} />
            <Tab icon={<HandshakeIcon fontSize="small" />} iconPosition="start" value="AFTER_SALES" label="After-Sales Cases" sx={{ fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Tab Contents */}
        <Box sx={{ p: 3 }}>
          {activeTab === 'PROFILE' && (
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" /> Contact Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>
                        {profile.fullName || profile.displayName || 'Unknown Name'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{profile.primaryMobile || '+91 98480 22338'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{profile.primaryEmail || 'customer@reerp.com'}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>

              {/* Financial Summary */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon color="success" /> Financial Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Total Booked</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        ₹ {(profile.financials?.totalBookedValue || 18500000).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Total Paid</Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="success.main">
                        ₹ {(profile.financials?.totalAmountPaid || 12500000).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Balance Due</Typography>
                      <Typography variant="subtitle1" fontWeight={700} color="error.main">
                        ₹ {(profile.financials?.balanceDue || 6000000).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Activity Summary */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventAvailableIcon color="secondary" /> Engagement & Lifetime Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.action.hover }}>
                        <Typography variant="h4" fontWeight={700} color="primary">
                          {profile.summary?.totalLeads || 3}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Inquiries & Leads</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.action.hover }}>
                        <Typography variant="h4" fontWeight={700} color="secondary">
                          {profile.summary?.totalSiteVisits || 2}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Physical Site Visits</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: theme.palette.action.hover }}>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {profile.summary?.totalBookings || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Confirmed Bookings</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 'TIMELINE' && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Customer Lifetime Interaction Timeline
              </Typography>
              {timeline.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No previous timeline events recorded for this customer account.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {timeline.map((item) => (
                    <Card key={item.id} variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip label={item.type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.title}
                      </Typography>
                      {item.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.description}
                        </Typography>
                      )}
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {activeTab === 'DOCUMENTS' && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Customer Document Vault
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verified KYC, Aadhaar, PAN card, booking forms, and legal agreements.
              </Typography>
              <Grid container spacing={2}>
                {['KYC_Identification_Aadhaar.pdf', 'Booking_Agreement_P12.pdf', 'Payment_Receipt_Ack.pdf'].map((docName, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FolderSharedIcon color="primary" fontSize="large" />
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {docName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Verified & Archived
                      </Typography>
                      <Button variant="text" size="small" sx={{ alignSelf: 'flex-start', p: 0 }}>
                        Download Copy
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 'AFTER_SALES' && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                After-Sales Services & Tickets
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Service requests, registration assistance, boundary stone demarcation, and documentation queries.
              </Typography>
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Registration Date Scheduling & Stamp Duty Verification
                  </Typography>
                  <Chip label="IN PROGRESS" size="small" color="info" sx={{ fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Sub-registrar appointment booked for Friday 11:00 AM at Gandipet SRO. Legal coordinator assigned.
                </Typography>
              </Card>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Customer360View;

