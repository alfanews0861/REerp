import React from 'react';
import { TextField as MuiTextField, TextFieldProps, InputAdornment } from '@mui/material';

export const CurrencyField: React.FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField 
      type="number"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      {...props} 
    />
  );
};
