import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export const DateField: React.FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField 
      type="date"
      InputLabelProps={{ shrink: true }}
      {...props} 
    />
  );
};
