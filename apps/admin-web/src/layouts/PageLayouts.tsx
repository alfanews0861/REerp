import React from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';

// PageContainer
export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 1400, mx: 'auto', width: '100%' }}>
    {children}
  </Box>
);

// PageHeader
export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box>{action}</Box>}
  </Box>
);

// SectionCard
export const SectionCard: React.FC<{ children: React.ReactNode; title?: string; noPadding?: boolean }> = ({ children, title, noPadding }) => (
  <Card sx={{ mb: 3 }}>
    {title && (
      <>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
        </Box>
        <Divider />
      </>
    )}
    <CardContent sx={{ p: noPadding ? 0 : 3, '&:last-child': { pb: noPadding ? 0 : 3 } }}>
      {children}
    </CardContent>
  </Card>
);

// SectionTitle
export const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="h6" fontWeight={600} mb={2}>
    {title}
  </Typography>
);

// StatsGrid
export const StatsGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
    {children}
  </Box>
);

// ActionToolbar
export const ActionToolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, backgroundColor: 'background.paper', borderRadius: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
    {children}
  </Box>
);

// FilterToolbar
export const FilterToolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, backgroundColor: 'background.default', borderRadius: 2, mb: 3 }}>
    {children}
  </Box>
);

// ContentLayout
export const ContentLayout: React.FC<{ children: React.ReactNode; sidebar?: React.ReactNode }> = ({ children, sidebar }) => (
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      {children}
    </Box>
    {sidebar && (
      <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
        {sidebar}
      </Box>
    )}
  </Box>
);
