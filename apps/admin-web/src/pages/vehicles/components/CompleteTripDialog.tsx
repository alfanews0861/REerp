import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import { OdometerLog } from '@real-estate-erp/types';

interface CompleteTripDialogProps {
  trip: OdometerLog | null;
  open: boolean;
  onClose: () => void;
  onTripCompleted: (tripId: string, endOdometerKm: number, notes?: string) => void;
}

export const CompleteTripDialog: React.FC<CompleteTripDialogProps> = ({
  trip,
  open,
  onClose,
  onTripCompleted,
}) => {
  const [endOdometerKm, setEndOdometerKm] = useState<number | ''>('');
  const [closingNotes, setClosingNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!trip) return null;

  const startKm = trip.startOdometerKm || 0;
  const calculatedDistance =
    endOdometerKm !== '' && Number(endOdometerKm) >= startKm
      ? Number(endOdometerKm) - startKm
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!endOdometerKm || Number(endOdometerKm) < startKm) {
      setError(`Ending odometer must be greater than or equal to start odometer (${startKm} KM).`);
      return;
    }

    onTripCompleted(trip.id, Number(endOdometerKm), closingNotes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircleIcon color="success" />
          <Typography variant="h6" fontWeight={600}>
            Complete Trip: {trip.tripNumber || 'Active Trip'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '74vh' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Vehicle
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {trip.vehicleName || trip.vehicleId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Driver
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {trip.driverName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Destination
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {trip.siteVisitProjectName || 'Site Visit'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Starting Odometer
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {startKm.toLocaleString('en-IN')} KM
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <TextField
              label="Ending Odometer Reading (KM) *"
              type="number"
              placeholder={`e.g. ${startKm + 85}`}
              fullWidth
              size="small"
              value={endOdometerKm}
              onChange={(e) => {
                setError(null);
                setEndOdometerKm(e.target.value === '' ? '' : Number(e.target.value));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SpeedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              required
            />

            {calculatedDistance !== null && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.lighter',
                  border: 1,
                  borderColor: 'success.light',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" fontWeight={600} color="success.dark">
                  Total Trip Distance Calculated:
                </Typography>
                <Typography variant="h6" fontWeight={800} color="success.dark">
                  {calculatedDistance} KM
                </Typography>
              </Paper>
            )}

            <Divider />

            <TextField
              label="Trip Completion Notes / Customer Feedback"
              placeholder="e.g. Safe return, customer expressed high interest in Plot P-12, vehicle parked at main office."
              multiline
              rows={3}
              fullWidth
              size="small"
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="success">
            Complete & Save Trip Log
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
