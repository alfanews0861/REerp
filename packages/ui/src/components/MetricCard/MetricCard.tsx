import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h4">{value}</Typography>
            {trend && (
              <Typography variant="body2" color={trend.isPositive ? 'success.main' : 'error.main'}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </Typography>
            )}
          </Box>
          {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};
