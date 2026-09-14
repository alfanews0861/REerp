import { FC } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';

export const AboutPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f9fafb', py: 6 }}>
      {/* Hero Banner */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', mb: 8 }}>
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
            BUILDING TRUST SINCE 2008
          </Typography>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Pioneering Transparent Real Estate & Gated Community Excellence
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            ISKON Developers is a premier land development enterprise headquartered at RKRI Towers, Nellore, dedicated to creating AP RERA, NUDA, and DTCP approved gated layouts that deliver unmatched lifestyle infrastructure and superior investment returns.
          </Typography>
        </Box>

        {/* Pillars / Values */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
              <CardContent>
                <VerifiedUserIcon color="primary" sx={{ fontSize: 44, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  100% Legal Certainty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rigorous title search by top advocate counsels dating back 40 years before layout purchase.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
              <CardContent>
                <LocationCityIcon color="primary" sx={{ fontSize: 44, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Prime Locations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Direct corridor connectivity to Podalakur Road, Bombay Highway, Mini Bypass, and NH-16.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
              <CardContent>
                <GroupsIcon color="primary" sx={{ fontSize: 44, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Customer Centric
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dedicated CRM relationship managers assisting you from layout inspection to spot registration.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
              <CardContent>
                <HandshakeIcon color="primary" sx={{ fontSize: 44, mb: 1.5 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Timely Execution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete blacktop roads, underground drainage, overhead water tanks, and electricity before launch.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leadership & Journey */}
        <Box sx={{ bgcolor: '#ffffff', p: { xs: 3, md: 6 }, borderRadius: 4, mb: 8, border: '1px solid #e5e7eb' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="primary.main" fontWeight={700}>
                OUR TRACK RECORD
              </Typography>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Over 15 Years of Enriching Lives Through Land Ownership
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                Founded with a vision to democratize gated community land ownership with total transparency, ISKON Developers has transformed over 550 acres of agricultural land into thriving, master-planned residential townships across Nellore and Andhra Pradesh.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Today, more than 4,500 families have secured their financial future and built their dream homes in our ventures.
              </Typography>

              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    100%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Vaastu Compliant
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    4,500+
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Satisfied Buyers
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    25+
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Delivered Layouts
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                alt="Township Architecture"
                sx={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 3 }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* CTA Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)',
            color: '#ffffff',
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(30, 58, 138, 0.25)',
          }}
        >
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }}>
            Ready to Begin Your Real Estate Journey?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 620, mx: 'auto', mb: 3.5, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Book a complimentary site visit today. Our air-conditioned fleet will pick you up directly from your doorstep in Nellore.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<DirectionsCarIcon sx={{ fontSize: '1.4rem !important', color: '#1e3a8a !important' }} />}
            onClick={() => navigate('/contact')}
            sx={{
              background: '#ffffff !important',
              backgroundColor: '#ffffff !important',
              color: '#1e3a8a !important',
              fontWeight: 800,
              fontSize: '1.05rem',
              px: 4.5,
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: '#f8fafc !important',
                backgroundColor: '#f8fafc !important',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
              },
              '& .MuiButton-startIcon': {
                color: '#1e3a8a !important',
              },
            }}
          >
            Schedule Free Site Visit
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
