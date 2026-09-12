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
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CommuteIcon from '@mui/icons-material/Commute';
import SpeedIcon from '@mui/icons-material/Speed';
import { OdometerLog, Vehicle, Driver } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddTripLogDialogProps {
  open: boolean;
  onClose: () => void;
  onTripAdded: (newTrip: OdometerLog) => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const AddTripLogDialog: React.FC<AddTripLogDialogProps> = ({
  open,
  onClose,
  onTripAdded,
  vehicles,
  drivers,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');
  const [tripType, setTripType] = useState<OdometerLog['tripType']>('SITE_VISIT');
  const [customerName, setCustomerName] = useState('');
  const [siteVisitProjectName, setSiteVisitProjectName] = useState('Sunrise Enclave (Mokila)');
  const [startOdometerKm, setStartOdometerKm] = useState<number | ''>(
    vehicles[0]?.currentOdometerKm || 45000
  );
  const [notes, setNotes] = useState('');

  const handleVehicleChange = (selectedId: string) => {
    setVehicleId(selectedId);
    const foundVeh = vehicles.find((v) => v.id === selectedId);
    if (foundVeh) {
      setStartOdometerKm(foundVeh.currentOdometerKm);
      if (foundVeh.assignedDriverId) {
        setDriverId(foundVeh.assignedDriverId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !driverId || !startOdometerKm) {
      setError('Please select vehicle, driver, and enter starting odometer.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const tripNumber = `TRIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const selVeh = vehicles.find((v) => v.id === vehicleId);
    const selDriver = drivers.find((d) => d.id === driverId);

    const newTrip: OdometerLog = {
      id: `trip-${Date.now()}`,
      tripNumber,
      vehicleId,
      vehicleName: selVeh ? `${selVeh.makeModel} (${selVeh.registrationNumber})` : 'Company Car',
      driverId,
      driverName: selDriver ? selDriver.name : 'Company Driver',
      tripType,
      siteVisitProjectName: siteVisitProjectName.trim(),
      customerName: customerName.trim() || undefined,
      startOdometerKm: Number(startOdometerKm),
      startTime: now,
      notes: notes.trim() || undefined,
      status: 'ACTIVE',
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = await addDoc(collection(db, 'vehicle_trips'), {
          ...newTrip,
          createdAt: now,
          updatedAt: now,
        });
        newTrip.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firestore write skipped or failed, persisting locally in memory:', err);
    } finally {
      onTripAdded(newTrip);
      setSubmitting(false);
      onClose();
      // Reset form
      setCustomerName('');
      setNotes('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CommuteIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Start / Log Site Visit Trip
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Fleet Vehicle *"
                  fullWidth
                  size="small"
                  value={vehicleId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  required
                >
                  {vehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.makeModel} ({v.registrationNumber})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Assigned Driver *"
                  fullWidth
                  size="small"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  required
                >
                  {drivers.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Trip Purpose / Type"
                  fullWidth
                  size="small"
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                >
                  <MenuItem value="SITE_VISIT">Customer Site Visit</MenuItem>
                  <MenuItem value="MARKETING">Marketing & Leaflet Distribution</MenuItem>
                  <MenuItem value="OFFICE_COMMUTE">Staff Office Commute</MenuItem>
                  <MenuItem value="PERSONAL">Management Official Duty</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Destination Venture Project *"
                  placeholder="e.g. Sunrise Enclave (Mokila)"
                  fullWidth
                  size="small"
                  value={siteVisitProjectName}
                  onChange={(e) => setSiteVisitProjectName(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              label="Visiting Customer / Group Name"
              placeholder="e.g. Mr. Venkat Rao & Family (4 Pax)"
              fullWidth
              size="small"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <TextField
              label="Starting Odometer (KM) *"
              type="number"
              fullWidth
              size="small"
              value={startOdometerKm}
              onChange={(e) => setStartOdometerKm(e.target.value === '' ? '' : Number(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SpeedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Pickup Location & Trip Notes"
              placeholder="e.g. Pickup at Gachibowli Circle at 10:30 AM, lunch stop at Shankarpally"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Starting...' : 'Dispatch Vehicle & Log Trip'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
