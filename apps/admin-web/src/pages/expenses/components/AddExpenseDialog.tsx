import React, { useState } from 'react';
import {
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
  InputAdornment,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ExpenseClaim, ExpenseCategory, ExpensePaymentMode } from '@real-estate-erp/types';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onExpenseAdded: (newExpense: ExpenseClaim) => void;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  onClose,
  onExpenseAdded,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('SITE_VISIT');
  const [amount, setAmount] = useState<number | ''>('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<ExpensePaymentMode>('UPI');
  const [employeeName, setEmployeeName] = useState('Rajesh Kumar (Sales Executive)');
  const [description, setDescription] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [linkedRef, setLinkedRef] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      setError('Please provide a valid claim title and positive expense amount.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const now = new Date().toISOString();
    const claimNumber = `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newExpense: ExpenseClaim = {
      id: `exp-${Date.now()}`,
      claimNumber,
      category,
      title: title.trim(),
      description: description.trim() || title.trim(),
      amount: Number(amount),
      expenseDate,
      paymentMode,
      status: 'PENDING',
      submittedBy: {
        id: 'usr-current',
        name: employeeName.trim(),
        role: 'Executive',
      },
      receiptUrl: receiptUrl.trim() || undefined,
      linkedVehicleId: category === 'VEHICLE_FUEL' ? linkedRef.trim() : undefined,
      linkedSiteVisitId: category === 'SITE_VISIT' ? linkedRef.trim() : undefined,
      linkedCampaignId: category === 'MARKETING_CAMPAIGN' ? linkedRef.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const { db } = getFirebaseInstance();
      if (db) {
        const docRef = await addDoc(collection(db, 'expenses'), {
          ...newExpense,
          createdAt: now,
          updatedAt: now,
        });
        newExpense.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firestore write skipped or failed, persisting locally in state:', err);
    } finally {
      onExpenseAdded(newExpense);
      setSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
      setAmount('');
      setDescription('');
      setReceiptUrl('');
      setLinkedRef('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Submit Expense Claim / Bill
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ maxHeight: '74vh' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              select
              label="Expense Category *"
              fullWidth
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              required
            >
              <MenuItem value="SITE_VISIT">Site Visit Expense (Customer Refreshment/Tolls)</MenuItem>
              <MenuItem value="VEHICLE_FUEL">Vehicle Fuel Bill (Petrol / Diesel / CNG)</MenuItem>
              <MenuItem value="MARKETING_CAMPAIGN">Marketing Campaign Spends (Ads / Hoardings)</MenuItem>
              <MenuItem value="EMPLOYEE_CLAIM">Employee Travel & Food Reimbursement</MenuItem>
              <MenuItem value="SITE_DEVELOPMENT">Site Layout Upkeep & Labour</MenuItem>
              <MenuItem value="OFFICE_ADMIN">Office Admin, Stationery & Utilities</MenuItem>
            </TextField>

            <TextField
              label="Claim / Bill Title *"
              placeholder="e.g. Fuel for Innova (Mokila Site Visit) or Customer Lunch"
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount (₹) *"
                  type="number"
                  placeholder="e.g. 3500"
                  fullWidth
                  size="small"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expense Date *"
                  type="date"
                  fullWidth
                  size="small"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Payment Mode"
                  fullWidth
                  size="small"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as ExpensePaymentMode)}
                >
                  <MenuItem value="UPI">UPI (GPay / PhonePe)</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="COMPANY_CARD">Company Fuel Card</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer / NEFT</MenuItem>
                  <MenuItem value="PETTY_CASH">Office Petty Cash</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Spent / Submitted By"
                  fullWidth
                  size="small"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Contextual Link */}
            <TextField
              label={
                category === 'VEHICLE_FUEL'
                  ? 'Vehicle Number / Model'
                  : category === 'SITE_VISIT'
                  ? 'Site Visit Customer / Project'
                  : category === 'MARKETING_CAMPAIGN'
                  ? 'Campaign Name / Platform'
                  : 'Reference / Voucher No.'
              }
              placeholder={
                category === 'VEHICLE_FUEL'
                  ? 'e.g. TS 09 UB 1001 (Innova Crysta)'
                  : category === 'SITE_VISIT'
                  ? 'e.g. Sunrise Enclave Site Visit'
                  : category === 'MARKETING_CAMPAIGN'
                  ? 'e.g. Meta Ads August Drive'
                  : 'Optional reference notes'
              }
              fullWidth
              size="small"
              value={linkedRef}
              onChange={(e) => setLinkedRef(e.target.value)}
            />

            <TextField
              label="Receipt / Bill Image URL"
              placeholder="https://... or uploaded image URL"
              fullWidth
              size="small"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              helperText="Paste bill photo link or payment confirmation screenshot"
            />

            <TextField
              label="Detailed Notes & Breakdown"
              placeholder="Provide trip details, odometer readings, or itemized expenses..."
              multiline
              rows={3}
              fullWidth
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
