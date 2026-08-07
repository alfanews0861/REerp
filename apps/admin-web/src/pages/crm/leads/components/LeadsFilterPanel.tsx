import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSearch, setFilterStatus, setFilterSource, clearFilters } from '../../../../store/leadsSlice';

export const LeadsFilterPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { activeFilters } = useSelector((state: RootState) => state.leads);

  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATING', 'BOOKED', 'CLOSED_LOST', 'INVALID_UNREACHABLE'];
  const sources = ['PUBLIC_WEBSITE', 'FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_SEARCH', 'WALK_IN', 'REFERRAL'];

  const handleStatusChange = (status: string) => {
    const newStatuses = activeFilters.status.includes(status)
      ? activeFilters.status.filter(s => s !== status)
      : [...activeFilters.status, status];
    dispatch(setFilterStatus(newStatuses));
  };

  const handleSourceChange = (source: string) => {
    const newSources = activeFilters.source.includes(source)
      ? activeFilters.source.filter(s => s !== source)
      : [...activeFilters.source, source];
    dispatch(setFilterSource(newSources));
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button size="small" onClick={() => dispatch(clearFilters())}>Clear</Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search leads..."
        value={activeFilters.search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        sx={{ mb: 2 }}
      />

      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {statuses.map(status => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    size="small"
                    checked={activeFilters.status.includes(status)}
                    onChange={() => handleStatusChange(status)}
                  />
                }
                label={<Typography variant="body2">{status.replace(/_/g, ' ')}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider />

      <Accordion elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Source</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {sources.map(source => (
              <FormControlLabel
                key={source}
                control={
                  <Checkbox
                    size="small"
                    checked={activeFilters.source.includes(source)}
                    onChange={() => handleSourceChange(source)}
                  />
                }
                label={<Typography variant="body2">{source.replace(/_/g, ' ')}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Saved Filters</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label="Hot Leads" onClick={() => { /* set filters for hot leads */ }} size="small" />
          <Chip label="Today's Follow-ups" onClick={() => {}} size="small" />
        </Box>
      </Box>
    </Box>
  );
};
