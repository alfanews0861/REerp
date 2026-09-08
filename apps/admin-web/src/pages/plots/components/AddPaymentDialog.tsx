import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { paymentService } from '@real-estate-erp/firebase';

export const AddPaymentDialog = ({ open, onClose, booking, onPaymentComplete }: any) => {
  const [formData, setFormData] = useState({
    amount: 0,
    paymentMethod: 'CASH',
    transactionRef: '',
  });

  const handleSubmit = async () => {
    try {
      await paymentService.recordPayment({
        bookingId: booking.id,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as any,
        transactionRef: formData.transactionRef,
      }, 'user-1'); // using a dummy user id for now
      onPaymentComplete();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert('Error recording payment: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Payment</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField label="Amount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} fullWidth />
          <TextField label="Payment Method" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} fullWidth />
          <TextField label="Transaction Reference" value={formData.transactionRef} onChange={(e) => setFormData({...formData, transactionRef: e.target.value})} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Record Payment</Button>
      </DialogActions>
    </Dialog>
  );
};
