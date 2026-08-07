import React from 'react';
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material';

export const Avatar: React.FC<AvatarProps> = (props) => {
  return <MuiAvatar {...props} />;
};
