import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export const RichNotesEditor: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField 
      multiline
      minRows={4}
      placeholder="Type your notes here..."
      {...props} 
    />
  );
};
