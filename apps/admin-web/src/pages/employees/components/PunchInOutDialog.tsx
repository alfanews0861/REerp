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
  Alert,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { AttendanceRecord, AttendanceStatus } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface PunchInOutDialogProps {
  open: boolean;
  onClose: () => void;
  onAttendanceRecorded: (record: AttendanceRecord) => void;
}

export const PunchInOutDialog: React.FC<PunchInOutDialogProps> = ({
  open,
  onClose,
  onAttendanceRecorded,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Sales Executive');
  const [staffType, setStaffType] = useState<'FIELD_STAFF' | 'OFFICE_STAFF'>('FIELD_STAFF');
  const [assignedLocationName, setAssignedLocationName] = useState('Sunrise Enclave Site Office (Mokila)');
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [punchInTime, setPunchInTime] = useState('09:15');
  const [isGeoFenceVerified, setIsGeoFenceVerified] = useState(true);
  const [workSummary, setWorkSummary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please provide Employee Name.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const punchInIso = `${dateStr}T${punchInTime}:00Z`;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      userName: userName.trim(),
      userRole: userRole.trim(),
      staffType,
      assignedLocationName: assignedLocationName.trim(),
      branchId: 'branch-1',
      date: dateStr,
      punchInTime: punchInIso,
      isGeoFenceVerified,
      status,
      workSummary: workSummary.trim() || undefined,
      totalHoursWorked: status === 'HALF_DAY' ? 4 : 8.5,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = await addDoc(collection(db, 'attendance'), {
          ...newRecord,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        });
        newRecord.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firestore write skipped or failed, persisting locally in memory:', err);
    } finally {
      onAttendanceRecorded(newRecord);
      setSubmitting(false);
      onClose();
      // Reset form
      setUserName('');
      setWorkSummary('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <HowToRegIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Record Daily Check-in / Attendance
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
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Employee Name *"
                  placeholder="e.g. Vamshi Krishna"
                  fullWidth
                  size="small"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Role / Designation *"
                  placeholder="e.g. Sales Executive"
                  fullWidth
                  size="small"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Staff Category"
                  fullWidth
                  size="small"
                  value={staffType}
                  onChange={(e) => setStaffType(e.target.value as any)}
                >
                  <MenuItem value="FIELD_STAFF">Field Staff (On-site at Venture)</MenuItem>
                  <MenuItem value="OFFICE_STAFF">Office Staff (Head Office / Telecaller)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Attendance Status"
                  fullWidth
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                >
                  <MenuItem value="PRESENT">Present</MenuItem>
                  <MenuItem value="ON_FIELD_DUTY">On Field Duty (Site Visit)</MenuItem>
                  <MenuItem value="LATE">Late Check-in</MenuItem>
                  <MenuItem value="HALF_DAY">Half Day</MenuItem>
                  <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Assigned Site / Office Location"
                  placeholder="e.g. Sunrise Enclave Site Office (Mokila)"
                  fullWidth
                  size="small"
                  value={assignedLocationName}
                  onChange={(e) => setAssignedLocationName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Punch-In Time"
                  type="time"
                  fullWidth
                  size="small"
                  value={punchInTime}
                  onChange={(e) => setPunchInTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={isGeoFenceVerified}
                  onChange={(e) => setIsGeoFenceVerified(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography variant="body2" fontWeight={500}>
                  GPS Geo-Fence Verified (Checked-in within 200m of project boundary)
                </Typography>
              }
            />

            <TextField
              label="Daily Work Duty / Planned Tasks"
              placeholder="e.g. Attending 3 customer site visits from 11 AM to 4 PM, boundary stone demarcation at block B."
              multiline
              rows={3}
              fullWidth
              size="small"
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Check-in'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
