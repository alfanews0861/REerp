import React, { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Chip,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupsIcon from '@mui/icons-material/Groups';
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useSiteVisits } from '@real-estate-erp/hooks';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'primary';
    case 'CONFIRMED':
      return 'info';
    case 'SCHEDULED':
      return 'secondary';
    default:
      return 'default';
  }
};

const getOutcomeColor = (outcome?: string) => {
  switch (outcome) {
    case 'BOOKED':
      return 'success';
    case 'HOT':
      return 'error';
    case 'WARM':
      return 'warning';
    default:
      return 'default';
  }
};

export const SiteVisitsWorkspace: React.FC = () => {
  const [viewMode, setViewMode] = useState<'TABLE' | 'CALENDAR' | 'TIMELINE' | 'MAP'>('TABLE');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { data, isFetchingNextPage, isLoading } = useSiteVisits();

  const visits = data?.pages.flatMap((page) => page.data) || [];

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 120px)', borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {/* LEFT PANEL: Filters */}
      {filtersOpen && (
        <Paper
          elevation={0}
          sx={{
            width: 260,
            minWidth: 260,
            borderRight: 1,
            borderColor: 'divider',
            borderRadius: 0,
            zIndex: 1,
            p: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Filter Site Visits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Venture Locations & Corridors
          </Typography>
          <Stack spacing={1}>
            <Chip label="All Ventures" color="primary" variant="filled" size="small" />
            <Chip label="Sunrise Enclave (Mokila)" variant="outlined" size="small" />
            <Chip label="Green Valley (Shadnagar)" variant="outlined" size="small" />
            <Chip label="Palm County (Kollur)" variant="outlined" size="small" />
            <Chip label="Royal Meadows (Shankarpally)" variant="outlined" size="small" />
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="IN_PROGRESS" color="primary" size="small" />
            <Chip label="CONFIRMED" color="info" size="small" />
            <Chip label="COMPLETED" color="success" size="small" />
          </Stack>
        </Paper>
      )}

      {/* CENTER PANEL: Main View */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
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
              <ToggleButton value="TABLE">
                <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> List
              </ToggleButton>
              <ToggleButton value="CALENDAR">
                <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} /> Schedule
              </ToggleButton>
              <ToggleButton value="TIMELINE">
                <ViewTimelineIcon fontSize="small" sx={{ mr: 0.5 }} /> Timeline
              </ToggleButton>
              <ToggleButton value="MAP">
                <MapIcon fontSize="small" sx={{ mr: 0.5 }} /> Geo Map
              </ToggleButton>
            </ToggleButtonGroup>

            {isLoading && (
              <Typography variant="body2" color="text.secondary">
                Loading visits...
              </Typography>
            )}
            {isFetchingNextPage && (
              <Typography variant="body2" color="text.secondary">
                Loading more...
              </Typography>
            )}
          </Box>
        </Box>

        {/* View Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {isLoading && <Typography>Loading site visits...</Typography>}
          {!isLoading && visits.length === 0 && <Typography>No site visits found.</Typography>}

          {!isLoading && visits.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Site Visits Directory ({visits.length} records)
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {visits.map((v, i) => (
                  <Grid item xs={12} md={viewMode === 'TABLE' ? 12 : 6} key={v.id || i}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        borderLeft: `5px solid ${
                          v.visitStatus === 'COMPLETED'
                            ? '#2e7d32'
                            : v.visitStatus === 'IN_PROGRESS'
                            ? '#1976d2'
                            : '#ed6c02'
                        }`,
                        '&:hover': { boxShadow: 3 },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                            {v.siteLocation || 'Venture Site'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Date: {v.scheduledDate} {v.scheduledStartTime ? `• ${v.scheduledStartTime.split('T')[1]?.substring(0, 5)} hrs` : ''}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={v.visitStatus}
                            color={getStatusColor(v.visitStatus) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          {v.outcome && (
                            <Chip
                              label={v.outcome}
                              color={getOutcomeColor(v.outcome) as any}
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={3} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PlaceIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Meeting: {v.meetingLocation || 'Office'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DirectionsCarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Mode: {v.visitMode}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <GroupsIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Visitors: {v.expectedVisitors || 1} pax
                          </Typography>
                        </Box>
                      </Stack>

                      {v.nextAction && (
                        <Box
                          sx={{
                            p: 1.2,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.primary">
                            <strong>Update:</strong> {v.nextAction}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SiteVisitsWorkspace;
