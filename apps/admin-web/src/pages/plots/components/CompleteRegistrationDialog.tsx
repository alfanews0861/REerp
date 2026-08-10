import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { registrationService } from '@real-estate-erp/firebase';

export const CompleteRegistrationDialog = ({ open, onClose, booking, onRegistrationComplete }: any) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
  });

  const balance = booking?.finalAmount - (booking?.totalPaidAmount || 0);

  const handleSubmit = async () => {
    try {
      await registrationService.completeRegistration({
        bookingId: booking.id,
        registrationNumber: formData.registrationNumber,
        registrationDate: new Date().toISOString(),
        documents: [{ type: 'Sale Deed', url: 'http://example.com/doc', verified: true }],
      }, 'user-1');
      onRegistrationComplete();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert('Error completing registration: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Registration</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Typography variant="body1">Total Agreed Amount: ₹{booking?.finalAmount}</Typography>
          <Typography variant="body1">Total Paid: ₹{booking?.totalPaidAmount}</Typography>
          <Typography variant="body1" color={balance > 0 ? "error" : "success.main"}>
            Outstanding Balance: ₹{balance}
          </Typography>
          
          {balance > 0 && (
            <Typography variant="body2" color="error">
              Registration cannot be completed while there is an outstanding balance.
            </Typography>
          )}

          <TextField 
            label="Registration Document Number" 
            value={formData.registrationNumber} 
            onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} 
            fullWidth 
            disabled={balance > 0}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="success" disabled={balance > 0}>Complete Registration</Button>
      </DialogActions>
    </Dialog>
  );
};
