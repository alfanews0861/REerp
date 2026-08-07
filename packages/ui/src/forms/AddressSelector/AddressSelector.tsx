import React from 'react';
import { TextField, Box } from '@mui/material';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AddressSelectorProps {
  value?: Address;
  onChange?: (address: Address) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({ ...value, [field]: e.target.value } as Address);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Street" value={value?.street || ''} onChange={handleChange('street')} fullWidth />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="City" value={value?.city || ''} onChange={handleChange('city')} fullWidth />
        <TextField label="State" value={value?.state || ''} onChange={handleChange('state')} fullWidth />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Zip Code" value={value?.zipCode || ''} onChange={handleChange('zipCode')} fullWidth />
        <TextField label="Country" value={value?.country || ''} onChange={handleChange('country')} fullWidth />
      </Box>
    </Box>
  );
};
