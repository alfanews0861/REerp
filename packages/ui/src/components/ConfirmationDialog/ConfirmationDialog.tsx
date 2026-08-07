import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps } from '@mui/material';

export interface ConfirmationDialogProps extends Omit<DialogProps, 'onConfirm'> {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, onConfirm, onCancel, ...props }) => {
  return (
    <Dialog {...props} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
