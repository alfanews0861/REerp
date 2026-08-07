import React from 'react';
import { PageContainer, PageHeader, SectionCard } from '../layouts';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const title = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard';
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <PageContainer>
      <PageHeader title={formattedTitle} subtitle={`Welcome to the ${formattedTitle} module`} />
      <SectionCard title="Under Construction">
        <Typography>This page is part of the Enterprise Admin Shell and is currently under construction.</Typography>
      </SectionCard>
    </PageContainer>
  );
};

export default PlaceholderPage;
