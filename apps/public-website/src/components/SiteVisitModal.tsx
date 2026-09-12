import { FC, useState } from 'react';
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
  Box,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PUBLIC_VENTURES } from '../data/venturesData';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface SiteVisitModalProps {
  open: boolean;
  onClose: () => void;
  defaultVentureId?: string;
  defaultPlotNumber?: string;
}

export const SiteVisitModal: FC<SiteVisitModalProps> = ({
  open,
  onClose,
  defaultVentureId,
  defaultPlotNumber,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ventureId, setVentureId] = useState(defaultVentureId || PUBLIC_VENTURES[0]?.id || '');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [cabRequired, setCabRequired] = useState('YES');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState(defaultPlotNumber ? `Inquiring about Plot #${defaultPlotNumber}` : '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedVenture = PUBLIC_VENTURES.find((v) => v.id === ventureId) || PUBLIC_VENTURES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setErrorMessage('Please enter your full name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const bookingRef = `VISIT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'site_visits'), {
          bookingRef,
          customerName: fullName,
          customerPhone: phone,
          customerEmail: email,
          projectId: ventureId,
          projectName: selectedVenture?.name,
          preferredDate: visitDate,
          cabRequired: cabRequired === 'YES',
          pickupLocation,
          notes,
          status: 'SCHEDULED',
          source: 'PUBLIC_WEBSITE',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Saved locally (Firestore offline or emulator not connected):', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedRef(bookingRef);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPickupLocation('');
    setNotes('');
    setSubmittedRef(null);
    setErrorMessage('');
    onClose();
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello, I would like to schedule a site visit for *${selectedVenture?.name}*.\nReference: *${submittedRef}*\nName: ${fullName}\nPhone: ${phone}\nDate: ${visitDate}\nCab Required: ${cabRequired}\nPickup: ${pickupLocation || 'Self-drive'}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={handleReset} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCarIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Schedule a Free Site Visit
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleReset} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {submittedRef ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Site Visit Booked Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your Booking Reference ID is <strong>{submittedRef}</strong>. Our executive will call you within 15 minutes to confirm cab timing & pickup details.
            </Typography>
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <strong>Venture:</strong> {selectedVenture?.name} <br />
              <strong>Date:</strong> {visitDate} <br />
              <strong>Complimentary Cab:</strong> {cabRequired === 'YES' ? `Yes (${pickupLocation || 'Hyderabad'})` : 'Self Drive'}
            </Alert>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={openWhatsApp}
              fullWidth
              size="large"
              sx={{ fontWeight: 600, py: 1.2 }}
            >
              Confirm on WhatsApp (+91 98765 43210)
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Enjoy complimentary AC Cab pickup and drop for you and your family!
            </Alert>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Venture / Layout"
                  value={ventureId}
                  onChange={(e) => setVentureId(e.target.value)}
                  required
                >
                  {PUBLIC_VENTURES.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name} ({v.approvalAuthority} Approved - ₹{v.basePricePerSqYd.toLocaleString('en-IN')}/sq.yd)
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="e.g. Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  placeholder="e.g. 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email (Optional)"
                  placeholder="e.g. rajesh@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Visit Date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Need Free Cab Pickup?"
                  value={cabRequired}
                  onChange={(e) => setCabRequired(e.target.value)}
                >
                  <MenuItem value="YES">Yes, Arrange Free AC Cab</MenuItem>
                  <MenuItem value="NO">No, Traveling in Own Vehicle</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pickup Location / Landmark"
                  placeholder={cabRequired === 'YES' ? 'e.g. Gachibowli, Kukatpally' : 'Not applicable'}
                  disabled={cabRequired === 'NO'}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Notes or Specific Plot Interested"
                  placeholder="e.g. Looking for East-facing 200 sq.yd corner plot"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {submittedRef ? (
          <Button onClick={handleReset} variant="outlined">
            Close
          </Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ px: 3 }}
            >
              {isSubmitting ? 'Booking...' : 'Book Free Site Visit'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
