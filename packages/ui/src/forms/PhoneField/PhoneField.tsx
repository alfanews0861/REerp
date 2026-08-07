import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export const PhoneField: React.FC<TextFieldProps> = (props) => {
  return <MuiTextField type="tel" {...props} />;
};
