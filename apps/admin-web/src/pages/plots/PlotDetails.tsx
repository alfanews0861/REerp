import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { StatusChip, PageHeader } from '@real-estate-erp/ui';

export const PlotDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plot, setPlot] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const { db } = getFirebaseInstance();
        
        // Fetch Plot
        const plotRef = doc(db, 'plots', id);
        const plotSnap = await getDoc(plotRef);
        if (plotSnap.exists()) {
          const plotData = { id: plotSnap.id, ...plotSnap.data() };
          setPlot(plotData);

          // Fetch active booking if booked or registered
          if (plotData.currentBookingId) {
            const bookingRef = doc(db, 'bookings', plotData.currentBookingId);
            const bookingSnap = await getDoc(bookingRef);
            if (bookingSnap.exists()) {
              setBooking({ id: bookingSnap.id, ...bookingSnap.data() });
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
  }, [id]);

  if (loading) return <Typography p={3}>Loading...</Typography>;
  if (!plot) return <Typography p={3}>Plot not found.</Typography>;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader 
        title={`Plot ${plot.plotNumber}`} 
        action={
          <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        }
      />
      
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
                  <Typography color="textSecondary" color="error">Booking Expiry</Typography>
                  <Typography variant="body1">{new Date(plot.bookingExpiryAt).toLocaleString()}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {booking && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Active Booking Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Customer Name</Typography>
                  <Typography variant="body1">{booking.customerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Customer Phone</Typography>
                  <Typography variant="body1">{booking.customerPhone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Sales Executive</Typography>
                  <Typography variant="body1">{booking.salesExecutiveName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Agreed Amount</Typography>
                  <Typography variant="body1">₹{booking.finalSaleAmount}</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {plot.status === 'AVAILABLE' && (
                <Button variant="contained" color="primary">Initiate Booking</Button>
              )}
              {plot.status === 'BOOKED' && (
                <>
                  <Button variant="contained" color="success">Proceed to Registration</Button>
                  <Button variant="outlined" color="error">Cancel / Expire Booking</Button>
                </>
              )}
              <Button variant="outlined">Update Price</Button>
              <Button variant="outlined">View Documents</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default PlotDetails;
