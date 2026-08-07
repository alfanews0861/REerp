import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface PriorityChipProps extends ChipProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const PriorityChip: React.FC<PriorityChipProps> = ({ priority, ...props }) => {
  const getColor = () => {
    switch (priority) {
      case 'low': return 'info';
      case 'medium': return 'success';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };
  return <Chip label={priority.toUpperCase()} color={getColor()} size="small" {...props} />;
};
