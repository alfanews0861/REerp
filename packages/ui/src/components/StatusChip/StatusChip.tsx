import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface StatusChipProps extends ChipProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, ...props }) => {
  const getColor = () => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'success';
      case 'inactive':
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return <Chip label={status.toUpperCase()} color={getColor()} size="small" {...props} />;
};
