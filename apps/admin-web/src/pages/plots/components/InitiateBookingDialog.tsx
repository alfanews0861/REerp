import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import { inventoryBookingService } from '@real-estate-erp/firebase/src/realestate/services/InventoryBookingService';

export const InitiateBookingDialog = ({ open, onClose, plot, onBookingComplete }: any) => {
  const [formData, setFormData] = useState({
    customerId: '',
    leadId: '',
    paymentAmount: 0,
    paymentMethod: 'CASH',
  });

  const handleSubmit = async () => {
    try {
      // In a real app, these values would come from Auth Context and proper UI selections
      await inventoryBookingService.bookPlot({
        plotId: plot.id,
        customerId: formData.customerId || 'cust-123',
        customerName: 'Test Customer',
        customerPhone: '1234567890',
        leadId: formData.leadId,
        salesExecutiveId: 'user-1',
        salesExecutiveName: 'Admin User',
        branchId: 'branch-1',
        projectId: plot.projectId,
        projectName: 'Project Name',
        plotNumber: plot.plotNumber,
        plotSizeSqFt: plot.area,
        agreedPricePerSqFt: plot.price / plot.area,
        totalPlotAmount: plot.price,
        discountAmount: 0,
        finalSaleAmount: plot.price,
        paymentAmount: Number(formData.paymentAmount),
        paymentMethod: formData.paymentMethod as any,
      }, 'user-1');
      onBookingComplete();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error booking plot');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Initiate Booking for Plot {plot?.plotNumber}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField label="Customer ID" value={formData.customerId} onChange={(e) => setFormData({...formData, customerId: e.target.value})} fullWidth />
          <TextField label="Lead ID (Optional)" value={formData.leadId} onChange={(e) => setFormData({...formData, leadId: e.target.value})} fullWidth />
          <Typography variant="subtitle1">Plot Price: ₹{plot?.price}</Typography>
          <TextField label="Initial Payment Amount" type="number" value={formData.paymentAmount} onChange={(e) => setFormData({...formData, paymentAmount: Number(e.target.value)})} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Confirm Booking</Button>
      </DialogActions>
    </Dialog>
  );
};
