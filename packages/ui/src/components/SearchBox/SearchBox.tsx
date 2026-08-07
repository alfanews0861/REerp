import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const SearchBox: React.FC<TextFieldProps> = (props) => {
  return <TextField placeholder="Search..." InputProps={{ startAdornment: <SearchIcon /> }} {...props} />;
};
