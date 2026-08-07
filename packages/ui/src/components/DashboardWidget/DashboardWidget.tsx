import React from 'react';
import { Card, CardHeader, CardContent, CardProps } from '@mui/material';

export interface DashboardWidgetProps extends CardProps {
  title: string;
  action?: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, action, children, ...props }) => {
  return (
    <Card {...props}>
      <CardHeader title={title} action={action} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};
