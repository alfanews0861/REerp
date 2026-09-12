import React, { useState } from 'react';
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
import { Project, ApprovalAuthority, ProjectType, ProjectStatus } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onProjectAdded: (newProject: Project) => void;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
  open,
  onClose,
  onProjectAdded,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('RESIDENTIAL');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');
  
  // Approvals & Legal
  const [approvalAuthority, setApprovalAuthority] = useState<ApprovalAuthority>('HMDA');
  const [approvalNumber, setApprovalNumber] = useState('');
  const [reraId, setReraId] = useState('');
  const [surveyNumbers, setSurveyNumbers] = useState('');

  // Location
  const [village, setVillage] = useState('');
  const [mandal, setMandal] = useState('');
  const [district, setDistrict] = useState('Ranga Reddy');
  const [state, setState] = useState('Telangana');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Area & Inventory
  const [totalAreaAcres, setTotalAreaAcres] = useState<number | ''>(25);
  const [totalPlotsCount, setTotalPlotsCount] = useState<number | ''>(180);

  // Pricing
  const [basePrice, setBasePrice] = useState<number | ''>(22500);
  const [launchOffer, setLaunchOffer] = useState<number | ''>(19999);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number | ''>(400);

  // Media & Layout
  const [layoutMapUrl, setLayoutMapUrl] = useState('');
  const [brochurePdf, setBrochurePdf] = useState('');

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

  const handleAmenityToggle = (key: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !village.trim()) {
      setError('Please fill in Venture Name, Short Code, and Location Village.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const newProjectData: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      projectType,
      status,
      approvalAuthority,
      approvalNumber: approvalNumber.trim() || undefined,
      reraId: reraId.trim() || undefined,
      totalAreaAcres: Number(totalAreaAcres) || 0,
      layoutMapUrl: layoutMapUrl.trim() || undefined,
      featured: true,
      location: {
        country: 'India',
        state: state.trim(),
        district: district.trim(),
        mandal: mandal.trim(),
        village: village.trim(),
        surveyNumbers: surveyNumbers ? surveyNumbers.split(',').map((s) => s.trim()) : [],
        googleMapsUrl: googleMapsUrl.trim() || undefined,
      },
      members: {
        companyId: 'comp-1',
        branchId: 'branch-1',
        marketingTeamIds: [],
        salesTeamIds: [],
        legalTeamIds: [],
        financeTeamIds: [],
      },
      pricing: {
        basePrice: Number(basePrice) || 0,
        launchOffer: Number(launchOffer) || undefined,
        currentPrice: Number(basePrice) || 0,
        maintenanceCharges: Number(maintenanceCharges) || undefined,
      },
      amenities,
      media: {
        photos: [],
        videos: [],
        droneImages: [],
        images360: [],
        brochurePdf: brochurePdf.trim() || undefined,
        masterPlanPdf: layoutMapUrl.trim() || undefined,
      },
      totalArea: Number(totalAreaAcres) || 0,
      areaUnit: 'ACRES',
      totalLayoutsCount: 1,
      totalBlocksCount: 1,
      totalPlotsCount: Number(totalPlotsCount) || 0,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = await addDoc(collection(db, 'projects'), {
          ...newProjectData,
          createdAt: now,
          updatedAt: now,
        });
        newProjectData.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firestore write skipped or failed, persisting locally in memory:', err);
    } finally {
      onProjectAdded(newProjectData);
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <VerifiedIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Add New Venture / Project
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '72vh' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Section 1: Basic Information */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                1. BASIC VENTURE DETAILS
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Venture Name *"
                    placeholder="e.g. Royal Meadows Phase 2"
                    fullWidth
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Project Short Code *"
                    placeholder="e.g. RMP-02"
                    fullWidth
                    size="small"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Project Type"
                    fullWidth
                    size="small"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  >
                    <MenuItem value="RESIDENTIAL">Residential Open Plots</MenuItem>
                    <MenuItem value="VILLA">Gated Villa Plots</MenuItem>
                    <MenuItem value="FARM_LAND">Farm Land / Agro Venture</MenuItem>
                    <MenuItem value="COMMERCIAL">Commercial Layout</MenuItem>
                    <MenuItem value="MIXED_USE">Mixed-Use Community</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Development Status"
                    fullWidth
                    size="small"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  >
                    <MenuItem value="PLANNING">Planning & Approvals Stage</MenuItem>
                    <MenuItem value="ACTIVE">Active for Booking</MenuItem>
                    <MenuItem value="ON_HOLD">On Hold</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="SOLD_OUT">Sold Out</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Section 2: Approvals & Regulatory Authority */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                2. APPROVAL & LEGAL DETAILS
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="Approval Authority"
                    fullWidth
                    size="small"
                    value={approvalAuthority}
                    onChange={(e) => setApprovalAuthority(e.target.value as ApprovalAuthority)}
                  >
                    <MenuItem value="HMDA">HMDA Approved</MenuItem>
                    <MenuItem value="DTCP">DTCP Approved</MenuItem>
                    <MenuItem value="RERA">RERA Registered</MenuItem>
                    <MenuItem value="GHMC">GHMC Approved</MenuItem>
                    <MenuItem value="YTDA">YTDA Approved</MenuItem>
                    <MenuItem value="GRAM_PANCHAYAT">Gram Panchayat</MenuItem>
                    <MenuItem value="OTHER">Other Authority</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="LP / Permit Number"
                    placeholder="e.g. 000124/LO/Plg/HMDA/2025"
                    fullWidth
                    size="small"
                    value={approvalNumber}
                    onChange={(e) => setApprovalNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="RERA Registration ID"
                    placeholder="e.g. P02400008921"
                    fullWidth
                    size="small"
                    value={reraId}
                    onChange={(e) => setReraId(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Survey Numbers"
                    placeholder="Comma separated: e.g. Sy. No. 102/A, 103/AA, 105"
                    fullWidth
                    size="small"
                    value={surveyNumbers}
                    onChange={(e) => setSurveyNumbers(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Section 3: Location Details */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                3. LOCATION SPECIFICATIONS
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Village / Locality *"
                    placeholder="e.g. Mokila / Shankarpally Road"
                    fullWidth
                    size="small"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mandal"
                    placeholder="e.g. Shankarpally"
                    fullWidth
                    size="small"
                    value={mandal}
                    onChange={(e) => setMandal(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="District"
                    fullWidth
                    size="small"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    fullWidth
                    size="small"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Google Maps Location Link"
                    placeholder="https://maps.google.com/?q=..."
                    fullWidth
                    size="small"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Section 4: Area, Plots & Pricing */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                4. EXTENT, CAPACITY & PRICING
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Area (Acres) *"
                    type="number"
                    fullWidth
                    size="small"
                    value={totalAreaAcres}
                    onChange={(e) => setTotalAreaAcres(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Planned Plots *"
                    type="number"
                    fullWidth
                    size="small"
                    value={totalPlotsCount}
                    onChange={(e) => setTotalPlotsCount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Base Rate (₹ / Sq. Yd) *"
                    type="number"
                    fullWidth
                    size="small"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Launch Offer Rate (₹ / Sq. Yd)"
                    type="number"
                    fullWidth
                    size="small"
                    value={launchOffer}
                    onChange={(e) => setLaunchOffer(e.target.value === '' ? '' : Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Dev / Maintenance (₹ / Sq. Yd)"
                    type="number"
                    fullWidth
                    size="small"
                    value={maintenanceCharges}
                    onChange={(e) => setMaintenanceCharges(e.target.value === '' ? '' : Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Section 5: Layout Map & Media */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                5. LAYOUT MAP & MEDIA
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Layout Map / Master Plan Image URL"
                    placeholder="https://images.unsplash.com/... or cloud storage URL"
                    fullWidth
                    size="small"
                    value={layoutMapUrl}
                    onChange={(e) => setLayoutMapUrl(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="E-Brochure PDF URL"
                    placeholder="https://.../brochure.pdf"
                    fullWidth
                    size="small"
                    value={brochurePdf}
                    onChange={(e) => setBrochurePdf(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Section 6: Venture Amenities */}
            <Box>
              <Typography variant="subtitle2" color="primary" fontWeight={600} gutterBottom>
                6. APPROVED INFRASTRUCTURE & AMENITIES
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasRoads} onChange={() => handleAmenityToggle('hasRoads')} size="small" />}
                    label="40' & 33' BT Roads"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasElectricity} onChange={() => handleAmenityToggle('hasElectricity')} size="small" />}
                    label="Underground Power"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasDrainage} onChange={() => handleAmenityToggle('hasDrainage')} size="small" />}
                    label="UG Drainage Lines"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasWater} onChange={() => handleAmenityToggle('hasWater')} size="small" />}
                    label="Water Supply Line"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasParks} onChange={() => handleAmenityToggle('hasParks')} size="small" />}
                    label="Landscaped Parks"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasCompoundWall} onChange={() => handleAmenityToggle('hasCompoundWall')} size="small" />}
                    label="Gated Wall & Arch"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasStreetLights} onChange={() => handleAmenityToggle('hasStreetLights')} size="small" />}
                    label="LED Street Lights"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasClubHouse} onChange={() => handleAmenityToggle('hasClubHouse')} size="small" />}
                    label="Clubhouse & Gym"
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={amenities.hasTemple} onChange={() => handleAmenityToggle('hasTemple')} size="small" />}
                    label="Temple Precinct"
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Saving Venture...' : 'Create Venture Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
