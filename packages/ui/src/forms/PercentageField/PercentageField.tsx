import React from 'react';
import { TextField as MuiTextField, TextFieldProps, InputAdornment } from '@mui/material';

export const PercentageField: React.FC<TextFieldProps> = (props) => {
  return (
    <MuiTextField 
      type="number"
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      {...props} 
    />
  );
};
