import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useSiteVisits } from '@real-estate-erp/hooks';

export const SiteVisitsWorkspace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'TABLE' | 'CALENDAR' | 'TIMELINE' | 'MAP'>('TABLE');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useSiteVisits();

  const visits = data?.pages.flatMap(page => page.data) || [];

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      
      {/* LEFT PANEL: Filters */}
      {filtersOpen && (
        <Paper elevation={0} sx={{ width: 300, minWidth: 300, borderRight: 1, borderColor: 'divider', borderRadius: 0, zIndex: 1, p: 2 }}>
          <Typography variant="h6">Filters</Typography>
          {/* Add FilterPanel here */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Status, Date, Executive, etc.
          </Typography>
        </Paper>
      )}

      {/* CENTER PANEL: Main View */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Toggle Filters">
              <IconButton onClick={() => setFiltersOpen(!filtersOpen)} color={filtersOpen ? 'primary' : 'default'}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value as typeof viewMode)}
              size="small"
            >
              <ToggleButton value="TABLE"><ViewListIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="CALENDAR"><CalendarMonthIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="TIMELINE"><ViewTimelineIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="MAP"><MapIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>

            {isLoading && <Typography variant="body2" color="text.secondary">Loading...</Typography>}
            {isFetchingNextPage && <Typography variant="body2" color="text.secondary">Loading more...</Typography>}
          </Box>
        </Box>

        {/* View Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {isLoading && <Typography>Loading site visits...</Typography>}
          {!isLoading && visits.length === 0 && <Typography>No site visits found.</Typography>}
          
          {!isLoading && visits.length > 0 && viewMode === 'TABLE' && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>Table View ({visits.length} visits)</Typography>
              {visits.map((v, i) => (
                <Paper key={v.id || i} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="body2">{v.visitStatus} - {v.scheduledDate}</Typography>
                </Paper>
              ))}
            </Box>
          )}
          {!isLoading && visits.length > 0 && viewMode === 'CALENDAR' && (
            <Typography>Calendar View ({visits.length} visits)</Typography>
          )}
          {!isLoading && visits.length > 0 && viewMode === 'TIMELINE' && (
            <Typography>Timeline View ({visits.length} visits)</Typography>
          )}
          {!isLoading && visits.length > 0 && viewMode === 'MAP' && (
            <Typography>Map View ({visits.length} visits)</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SiteVisitsWorkspace;
