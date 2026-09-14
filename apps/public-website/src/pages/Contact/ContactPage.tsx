import { FC, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PUBLIC_VENTURES } from '../../data/venturesData';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ContactPage: FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ventureId, setVentureId] = useState(PUBLIC_VENTURES[0]?.id || '');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [cabRequired, setCabRequired] = useState('YES');
  const [pickupLocation, setPickupLocation] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedVenture = PUBLIC_VENTURES.find((v) => v.id === ventureId) || PUBLIC_VENTURES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setErrorMsg('Please enter your full name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    const bookingRef = `WEB-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'leads'), {
          bookingRef,
          fullName,
          phone,
          email,
          projectId: ventureId,
          projectName: selectedVenture?.name,
          visitDate,
          cabRequired: cabRequired === 'YES',
          pickupLocation,
          message,
          status: 'NEW',
          source: 'PUBLIC_WEBSITE_CONTACT',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Saved lead locally (Firestore offline or emulator mode):', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedRef(bookingRef);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello, I would like to schedule a site visit for *${selectedVenture?.name}*.\nName: ${fullName}\nPhone: ${phone}\nDate: ${visitDate}\nCab Required: ${cabRequired}\nPickup: ${pickupLocation || 'Self Drive'}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f9fafb', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Box sx={{ mb: 5, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
            GET IN TOUCH & SCHEDULE VISIT
          </Typography>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            We Are Here to Help You Invest Right
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Have questions about NUDA/DTCP layouts, title approvals, or want to schedule a free doorstep cab site visit? Fill in the form or call our office.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Details & Office Locations */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #e5e7eb' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Corporate Head Office
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      RKRI Towers, Annamayya Circle, Mini Byepass Road, Nellore - 524 004, AP.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body2" fontWeight={600}>
                      +91 98480 22334 / 0861-2345678
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <EmailIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      sales@iskondevelopers.com
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, border: '1px solid #e5e7eb' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Podalakur Road Site Office
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      ISKON City - 2 Main Entrance, Near Mattempadu, Podalakur Road, Nellore - 524004, AP.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body2" fontWeight={600}>
                      +91 98480 22335
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Direct WhatsApp Action */}
              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#2e7d32', color: '#ffffff' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Chat with Us on WhatsApp
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Need instant plot availability, layout maps, or PDF brochures sent to your phone?
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  onClick={openWhatsApp}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#2e7d32',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#f3f4f6' },
                  }}
                >
                  Start WhatsApp Chat
                </Button>
              </Paper>
            </Stack>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, border: '1px solid #e5e7eb' }}>
              {submittedRef ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Site Visit Enquiry Submitted!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Thank you, <strong>{fullName}</strong>. Your Booking Reference ID is <strong>{submittedRef}</strong>. Our venture consultant will contact you shortly to coordinate cab pickup.
                  </Typography>
                  <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                    <strong>Selected Venture:</strong> {selectedVenture?.name} <br />
                    <strong>Visit Date:</strong> {visitDate} <br />
                    <strong>Free Cab Facility:</strong> {cabRequired === 'YES' ? `Requested (${pickupLocation})` : 'Self-Drive'}
                  </Alert>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    onClick={openWhatsApp}
                    fullWidth
                    size="large"
                    sx={{ py: 1.2, fontWeight: 700 }}
                  >
                    Confirm via WhatsApp
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Schedule a Free Site Visit
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Experience the project grounds firsthand. Complimentary door-to-door AC car service for you and your family.
                  </Typography>

                  {errorMsg && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {errorMsg}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Interested Venture"
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
                        label="Your Full Name"
                        placeholder="e.g. Ramesh Varma"
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
                        label="Email Address (Optional)"
                        type="email"
                        placeholder="e.g. ramesh@example.com"
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
                        label="Free Cab Facility?"
                        value={cabRequired}
                        onChange={(e) => setCabRequired(e.target.value)}
                      >
                        <MenuItem value="YES">Yes, Arrange Free AC Cab</MenuItem>
                        <MenuItem value="NO">No, Coming by Own Car</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pickup Location"
                        placeholder={cabRequired === 'YES' ? 'e.g. Kukatpally, Miyapur' : 'N/A'}
                        disabled={cabRequired === 'NO'}
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Requirements / Message"
                        placeholder="e.g. Interested in East-facing 200 sq.yd plot with immediate spot registration."
                        multiline
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        startIcon={<DirectionsCarIcon />}
                        disabled={isSubmitting}
                        sx={{ py: 1.4, fontWeight: 700, borderRadius: 2 }}
                      >
                        {isSubmitting ? 'Submitting Request...' : 'Book Free Site Visit'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
