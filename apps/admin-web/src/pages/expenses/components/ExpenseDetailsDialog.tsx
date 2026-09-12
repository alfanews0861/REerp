import React, { useState } from 'react';
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
  TextField,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ExpenseClaim, ExpenseStatus } from '@real-estate-erp/types';

interface ExpenseDetailsDialogProps {
  claim: ExpenseClaim | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (claimId: string, newStatus: ExpenseStatus, remarks?: string) => void;
}

export const ExpenseDetailsDialog: React.FC<ExpenseDetailsDialogProps> = ({
  claim,
  open,
  onClose,
  onStatusUpdate,
}) => {
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');

  if (!claim) return null;

  const handleApprove = () => {
    onStatusUpdate(claim.id, 'APPROVED', approvalRemarks || 'Approved by Accounts & Admin');
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onStatusUpdate(claim.id, 'REJECTED', rejectReason.trim());
    setRejecting(false);
    onClose();
  };

  const handleMarkPaid = () => {
    onStatusUpdate(claim.id, 'PAID', 'Reimbursed via bank transfer / cash');
    onClose();
  };

  const getStatusColor = (status: ExpenseStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PAID':
        return 'primary';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
      default:
        return 'warning';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {claim.claimNumber}
            </Typography>
            <Chip
              label={claim.status}
              color={getStatusColor(claim.status)}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {claim.category.replace('_', ' ')}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '74vh' }}>
        <Stack spacing={2.5}>
          {/* Amount Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TOTAL CLAIM AMOUNT
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                ₹{claim.amount.toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Chip
              label={`Paid via ${claim.paymentMode.replace('_', ' ')}`}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Paper>

          {/* Details Table */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Claim Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Title / Purpose
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {claim.title}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Expense Date
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {claim.expenseDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Submitted By
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {claim.submittedBy.name} ({claim.submittedBy.role})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Linked Entity / Asset
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {claim.linkedVehicleId ||
                    claim.linkedSiteVisitId ||
                    claim.linkedCampaignId ||
                    'General Claim'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Breakdown / Description */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Description & Notes
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {claim.description || 'No additional remarks provided.'}
            </Typography>
          </Box>

          {/* Attached Receipt */}
          {claim.receiptUrl && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Attached Bill / Receipt
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  bgcolor: 'action.hover',
                }}
              >
                <ReceiptIcon color="primary" />
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="body2" noWrap fontWeight={500}>
                    {claim.receiptName || 'Receipt_Attachment.jpg'}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  href={claim.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Bill
                </Button>
              </Paper>
            </Box>
          )}

          {/* Approval Audit Trail */}
          {claim.status === 'PENDING' && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Reviewer Remarks (Optional)
              </Typography>
              <TextField
                placeholder="Add verification notes or approval instructions..."
                fullWidth
                size="small"
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
              />
            </Box>
          )}

          {claim.approvedBy && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <Typography variant="subtitle2" fontWeight={700}>
                Approved by {claim.approvedBy.name}
              </Typography>
              <Typography variant="caption" display="block">
                On: {new Date(claim.approvedBy.approvedAt).toLocaleString('en-IN')}
              </Typography>
              {claim.approvedBy.remarks && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Remarks: {claim.approvedBy.remarks}
                </Typography>
              )}
            </Alert>
          )}

          {claim.status === 'REJECTED' && claim.rejectedReason && (
            <Alert severity="error" icon={<CancelIcon />}>
              <Typography variant="subtitle2" fontWeight={700}>
                Claim Rejected
              </Typography>
              <Typography variant="body2">Reason: {claim.rejectedReason}</Typography>
            </Alert>
          )}

          {/* Inline Rejection Prompt */}
          {rejecting && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'error.main' }}>
              <Typography variant="subtitle2" color="error" fontWeight={700} gutterBottom>
                Provide Rejection Reason
              </Typography>
              <TextField
                placeholder="e.g. Bill photo not clear / missing toll receipt / unapproved trip"
                fullWidth
                size="small"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" onClick={() => setRejecting(false)}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  disabled={!rejectReason.trim()}
                  onClick={handleReject}
                >
                  Confirm Rejection
                </Button>
              </Stack>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose}>Close</Button>

        {claim.status === 'PENDING' && !rejecting && (
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setRejecting(true)}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleApprove}
            >
              Approve Claim
            </Button>
          </Stack>
        )}

        {claim.status === 'APPROVED' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PaidIcon />}
            onClick={handleMarkPaid}
          >
            Mark as Reimbursed / Paid
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
