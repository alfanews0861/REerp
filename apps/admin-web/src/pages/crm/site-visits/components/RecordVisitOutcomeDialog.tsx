import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
  IconButton,
  Alert,
  Divider,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { SiteVisit } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

interface RecordVisitOutcomeDialogProps {
  open: boolean;
  visit: SiteVisit | null;
  onClose: () => void;
  onOutcomeRecorded?: () => void;
}

const VISIT_OUTCOMES = [
  { value: 'BOOKED', label: 'Spot Booking Completed (స్పాట్ బుకింగ్ పూర్తయింది - టోకెన్ అడ్వాన్స్)' },
  { value: 'HOT', label: 'Very Interested / Ready to Buy (చాలా ఆసక్తిగా ఉన్నారు - హాట్ లీడ్)' },
  { value: 'WARM', label: 'Interested (ఆసక్తిగా ఉన్నారు - సాధారణ చర్చ)' },
  { value: 'NEED_DISCOUNT', label: 'Requested Price Discount (ధర తగ్గింపు లేదా రాయితీ కోరారు)' },
  { value: 'FAMILY_DISCUSSION', label: 'Need Family / Elder Discussion (కుటుంబ సభ్యులతో చర్చించాలి)' },
  { value: 'NEED_LOAN', label: 'Need Bank / NBFC Loan Assistance (బ్యాంక్ లోన్ సౌకర్యం కావాలి)' },
  { value: 'NEED_ANOTHER_VISIT', label: 'Requested Another Site Visit (మరోసారి సైట్ చూడాలి)' },
  { value: 'NOT_INTERESTED', label: 'Not Interested / Budget Mismatch (ఆసక్తి చూపలేదు)' },
];

export const RecordVisitOutcomeDialog: React.FC<RecordVisitOutcomeDialogProps> = ({
  open,
  visit,
  onClose,
  onOutcomeRecorded,
}) => {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [outcome, setOutcome] = useState('HOT');
  const [actualVisitors, setActualVisitors] = useState<number>(2);
  const [nextAction, setNextAction] = useState('');
  const [plotPreference, setPlotPreference] = useState('');

  useEffect(() => {
    if (visit) {
      setOutcome(visit.outcome || 'HOT');
      setActualVisitors(visit.actualVisitors || visit.expectedVisitors || 2);
      setNextAction(visit.nextAction || '');
      setError(null);
    }
  }, [visit, open]);

  if (!visit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const updatePayload = {
      visitStatus: 'COMPLETED',
      outcome: outcome,
      actualVisitors: Number(actualVisitors) || 1,
      nextAction: nextAction.trim() || `Visit completed. Outcome: ${outcome}.`,
      plotPreference: plotPreference.trim() || undefined,
      completedAt: now,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      if (db && visit.id) {
        const visitRef = doc(db, 'siteVisits', visit.id);
        await updateDoc(visitRef, updatePayload);
      }
      queryClient.invalidateQueries({ queryKey: ['siteVisits'] });
      if (onOutcomeRecorded) onOutcomeRecorded();
      onClose();
    } catch (err: any) {
      console.error('Failed to update visit outcome in Firestore:', err);
      setError(err?.message || 'Failed to record visit outcome.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AssignmentTurnedInIcon color="success" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Record Visit Outcome (ఫలితం రికార్డ్)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {visit.siteLocation} • {visit.scheduledDate}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
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

          <Stack spacing={2.5}>
            <TextField
              select
              label="Visit Outcome (విజిట్ ఫలితం) *"
              fullWidth
              size="small"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              required
            >
              {VISIT_OUTCOMES.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Actual Attendees / Visitors (Pax)"
              type="number"
              fullWidth
              size="small"
              value={actualVisitors}
              onChange={(e) => setActualVisitors(Math.max(1, Number(e.target.value)))}
            />

            <TextField
              label="Shortlisted / Preferred Plot(s)"
              fullWidth
              size="small"
              placeholder="e.g. Plot No. 102 (East), 103 (Corner)"
              value={plotPreference}
              onChange={(e) => setPlotPreference(e.target.value)}
            />

            <TextField
              label="Next Follow-up Action / Customer Feedback *"
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="e.g. Customer loved the clubhouse view; requested meeting with senior director on Friday for rate negotiation."
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              required
            />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 1.75 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={submitting}
            sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {submitting ? 'Saving...' : 'Save Outcome (పూర్తయింది)'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
