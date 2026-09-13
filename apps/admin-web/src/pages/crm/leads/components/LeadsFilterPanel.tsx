import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setFilterStatus, setFilterSource, clearFilters } from '../../../../store/leadsSlice';

interface LeadsFilterPanelProps {
  onClose?: () => void;
}

export const LeadsFilterPanel: React.FC<LeadsFilterPanelProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { activeFilters } = useSelector((state: RootState) => state.leads);

  const statuses = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE_VISIT_SCHEDULED',
    'SITE_VISIT_COMPLETED',
    'NEGOTIATING',
    'BOOKED',
    'CLOSED_LOST',
    'INVALID_UNREACHABLE',
  ];
  const sources = [
    'PUBLIC_WEBSITE',
    'FACEBOOK_ADS',
    'INSTAGRAM_ADS',
    'GOOGLE_SEARCH',
    'WALK_IN',
    'REFERRAL',
    'NEWSPAPER_AD',
  ];

  const handleStatusChange = (status: string) => {
    const newStatuses = activeFilters.status.includes(status)
      ? activeFilters.status.filter((s) => s !== status)
      : [...activeFilters.status, status];
    dispatch(setFilterStatus(newStatuses));
  };

  const handleSourceChange = (source: string) => {
    const newSources = activeFilters.source.includes(source)
      ? activeFilters.source.filter((s) => s !== source)
      : [...activeFilters.source, source];
    dispatch(setFilterSource(newSources));
  };

  const activeCount = activeFilters.status.length + activeFilters.source.length;

  return (
    <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterAltIcon color="primary" fontSize="small" />
          <Typography variant="h6" fontWeight={800} color="#1e293b">
            Filters {activeCount > 0 && `(${activeCount})`}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {activeCount > 0 && (
            <Button size="small" color="error" onClick={() => dispatch(clearFilters())} sx={{ fontWeight: 700, textTransform: 'none' }}>
              Reset
            </Button>
          )}
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color: '#64748b' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Filter Options Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
        {/* Quick Presets */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
            Quick Presets
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="🔥 Hot Leads"
              clickable
              color={activeFilters.status.includes('QUALIFIED') && activeFilters.status.includes('NEGOTIATING') ? 'primary' : 'default'}
              onClick={() => dispatch(setFilterStatus(['QUALIFIED', 'SITE_VISIT_SCHEDULED', 'NEGOTIATING']))}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="📞 Contacted Pipeline"
              clickable
              color={activeFilters.status.includes('CONTACTED') ? 'primary' : 'default'}
              onClick={() => dispatch(setFilterStatus(['CONTACTED', 'QUALIFIED']))}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="🚗 Site Visits"
              clickable
              color={activeFilters.status.includes('SITE_VISIT_SCHEDULED') ? 'primary' : 'default'}
              onClick={() => dispatch(setFilterStatus(['SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED']))}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Lead Status Accordion */}
        <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
              Lead Status ({activeFilters.status.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <FormGroup>
              {statuses.map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      size="small"
                      checked={activeFilters.status.includes(status)}
                      onChange={() => handleStatusChange(status)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: activeFilters.status.includes(status) ? '#1e40af' : '#334155', fontWeight: activeFilters.status.includes(status) ? 700 : 500 }}>
                      {status.replace(/_/g, ' ')}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 1.5 }} />

        {/* Lead Source Accordion */}
        <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
            <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
              Lead Source ({activeFilters.source.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <FormGroup>
              {sources.map((source) => (
                <FormControlLabel
                  key={source}
                  control={
                    <Checkbox
                      size="small"
                      checked={activeFilters.source.includes(source)}
                      onChange={() => handleSourceChange(source)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: activeFilters.source.includes(source) ? '#1e40af' : '#334155', fontWeight: activeFilters.source.includes(source) ? 700 : 500 }}>
                      {source.replace(/_/g, ' ')}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer Done button */}
      {onClose && (
        <Box sx={{ pt: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button fullWidth variant="contained" color="primary" onClick={onClose} sx={{ fontWeight: 700, borderRadius: 2 }}>
            Apply & Close
          </Button>
        </Box>
      )}
    </Box>
  );
};
