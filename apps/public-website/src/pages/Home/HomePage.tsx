import { FC, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Slider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_VENTURES, TESTIMONIALS, FAQS } from '../../data/venturesData';
import { VentureCard } from '../../components/VentureCard';
import { SiteVisitModal } from '../../components/SiteVisitModal';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const [selectedVentureId, setSelectedVentureId] = useState('');
  const [selectedFacing, setSelectedFacing] = useState('');
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [modalVentureId, setModalVentureId] = useState<string | undefined>();

  // ROI Calculator State
  const [investAmount, setInvestAmount] = useState<number>(2500000); // 25 Lakhs
  const [years, setYears] = useState<number>(5);
  const expectedCagr = 0.18; // 18% historical land appreciation in Hyderabad suburban growth corridors
  const projectedValue = Math.round(investAmount * Math.pow(1 + expectedCagr, years));
  const totalGain = projectedValue - investAmount;

  const handleOpenVisitModal = (ventureId?: string) => {
    setModalVentureId(ventureId);
    setVisitModalOpen(true);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedVentureId) params.append('projectId', selectedVentureId);
    if (selectedFacing) params.append('facing', selectedFacing);
    navigate(`/plots?${params.toString()}`);
  };

  return (
    <Box>
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '620px',
          background: `linear-gradient(rgba(17, 24, 39, 0.72), rgba(17, 24, 39, 0.82)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat`,
          display: 'flex',
          alignItems: 'center',
          color: '#ffffff',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 960, mx: 'auto', textAlign: 'center' }}>
            <Chip
              icon={<VerifiedIcon sx={{ color: '#ffb74d !important' }} />}
              label="100% DTCP & HMDA APPROVED GATED PLOTS"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffecb3',
                fontWeight: 700,
                mb: 2.5,
                px: 1,
                backdropFilter: 'blur(4px)',
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: '2.2rem', sm: '3.2rem', md: '3.8rem' },
                lineHeight: 1.15,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              Own Premium Open Plots in Hyderabad’s Fastest Growing Corridors
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#e5e7eb',
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              100% Clear Titles, Spot Registration, Bank Loans & World-Class Gated Infrastructure in Mokila, Shadnagar, Kollur & Srisailam Highway.
            </Typography>

            {/* Quick Filter / Search Box */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                bgcolor: '#ffffff',
                color: 'text.primary',
                textAlign: 'left',
              }}
            >
              <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                <Grid item xs={12} sm={6} md={3.5}>
                  <TextField
                    select
                    fullWidth
                    label="Choose Corridor / Venture"
                    value={selectedVentureId}
                    onChange={(e) => setSelectedVentureId(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="">All Ventures & Corridors</MenuItem>
                    {PUBLIC_VENTURES.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={2.5}>
                  <TextField
                    select
                    fullWidth
                    label="Facing / Vaastu"
                    value={selectedFacing}
                    onChange={(e) => setSelectedFacing(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="">Any Facing</MenuItem>
                    <MenuItem value="EAST">East Facing</MenuItem>
                    <MenuItem value="WEST">West Facing</MenuItem>
                    <MenuItem value="NORTH">North Facing</MenuItem>
                    <MenuItem value="SOUTH">South Facing</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      py: 1.1,
                      fontWeight: 700,
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    Search Plots
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={() => handleOpenVisitModal()}
                    startIcon={<DirectionsCarIcon />}
                    sx={{
                      py: 1.1,
                      fontWeight: 700,
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      borderWidth: '1.5px',
                      '&:hover': { borderWidth: '1.5px' },
                    }}
                  >
                    Book Free AC Cab
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Trust Badges */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedIcon sx={{ color: '#4caf50' }} />
                <Typography variant="body2" fontWeight={600}>
                  Spot Sub-Registrar Registration
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon sx={{ color: '#ff9800' }} />
                <Typography variant="body2" fontWeight={600}>
                  SBI & HDFC Bank Loans Up to 75%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCarIcon sx={{ color: '#42a5f5' }} />
                <Typography variant="body2" fontWeight={600}>
                  Free Doorstep AC Cab Site Visits
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 2. STATS BAR */}
      <Box sx={{ bgcolor: '#ffffff', py: 4, borderBottom: '1px solid #e5e7eb' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} textAlign="center">
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                25+
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Completed Mega Ventures
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                4,500+
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Happy Plot Owners
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                550+
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Acres Master Planned
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Clear Legal Title Assurance
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. FEATURED VENTURES SECTION */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
                PREMIER LAYOUTS & GATED TOWNSHIPS
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                Featured Ventures for High Appreciation
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                DTCP & HMDA layouts offering immediate spot registration and modern amenities.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/ventures')}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              View All Ventures
            </Button>
          </Box>

          <Grid container spacing={3}>
            {PUBLIC_VENTURES.filter((v) => v.featured).map((venture) => (
              <Grid item xs={12} md={4} key={venture.id}>
                <VentureCard venture={venture} onBookVisit={handleOpenVisitModal} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. WHY CHOOSE US / INFRASTRUCTURE EXCELLENCE */}
      <Box sx={{ bgcolor: '#f3f4f6', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
            <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
              THE SREEKANTH REDDY ADVANTAGE
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Why Hundreds of Investors Trust Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We eliminate all the risks associated with real estate through legal diligence, high-spec engineering, and end-to-end customer support.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, borderRadius: 3, textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <SecurityIcon sx={{ fontSize: 44 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    100% Clear Title
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Every acre is scrutinized by senior high-court legal counsels. Spot registration with Dharani/Patta passbook.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, borderRadius: 3, textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <ArchitectureIcon sx={{ fontSize: 44 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Top-Tier Infrastructure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    40' & 33' Blacktop roads, underground cabling, avenue plantations, overhead tanks, and underground drainage.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, borderRadius: 3, textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 44 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    High Capital Growth
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Strategically acquired adjacent to Outer Ring Road exits, Regional Ring Road (RRR), and upcoming industrial hubs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, borderRadius: 3, textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <DirectionsCarIcon sx={{ fontSize: 44 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Doorstep Cab Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complimentary sanitized AC cars pick you and your family up for site inspections with zero obligation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 5. INTERACTIVE ROI CALCULATOR */}
      <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Chip label="INVESTMENT SIMULATOR" color="primary" size="small" sx={{ fontWeight: 700, mb: 1 }} />
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Plot Appreciation & ROI Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estimate the future wealth potential of open plot investments based on historical 18% CAGR growth in Hyderabad corridors.
              </Typography>
            </Box>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Investment Amount:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      ₹{(investAmount / 100000).toFixed(1)} Lakhs
                    </Typography>
                  </Box>
                  <Slider
                    value={investAmount}
                    min={1000000}
                    max={10000000}
                    step={250000}
                    onChange={(_, val) => setInvestAmount(val as number)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">₹10 Lakhs</Typography>
                    <Typography variant="caption" color="text.secondary">₹1.0 Crore</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Investment Horizon:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      {years} Years
                    </Typography>
                  </Box>
                  <Slider
                    value={years}
                    min={2}
                    max={10}
                    step={1}
                    marks
                    onChange={(_, val) => setYears(val as number)}
                    valueLabelDisplay="auto"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">2 Years</Typography>
                    <Typography variant="caption" color="text.secondary">10 Years</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Projected Value after {years} Years
                  </Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ my: 1.5 }}>
                    ₹{(projectedValue / 100000).toFixed(1)}L
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">Net Wealth Gain:</Typography>
                    <Typography variant="caption" fontWeight={700} color="#a7f3d0">
                      +₹{(totalGain / 100000).toFixed(1)} Lakhs
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption">Projected ROI:</Typography>
                    <Typography variant="caption" fontWeight={700} color="#a7f3d0">
                      +{Math.round((totalGain / investAmount) * 100)}%
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleOpenVisitModal()}
                    sx={{
                      mt: 3,
                      bgcolor: '#ffffff',
                      color: 'primary.main',
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#f3f4f6' },
                    }}
                  >
                    Lock In A Plot Today
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 6. TESTIMONIALS */}
      <Box sx={{ py: 8, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 6 }}>
            <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
              CUSTOMER SATISFACTION
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              What Our Investors Say
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real experiences from IT executives, doctors, and NRI families who invested in our ventures.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid item xs={12} md={4} key={t.id}>
                <Card sx={{ height: '100%', p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <Rating value={t.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, flexGrow: 1, color: 'text.secondary' }}>
                    "{t.quote}"
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={t.avatar} alt={t.name} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {t.designation}
                      </Typography>
                      <Typography variant="caption" color="primary.main" fontWeight={600}>
                        {t.venturePurchased}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. FREE CAB CALL TO ACTION */}
      <Box sx={{ py: 8, bgcolor: 'primary.dark', color: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="overline" sx={{ color: '#ffecb3', fontWeight: 700, letterSpacing: 1.5 }}>
                EXCLUSIVE WEEKEND SITE VISITS
              </Typography>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Experience the Layout in Person with Complimentary Cab Service
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e7eb', maxWidth: 650 }}>
                Don't decide based on brochures alone. We provide free doorstep AC cab pickup from your home anywhere in Hyderabad so you and your family can inspect the ground reality, roads, and surrounding landmarks.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DirectionsCarIcon />}
                onClick={() => handleOpenVisitModal()}
                sx={{
                  bgcolor: '#ffffff',
                  color: 'primary.dark',
                  fontWeight: 800,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.05rem',
                  '&:hover': { bgcolor: '#f3f4f6' },
                }}
              >
                Book Free AC Cab
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
              QUESTIONS & CLARIFICATIONS
            </Typography>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Frequently Asked Questions
            </Typography>
          </Box>

          <Stack spacing={2}>
            {FAQS.map((faq, index) => (
              <Accordion key={index} sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid #e5e7eb' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Site Visit Modal */}
      <SiteVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        defaultVentureId={modalVentureId}
      />
    </Box>
  );
};
