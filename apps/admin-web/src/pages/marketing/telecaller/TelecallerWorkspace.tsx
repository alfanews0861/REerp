import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HeadsetIcon from '@mui/icons-material/Headset';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, doc, updateDoc, addDoc, limit, orderBy } from 'firebase/firestore';

interface TelecallerLead {
  id: string;
  name: string;
  contact: string;
  source: string;
  interest: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'FOLLOW_UP' | 'QUALIFIED' | 'DISQUALIFIED' | 'SITE_VISIT_SCHEDULED';
  notes?: string;
  nextFollowUpDate?: string;
}

const INITIAL_LEADS: TelecallerLead[] = [
  { id: 'lead-1', name: 'John Doe', contact: '+91 98765 43210', source: 'Facebook Ads', interest: 'MEDIUM', status: 'NEW' },
  { id: 'lead-2', name: 'Jane Smith', contact: '+91 91234 56780', source: 'Walk In', interest: 'HIGH', status: 'FOLLOW_UP' },
  { id: 'lead-3', name: 'Ravi Teja', contact: '+91 99887 76655', source: 'Website Inquiry', interest: 'HIGH', status: 'NEW' },
  { id: 'lead-4', name: 'Kavitha Reddy', contact: '+91 98480 11223', source: 'Referral', interest: 'HIGH', status: 'FOLLOW_UP' },
  { id: 'lead-5', name: 'Mohan Rao', contact: '+91 94401 23456', source: 'Print Ad', interest: 'LOW', status: 'QUALIFIED' },
];

