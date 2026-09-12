import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Stack,
  Divider,
  Paper,
  IconButton,
  TextField,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AttendanceRecord } from '@real-estate-erp/types';

interface AttendanceDetailsDialogProps {
  record: AttendanceRecord | null;
  open: boolean;
  onClose: () => void;
  onPunchOut: (recordId: string, punchOutTime: string, notes?: string) => void;
}

export const AttendanceDetailsDialog: React.FC<AttendanceDetailsDialogProps> = ({
  record,
  open,
  onClose,
  onPunchOut,
}) => {
  const [punchOutNotes, setPunchOutNotes] = useState('');

  if (!record) return null;

  const handlePunchOutClick = () => {
    const now = new Date().toISOString();
    onPunchOut(record.id, now, punchOutNotes);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
      case 'ON_FIELD_DUTY':
        return 'success';
      case 'LATE':
      case 'HALF_DAY':
        return 'warning';
      case 'ABSENT':
      case 'ON_LEAVE':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {record.userName}
            </Typography>
            <Chip
              label={record.status.replace('_', ' ')}
              color={getStatusColor(record.status)}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {record.userRole} • {record.date}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '74vh' }}>
        <Stack spacing={2.5}>
          {/* Geo-fence Verification Alert */}
          {record.isGeoFenceVerified ? (
            <Alert severity="success" icon={<VerifiedIcon />}>
              <Typography variant="subtitle2" fontWeight={700}>
                Geo-Fence Verified Check-in
              </Typography>
              <Typography variant="caption">
                Employee check-in coordinates confirmed inside project geofence boundary.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" icon={<LocationOnIcon />}>
              <Typography variant="subtitle2" fontWeight={700}>
                Outside Geo-Fence Boundary
              </Typography>
              <Typography variant="caption">
                Check-in recorded outside standard geofence boundary. Manual review recommended.
              </Typography>
            </Alert>
          )}

          {/* Time & Location Grid */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Punch-In Time
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {record.punchInTime
                    ? new Date(record.punchInTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Punch-Out Time
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {record.punchOutTime
                    ? new Date(record.punchOutTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Currently Active'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Assigned Location / Venture
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary">
                  {record.assignedLocationName || 'Head Office'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Total Hours Worked
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {record.totalHoursWorked || 8.5} Hours
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Divider />

          {/* Daily Work Duty Summary */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Daily Work Summary & Site Tasks
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {record.workSummary ||
                'Attended scheduled customer site tours and assisted with layout demarcations.'}
            </Typography>
          </Box>

          {/* Punch Out Prompt if not checked out */}
          {!record.punchOutTime && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Record Evening Punch-Out
              </Typography>
              <TextField
                placeholder="Add end-of-day summary or tasks completed..."
                multiline
                rows={2}
                fullWidth
                size="small"
                value={punchOutNotes}
                onChange={(e) => setPunchOutNotes(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AccessTimeIcon />}
                onClick={handlePunchOutClick}
              >
                Punch Out Employee
              </Button>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
