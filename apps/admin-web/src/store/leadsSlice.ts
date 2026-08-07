import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LeadViewMode = 'TABLE' | 'KANBAN' | 'TIMELINE' | 'MAP';

interface LeadsState {
  viewMode: LeadViewMode;
  selectedLeadId: string | null;
  activeFilters: {
    status: string[];
    source: string[];
    search: string;
  };
  hiddenColumns: string[];
}

const initialState: LeadsState = {
  viewMode: 'TABLE',
  selectedLeadId: null,
  activeFilters: {
    status: [],
    source: [],
    search: '',
  },
  hiddenColumns: ['aiIntentScore'], // hide by default as example
};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<LeadViewMode>) => {
      state.viewMode = action.payload;
    },
    setSelectedLeadId: (state, action: PayloadAction<string | null>) => {
      state.selectedLeadId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string[]>) => {
      state.activeFilters.status = action.payload;
    },
    setFilterSource: (state, action: PayloadAction<string[]>) => {
      state.activeFilters.source = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.activeFilters.search = action.payload;
    },
    setHiddenColumns: (state, action: PayloadAction<string[]>) => {
      state.hiddenColumns = action.payload;
    },
    clearFilters: (state) => {
      state.activeFilters = {
        status: [],
        source: [],
        search: '',
      };
    },
  },
});

export const {
  setViewMode,
  setSelectedLeadId,
  setFilterStatus,
  setFilterSource,
  setSearch,
  setHiddenColumns,
  clearFilters,
} = leadsSlice.actions;

export default leadsSlice.reducer;
