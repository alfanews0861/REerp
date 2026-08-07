import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TransformIcon from '@mui/icons-material/Transform';
import ArchiveIcon from '@mui/icons-material/Archive';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';
import DownloadIcon from '@mui/icons-material/Download';

interface BulkActionsMenuProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

export const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({ selectedCount, onAction }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    onAction(action);
    handleClose();
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAction('ASSIGN')}>
          <ListItemIcon><AssignmentIndIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Assign</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('TRANSFER')}>
          <ListItemIcon><TransformIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Transfer</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('WHATSAPP')}>
          <ListItemIcon><WhatsAppIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Send WhatsApp</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('SMS')}>
          <ListItemIcon><SmsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Send SMS</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('EXPORT')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('MERGE')}>
          <ListItemIcon><MergeTypeIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Merge Leads</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('ARCHIVE')}>
          <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
