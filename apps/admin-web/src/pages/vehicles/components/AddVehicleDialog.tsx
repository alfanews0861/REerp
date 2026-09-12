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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import { Vehicle, VehicleStatus, FuelType, Driver } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onVehicleAdded: (newVehicle: Vehicle) => void;
  availableDrivers: Driver[];
}

export const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  open,
  onClose,
  onVehicleAdded,
  availableDrivers,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [vehicleType, setVehicleType] = useState<Vehicle['vehicleType']>('SUV');
  const [capacitySeats, setCapacitySeats] = useState<number | ''>(7);
  const [fuelType, setFuelType] = useState<FuelType>('DIESEL');
  const [currentOdometerKm, setCurrentOdometerKm] = useState<number | ''>(25000);
  const [status, setStatus] = useState<VehicleStatus>('AVAILABLE');
  const [assignedDriverId, setAssignedDriverId] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('2027-03-31');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNumber.trim() || !makeModel.trim()) {
      setError('Registration Number and Make / Model are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const assignedDriver = availableDrivers.find((d) => d.id === assignedDriverId);

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      registrationNumber: registrationNumber.trim().toUpperCase(),
      makeModel: makeModel.trim(),
      vehicleType,
      capacitySeats: Number(capacitySeats) || 7,
      fuelType,
      assignedDriverId: assignedDriverId || undefined,
      assignedDriverName: assignedDriver ? assignedDriver.name : undefined,
      currentOdometerKm: Number(currentOdometerKm) || 0,
      status,
      insuranceExpiryDate: insuranceExpiryDate || undefined,
      branchId: 'branch-1',
      createdAt: now,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = await addDoc(collection(db, 'vehicles'), {
          ...newVehicle,
          createdAt: now,
          updatedAt: now,
        });
        newVehicle.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firestore write skipped or failed, persisting locally in memory:', err);
    } finally {
      onVehicleAdded(newVehicle);
      setSubmitting(false);
      onClose();
      // Reset form
      setRegistrationNumber('');
      setMakeModel('');
      setCurrentOdometerKm(25000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <DirectionsCarIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Add Fleet Vehicle
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
                  label="Registration Number *"
                  placeholder="e.g. TS 09 UB 1001"
                  fullWidth
                  size="small"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Make & Model *"
                  placeholder="e.g. Toyota Innova Crysta"
                  fullWidth
                  size="small"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Vehicle Category"
                  fullWidth
                  size="small"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                >
                  <MenuItem value="SUV">SUV (Innova, Scorpio)</MenuItem>
                  <MenuItem value="CAB">Sedan / Hatchback (Ertiga, Dzire)</MenuItem>
                  <MenuItem value="MINI_BUS">Mini Bus / Traveller (12-24 Seats)</MenuItem>
                  <MenuItem value="BUS">Coach Bus (32+ Seats)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Seating Capacity (Seats) *"
                  type="number"
                  placeholder="7"
                  fullWidth
                  size="small"
                  value={capacitySeats}
                  onChange={(e) => setCapacitySeats(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Fuel Type"
                  fullWidth
                  size="small"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                >
                  <MenuItem value="DIESEL">Diesel</MenuItem>
                  <MenuItem value="PETROL">Petrol</MenuItem>
                  <MenuItem value="CNG">CNG</MenuItem>
                  <MenuItem value="ELECTRIC">Electric (EV)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Odometer (KM) *"
                  type="number"
                  fullWidth
                  size="small"
                  value={currentOdometerKm}
                  onChange={(e) => setCurrentOdometerKm(e.target.value === '' ? '' : Number(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SpeedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Assigned Primary Driver"
                  fullWidth
                  size="small"
                  value={assignedDriverId}
                  onChange={(e) => setAssignedDriverId(e.target.value)}
                >
                  <MenuItem value="">-- Unassigned --</MenuItem>
                  {availableDrivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name} ({driver.phone})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Initial Status"
                  fullWidth
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                >
                  <MenuItem value="AVAILABLE">Available for Trips</MenuItem>
                  <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
                  <MenuItem value="MAINTENANCE">Under Maintenance</MenuItem>
                  <MenuItem value="OUT_OF_SERVICE">Out of Service</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Insurance Expiry Date"
              type="date"
              fullWidth
              size="small"
              value={insuranceExpiryDate}
              onChange={(e) => setInsuranceExpiryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register Vehicle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
