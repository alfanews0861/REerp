import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export const DatePickerWrapper: React.FC<TextFieldProps> = (props) => {
  return <TextField type="date" InputLabelProps={{ shrink: true }} {...props} />;
};
