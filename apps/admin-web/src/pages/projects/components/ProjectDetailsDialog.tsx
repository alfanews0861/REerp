import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Stack,
  Divider,
  Paper,
  IconButton,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MapIcon from '@mui/icons-material/Map';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Project } from '@real-estate-erp/types';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  project,
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!project) return null;

  const handleNavigateToPlots = () => {
    onClose();
    navigate(`/plots?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`);
  };

  const defaultLayoutImage =
    project.layoutMapUrl ||
    'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              {project.name}
            </Typography>
            <Chip label={project.code} size="small" variant="outlined" />
            <Chip
              label={project.status}
              size="small"
              color={
                project.status === 'ACTIVE'
                  ? 'success'
                  : project.status === 'PLANNING'
                  ? 'info'
                  : project.status === 'COMPLETED'
                  ? 'primary'
                  : 'default'
              }
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {project.location.village}, {project.location.mandal ? `${project.location.mandal}, ` : ''}
            {project.location.district}, {project.location.state}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '76vh' }}>
        <Stack spacing={3}>
          {/* Layout Plan / Master Map Banner */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              border: 1,
              borderColor: 'divider',
              height: 240,
              bgcolor: 'grey.100',
            }}
          >
            <Box
              component="img"
              src={defaultLayoutImage}
              alt={`${project.name} Master Plan`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                bgcolor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MapIcon fontSize="small" />
              <Typography variant="caption" fontWeight={600}>
                Master Layout Map & Elevation Plan
              </Typography>
            </Box>
          </Paper>

          {/* Key Metric Highlights */}
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Land Extent
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {project.totalAreaAcres || project.totalArea || 0} Acres
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Units
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {project.totalPlotsCount || 0} Plots
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Base Price
                </Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  ₹{project.pricing.basePrice.toLocaleString('en-IN')}{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    / Sq. Yd
                  </Typography>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Launch Offer
                </Typography>
                <Typography variant="h6" fontWeight={700} color="warning.dark">
                  {project.pricing.launchOffer ? `₹${project.pricing.launchOffer.toLocaleString('en-IN')}` : 'N/A'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider />

          {/* Legal Approvals & Survey Records */}
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Regulatory Approvals & Land Records
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Approval Authority
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <VerifiedIcon color="primary" fontSize="small" />
                  <Typography variant="body1" fontWeight={600}>
                    {project.approvalAuthority || 'DTCP Approved'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Layout Permit / LP Number
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                  {project.approvalNumber || 'LP/2025/Approved'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  TS-RERA Registration ID
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                  {project.reraId || 'P0240000XXXX'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Survey Numbers
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                  {project.location.surveyNumbers && project.location.surveyNumbers.length > 0
                    ? project.location.surveyNumbers.join(', ')
                    : 'Survey records on file'}
                </Typography>
              </Grid>
              {project.location.googleMapsUrl && (
                <Grid item xs={12}>
                  <Link
                    href={project.location.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}
                  >
                    <LocationOnIcon fontSize="small" />
                    Open Location on Google Maps
                    <OpenInNewIcon fontSize="inherit" />
                  </Link>
                </Grid>
              )}
            </Grid>
          </Box>

          <Divider />

          {/* Venture Amenities */}
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Venture Infrastructure & Amenities
            </Typography>
            <Grid container spacing={1.5}>
              {[
                { key: 'hasRoads', label: "40' & 33' Blacktop Roads" },
                { key: 'hasElectricity', label: 'Underground Power & Street Lights' },
                { key: 'hasWater', label: 'Overhead Tank & Water Pipelines' },
                { key: 'hasDrainage', label: 'Underground Drainage System' },
                { key: 'hasParks', label: 'Parks with Walking Track' },
                { key: 'hasCompoundWall', label: 'Gated Arch & Compound Wall' },
                { key: 'hasStreetLights', label: '24/7 Security & CCTV Surveillance' },
                { key: 'hasClubHouse', label: 'Clubhouse & Recreational Zone' },
                { key: 'hasTemple', label: 'Temple Precinct' },
              ].map((amenity) => {
                const isAvailable = Boolean(project.amenities && (project.amenities as any)[amenity.key]);
                return (
                  <Grid item xs={12} sm={6} md={4} key={amenity.key}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: isAvailable ? 'success.lighter' : 'action.hover',
                        opacity: isAvailable ? 1 : 0.5,
                      }}
                    >
                      <CheckCircleOutlineIcon
                        fontSize="small"
                        color={isAvailable ? 'success' : 'disabled'}
                      />
                      <Typography variant="body2" fontWeight={isAvailable ? 500 : 400}>
                        {amenity.label}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToPlots}
          startIcon={<MapIcon />}
        >
          Explore Plots in this Venture
        </Button>
      </DialogActions>
    </Dialog>
  );
};
