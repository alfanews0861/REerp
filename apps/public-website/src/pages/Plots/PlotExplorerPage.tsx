import { FC, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  Button,
  Chip,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CompassCalibrationIcon from '@mui/icons-material/Explore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockClockIcon from '@mui/icons-material/LockClock';
import { PUBLIC_PLOTS, PUBLIC_VENTURES, PublicPlot, PublicVenture } from '../../data/venturesData';
import { SiteVisitModal } from '../../components/SiteVisitModal';
import { TokenBookingModal } from '../../components/TokenBookingModal';
import { MasterLayoutMap } from '../../components/MasterLayoutMap';
import { useI18n } from '../../providers/LanguageContext';
import { fetchPublicVentures, fetchPublicPlots, OnlineBookingResult } from '../../services/publicDataService';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';

export const PlotExplorerPage: FC = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || 'ALL';
  const initialFacing = searchParams.get('facing') || 'ALL';

  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [allPlots, setAllPlots] = useState<PublicPlot[]>(PUBLIC_PLOTS);
  const [selectedProject, setSelectedProject] = useState(initialProjectId);
  const [selectedFacing, setSelectedFacing] = useState(initialFacing);
  const [cornerOnly, setCornerOnly] = useState('ALL');
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<PublicPlot | null>(null);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<OnlineBookingResult | null>(null);

  const loadData = async () => {
    const [vList, pList] = await Promise.all([
      fetchPublicVentures(),
      fetchPublicPlots(),
    ]);
    setVentures(vList);
    setAllPlots(pList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPlots = useMemo(() => {
    return allPlots.filter((plot) => {
      if (selectedProject !== 'ALL' && plot.projectId !== selectedProject) return false;
      if (selectedFacing !== 'ALL' && plot.facing !== selectedFacing) return false;
      if (cornerOnly === 'CORNER' && !plot.isCornerPlot) return false;
      if (selectedSize === 'SMALL' && plot.areaSqYds > 180) return false;
      if (selectedSize === 'MEDIUM' && (plot.areaSqYds < 180 || plot.areaSqYds > 260)) return false;
      if (selectedSize === 'LARGE' && plot.areaSqYds < 260) return false;
      return true;
    });
  }, [allPlots, selectedProject, selectedFacing, cornerOnly, selectedSize]);

  const handleEnquirePlot = (plot: PublicPlot) => {
    setSelectedPlot(plot);
    setVisitModalOpen(true);
  };

  const handleHoldPlot = (plot: PublicPlot) => {
    setSelectedPlot(plot);
    setHoldModalOpen(true);
  };

  const handleBookingCompleted = (result: OnlineBookingResult) => {
    setBookingSuccessNotice(result);
    // Reload plot inventory to reflect reserved status
    loadData();
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f9fafb', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.2 }}>
            REAL-TIME INVENTORY EXPLORER
          </Typography>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            {t('inventory_title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('inventory_subtitle')}
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label={t('filter_venture')}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <MenuItem value="ALL">{t('all_ventures')}</MenuItem>
                {ventures.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label={t('filter_facing')}
                value={selectedFacing}
                onChange={(e) => setSelectedFacing(e.target.value)}
              >
                <MenuItem value="ALL">{t('any_facing')}</MenuItem>
                <MenuItem value="EAST">{t('east_facing')}</MenuItem>
                <MenuItem value="WEST">{t('west_facing')}</MenuItem>
                <MenuItem value="NORTH">{t('north_facing')}</MenuItem>
                <MenuItem value="SOUTH">{t('south_facing')}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label={t('filter_size')}
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <MenuItem value="ALL">{t('all_sizes')}</MenuItem>
                <MenuItem value="SMALL">{t('small_size')}</MenuItem>
                <MenuItem value="MEDIUM">{t('medium_size')}</MenuItem>
                <MenuItem value="LARGE">{t('large_size')}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label={t('filter_position')}
                value={cornerOnly}
                onChange={(e) => setCornerOnly(e.target.value)}
              >
                <MenuItem value="ALL">{t('all_positions')}</MenuItem>
                <MenuItem value="CORNER">{t('corner_only')}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* Booking Confirmation Alert */}
        {bookingSuccessNotice && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setBookingSuccessNotice(null)}
          >
            <strong>Plot #{bookingSuccessNotice.plotNumber} successfully reserved for {bookingSuccessNotice.customerName}!</strong>{' '}
            Your 48-Hour price freeze is active until{' '}
            {new Date(bookingSuccessNotice.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.{' '}
            Official Booking Receipt #{bookingSuccessNotice.receiptNumber} generated.
          </Alert>
        )}

        {/* Counter and View Switcher Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('found_plots')}: <strong>{filteredPlots.length}</strong>
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<GridViewIcon />}
              onClick={() => setViewMode('grid')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('view_card_grid')}
            </Button>
            <Button
              variant={viewMode === 'map' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<MapIcon />}
              onClick={() => setViewMode('map')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              {t('view_layout_map')}
            </Button>
          </Stack>
        </Box>

        {/* Interactive Map View */}
        {viewMode === 'map' && (
          <MasterLayoutMap
            plots={filteredPlots}
            projectName={selectedProject !== 'ALL' ? ventures.find((v) => v.id === selectedProject)?.name : undefined}
            onHoldPlot={handleHoldPlot}
            onVisitPlot={handleEnquirePlot}
          />
        )}

        {/* Plots Grid View */}
        {viewMode === 'grid' && (
          filteredPlots.length === 0 ? (
            <Alert severity="info">
              No plots match the chosen filters. Please choose different facing or size criteria.
            </Alert>
          ) : (
          <Grid container spacing={3}>
            {filteredPlots.map((plot) => (
              <Grid item xs={12} sm={6} md={4} key={plot.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e5e7eb',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        Plot #{plot.plotNumber}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        {plot.isCornerPlot && (
                          <Chip label="CORNER" size="small" color="secondary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                        )}
                        <Chip
                          label={plot.status === 'AVAILABLE' ? 'Available' : plot.status === 'BOOKED' ? 'Reserved (48h)' : 'Fast Selling'}
                          size="small"
                          color={plot.status === 'AVAILABLE' ? 'success' : plot.status === 'BOOKED' ? 'error' : 'warning'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </Stack>
                    </Box>

                    <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom noWrap>
                      {plot.projectName}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <CompassCalibrationIcon fontSize="small" />
                          <Typography variant="caption">Facing:</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>
                          {plot.facing}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <SquareFootIcon fontSize="small" />
                          <Typography variant="caption">Area:</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>
                          {plot.areaSqYds} Sq.Yds
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Dimensions:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {plot.dimensions} Ft
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Rate / Sq.Yd:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ₹{plot.pricePerSqYd.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Total Investment Value:
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="primary.main">
                        ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs
                      </Typography>
                    </Box>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                          Clear Title &bull; Spot Reg.
                        </Typography>
                      </Stack>
                      {plot.status === 'BOOKED' && (
                        <Chip label="HOLD ACTIVE" size="small" color="error" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<DirectionsCarIcon />}
                        onClick={() => handleEnquirePlot(plot)}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        Site Visit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        color={plot.status === 'BOOKED' ? 'inherit' : 'primary'}
                        disabled={plot.status === 'BOOKED'}
                        startIcon={<LockClockIcon />}
                        onClick={() => handleHoldPlot(plot)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        {plot.status === 'BOOKED' ? 'Reserved' : 'Hold Plot'}
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </Container>

      {/* Site Visit Modal */}
      <SiteVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        defaultVentureId={selectedPlot?.projectId}
        defaultPlotNumber={selectedPlot?.plotNumber}
      />

      {/* Online Token Booking & Hold Modal */}
      <TokenBookingModal
        open={holdModalOpen}
        onClose={() => setHoldModalOpen(false)}
        plot={selectedPlot}
        onBookingSuccess={handleBookingCompleted}
      />
    </Box>
  );
};
