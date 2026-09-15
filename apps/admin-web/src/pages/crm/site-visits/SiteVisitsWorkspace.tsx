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
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { useSiteVisits } from '@real-estate-erp/hooks';
import { SiteVisit } from '@real-estate-erp/types';
import { ScheduleSiteVisitDialog } from './components/ScheduleSiteVisitDialog';
import { RecordVisitOutcomeDialog } from './components/RecordVisitOutcomeDialog';

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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [outcomeVisit, setOutcomeVisit] = useState<SiteVisit | null>(null);
  const [selectedVentureFilter, setSelectedVentureFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const { data, isFetchingNextPage, isLoading } = useSiteVisits();

  const visits = data?.pages.flatMap((page) => page.data) || [];

  const filteredVisits = visits.filter((v) => {
    if (selectedVentureFilter !== 'ALL') {
      const match = v.siteLocation?.toLowerCase().includes(selectedVentureFilter.toLowerCase());
      if (!match) return false;
    }
    if (selectedStatusFilter !== 'ALL') {
      if (v.visitStatus !== selectedStatusFilter) return false;
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 120px)', borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      {/* LEFT PANEL: Filters */}
      {filtersOpen && (
        <Paper
          elevation={0}
          sx={{
            width: 270,
            minWidth: 270,
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
            <Chip
              label="All ISKON Ventures"
              color={selectedVentureFilter === 'ALL' ? 'primary' : 'default'}
              variant={selectedVentureFilter === 'ALL' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedVentureFilter('ALL')}
            />
            <Chip
              label="ISKON City - 2 (Podalakur Rd)"
              color={selectedVentureFilter === 'ISKON City - 2' ? 'primary' : 'default'}
              variant={selectedVentureFilter === 'ISKON City - 2' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedVentureFilter('ISKON City - 2')}
            />
            <Chip
              label="Dream City (Kovuru Highway)"
              color={selectedVentureFilter === 'Dream City' ? 'primary' : 'default'}
              variant={selectedVentureFilter === 'Dream City' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedVentureFilter('Dream City')}
            />
            <Chip
              label="ISKON Brundhavanam"
              color={selectedVentureFilter === 'ISKON Brundhavanam' ? 'primary' : 'default'}
              variant={selectedVentureFilter === 'ISKON Brundhavanam' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedVentureFilter('ISKON Brundhavanam')}
            />
            <Chip
              label="ISKON Elite Township"
              color={selectedVentureFilter === 'ISKON Elite Township' ? 'primary' : 'default'}
              variant={selectedVentureFilter === 'ISKON Elite Township' ? 'filled' : 'outlined'}
              size="small"
              onClick={() => setSelectedVentureFilter('ISKON Elite Township')}
            />
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label="ALL"
              color={selectedStatusFilter === 'ALL' ? 'primary' : 'default'}
              size="small"
              onClick={() => setSelectedStatusFilter('ALL')}
            />
            <Chip
              label="IN_PROGRESS"
              color={selectedStatusFilter === 'IN_PROGRESS' ? 'primary' : 'default'}
              size="small"
              onClick={() => setSelectedStatusFilter('IN_PROGRESS')}
            />
            <Chip
              label="CONFIRMED"
              color={selectedStatusFilter === 'CONFIRMED' ? 'info' : 'default'}
              size="small"
              onClick={() => setSelectedStatusFilter('CONFIRMED')}
            />
            <Chip
              label="COMPLETED"
              color={selectedStatusFilter === 'COMPLETED' ? 'success' : 'default'}
              size="small"
              onClick={() => setSelectedStatusFilter('COMPLETED')}
            />
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

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setScheduleOpen(true)}
            sx={{ fontWeight: 700, borderRadius: 2, px: 2, textTransform: 'none' }}
          >
            Schedule Site Visit
          </Button>
        </Box>

        {/* View Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {isLoading && <Typography>Loading site visits...</Typography>}
          {!isLoading && filteredVisits.length === 0 && (
            <Typography color="text.secondary">No site visits found matching the selected filters.</Typography>
          )}

          {!isLoading && filteredVisits.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Site Visits Directory ({filteredVisits.length} records)
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {filteredVisits.map((v, i) => (
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
                            mb: 1,
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color="text.primary">
                            <strong>Update:</strong> {v.nextAction}
                          </Typography>
                        </Box>
                      )}

                      {v.visitStatus !== 'COMPLETED' && (
                        <Box sx={{ pt: 1, borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<AssignmentTurnedInIcon fontSize="small" />}
                            onClick={() => setOutcomeVisit(v)}
                            sx={{ fontWeight: 600, textTransform: 'none', borderRadius: 1.5 }}
                          >
                            Record Outcome (ఫలితం నమోదు)
                          </Button>
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

      {/* SCHEDULE SITE VISIT DIALOG */}
      <ScheduleSiteVisitDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />

      {/* RECORD VISIT OUTCOME DIALOG */}
      <RecordVisitOutcomeDialog
        open={Boolean(outcomeVisit)}
        visit={outcomeVisit}
        onClose={() => setOutcomeVisit(null)}
      />
    </Box>
  );
};

export default SiteVisitsWorkspace;
