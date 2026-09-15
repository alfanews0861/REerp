import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import { Project, ApprovalAuthority, ProjectType, ProjectStatus } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface EditProjectDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onProjectUpdated: (updatedProject: Project) => void;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  project,
  onClose,
  onProjectUpdated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('RESIDENTIAL');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');

  // Approvals & Legal
  const [approvalAuthority, setApprovalAuthority] = useState<ApprovalAuthority>('NUDA');
  const [approvalNumber, setApprovalNumber] = useState('');
  const [reraId, setReraId] = useState('');
  const [surveyNumbers, setSurveyNumbers] = useState('');

  // Location
  const [village, setVillage] = useState('');
  const [mandal, setMandal] = useState('');
  const [district, setDistrict] = useState('SPSR Nellore');
  const [state, setState] = useState('Andhra Pradesh');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Area & Inventory
  const [totalAreaAcres, setTotalAreaAcres] = useState<number | ''>(120);
  const [totalPlotsCount, setTotalPlotsCount] = useState<number | ''>(450);
  const [availablePlots, setAvailablePlots] = useState<number | ''>(78);

  // Pricing
  const [basePrice, setBasePrice] = useState<number | ''>(18500);
  const [launchOffer, setLaunchOffer] = useState<number | ''>(17500);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number | ''>(500);

  // Media & Details
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [layoutMapUrl, setLayoutMapUrl] = useState('');

  // Amenities
  const [amenities, setAmenities] = useState({
    hasRoads: true,
    hasElectricity: true,
    hasWater: true,
    hasDrainage: true,
    hasParks: true,
    hasCompoundWall: true,
    hasStreetLights: true,
    hasClubHouse: false,
    hasTemple: false,
  });

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setCode(project.code || '');
      setProjectType(project.projectType || 'RESIDENTIAL');
      setStatus(project.status || 'ACTIVE');
      setApprovalAuthority(project.approvalAuthority || 'NUDA');
      setApprovalNumber(project.approvalNumber || '');
      setReraId(project.reraId || '');
      setSurveyNumbers(project.location?.surveyNumbers?.join(', ') || '');
      setVillage(project.location?.village || '');
      setMandal(project.location?.mandal || '');
      setDistrict(project.location?.district || 'SPSR Nellore');
      setState(project.location?.state || 'Andhra Pradesh');
      setGoogleMapsUrl(project.location?.googleMapsUrl || '');
      setTotalAreaAcres(project.totalAreaAcres || project.totalArea || 0);
      setTotalPlotsCount(project.totalPlotsCount || 0);
      setAvailablePlots((project as any).availablePlots ?? 50);
      setBasePrice(project.pricing?.basePrice || 18500);
      setLaunchOffer(project.pricing?.launchOffer || 17500);
      setMaintenanceCharges(project.pricing?.maintenanceCharges || 500);
      setTagline((project as any).tagline || '');
      setDescription(project.description || (project as any).description || '');
      setHeroImage(project.media?.photos?.[0] || '');
      setLayoutMapUrl(project.layoutMapUrl || '');
      setAmenities({
        hasRoads: project.amenities?.hasRoads ?? true,
        hasElectricity: project.amenities?.hasElectricity ?? true,
        hasWater: project.amenities?.hasWater ?? true,
        hasDrainage: project.amenities?.hasDrainage ?? true,
        hasParks: project.amenities?.hasParks ?? true,
        hasCompoundWall: project.amenities?.hasCompoundWall ?? true,
        hasStreetLights: project.amenities?.hasStreetLights ?? true,
        hasClubHouse: project.amenities?.hasClubHouse ?? false,
        hasTemple: project.amenities?.hasTemple ?? false,
      });
      setError(null);
    }
  }, [project, open]);

  const handleAmenityToggle = (key: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!name.trim() || !code.trim() || !village.trim()) {
      setError('Please fill in Venture Name, Short Code, and Location Village.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const updatedProject: Project = {
      ...project,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      projectType,
      status,
      approvalAuthority,
      approvalNumber: approvalNumber.trim() || undefined,
      reraId: reraId.trim() || undefined,
      totalAreaAcres: Number(totalAreaAcres) || 0,
      totalArea: Number(totalAreaAcres) || 0,
      areaUnit: 'ACRES',
      totalPlotsCount: Number(totalPlotsCount) || 0,
      layoutMapUrl: layoutMapUrl.trim() || undefined,
      description: description.trim() || undefined,
      location: {
        ...project.location,
        country: 'India',
        state: state.trim(),
        district: district.trim(),
        mandal: mandal.trim(),
        village: village.trim(),
        surveyNumbers: surveyNumbers ? surveyNumbers.split(',').map((s) => s.trim()) : [],
        googleMapsUrl: googleMapsUrl.trim() || undefined,
      },
      pricing: {
        basePrice: Number(basePrice) || 0,
        launchOffer: Number(launchOffer) || undefined,
        currentPrice: Number(basePrice) || 0,
        maintenanceCharges: Number(maintenanceCharges) || undefined,
      },
      amenities,
      media: {
        ...project.media,
        photos: heroImage ? [heroImage, ...(project.media?.photos?.slice(1) || [])] : project.media?.photos || [],
      },
      updatedAt: now,
    };

    // Attach custom extension fields for mobile & public sync
    (updatedProject as any).tagline = tagline.trim() || undefined;
    (updatedProject as any).availablePlots = Number(availablePlots) || 0;

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await setDoc(doc(db, 'projects', project.id), updatedProject, { merge: true });
      }
    } catch (err: any) {
      console.warn('Firestore write warning:', err);
    } finally {
      onProjectUpdated(updatedProject);
      setSubmitting(false);
      onClose();
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <EditIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Edit Venture / Property Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Modifying: {project.name} ({project.code}) • Direct sync to Web & Mobile Apps
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: '78vh' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* 1. Basic Information */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                1. Basic Venture Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    required
                    label="Venture Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ISKON City - 2"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Short Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. IC2-01"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Project Type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    size="small"
                  >
                    <MenuItem value="RESIDENTIAL">Residential Plots</MenuItem>
                    <MenuItem value="COMMERCIAL">Commercial Corridor</MenuItem>
                    <MenuItem value="VILLA">Gated Villa Layout</MenuItem>
                    <MenuItem value="MIXED_USE">Mixed Township</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Venture Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    size="small"
                  >
                    <MenuItem value="ACTIVE">Active / Open for Sale</MenuItem>
                    <MenuItem value="PLANNING">Planning & Approvals</MenuItem>
                    <MenuItem value="COMPLETED">Completed / Sold Out</MenuItem>
                    <MenuItem value="ON_HOLD">Temporarily On Hold</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tagline (Sub-heading)"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Premium 120-Acre Mega Township & Gated Villa Plots on Podalakur Road, Nellore"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 2. Statutory Approvals & Legal */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                2. Approvals & Legal Registration (Nellore & AP)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Approval Authority"
                    value={approvalAuthority}
                    onChange={(e) => setApprovalAuthority(e.target.value as ApprovalAuthority)}
                    size="small"
                  >
                    <MenuItem value="NUDA">NUDA Approved (Nellore Urban)</MenuItem>
                    <MenuItem value="DTCP">DTCP Approved (AP Regional)</MenuItem>
                    <MenuItem value="RERA">AP RERA Registered</MenuItem>
                    <MenuItem value="GRAM_PANCHAYAT">Gram Panchayat</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Layout Approval / LP Number"
                    value={approvalNumber}
                    onChange={(e) => setApprovalNumber(e.target.value)}
                    placeholder="e.g. NUDA/00248/LO/Plg/2024"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="AP RERA Project ID"
                    value={reraId}
                    onChange={(e) => setReraId(e.target.value)}
                    placeholder="e.g. AP-RERA-IC2-2026"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Survey Numbers (Comma-separated)"
                    value={surveyNumbers}
                    onChange={(e) => setSurveyNumbers(e.target.value)}
                    placeholder="e.g. Sy. No. 142/A, 143/B, 145"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 3. Rates & Pricing (CRITICAL REQUIREMENT) */}
            <Box sx={{ bgcolor: 'rgba(22, 163, 74, 0.05)', p: 2, borderRadius: 2, border: 1, borderColor: 'success.light' }}>
              <Typography variant="subtitle2" color="success.dark" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CurrencyRupeeIcon fontSize="small" />
                3. Venture Plot Pricing & Rates (రేట్ల సవరణ)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                Updating rates here will instantly update prices in both the Web App and Mobile App.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Base Price (₹/Sq.Yd)"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
                    }}
                    size="small"
                    helperText="Current standard rate per square yard"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Launch Offer Rate (₹/Sq.Yd)"
                    value={launchOffer}
                    onChange={(e) => setLaunchOffer(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
                    }}
                    size="small"
                    helperText="Promotional rate for new buyers"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maintenance / Sinking Fund"
                    value={maintenanceCharges}
                    onChange={(e) => setMaintenanceCharges(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
                    }}
                    size="small"
                    helperText="One-time township maintenance"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 4. Extent & Unit Quantities */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                4. Land Extent & Plot Counts
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Total Extent (Acres)"
                    value={totalAreaAcres}
                    onChange={(e) => setTotalAreaAcres(e.target.value ? Number(e.target.value) : '')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Total Planned Plots"
                    value={totalPlotsCount}
                    onChange={(e) => setTotalPlotsCount(e.target.value ? Number(e.target.value) : '')}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Available Plots for Sale"
                    value={availablePlots}
                    onChange={(e) => setAvailablePlots(e.target.value ? Number(e.target.value) : '')}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 5. Location Details */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                5. Location & Geo-Coordinates (Nellore Region)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Village / Landmark Corridor"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Podalakur Road (Near Mattempadu)"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mandal / Zone"
                    value={mandal}
                    onChange={(e) => setMandal(e.target.value)}
                    placeholder="e.g. Nellore Rural / Podalakur Road"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="SPSR Nellore"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Andhra Pradesh"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Google Maps Location URL"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 6. Media & Marketing Description */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                6. Media, Master Plan & Marketing Description
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Venture Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write marketing description highlighting connectivity, NUDA approval, amenities..."
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hero Image URL"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Layout Map URL"
                    value={layoutMapUrl}
                    onChange={(e) => setLayoutMapUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 7. Township Infrastructure & Amenities */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                7. Township Amenities & Infrastructure
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasRoads} onChange={() => handleAmenityToggle('hasRoads')} color="primary" />}
                    label="60, 40 & 33ft BT Roads"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasElectricity} onChange={() => handleAmenityToggle('hasElectricity')} color="primary" />}
                    label="Underground Electricity"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasWater} onChange={() => handleAmenityToggle('hasWater')} color="primary" />}
                    label="24/7 Water & OHT"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasDrainage} onChange={() => handleAmenityToggle('hasDrainage')} color="primary" />}
                    label="Underground Drainage"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasCompoundWall} onChange={() => handleAmenityToggle('hasCompoundWall')} color="primary" />}
                    label="Gated Compound Wall"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasStreetLights} onChange={() => handleAmenityToggle('hasStreetLights')} color="primary" />}
                    label="Solar Street Lights"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasParks} onChange={() => handleAmenityToggle('hasParks')} color="primary" />}
                    label="Lush Parks & Play Area"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasClubHouse} onChange={() => handleAmenityToggle('hasClubHouse')} color="primary" />}
                    label="Clubhouse & Gym"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasTemple} onChange={() => handleAmenityToggle('hasTemple')} color="primary" />}
                    label="Township Temple"
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={<EditIcon />}
            sx={{ px: 3, fontWeight: 700 }}
          >
            {submitting ? 'Saving to Database...' : 'Save & Update in Cloud'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProjectDialog;
