import { FC, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Divider,
  Fab,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { SiteVisitModal } from '../components/SiteVisitModal';
import { TokenBookingModal } from '../components/TokenBookingModal';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { GeminiAIAssistantModal } from '../components/GeminiAIAssistantModal';
import { useI18n } from '../providers/LanguageContext';
import { PublicPlot } from '../data/venturesData';

export const PublicLayout: FC = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [holdPlot, setHoldPlot] = useState<PublicPlot | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_ventures'), path: '/ventures' },
    { label: t('nav_plots'), path: '/plots' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_contact'), path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent('Hello! I would like more information about your DTCP/HMDA approved ventures in Hyderabad.');
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fbfbfb' }}>
      {/* Top Announcement Bar */}
      <Box sx={{ bgcolor: 'primary.dark', color: '#ffffff', py: 0.6, px: { xs: 1, sm: 2 }, fontSize: '0.82rem' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16, color: '#93c5fd' }} />
                <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>+91 98765 43210</span>
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16, color: '#93c5fd' }} />
                <span>sales@sreekanthreddyrealty.com</span>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, ml: 'auto' }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75 }}>
                <DirectionsCarIcon sx={{ fontSize: 16, color: '#fbc02d' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#ffecb3', whiteSpace: 'nowrap' }}>
                  {t('complimentary_cab')}
                </Typography>
              </Box>

              {/* Staff / Admin ERP Direct Link Button */}
              <Button
                component="a"
                href="https://reerp-b806b.web.app"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                startIcon={<LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  py: 0.25,
                  px: 1.2,
                  borderRadius: 1.5,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    borderColor: '#ffffff',
                  },
                }}
              >
                Staff / Admin ERP Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header / Navbar */}
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #eaeaea' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: 64, md: 72 }, gap: 2 }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  p: 0.85,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LocationCityIcon fontSize="medium" />
              </Box>
              <Box sx={{ whiteSpace: 'nowrap' }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  sx={{
                    letterSpacing: -0.3,
                    lineHeight: 1.1,
                    color: 'text.primary',
                    fontSize: { xs: '0.95rem', sm: '1.05rem', lg: '1.15rem' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  SREEKANTH REDDY REALTY
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{
                    letterSpacing: 0.5,
                    fontSize: { xs: '0.62rem', sm: '0.68rem' },
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  DTCP & HMDA APPROVED GATED TOWNSHIPS
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={{ md: 0.8, lg: 1.5 }} alignItems="center" sx={{ flexShrink: 0 }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: isActive ? 700 : 600,
                        borderBottom: isActive ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        borderRadius: 0,
                        px: { md: 1, lg: 1.5 },
                        py: 0.8,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        minWidth: 'max-content',
                        fontSize: { md: '0.84rem', lg: '0.9rem' },
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.main',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}

                <LanguageSwitcher />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setVisitModalOpen(true)}
                  startIcon={<DirectionsCarIcon sx={{ fontSize: '1.1rem !important' }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    px: { md: 1.5, lg: 2.2 },
                    py: 0.85,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: 'max-content',
                    fontSize: { md: '0.82rem', lg: '0.88rem' },
                  }}
                >
                  {t('book_free_visit')}
                </Button>

                {/* Admin Portal Gateway Button */}
                <Button
                  component="a"
                  href="https://reerp-b806b.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="secondary"
                  startIcon={<AdminPanelSettingsIcon sx={{ fontSize: '1.1rem !important' }} />}
                  endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    px: { md: 1.2, lg: 1.8 },
                    py: 0.8,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: 'max-content',
                    fontSize: { md: '0.8rem', lg: '0.85rem' },
                    borderWidth: '1.5px',
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': {
                      borderWidth: '1.5px',
                      bgcolor: 'rgba(156, 39, 176, 0.04)',
                    },
                  }}
                >
                  Admin ERP
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Icon & Compact Language Switcher */}
            {isMobile && (
              <Stack direction="row" spacing={1} alignItems="center">
                <LanguageSwitcher variant="compact" />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Navigation Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={handleDrawerToggle}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<DirectionsCarIcon />}
            onClick={() => {
              handleDrawerToggle();
              setVisitModalOpen(true);
            }}
            sx={{ py: 1.2, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            {t('book_free_visit')}
          </Button>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            startIcon={<WhatsAppIcon />}
            onClick={openWhatsApp}
            sx={{ py: 1.2, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Chat on WhatsApp
          </Button>
          <Divider sx={{ my: 0.5 }} />
          <Button
            component="a"
            href="https://reerp-b806b.web.app"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<AdminPanelSettingsIcon />}
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={{ py: 1.2, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Staff / Admin ERP Portal
          </Button>
        </Box>
      </Drawer>

      {/* Main Outlet */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Comprehensive Footer */}
      <Box sx={{ bgcolor: '#111827', color: '#9ca3af', pt: 8, pb: 4, mt: 8 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1.5fr' },
              gap: 4,
              mb: 6,
            }}
          >
            {/* Col 1: About */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', color: '#ffffff', p: 1, borderRadius: 1.5 }}>
                  <LocationCityIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#ffffff">
                  SREEKANTH REDDY REALTY
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                South India’s trusted real estate developer specializing in DTCP & HMDA approved gated community open plots with clear legal titles, 100% Vaastu, and strategic connectivity to Hyderabad’s growth corridors.
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 600 }}>
                  100% RERA Registered & Legal Due Diligence Verified
                </Typography>
              </Stack>
            </Box>

            {/* Col 2: Quick Links */}
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#ffffff" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {navItems.map((item) => (
                  <Typography
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    variant="body2"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': { color: '#ffffff' },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
                <Box sx={{ pt: 1 }}>
                  <Button
                    component="a"
                    href="https://reerp-b806b.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="outlined"
                    startIcon={<LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                    endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
                    sx={{
                      color: '#93c5fd',
                      borderColor: '#1e3a8a',
                      textTransform: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      whiteSpace: 'nowrap',
                      '&:hover': { borderColor: '#60a5fa', color: '#bfdbfe', bgcolor: 'rgba(59, 130, 246, 0.1)' },
                    }}
                  >
                    Staff / Admin ERP Portal ↗
                  </Button>
                </Box>
              </Stack>
            </Box>

            {/* Col 3: Popular Corridors */}
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#ffffff" gutterBottom>
                Top Ventures
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component={RouterLink}
                  to="/ventures/proj-1"
                  variant="body2"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
                >
                  Sunrise Enclave (Mokila)
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/ventures/proj-2"
                  variant="body2"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
                >
                  Greenfield Meadows (Shadnagar)
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/ventures/proj-3"
                  variant="body2"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
                >
                  Royal Palms Elite (Kollur ORR)
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/ventures/proj-4"
                  variant="body2"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
                >
                  Aerocity Town (Srisailam Hwy)
                </Typography>
              </Stack>
            </Box>

            {/* Col 4: Corporate Office */}
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="#ffffff" gutterBottom>
                Corporate Office
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                Tower 4, Level 9, Financial District, Nanakramguda, Hyderabad, Telangana 500032.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Phone:</strong> +91 98765 43210
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Hours:</strong> Mon - Sun: 9:00 AM - 7:30 PM
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => navigate('/contact')}
                sx={{ borderColor: '#4b5563', color: '#e5e7eb', textTransform: 'none' }}
              >
                Get Directions & Contact
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#374151', mb: 3 }} />

          {/* RERA Disclaimer */}
          <Typography variant="caption" sx={{ display: 'block', color: '#6b7280', textAlign: 'justify', mb: 3 }}>
            <strong>Disclaimer:</strong> All layouts, dimensions, amenities, and project renders shown are indicative and subject to approvals from statutory authorities. Prospective buyers are advised to inspect original title deeds, RERA registrations, and layout maps prior to booking.
          </Typography>

          {/* Copyright */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" color="#9ca3af">
              © {new Date().getFullYear()} Sreekanth Reddy Realty Pvt Ltd. All rights reserved.
            </Typography>
            <Typography variant="caption" color="#9ca3af">
              Powered by Enterprise Real Estate Marketing ERP Platform
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Floating Gemini AI Assistant Advisor Button */}
      <Tooltip title={t('ai_advisor_title')} placement="left">
        <Fab
          color="primary"
          aria-label="gemini-ai"
          onClick={() => setAiModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            zIndex: 1000,
            bgcolor: '#1e3a8a',
            color: '#ffffff',
            boxShadow: '0 4px 18px rgba(30, 58, 138, 0.4)',
            '&:hover': { bgcolor: '#172554' },
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 26, color: '#fbc02d' }} />
        </Fab>
      </Tooltip>

      {/* Floating WhatsApp Quick Connect Button */}
      <Tooltip title="Chat with Real Estate Advisor on WhatsApp" placement="left">
        <Fab
          color="success"
          aria-label="whatsapp"
          onClick={openWhatsApp}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Tooltip>

      {/* Site Visit Booking Modal */}
      <SiteVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
      />

      {/* Gemini AI Assistant Modal */}
      <GeminiAIAssistantModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onHoldPlot={(plot) => {
          setHoldPlot(plot);
          setTokenModalOpen(true);
        }}
        onVisitPlot={() => {
          setVisitModalOpen(true);
        }}
      />

      {/* Token Booking & 48H Hold Modal */}
      <TokenBookingModal
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        plot={holdPlot}
      />
    </Box>
  );
};
