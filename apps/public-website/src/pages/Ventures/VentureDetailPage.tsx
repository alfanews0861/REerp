import { FC, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Paper,
  Stack,
  Divider,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Alert,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PhoneIcon from '@mui/icons-material/Phone';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import LockClockIcon from '@mui/icons-material/LockClock';
import { PUBLIC_VENTURES, PUBLIC_PLOTS, PublicVenture, PublicPlot } from '../../data/venturesData';
import { SiteVisitModal } from '../../components/SiteVisitModal';
import { TokenBookingModal } from '../../components/TokenBookingModal';
import { MasterLayoutMap } from '../../components/MasterLayoutMap';
import { fetchPublicVentures, fetchPublicPlots, OnlineBookingResult } from '../../services/publicDataService';

export const VentureDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [allVentures, setAllVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [plots, setPlots] = useState<PublicPlot[]>(PUBLIC_PLOTS);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [selectedPlotNumber, setSelectedPlotNumber] = useState<string | undefined>();
  const [selectedHoldPlot, setSelectedHoldPlot] = useState<PublicPlot | null>(null);
  const [bookingNotice, setBookingNotice] = useState<OnlineBookingResult | null>(null);

  const loadData = async () => {
    const [vList, pList] = await Promise.all([
      fetchPublicVentures(),
      fetchPublicPlots(id),
    ]);
    setAllVentures(vList);
    setPlots(pList);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const venture = allVentures.find((v) => v.id === id) || allVentures[0];
  const venturePlots = plots.filter((p) => p.projectId === venture.id);

  const handleBookPlotVisit = (plotNum: string) => {
    setSelectedPlotNumber(plotNum);
    setVisitModalOpen(true);
  };

  const handleHoldPlot = (plot: PublicPlot) => {
    setSelectedHoldPlot(plot);
    setHoldModalOpen(true);
  };

  const handleBookingCompleted = (result: OnlineBookingResult) => {
    setBookingNotice(result);
    loadData();
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#f9fafb', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="hover">
            Home
          </Link>
          <Link component={RouterLink} to="/ventures" color="inherit" underline="hover">
            Ventures
          </Link>
          <Typography color="text.primary" fontWeight={600}>
            {venture.name}
          </Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            bgcolor: '#ffffff',
            mb: 4,
          }}
        >
          <Box sx={{ position: 'relative', height: { xs: 260, md: 400 } }}>
            <Box
              component="img"
              src={venture.heroImage}
              alt={venture.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                display: 'flex',
                gap: 1.5,
              }}
            >
              <Chip
                label={`${venture.approvalAuthority} APPROVED`}
                color="primary"
                icon={<VerifiedIcon />}
                sx={{ fontWeight: 700, px: 1 }}
              />
              <Chip
                label={`RERA: ${venture.reraId}`}
                color="success"
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {venture.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  {venture.tagline}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <LocationOnIcon color="error" fontSize="small" />
                  <Typography variant="body2">{venture.location}</Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Starting Price
                </Typography>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  ₹{venture.basePricePerSqYd.toLocaleString('en-IN')}{' '}
                  <Typography variant="body2" component="span" color="text.secondary">
                    / sq.yd
                  </Typography>
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight={700}>
                  Spot Registration & Bank Loan Eligible
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Specs Bar */}
            <Grid container spacing={3} sx={{ textAlign: 'center' }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Layout Area
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {venture.totalAreaAcres} Acres
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Gated Plots
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {venture.totalPlots} Units
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Available for Booking
                </Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {venture.availablePlots} Plots
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Approval LP Number
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {venture.approvalNumber}
                </Typography>
              </Grid>
            </Grid>

            {/* CTAs */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<DirectionsCarIcon />}
                onClick={() => setVisitModalOpen(true)}
                sx={{ fontWeight: 700, px: 3, py: 1.2, borderRadius: 2 }}
              >
                Book Free AC Cab Site Visit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ZoomInIcon />}
                onClick={() => setMapModalOpen(true)}
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                View Master Layout Map
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Content Tabs & Details */}
        <Grid container spacing={4}>
          {/* Left Column: Description, Amenities & Available Plots */}
          <Grid item xs={12} md={8}>
            {/* Overview */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Project Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                {venture.description}
              </Typography>

              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Key Highlights
              </Typography>
              <Grid container spacing={1.5}>
                {venture.highlights.map((h, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 20, mt: 0.2 }} />
                      <Typography variant="body2">{h}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Infrastructure & Amenities */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                World-Class Gated Amenities
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {venture.amenities.map((amenity, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {amenity}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Available Plots In This Venture */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Available Plots in {venture.name}
                </Typography>
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/plots?projectId=${venture.id}`}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Explore All Plots
                </Button>
              </Box>

              {/* Booking Confirmation Notice */}
              {bookingNotice && (
                <Alert
                  severity="success"
                  sx={{ mb: 2, borderRadius: 2 }}
                  onClose={() => setBookingNotice(null)}
                >
                  <strong>Plot #{bookingNotice.plotNumber} Hold Confirmed!</strong> 48H hold active until{' '}
                  {new Date(bookingNotice.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.{' '}
                  Receipt #{bookingNotice.receiptNumber} generated.
                </Alert>
              )}

              {venturePlots.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Please call our sales office for live plot availability in this layout.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Plot #</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Facing</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Area (Sq.Yds)</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Total Price</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {venturePlots.map((plot) => (
                        <TableRow key={plot.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>
                            {plot.plotNumber}
                            {plot.isCornerPlot && (
                              <Chip label="Corner" size="small" color="secondary" sx={{ ml: 1, fontSize: '0.65rem' }} />
                            )}
                          </TableCell>
                          <TableCell>{plot.facing}</TableCell>
                          <TableCell>{plot.areaSqYds} sq.yd ({plot.dimensions})</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                            ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={plot.status === 'AVAILABLE' ? 'Available' : plot.status === 'BOOKED' ? 'Reserved (48h)' : 'Fast Selling'}
                              color={plot.status === 'AVAILABLE' ? 'success' : plot.status === 'BOOKED' ? 'error' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleBookPlotVisit(plot.plotNumber)}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                              >
                                Enquire
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color={plot.status === 'BOOKED' ? 'inherit' : 'primary'}
                                disabled={plot.status === 'BOOKED'}
                                startIcon={<LockClockIcon fontSize="small" />}
                                onClick={() => handleHoldPlot(plot)}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                              >
                                {plot.status === 'BOOKED' ? 'Reserved' : 'Hold Plot'}
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>

          {/* Right Column: Strategic Location & Assistance */}
          <Grid item xs={12} md={4}>
            {/* Connectivity Box */}
            <Card sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Strategic Connectivity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Direct transit times to key growth nodes & employment hubs:
                </Typography>
                <Stack spacing={1.5}>
                  {venture.connectivity.map((conn, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {conn.label}
                      </Typography>
                      <Chip label={conn.time} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Need Assistance Card */}
            <Card sx={{ borderRadius: 3, bgcolor: 'primary.dark', color: '#ffffff' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Schedule A Free Site Visit
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  Our real estate specialist will arrange doorstep pickup in a sanitized AC cab and walk you through every boundary stone.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DirectionsCarIcon sx={{ color: '#1e3a8a !important' }} />}
                  onClick={() => setVisitModalOpen(true)}
                  sx={{
                    background: '#ffffff !important',
                    backgroundColor: '#ffffff !important',
                    color: '#1e3a8a !important',
                    fontWeight: 800,
                    mb: 1.5,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      background: '#f8fafc !important',
                      backgroundColor: '#f8fafc !important',
                      transform: 'translateY(-1px)',
                    },
                    '& .MuiButton-startIcon': {
                      color: '#1e3a8a !important',
                    },
                  }}
                >
                  Book Free AC Cab
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  color="inherit"
                  startIcon={<PhoneIcon />}
                  onClick={() => window.open('tel:+919876543210')}
                  sx={{ borderColor: 'rgba(255,255,255,0.4)', textTransform: 'none' }}
                >
                  Call +91 98765 43210
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Master Plan Interactive Explorer Modal */}
      <Dialog open={mapModalOpen} onClose={() => setMapModalOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {venture.name} - Master Layout Map Explorer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Layout approved by {venture.approvalAuthority} vide approval number {venture.approvalNumber} &bull; RERA: {venture.reraId}
            </Typography>
          </Box>
          <IconButton onClick={() => setMapModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2, bgcolor: '#f9fafb' }}>
          <MasterLayoutMap
            plots={venturePlots}
            projectName={venture.name}
            onHoldPlot={(plot) => {
              setMapModalOpen(false);
              handleHoldPlot(plot);
            }}
            onVisitPlot={(plot) => {
              setMapModalOpen(false);
              handleBookPlotVisit(plot.plotNumber);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Site Visit Modal */}
      <SiteVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        defaultVentureId={venture.id}
        defaultPlotNumber={selectedPlotNumber}
      />

      {/* Online Token Booking & Hold Modal */}
      <TokenBookingModal
        open={holdModalOpen}
        onClose={() => setHoldModalOpen(false)}
        plot={selectedHoldPlot}
        onBookingSuccess={handleBookingCompleted}
      />
    </Box>
  );
};
