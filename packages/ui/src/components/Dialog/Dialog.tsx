import React from 'react';
import { Dialog as MuiDialog, DialogProps } from '@mui/material';

export const Dialog: React.FC<DialogProps> = (props) => {
  return <MuiDialog {...props} />;
};
