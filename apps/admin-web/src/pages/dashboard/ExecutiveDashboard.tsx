import React from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingState, ErrorState } from '@real-estate-erp/ui';
import { useDashboardData } from './hooks/useDashboardData';
import { MetricSection } from './components/MetricSection';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardWidgets } from './components/DashboardWidgets';
import { QuickActions } from './components/QuickActions';

const ExecutiveDashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (isLoading) {
    return <LoadingState message="Loading Executive Dashboard..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        message={error?.message || 'An unknown error occurred while fetching dashboard data.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Enterprise Executive Dashboard
      </Typography>
      
      <QuickActions />
      <MetricSection data={data} />
      <DashboardCharts data={data} />
      <DashboardWidgets data={data} />
    </Box>
  );
};

export default ExecutiveDashboard;
