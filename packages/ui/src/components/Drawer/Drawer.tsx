import React from 'react';
import { Drawer as MuiDrawer, DrawerProps } from '@mui/material';

export const Drawer: React.FC<DrawerProps> = (props) => {
  return <MuiDrawer {...props} />;
};
