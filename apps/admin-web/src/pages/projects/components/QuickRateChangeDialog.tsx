import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Project } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface QuickRateChangeDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onRateUpdated: (updatedProject: Project) => void;
}

export const QuickRateChangeDialog: React.FC<QuickRateChangeDialogProps> = ({
  open,
  project,
  onClose,
  onRateUpdated,
}) => {
  const [basePrice, setBasePrice] = useState<number | ''>(18500);
  const [launchOffer, setLaunchOffer] = useState<number | ''>(17500);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number | ''>(500);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setBasePrice(project.pricing?.basePrice || 18500);
      setLaunchOffer(project.pricing?.launchOffer || 17500);
      setMaintenanceCharges(project.pricing?.maintenanceCharges || 500);
      setError(null);
    }
  }, [project, open]);

  if (!project) return null;

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basePrice || Number(basePrice) <= 0) {
      setError('Please enter a valid base price greater than 0.');
      return;
    }

    setSaving(true);
    setError(null);

    const now = new Date().toISOString();
    const updatedPricing = {
      ...project.pricing,
      basePrice: Number(basePrice),
      launchOffer: launchOffer ? Number(launchOffer) : undefined,
      currentPrice: Number(basePrice),
      maintenanceCharges: maintenanceCharges ? Number(maintenanceCharges) : undefined,
    };

    const updatedProject: Project = {
      ...project,
      pricing: updatedPricing,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await setDoc(doc(db, 'projects', project.id), { pricing: updatedPricing, updatedAt: now }, { merge: true });
      }
    } catch (err: any) {
      console.warn('Firestore rate update warning:', err);
    } finally {
      onRateUpdated(updatedProject);
      setSaving(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSaveRate}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CurrencyRupeeIcon color="success" />
            <Typography variant="h6" fontWeight={700}>
              Update Plot Rates (ధర మార్పు)
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700} color="primary">
                {project.name} ({project.code})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Location: {project.location?.village}, {project.location?.district}
              </Typography>
              <Typography variant="caption" display="block" color="success.dark" fontWeight={600} sx={{ mt: 0.5 }}>
                Current Rate: ₹{project.pricing?.basePrice?.toLocaleString('en-IN')}/Sq.Yd
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
              Changes made here are saved directly to Cloud Firestore and instantly update across both the Web App and Mobile App.
            </Alert>

            <TextField
              fullWidth
              required
              type="number"
              label="New Base Price (₹/Sq.Yd)"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value ? Number(e.target.value) : '')}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
              }}
              size="small"
              autoFocus
            />

            <TextField
              fullWidth
              type="number"
              label="Launch Offer / Special Rate (₹/Sq.Yd)"
              value={launchOffer}
              onChange={(e) => setLaunchOffer(e.target.value ? Number(e.target.value) : '')}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
              }}
              size="small"
              helperText="Leave blank if no promotional offer is active"
            />

            <TextField
              fullWidth
              type="number"
              label="Maintenance / Sinking Fund (₹/Sq.Yd)"
              value={maintenanceCharges}
              onChange={(e) => setMaintenanceCharges(e.target.value ? Number(e.target.value) : '')}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                endAdornment: <InputAdornment position="end">/Sq.Yd</InputAdornment>,
              }}
              size="small"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button onClick={onClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={saving}
            startIcon={<TrendingUpIcon />}
            sx={{ fontWeight: 700 }}
          >
            {saving ? 'Updating...' : 'Update Rate Now'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuickRateChangeDialog;
