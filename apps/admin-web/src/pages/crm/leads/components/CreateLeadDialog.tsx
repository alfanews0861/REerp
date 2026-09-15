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
  Typography,
  Stack,
  IconButton,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PhoneIcon from '@mui/icons-material/Phone';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

interface CreateLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onLeadCreated?: () => void;
}

const ISKON_VENTURES = [
  { id: 'proj-1', name: 'ISKON City - 2 (Podalakur Road, Nellore)' },
  { id: 'proj-2', name: 'Dream City (Nellore-Bombay Highway / Kovuru)' },
  { id: 'proj-3', name: 'ISKON Brundhavanam (Chinthareddypalem)' },
  { id: 'proj-4', name: 'ISKON Elite Township (Annamayya Circle Extn)' },
];

const LEAD_SOURCES = [
  { value: 'walk_in', label: 'Direct Walk-in (ఆఫీస్ విజిట్)' },
  { value: 'digital', label: 'Digital Ads / Social Media (Facebook/Google)' },
  { value: 'telecaller', label: 'Telecaller Inbound / Outbound' },
  { value: 'referral', label: 'Customer / Staff Referral' },
  { value: 'agent', label: 'Network Agent / Channel Partner' },
  { value: 'event', label: 'Real Estate Expo / Exhibition' },
];

export const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({
  open,
  onClose,
  onLeadCreated,
}) => {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('walk_in');
  const [preferredVenture, setPreferredVenture] = useState('proj-1');
  const [budgetMin, setBudgetMin] = useState<string>('2500000');
  const [budgetMax, setBudgetMax] = useState<string>('5000000');
  const [preferredFacing, setPreferredFacing] = useState('EAST');
  const [notes, setNotes] = useState('');
  const [pasteText, setPasteText] = useState('');

  // Smart Contact Parser from pasted text
  const handleParsePaste = () => {
    if (!pasteText.trim()) return;

    // Look for 10-digit phone number with optional +91
    const phoneMatch = pasteText.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    if (phoneMatch) {
      const extractedPhone = phoneMatch[0].replace(/[\s-+]/g, '').slice(-10);
      setPhone(extractedPhone);
    }

    // Look for email
    const emailMatch = pasteText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      setEmail(emailMatch[0]);
    }

    // Name inference: first line without phone/email
    const lines = pasteText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const firstLineWords = lines[0].replace(/(?:\+91[\s-]?)?[6-9]\d{9}/g, '').trim().split(' ');
      if (firstLineWords.length >= 2) {
        setFirstName(firstLineWords[0]);
        setLastName(firstLineWords.slice(1).join(' '));
      } else if (firstLineWords.length === 1 && firstLineWords[0]) {
        setFirstName(firstLineWords[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim()) {
      setError('Please provide at least a First Name and a 10-digit Phone Number.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Phone number must be at least 10 digits.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const selectedProjectObj = ISKON_VENTURES.find((v) => v.id === preferredVenture);

    const newLeadDoc = {
      companyId: 'comp-1',
      branchId: 'branch-nellore',
      firstName: firstName.trim(),
      lastName: lastName.trim() || 'Client',
      name: `${firstName.trim()} ${lastName.trim() || ''}`.trim(),
      phone: cleanPhone.slice(-10),
      email: email.trim() || undefined,
      status: 'new',
      stage: 'QUALIFIED',
      source: source,
      leadSourceId: source,
      preferredLocation: selectedProjectObj ? selectedProjectObj.name : 'ISKON City - 2',
      projectId: preferredVenture,
      projectName: selectedProjectObj?.name || 'ISKON City - 2',
      budgetMin: budgetMin ? Number(budgetMin) : 2500000,
      budgetMax: budgetMax ? Number(budgetMax) : 5000000,
      preferredFacing: preferredFacing,
      notes: notes.trim(),
      requirementDetails: `Facing: ${preferredFacing}. Notes: ${notes.trim()}`,
      isActive: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      serverTimestamp: serverTimestamp(),
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await addDoc(collection(db, 'leads'), newLeadDoc);
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      if (onLeadCreated) onLeadCreated();
      handleClose();
    } catch (err: any) {
      console.error('Failed to create lead in Firestore:', err);
      setError(err?.message || 'Failed to save lead. Please check network.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setPasteText('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PersonAddIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Create New Lead (కొత్త లీడ్)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ISKON Developers CRM • Direct Customer Registration
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Quick Paste Assistant */}
          <Box sx={{ mb: 2.5, p: 1.5, bgcolor: '#f1f5f9', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              SMART CONTACT PASTE (WhatsApp / SMS నుండి నేరుగా పేస్ట్ చేయండి)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. Ramesh Naidu 9848012345 ramesh@gmail.com"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
              />
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<ContentPasteIcon fontSize="small" />}
                onClick={handleParsePaste}
                sx={{ whiteSpace: 'nowrap', textTransform: 'none', fontWeight: 600 }}
              >
                Auto-Fill
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name *"
                fullWidth
                size="small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name / Surname"
                fullWidth
                size="small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number *"
                fullWidth
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Interested Venture *"
                fullWidth
                size="small"
                value={preferredVenture}
                onChange={(e) => setPreferredVenture(e.target.value)}
              >
                {ISKON_VENTURES.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Lead Source *"
                fullWidth
                size="small"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {LEAD_SOURCES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Preferred Facing"
                fullWidth
                size="small"
                value={preferredFacing}
                onChange={(e) => setPreferredFacing(e.target.value)}
              >
                <MenuItem value="EAST">East Facing (తూర్పు)</MenuItem>
                <MenuItem value="NORTH">North Facing (ఉత్తరం)</MenuItem>
                <MenuItem value="WEST">West Facing (పడమర)</MenuItem>
                <MenuItem value="SOUTH">South Facing (దక్షణం)</MenuItem>
                <MenuItem value="CORNER">Corner Plot (కార్నర్)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Budget (Approx. ₹)"
                fullWidth
                size="small"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Customer Requirement Notes"
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="e.g. Planning to construct duplex villa in next 6 months. Needs loan assistance."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 1.75 }}>
          <Button onClick={handleClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700, px: 3, borderRadius: 2 }}
          >
            {submitting ? 'Saving Lead...' : 'Save Lead (లీడ్ సృష్టించు)'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
