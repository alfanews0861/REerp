import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Badge,
  Chip,
  Stack,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import MapIcon from '@mui/icons-material/Map';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useLeads } from '@real-estate-erp/hooks';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { Lead } from '@real-estate-erp/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setViewMode, LeadViewMode, setSearch, setFilterStatus, setFilterSource, clearFilters } from '../../../store/leadsSlice';

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
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useLeads(activeFilters);

  const leads = data?.pages.flatMap(page => page.data) || [];
  const selectedLeadObjects = leads.filter((l) => selectedLeads.includes(l.id));

  const activeFiltersCount =
    activeFilters.status.length +
    activeFilters.source.length +
    (activeFilters.search.trim() ? 1 : 0);

  const handleBatchUpdate = async (leadIds: string[], updates: Partial<Lead>) => {
    try {
      const { db } = getFirebaseInstance();
      if (db && leadIds.length > 0) {
        const batch = writeBatch(db);
        for (const id of leadIds) {
          const docRef = doc(db, 'leads', id);
          batch.update(docRef, { ...updates, updatedAt: new Date().toISOString() });
        }
        await batch.commit();
      }
      setSelectedLeads([]);
    } catch (err) {
      console.error('Failed to batch update leads:', err);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 100;
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 120px)', borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
      
      {/* MAIN CONTENT AREA */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        
        {/* TOP TOOLBAR: Search Bar, Filters Trigger, Views, and Actions */}
        <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            justifyContent="space-between"
          >
            {/* Left/Center Section: Search Bar & Filters Button */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, maxWidth: { xs: '100%', md: 550 } }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search leads..."
                value={activeFilters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: activeFilters.search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => dispatch(setSearch(''))}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Tooltip title="Toggle Filters">
                <Button
                  variant={filtersOpen || activeFiltersCount > 0 ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={
                    <Badge badgeContent={activeFiltersCount} color="error">
                      <FilterListIcon />
                    </Badge>
                  }
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 2.5,
                    height: 40,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Filters
                </Button>
              </Tooltip>
            </Stack>

            {/* Right Section: View Switchers & Bulk Actions */}
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: 'space-between', md: 'flex-end' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && dispatch(setViewMode(value as LeadViewMode))}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <ToggleButton value="TABLE">
                  <Tooltip title="Table View"><ViewListIcon fontSize="small" /></Tooltip>
                </ToggleButton>
                <ToggleButton value="KANBAN">
                  <Tooltip title="Kanban Board"><ViewKanbanIcon fontSize="small" /></Tooltip>
                </ToggleButton>
                <ToggleButton value="TIMELINE">
                  <Tooltip title="Timeline View"><ViewTimelineIcon fontSize="small" /></Tooltip>
                </ToggleButton>
                <ToggleButton value="MAP">
                  <Tooltip title="Map View"><MapIcon fontSize="small" /></Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              {isLoading && (
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Loading...
                </Typography>
              )}

              <BulkActionsMenu
                selectedCount={selectedLeads.length}
                selectedLeads={selectedLeadObjects}
                onBatchUpdate={handleBatchUpdate}
              />
            </Stack>
          </Stack>

          {/* Active Filter Chips Bar */}
          {(activeFilters.status.length > 0 || activeFilters.source.length > 0 || activeFilters.search) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.04em' }}>
                ACTIVE FILTERS:
              </Typography>
              {activeFilters.search && (
                <Chip
                  label={`Search: "${activeFilters.search}"`}
                  size="small"
                  onDelete={() => dispatch(setSearch(''))}
                  color="primary"
                  variant="outlined"
                />
              )}
              {activeFilters.status.map((st) => (
                <Chip
                  key={st}
                  label={`Status: ${st.replace(/_/g, ' ')}`}
                  size="small"
                  onDelete={() => dispatch(setFilterStatus(activeFilters.status.filter((s) => s !== st)))}
                  color="info"
                  variant="outlined"
                />
              ))}
              {activeFilters.source.map((src) => (
                <Chip
                  key={src}
                  label={`Source: ${src.replace(/_/g, ' ')}`}
                  size="small"
                  onDelete={() => dispatch(setFilterSource(activeFilters.source.filter((s) => s !== src)))}
                  color="secondary"
                  variant="outlined"
                />
              ))}
              <Button
                size="small"
                color="error"
                onClick={() => dispatch(clearFilters())}
                sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0, minHeight: 24, fontWeight: 700 }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        {/* View Content (Full Width) */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 0 }} onScroll={handleScroll}>
          {viewMode === 'TABLE' && (
            <LeadsGrid leads={leads} selected={selectedLeads} onSelectChange={setSelectedLeads} />
          )}
          {viewMode === 'KANBAN' && (
            <Box sx={{ p: 2, height: '100%' }}>
              <LeadKanbanBoard leads={leads} />
            </Box>
          )}
          {viewMode === 'TIMELINE' && (
            <Box sx={{ p: 2, height: '100%' }}>
              <LeadTimelineView leads={leads} />
            </Box>
          )}
          {viewMode === 'MAP' && (
            <Box sx={{ p: 2, height: '100%' }}>
              <LeadMapView leads={leads} />
            </Box>
          )}
        </Box>
      </Box>

      {/* FILTER MENU DRAWER (Slides out from right) */}
      <Drawer
        anchor="right"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{
          sx: { width: { xs: 320, sm: 360 }, p: 0, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' },
        }}
      >
        <LeadsFilterPanel onClose={() => setFiltersOpen(false)} />
      </Drawer>

      {/* RIGHT PANEL: Lead Detail Preview */}
      {selectedLeadId && (
        <Box sx={{ width: { xs: 340, md: 400 }, minWidth: { xs: 340, md: 400 }, zIndex: 2, borderLeft: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <LeadsPreviewPanel leads={leads} />
        </Box>
      )}
    </Box>
  );
};

export default LeadsWorkspace;
