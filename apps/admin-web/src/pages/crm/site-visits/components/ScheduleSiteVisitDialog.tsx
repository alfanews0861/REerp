import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

interface ScheduleSiteVisitDialogProps {
  open: boolean;
  onClose: () => void;
  onVisitScheduled?: () => void;
}

const ISKON_VENTURES = [
  { id: 'proj-1', name: 'ISKON City - 2 (Podalakur Road)', location: 'Podalakur Road, Mattempadu, Nellore' },
  { id: 'proj-2', name: 'Dream City (Nellore-Bombay Highway)', location: 'Nellore-Bombay Highway / Kovuru' },
  { id: 'proj-3', name: 'ISKON Brundhavanam (Chinthareddypalem)', location: 'Chinthareddypalem, Nellore' },
  { id: 'proj-4', name: 'ISKON Elite Township (Annamayya Circle Extn)', location: 'Annamayya Circle Extn, Nellore' },
];

const TRAVEL_MODES = [
  { value: 'COMPANY_VEHICLE', label: 'Company AC Cab / Innova (కంపెనీ వాహనం)' },
  { value: 'EXECUTIVE_VEHICLE', label: 'Executive Bike / Car (ఎగ్జిక్యూటివ్ వాహనం)' },
  { value: 'CUSTOMER_VEHICLE', label: 'Customer Own Vehicle (కస్టమర్ సొంత వాహనం)' },
  { value: 'HOME_PICKUP', label: 'Doorstep Pickup & Drop (ఇంటి వద్ద పికప్)' },
  { value: 'DIRECT_TO_SITE', label: 'Direct Meeting at Venture Site (సైట్ వద్ద కలయిక)' },
];

const MEETING_HUBS = [
  'RKRI Towers Head Office (Annamayya Circle, Nellore)',
  'Mini Bypass Road Branch Office, Nellore',
  'Nellore RTC Central Bus Stand',
  'VRC Centre, Nellore',
  'Current Office / Kovuru Toll Plaza',
  'Customer Residence (Doorstep Pickup)',
];

export const ScheduleSiteVisitDialog: React.FC<ScheduleSiteVisitDialogProps> = ({
  open,
  onClose,
  onVisitScheduled,
}) => {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('proj-1');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [visitMode, setVisitMode] = useState('COMPANY_VEHICLE');
  const [meetingLocation, setMeetingLocation] = useState(MEETING_HUBS[0]);
  const [expectedVisitors, setExpectedVisitors] = useState<number>(2);
  const [assignedExecutive, setAssignedExecutive] = useState('Suresh Kumar (Senior Executive)');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please provide Customer Name and Phone Number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const venture = ISKON_VENTURES.find((v) => v.id === selectedProjectId);

    const newVisitDoc = {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      projectId: selectedProjectId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      siteLocation: venture?.name || 'ISKON City - 2',
      meetingLocation: meetingLocation,
      scheduledDate: scheduledDate,
      scheduledStartTime: `${scheduledDate}T${scheduledTime}:00Z`,
      visitMode: visitMode,
      expectedVisitors: Number(expectedVisitors) || 1,
      actualVisitors: 0,
      visitStatus: 'SCHEDULED',
      outcome: 'PENDING',
      assignedExecutive: assignedExecutive,
      assignedExecutiveId: 'usr-9',
      notes: notes.trim(),
      nextAction: `Site visit scheduled for ${scheduledDate} at ${scheduledTime}. ${notes ? `Notes: ${notes}` : ''}`,
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      serverTimestamp: serverTimestamp(),
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'siteVisits'), newVisitDoc);
      }
      queryClient.invalidateQueries({ queryKey: ['siteVisits'] });
      if (onVisitScheduled) onVisitScheduled();
      handleClose();
    } catch (err: any) {
      console.error('Failed to schedule site visit in Firestore:', err);
      setError(err?.message || 'Failed to schedule site visit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DirectionsCarIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Schedule Site Visit (సైట్ విజిట్ షెడ్యూల్)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ISKON Developers Nellore • Field Operations & Customer Transit
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name *"
                fullWidth
                size="small"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Phone *"
                fullWidth
                size="small"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Venture Destination *"
                fullWidth
                size="small"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {ISKON_VENTURES.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Visit Date *"
                type="date"
                fullWidth
                size="small"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pickup Time *"
                type="time"
                fullWidth
                size="small"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Travel Mode *"
                fullWidth
                size="small"
                value={visitMode}
                onChange={(e) => setVisitMode(e.target.value)}
              >
                {TRAVEL_MODES.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Expected Visitors (Pax)"
                type="number"
                fullWidth
                size="small"
                value={expectedVisitors}
                onChange={(e) => setExpectedVisitors(Math.max(1, Number(e.target.value)))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Meeting / Pickup Point *"
                fullWidth
                size="small"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
              >
                {MEETING_HUBS.map((hub) => (
                  <MenuItem key={hub} value={hub}>
                    {hub}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Special Instructions / Interested Plots"
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="e.g. Family coming from Chennai, interested in 267 sq yds corner plot facing East."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 1.75 }}>
          <Button onClick={handleClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {submitting ? 'Scheduling...' : 'Schedule Visit (షెడ్యూల్ చేయి)'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
