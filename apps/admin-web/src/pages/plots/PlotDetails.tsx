import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { StatusChip } from '@real-estate-erp/ui';
import { InitiateBookingDialog } from './components/InitiateBookingDialog';
import { AddPaymentDialog } from './components/AddPaymentDialog';
import { CompleteRegistrationDialog } from './components/CompleteRegistrationDialog';

export const PlotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plot, setPlot] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-fetch

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const { db } = getFirebaseInstance();
        
        // Fetch Plot
        const plotRef = doc(db, 'plots', id);
        const plotSnap = await getDoc(plotRef);
        if (plotSnap.exists()) {
          const plotData = { id: plotSnap.id, ...plotSnap.data() } as any;
          setPlot(plotData);

          // Fetch active booking if booked or registered
          if (plotData.currentBookingId) {
            const bookingRef = doc(db, 'bookings', plotData.currentBookingId);
            const bookingSnap = await getDoc(bookingRef);
            if (bookingSnap.exists()) {
              const bData = { id: bookingSnap.id, ...bookingSnap.data() };
              setBooking(bData);

              // Fetch Payments for this booking
              const paymentsQuery = query(collection(db, 'payments'), where('bookingId', '==', bData.id));
              const paymentsSnap = await getDocs(paymentsQuery);
              const paymentsData = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setPayments(paymentsData);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch plot details', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [id, refreshKey]);

  if (loading) return <Typography p={3}>Loading...</Typography>;
  if (!plot) return <Typography p={3}>Plot not found.</Typography>;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{`Plot ${plot.plotNumber}`}</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Plot Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary">Status</Typography>
                <StatusChip status={plot.status} />
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Price</Typography>
                <Typography variant="body1">₹{plot.price}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Area</Typography>
                <Typography variant="body1">{plot.area} {plot.areaUnit}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Facing</Typography>
                <Typography variant="body1">{plot.facing}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Road Width</Typography>
                <Typography variant="body1">{plot.roadWidth} ft</Typography>
              </Grid>
              {plot.bookingExpiryAt && (
                <Grid item xs={6}>
                  <Typography color={new Date(plot.bookingExpiryAt) < new Date() ? "error" : "textSecondary"}>Booking Expiry</Typography>
                  <Typography variant="body1">{new Date(plot.bookingExpiryAt).toLocaleString()}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {booking && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Booking Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Customer ID</Typography>
                  <Typography variant="body1">{booking.customerId}</Typography>
                </Grid>
                {booking.leadId && (
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Lead ID</Typography>
                    <Typography variant="body1">{booking.leadId}</Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography color="textSecondary">Booking Date</Typography>
                  <Typography variant="body1">{new Date(booking.bookingDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Booking Status</Typography>
                  <Typography variant="body1">{booking.status}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {booking && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Payments & Ledger</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Total Price</Typography>
                  <Typography variant="body1">₹{booking.finalAmount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Total Paid</Typography>
                  <Typography variant="body1">₹{booking.totalPaidAmount || 0}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Outstanding Balance</Typography>
                  <Typography variant="body1" color={booking.finalAmount - (booking.totalPaidAmount || 0) > 0 ? "error" : "success.main"}>
                    ₹{booking.finalAmount - (booking.totalPaidAmount || 0)}
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Payment History</Typography>
                {payments.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">No payments recorded.</Typography>
                ) : (
                  <ul>
                    {payments.map(p => (
                      <li key={p.id}>
                        <Typography variant="body2">
                          {new Date(p.paymentDate).toLocaleDateString()} - {p.paymentMethod}: ₹{p.amount} ({p.status})
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </Box>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {plot.status === 'AVAILABLE' && (
                <Button variant="contained" color="primary" onClick={() => setBookingDialogOpen(true)}>Initiate Booking</Button>
              )}
              {plot.status === 'BOOKED' && booking?.status === 'active' && (
                <>
                  <Button variant="contained" color="secondary" onClick={() => setPaymentDialogOpen(true)}>Add Payment</Button>
                  <Button variant="contained" color="success" onClick={() => setRegistrationDialogOpen(true)}>Complete Registration</Button>
                  <Button variant="outlined" color="error">Cancel / Expire Booking</Button>
                </>
              )}
              <Button variant="outlined">Update Price</Button>
              <Button variant="outlined">View Documents</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      {plot.status === 'AVAILABLE' && (
        <InitiateBookingDialog 
          open={bookingDialogOpen} 
          onClose={() => setBookingDialogOpen(false)} 
          plot={plot} 
          onBookingComplete={() => setRefreshKey(prev => prev + 1)} 
        />
      )}
      
      {booking && (
        <AddPaymentDialog 
          open={paymentDialogOpen} 
          onClose={() => setPaymentDialogOpen(false)} 
          booking={booking} 
          onPaymentComplete={() => setRefreshKey(prev => prev + 1)} 
        />
      )}

      {booking && (
        <CompleteRegistrationDialog 
          open={registrationDialogOpen} 
          onClose={() => setRegistrationDialogOpen(false)} 
          booking={booking} 
          onRegistrationComplete={() => setRefreshKey(prev => prev + 1)} 
        />
      )}

    </Box>
  );
};
export default PlotDetails;

