import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useLeads } from '@real-estate-erp/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setViewMode, LeadViewMode } from '../../../store/leadsSlice';

import { LeadsFilterPanel } from './components/LeadsFilterPanel';
import { LeadsGrid } from './components/LeadsGrid';
import { LeadKanbanBoard } from './components/LeadKanbanBoard';
import { LeadTimelineView } from './components/LeadTimelineView';
import { LeadMapView } from './components/LeadMapView';
import { LeadsPreviewPanel } from './components/LeadsPreviewPanel';
import { BulkActionsMenu } from './components/BulkActionsMenu';

export const LeadsWorkspace: React.FC = () => {
  const dispatch = useDispatch();
  const { viewMode, activeFilters, selectedLeadId } = useSelector((state: RootState) => state.leads);
  
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useLeads(activeFilters);

  const leads = data?.pages.flatMap(page => page.data) || [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 100;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      
      {/* LEFT PANEL: Filters */}
      {filtersOpen && (
        <Paper elevation={0} sx={{ width: 300, minWidth: 300, borderRight: 1, borderColor: 'divider', borderRadius: 0, zIndex: 1 }}>
          <LeadsFilterPanel />
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
              onChange={(_, value) => value && dispatch(setViewMode(value as LeadViewMode))}
              size="small"
            >
              <ToggleButton value="TABLE"><ViewListIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="KANBAN"><ViewKanbanIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="TIMELINE"><ViewTimelineIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="MAP"><MapIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>

            {isLoading && <Typography variant="body2" color="text.secondary">Loading...</Typography>}
            {isFetchingNextPage && <Typography variant="body2" color="text.secondary">Loading more...</Typography>}
          </Box>
          <Box>
            <BulkActionsMenu selectedCount={selectedLeads.length} onAction={(action) => console.log('Action:', action)} />
          </Box>
        </Box>

        {/* View Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }} onScroll={handleScroll}>
          {viewMode === 'TABLE' && (
            <LeadsGrid leads={leads} selected={selectedLeads} onSelectChange={setSelectedLeads} />
          )}
          {viewMode === 'KANBAN' && (
            <LeadKanbanBoard leads={leads} />
          )}
          {viewMode === 'TIMELINE' && (
            <LeadTimelineView leads={leads} />
          )}
          {viewMode === 'MAP' && (
            <LeadMapView leads={leads} />
          )}
        </Box>
      </Box>

      {/* RIGHT PANEL: Preview */}
      {selectedLeadId && (
        <Box sx={{ width: 400, minWidth: 400, zIndex: 2 }}>
          <LeadsPreviewPanel leads={leads} />
        </Box>
      )}
    </Box>
  );
};

export default LeadsWorkspace;
