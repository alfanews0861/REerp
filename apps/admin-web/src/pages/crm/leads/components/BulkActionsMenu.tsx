import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TransformIcon from '@mui/icons-material/Transform';
import ArchiveIcon from '@mui/icons-material/Archive';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DownloadIcon from '@mui/icons-material/Download';
import { Lead } from '@real-estate-erp/types';

interface BulkActionsMenuProps {
  selectedCount: number;
  selectedLeads?: Lead[];
  onAction?: (action: string) => void;
  onBatchUpdate?: (leadIds: string[], updates: Partial<Lead>) => Promise<void>;
}

const SALES_EXECUTIVES = [
  { id: 'usr-1', name: 'Vamshi Krishna', email: 'vamshi.k@realestateerp.com' },
  { id: 'usr-2', name: 'Mahesh Kumar', email: 'mahesh.k@realestateerp.com' },
  { id: 'usr-3', name: 'Ananya Sharma', email: 'ananya.s@realestateerp.com' },
  { id: 'usr-4', name: 'Srinivas Rao', email: 'srinivas.r@realestateerp.com' },
  { id: 'usr-5', name: 'Deepika Rani', email: 'deepika.r@realestateerp.com' },
];

const BRANCHES = [
  { id: 'branch-1', name: 'Hyderabad Head Office (Financial District)' },
  { id: 'branch-2', name: 'Mokila Regional Site Office' },
  { id: 'branch-3', name: 'Shadnagar Branch Office' },
  { id: 'branch-4', name: 'Vijayawada Regional Office' },
];

export const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({
  selectedCount,
  selectedLeads = [],
  onAction,
  onBatchUpdate,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(SALES_EXECUTIVES[0].id);

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].id);

  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = () => {
    if (selectedLeads.length === 0) return;

    const headers = ['Lead ID', 'Full Name', 'Phone', 'Email', 'Status', 'Source', 'City', 'Budget Min', 'Budget Max', 'Intent Score', 'Created Date'];
    const rows = selectedLeads.map((l) => [
      `"${l.id}"`,
      `"${l.fullName || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.status || ''}"`,
      `"${l.source || ''}"`,
      `"${l.city || ''}"`,
      l.budgetMin || 0,
      l.budgetMax || 0,
      l.aiIntentScore || 0,
      `"${l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSnackbarMessage(`Successfully exported ${selectedLeads.length} leads to CSV.`);
    handleClose();
  };

  const handleWhatsAppAction = () => {
    if (selectedLeads.length === 0) return;

    if (selectedLeads.length === 1) {
      const lead = selectedLeads[0];
      const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
      const text = encodeURIComponent(
        `Hello ${lead.fullName || 'Valued Customer'},\nThank you for reaching out regarding our premium residential ventures. When would be a good time for a brief call to share our master layouts?`
      );
      window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`, '_blank');
    } else {
      // Bulk notification message
      const phones = selectedLeads.map((l) => `${l.fullName}: ${l.phone}`).join('\n');
      navigator.clipboard?.writeText(phones);
      setSnackbarMessage(`Copied contact list of ${selectedLeads.length} leads to clipboard for WhatsApp Broadcast.`);
    }
    handleClose();
  };

  const handleConfirmAssign = async () => {
    const exec = SALES_EXECUTIVES.find((e) => e.id === selectedExecutive);
    if (!exec) return;

    const leadIds = selectedLeads.map((l) => l.id);
    if (onBatchUpdate) {
      await onBatchUpdate(leadIds, {
        assignedExecutiveId: exec.id,
        assignedExecutiveName: exec.name,
      });
    }
    setAssignDialogOpen(false);
    setSnackbarMessage(`Assigned ${leadIds.length} leads to ${exec.name}.`);
  };

  const handleConfirmTransfer = async () => {
    const branch = BRANCHES.find((b) => b.id === selectedBranch);
    if (!branch) return;

    const leadIds = selectedLeads.map((l) => l.id);
    if (onBatchUpdate) {
      await onBatchUpdate(leadIds, { assignedBranchId: branch.id });
    }
    setTransferDialogOpen(false);
    setSnackbarMessage(`Transferred ${leadIds.length} leads to ${branch.name}.`);
  };

  const handleConfirmArchive = async () => {
    const leadIds = selectedLeads.map((l) => l.id);
    if (onBatchUpdate) {
      await onBatchUpdate(leadIds, { status: 'CLOSED_LOST' });
    }
    setArchiveDialogOpen(false);
    setSnackbarMessage(`Archived ${leadIds.length} leads.`);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        disabled={selectedCount === 0}
      >
        Bulk Actions ({selectedCount})
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            setAssignDialogOpen(true);
            onAction?.('ASSIGN');
          }}
        >
          <ListItemIcon><AssignmentIndIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Assign Executive</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            setTransferDialogOpen(true);
            onAction?.('TRANSFER');
          }}
        >
          <ListItemIcon><TransformIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Transfer Branch</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleWhatsAppAction();
            onAction?.('WHATSAPP');
          }}
        >
          <ListItemIcon><WhatsAppIcon fontSize="small" /></ListItemIcon>
          <ListItemText>WhatsApp Follow-up</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleExportCSV();
            onAction?.('EXPORT');
          }}
        >
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export to CSV</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            setArchiveDialogOpen(true);
            onAction?.('ARCHIVE');
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon><ArchiveIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Archive Leads</ListItemText>
        </MenuItem>
      </Menu>

      {/* Assign Executive Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign {selectedCount} Selected Leads</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Select a sales executive to assign the chosen leads for immediate follow-up:
          </DialogContentText>
          <FormControl fullWidth size="small">
            <InputLabel id="exec-select-label">Sales Executive</InputLabel>
            <Select
              labelId="exec-select-label"
              value={selectedExecutive}
              label="Sales Executive"
              onChange={(e) => setSelectedExecutive(e.target.value)}
            >
              {SALES_EXECUTIVES.map((exec) => (
                <MenuItem key={exec.id} value={exec.id}>
                  {exec.name} ({exec.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAssign}>
            Assign Leads
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Branch Dialog */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transfer {selectedCount} Leads to Branch</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Transfer lead ownership and routing to another regional office:
          </DialogContentText>
          <FormControl fullWidth size="small">
            <InputLabel id="branch-select-label">Target Branch</InputLabel>
            <Select
              labelId="branch-select-label"
              value={selectedBranch}
              label="Target Branch"
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {BRANCHES.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmTransfer}>
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Archive {selectedCount} Leads?</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to archive these {selectedCount} leads? Their status will be set to LOST and they will be removed from the active pipeline.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmArchive}>
            Archive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarMessage(null)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
