import { FC, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import { PUBLIC_VENTURES, PublicVenture } from '../../data/venturesData';
import { VentureCard } from '../../components/VentureCard';
import { SiteVisitModal } from '../../components/SiteVisitModal';
import { fetchPublicVentures } from '../../services/publicDataService';

export const VenturesPage: FC = () => {
  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedVentureId, setSelectedVentureId] = useState<string | undefined>();

  useEffect(() => {
    fetchPublicVentures().then(setVentures);
  }, []);

  const filteredVentures = useMemo(() => {
    let result = [...ventures];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q)
      );
    }

    if (authorityFilter !== 'ALL') {
      result = result.filter((v) => v.approvalAuthority === authorityFilter);
    }

    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.basePricePerSqYd - b.basePricePerSqYd);
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.basePricePerSqYd - a.basePricePerSqYd);
    } else if (sortBy === 'ACRES_DESC') {
      result.sort((a, b) => b.totalAreaAcres - a.totalAreaAcres);
    } else {
      // FEATURED
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchTerm, authorityFilter, sortBy]);

  const handleOpenVisitModal = (ventureId?: string) => {
    setSelectedVentureId(ventureId);
    setVisitModalOpen(true);
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f9fafb', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <VerifiedIcon color="primary" />
            <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.2 }}>
              OFFICIALLY APPROVED LAYOUTS & GATED TOWNSHIPS
            </Typography>
          </Stack>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Explore Our Real Estate Ventures
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find the ideal open plot for building your independent villa or long-term high-ROI investment with guaranteed clear title.
          </Typography>
        </Box>

        {/* Filter Toolbar */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            border: '1px solid #e5e7eb',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by venture name, road, or corridor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Approval Authority"
                value={authorityFilter}
                onChange={(e) => setAuthorityFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Approvals</MenuItem>
                <MenuItem value="HMDA">HMDA Approved</MenuItem>
                <MenuItem value="DTCP">DTCP Approved</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="FEATURED">Featured & Recommended</MenuItem>
                <MenuItem value="PRICE_ASC">Price: Low to High</MenuItem>
                <MenuItem value="PRICE_DESC">Price: High to Low</MenuItem>
                <MenuItem value="ACRES_DESC">Township Size (Acres)</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Quick Authority Badges */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
            <Typography variant="caption" sx={{ alignSelf: 'center', mr: 1, color: 'text.secondary', fontWeight: 600 }}>
              Quick Filters:
            </Typography>
            <Chip
              label="All"
              clickable
              color={authorityFilter === 'ALL' ? 'primary' : 'default'}
              size="small"
              onClick={() => setAuthorityFilter('ALL')}
            />
            <Chip
              label="HMDA Approved (Urban)"
              clickable
              color={authorityFilter === 'HMDA' ? 'primary' : 'default'}
              size="small"
              onClick={() => setAuthorityFilter('HMDA')}
            />
            <Chip
              label="DTCP Approved (High Growth)"
              clickable
              color={authorityFilter === 'DTCP' ? 'primary' : 'default'}
              size="small"
              onClick={() => setAuthorityFilter('DTCP')}
            />
          </Stack>
        </Box>

        {/* Results Counter */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
          Showing <strong>{filteredVentures.length}</strong> active ventures in Telangana & Hyderabad corridors
        </Typography>

        {/* Ventures Grid */}
        {filteredVentures.length === 0 ? (
          <Alert severity="info">
            No ventures match your filter criteria. Try adjusting your search query or filters.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredVentures.map((venture) => (
              <Grid item xs={12} sm={6} md={4} key={venture.id}>
                <VentureCard venture={venture} onBookVisit={handleOpenVisitModal} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Site Visit Modal */}
      <SiteVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        defaultVentureId={selectedVentureId}
      />
    </Box>
  );
};
