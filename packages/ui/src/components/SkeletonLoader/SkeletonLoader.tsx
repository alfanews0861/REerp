import React from 'react';
import { Skeleton, SkeletonProps } from '@mui/material';

export const SkeletonLoader: React.FC<SkeletonProps> = (props) => {
  return <Skeleton {...props} />;
};