export const TelecallerWorkspace: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'new' | 'my_leads' | 'follow_up'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<TelecallerLead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<TelecallerLead | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callOutcome, setCallOutcome] = useState('FOLLOW_UP');
  const [callNotes, setCallNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [siteVisitDate, setSiteVisitDate] = useState<string>('');
  const [siteVisitVenture, setSiteVisitVenture] = useState('Sunrise Enclave (Mokila)');
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveLeads = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(50));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const mapped: TelecallerLead[] = snap.docs.map((d) => {
              const data = d.data();
              let stat: TelecallerLead['status'] = 'NEW';
              if (data.status === 'QUALIFIED') stat = 'QUALIFIED';
              else if (data.status === 'CONTACTED') stat = 'FOLLOW_UP';
              else if (data.status === 'CLOSED_LOST') stat = 'DISQUALIFIED';
              else if (data.status === 'SITE_VISIT_SCHEDULED') stat = 'SITE_VISIT_SCHEDULED';

              return {
                id: d.id,
                name: data.fullName || 'Prospect',
                contact: data.phone || 'N/A',
                source: data.source || 'Digital Ad',
                interest: (data.aiIntentScore || 50) > 70 ? 'HIGH' : (data.aiIntentScore || 50) > 40 ? 'MEDIUM' : 'LOW',
                status: stat,
                notes: data.notes || '',
                nextFollowUpDate: data.nextFollowUpDate,
              };
            });
            setLeads(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live firestore leads, using initial dataset', err);
      }
    };

    fetchLiveLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.contact.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeTab === 'new') return lead.status === 'NEW';
    if (activeTab === 'follow_up') return lead.status === 'FOLLOW_UP';
    return true;
  });

  const handleOpenCall = (lead: TelecallerLead) => {
    setSelectedLead(lead);
    setCallOutcome(lead.status === 'NEW' ? 'FOLLOW_UP' : lead.status);
    setCallNotes(lead.notes || '');
    setFollowUpDate('');
    setSiteVisitDate('');
    setCallModalOpen(true);
  };

  const handleSaveCallOutcome = async () => {
    if (!selectedLead) return;

    setLoading(true);
    const updatedStatus = callOutcome as TelecallerLead['status'];

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        // 1. Update lead document in Firestore
        const leadRef = doc(db, 'leads', selectedLead.id);
        const mappedFirestoreStatus =
          updatedStatus === 'QUALIFIED'
            ? 'QUALIFIED'
            : updatedStatus === 'SITE_VISIT_SCHEDULED'
            ? 'SITE_VISIT_SCHEDULED'
            : updatedStatus === 'DISQUALIFIED'
            ? 'CLOSED_LOST'
            : 'CONTACTED';

        await updateDoc(leadRef, {
          status: mappedFirestoreStatus,
          notes: callNotes,
          nextFollowUpDate: followUpDate || null,
          updatedAt: new Date().toISOString(),
        });

        // 2. Record audit interaction in interactions collection
        await addDoc(collection(db, 'interactions'), {
          leadId: selectedLead.id,
          personId: selectedLead.id,
          type: 'PHONE_CALL',
          notes: callNotes,
          disposition: callOutcome,
          scheduledFollowUpDate: followUpDate || null,
          actor: 'Telecaller Console',
          createdAt: new Date().toISOString(),
        });

        // 3. If site visit scheduled, write to site_visits collection
        if (callOutcome === 'SITE_VISIT_SCHEDULED' || callOutcome === 'QUALIFIED') {
          await addDoc(collection(db, 'site_visits'), {
            bookingRef: `VISIT-${Math.floor(100000 + Math.random() * 900000)}`,
            customerName: selectedLead.name,
            customerPhone: selectedLead.contact,
            projectName: siteVisitVenture,
            preferredDate: siteVisitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            status: 'SCHEDULED',
            source: 'TELECALLER',
            notes: callNotes,
            createdAt: new Date().toISOString(),
          });
        }
      }
      setSnackbarMsg(`Interaction saved for ${selectedLead.name} successfully.`);
    } catch (err) {
      console.warn('Saved call outcome locally (Firestore offline):', err);
      setSnackbarMsg(`Recorded call log locally for ${selectedLead.name}.`);
    } finally {
      setLeads(
        leads.map((l) =>
          l.id === selectedLead.id
            ? { ...l, status: updatedStatus, notes: callNotes, nextFollowUpDate: followUpDate }
            : l
        )
      );
      setLoading(false);
      setCallModalOpen(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            Telecaller Queue & Calling Console
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Process inbound digital inquiries, log client interactions, and schedule physical site visits
          </Typography>
        </Box>
      </Box>

      {/* Control Card with Tabs & Search */}
      <Paper elevation={1} sx={{ borderRadius: 2.5, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, borderBottom: 1, borderColor: 'divider', px: 2, py: 0.5, gap: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" value="new" label="New Leads" sx={{ fontWeight: 600 }} />
            <Tab icon={<ScheduleIcon fontSize="small" />} iconPosition="start" value="follow_up" label="Follow-up Today" sx={{ fontWeight: 600 }} />
            <Tab icon={<HeadsetIcon fontSize="small" />} iconPosition="start" value="my_leads" label="All My Assigned Leads" sx={{ fontWeight: 600 }} />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: '100%', sm: 260 }, my: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Data Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Lead Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact Number</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Interest Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Call Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No leads matching this filter criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{lead.name}</TableCell>
                    <TableCell>{lead.contact}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.interest}
                        size="small"
                        color={lead.interest === 'HIGH' ? 'error' : lead.interest === 'MEDIUM' ? 'warning' : 'default'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status.replace('_', ' ')}
                        size="small"
                        color={lead.status === 'NEW' ? 'primary' : lead.status === 'QUALIFIED' ? 'success' : 'info'}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<PhoneIcon fontSize="small" />}
                          onClick={() => handleOpenCall(lead)}
                        >
                          Call
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<CheckCircleIcon fontSize="small" />}
                          onClick={() => handleOpenCall(lead)}
                        >
                          Qualify
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Call Outcome Modal */}
      <Dialog open={callModalOpen} onClose={() => setCallModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Call Interaction: {selectedLead?.name}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ p: 1.5, bgcolor: theme.palette.action.hover, borderRadius: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Contact Phone</Typography>
              <Typography variant="body1" fontWeight={600}>{selectedLead?.contact}</Typography>
            </Box>

            <TextField
              select
              label="Interaction Outcome"
              fullWidth
              value={callOutcome}
              onChange={(e) => setCallOutcome(e.target.value)}
            >
              <MenuItem value="FOLLOW_UP">Follow Up Scheduled</MenuItem>
              <MenuItem value="SITE_VISIT_SCHEDULED">Schedule Physical Site Visit</MenuItem>
              <MenuItem value="QUALIFIED">High-Intent Qualified</MenuItem>
              <MenuItem value="DISQUALIFIED">Not Interested / Disqualified</MenuItem>
            </TextField>

            {callOutcome === 'FOLLOW_UP' && (
              <TextField
                label="Next Follow-up Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            )}

            {(callOutcome === 'SITE_VISIT_SCHEDULED' || callOutcome === 'QUALIFIED') && (
              <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                <Typography variant="subtitle2" color="success.dark" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCarIcon fontSize="small" /> Schedule Site Visit Details
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Target Venture"
                    size="small"
                    fullWidth
                    value={siteVisitVenture}
                    onChange={(e) => setSiteVisitVenture(e.target.value)}
                  >
                    <MenuItem value="Sunrise Enclave (Mokila)">Sunrise Enclave (Mokila)</MenuItem>
                    <MenuItem value="Green Valley Phase 2 (Shadnagar)">Green Valley Phase 2 (Shadnagar)</MenuItem>
                    <MenuItem value="Palm Meadows (Jadcherla)">Palm Meadows (Jadcherla)</MenuItem>
                    <MenuItem value="Emerald City (Maheshwaram)">Emerald City (Maheshwaram)</MenuItem>
                  </TextField>

                  <TextField
                    label="Visit Date"
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={siteVisitDate}
                    onChange={(e) => setSiteVisitDate(e.target.value)}
                  />
                </Stack>
              </Box>
            )}

            <TextField
              label="Call Notes & Feedback"
              multiline
              rows={3}
              fullWidth
              placeholder="E.g. Client interested in 200 sq yards east facing, requested brochure on WhatsApp..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCallModalOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="primary" disabled={loading} onClick={handleSaveCallOutcome}>
            {loading ? 'Saving...' : 'Save Call Log & Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(snackbarMsg)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarMsg(null)}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TelecallerWorkspace;
