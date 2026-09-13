import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SecurityIcon from '@mui/icons-material/Security';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAuthContext } from '@real-estate-erp/firebase';
import {
  CadreLevel,
  CADRE_DISPLAY_NAMES,
  getAllowedAssignableCadres,
  canApproveOfficeStaff,
  canAssignCadre,
} from '@real-estate-erp/types';

interface NetworkMember {
  id: string;
  name: string;
  position: string;
  parent: string;
  phone: string;
  directSales: string;
  teamSales: string;
  status: 'Active' | 'Probation' | 'Inactive';
  joinDate: string;
}

export const initialMembers: NetworkMember[] = [
  {
    id: 'MEM-101',
    name: 'Ramesh Varma',
    position: 'Sr. Chief General Manager',
    parent: 'Direct / Board',
    phone: '+91 98480 12345',
    directSales: '₹2.8 Cr',
    teamSales: '₹28.4 Cr',
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: 'MEM-102',
    name: 'Kavitha Reddy',
    position: 'Chief General Manager',
    parent: 'Ramesh Varma',
    phone: '+91 98480 23456',
    directSales: '₹1.4 Cr',
    teamSales: '₹11.8 Cr',
    status: 'Active',
    joinDate: '2024-02-10',
  },
  {
    id: 'MEM-103',
    name: 'Suresh Babu',
    position: 'Chief General Manager',
    parent: 'Ramesh Varma',
    phone: '+91 98480 78901',
    directSales: '₹1.6 Cr',
    teamSales: '₹8.9 Cr',
    status: 'Active',
    joinDate: '2024-02-18',
  },
  {
    id: 'MEM-104',
    name: 'Murali Mohan',
    position: 'Chief General Manager',
    parent: 'Ramesh Varma',
    phone: '+91 98480 91001',
    directSales: '₹1.2 Cr',
    teamSales: '₹7.7 Cr',
    status: 'Active',
    joinDate: '2024-02-25',
  },
  {
    id: 'MEM-105',
    name: 'Vikram Rao',
    position: 'General Manager',
    parent: 'Kavitha Reddy',
    phone: '+91 98480 34567',
    directSales: '₹95 L',
    teamSales: '₹6.2 Cr',
    status: 'Active',
    joinDate: '2024-03-01',
  },
  {
    id: 'MEM-106',
    name: 'Anil Kumar',
    position: 'General Manager',
    parent: 'Kavitha Reddy',
    phone: '+91 98480 45678',
    directSales: '₹85 L',
    teamSales: '₹5.1 Cr',
    status: 'Active',
    joinDate: '2024-03-05',
  },
  {
    id: 'MEM-107',
    name: 'Sunita Patel',
    position: 'General Manager',
    parent: 'Suresh Babu',
    phone: '+91 98480 89012',
    directSales: '₹75 L',
    teamSales: '₹4.5 Cr',
    status: 'Active',
    joinDate: '2024-03-10',
  },
  {
    id: 'MEM-108',
    name: 'Venkatesh Chowdary',
    position: 'General Manager',
    parent: 'Suresh Babu',
    phone: '+91 98480 89013',
    directSales: '₹68 L',
    teamSales: '₹3.9 Cr',
    status: 'Active',
    joinDate: '2024-03-12',
  },
  {
    id: 'MEM-109',
    name: 'Radhika Nair',
    position: 'General Manager',
    parent: 'Murali Mohan',
    phone: '+91 98480 91002',
    directSales: '₹62 L',
    teamSales: '₹3.8 Cr',
    status: 'Active',
    joinDate: '2024-03-14',
  },
  {
    id: 'MEM-110',
    name: 'Priya Sharma',
    position: 'Senior Sales Manager',
    parent: 'Vikram Rao',
    phone: '+91 98480 56789',
    directSales: '₹54 L',
    teamSales: '₹3.2 Cr',
    status: 'Active',
    joinDate: '2024-03-15',
  },
  {
    id: 'MEM-111',
    name: 'Rajesh Gupta',
    position: 'Senior Sales Manager',
    parent: 'Vikram Rao',
    phone: '+91 98480 67890',
    directSales: '₹48 L',
    teamSales: '₹2.1 Cr',
    status: 'Active',
    joinDate: '2024-04-02',
  },
  {
    id: 'MEM-112',
    name: 'Praveen Teja',
    position: 'Senior Sales Manager',
    parent: 'Radhika Nair',
    phone: '+91 98480 22335',
    directSales: '₹50 L',
    teamSales: '₹2.2 Cr',
    status: 'Active',
    joinDate: '2024-04-05',
  },
  {
    id: 'MEM-113',
    name: 'Sudhakar Goud',
    position: 'Senior Sales Manager',
    parent: 'Sunita Patel',
    phone: '+91 98480 89015',
    directSales: '₹42 L',
    teamSales: '₹1.8 Cr',
    status: 'Active',
    joinDate: '2024-04-10',
  },
  {
    id: 'MEM-114',
    name: 'Anand Naidu',
    position: 'Sales Manager',
    parent: 'Priya Sharma',
    phone: '+91 98480 66778',
    directSales: '₹38 L',
    teamSales: '₹1.4 Cr',
    status: 'Active',
    joinDate: '2024-04-15',
  },
  {
    id: 'MEM-115',
    name: 'Vamshi Krishna',
    position: 'Sales Manager',
    parent: 'Priya Sharma',
    phone: '+91 98480 66779',
    directSales: '₹35 L',
    teamSales: '₹1.1 Cr',
    status: 'Active',
    joinDate: '2024-04-20',
  },
  {
    id: 'MEM-116',
    name: 'Sneha Latha',
    position: 'Sales Manager',
    parent: 'Rajesh Gupta',
    phone: '+91 98480 66780',
    directSales: '₹32 L',
    teamSales: '₹95 L',
    status: 'Active',
    joinDate: '2024-05-01',
  },
  {
    id: 'MEM-117',
    name: 'Ravi Teja Sharma',
    position: 'Associate',
    parent: 'Anand Naidu',
    phone: '+91 98480 66781',
    directSales: '₹45 L',
    teamSales: '₹45 L',
    status: 'Active',
    joinDate: '2024-05-10',
  },
  {
    id: 'MEM-118',
    name: 'Swathi Naidu',
    position: 'Associate',
    parent: 'Anand Naidu',
    phone: '+91 98480 66782',
    directSales: '₹65 L',
    teamSales: '₹65 L',
    status: 'Active',
    joinDate: '2024-05-15',
  },
  {
    id: 'MEM-119',
    name: 'Karthik Raja',
    position: 'Associate',
    parent: 'Vamshi Krishna',
    phone: '+91 98480 66783',
    directSales: '₹35 L',
    teamSales: '₹35 L',
    status: 'Probation',
    joinDate: '2024-06-01',
  },
  {
    id: 'MEM-120',
    name: 'Shravan Reddy',
    position: 'Associate',
    parent: 'Sudhakar Goud',
    phone: '+91 98480 89018',
    directSales: '₹40 L',
    teamSales: '₹40 L',
    status: 'Active',
    joinDate: '2024-06-15',
  },
];

export const NetworkMembersPage: React.FC = () => {
  const { user } = useAuthContext();
  const [members, setMembers] = useState<NetworkMember[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  // Cadre Assignment & Promotion State
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(null);
  const [targetCadre, setTargetCadre] = useState<CadreLevel>('sales_executive');
  const [cadreModalOpen, setCadreModalOpen] = useState(false);
  const [cadreError, setCadreError] = useState<string | null>(null);
  const [cadreSuccess, setCadreSuccess] = useState<string | null>(null);

  // Current Actor's Effective Cadre Level
  const actorCadre: CadreLevel =
    (user?.cadre as CadreLevel) ||
    (user?.role === 'super_admin' || user?.role === 'director'
      ? 'director'
      : user?.role === 'branch_manager'
      ? 'gm'
      : user?.role === 'sales_manager'
      ? 'sales_manager'
      : 'sales_executive');

  const allowedCadres = getAllowedAssignableCadres(actorCadre);

  const handleOpenCadreModal = (member: NetworkMember) => {
    setSelectedMember(member);
    setCadreError(null);
    setCadreSuccess(null);
    // Set default target cadre to first allowed option or sales_executive
    setTargetCadre(allowedCadres[0] || 'sales_executive');
    setCadreModalOpen(true);
  };

  const handleSaveCadreChange = () => {
    if (!selectedMember) return;
    setCadreError(null);

    // Enforce Hierarchy Rule: Actor can only assign cadres strictly lower than own rank
    if (!canAssignCadre(actorCadre, targetCadre)) {
      setCadreError(
        `Hierarchy Restriction: As a ${CADRE_DISPLAY_NAMES[actorCadre] || actorCadre}, you are not authorized to assign ${CADRE_DISPLAY_NAMES[targetCadre] || targetCadre}. You can only assign lower cadres.`
      );
      return;
    }

    // Enforce Office Staff rule
    if (targetCadre === 'office_staff' && !canApproveOfficeStaff(actorCadre) && !canApproveOfficeStaff(user?.role)) {
      setCadreError('Office Staff assignment requires Management or Director authorization.');
      return;
    }

    const updatedPosition = CADRE_DISPLAY_NAMES[targetCadre] || targetCadre;
    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, position: updatedPosition } : m))
    );

    setCadreSuccess(`Successfully updated ${selectedMember.name}'s Cadre to "${updatedPosition}".`);
    setTimeout(() => {
      setCadreModalOpen(false);
      setCadreSuccess(null);
    }, 1500);
  };

  // Form State
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    position: 'Sales Manager',
    parent: 'Vikram Rao',
  });

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.parent.toLowerCase().includes(search.toLowerCase());
    const matchPosition = positionFilter === 'ALL' || m.position === positionFilter;
    return matchSearch && matchPosition;
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.phone) return;
    const added: NetworkMember = {
      id: `MEM-${100 + members.length + 1}`,
      name: newMember.name,
      position: newMember.position,
      parent: newMember.parent,
      phone: newMember.phone,
      directSales: '₹0',
      teamSales: '₹0',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setMembers([added, ...members]);
    setOpenModal(false);
    setNewMember({ name: '', phone: '', position: 'Sales Manager', parent: 'Vikram Rao' });
  };

  const getStatusChip = (status: NetworkMember['status']) => {
    switch (status) {
      case 'Active':
        return <Chip label="Active" color="success" size="small" />;
      case 'Probation':
        return <Chip label="Probation" color="warning" size="small" />;
      default:
        return <Chip label="Inactive" color="default" size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Network Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage field sales associates, multi-tier upline sponsorships, and production targets.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ fontWeight: '600' }}
        >
          Add Member
        </Button>
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search by member name, ID, or sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Position Filter</InputLabel>
            <Select
              value={positionFilter}
              label="Position Filter"
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Positions</MenuItem>
              <MenuItem value="Sr. Chief General Manager">Sr. CGM</MenuItem>
              <MenuItem value="Chief General Manager">CGM</MenuItem>
              <MenuItem value="General Manager">GM</MenuItem>
              <MenuItem value="Senior Sales Manager">SSM</MenuItem>
              <MenuItem value="Sales Manager">SM</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Position</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Parent Sponsor</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Direct / Team Sales</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.id} • {member.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {member.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {member.parent}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="primary">
                      {member.directSales}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Team: {member.teamSales}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(member.status)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Assign / Promote / Demote Cadre">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenCadreModal(member)}
                        >
                          <HowToRegIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Profile">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Transfer Sponsor">
                        <IconButton size="small" color="secondary">
                          <SwapHorizIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Member">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No network members found matching criteria.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Cadre Assignment / Promotion Dialog */}
      <Dialog
        open={cadreModalOpen}
        onClose={() => setCadreModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="warning" /> Assign / Update Cadre Hierarchy
        </DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="700">
                  Target Associate: {selectedMember.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member ID: {selectedMember.id} • Current Position: <strong>{selectedMember.position}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your Current Authority: <strong>{CADRE_DISPLAY_NAMES[actorCadre] || actorCadre}</strong>
                </Typography>
              </Paper>

              <Alert severity="info">
                <strong>Cadre Hierarchy Rule:</strong> You can only assign or promote members to cadres strictly lower than your own rank ({CADRE_DISPLAY_NAMES[actorCadre] || actorCadre}).
              </Alert>

              {cadreError && <Alert severity="error">{cadreError}</Alert>}
              {cadreSuccess && <Alert severity="success">{cadreSuccess}</Alert>}

              <FormControl fullWidth size="small">
                <InputLabel>Select Target Cadre</InputLabel>
                <Select
                  value={targetCadre}
                  label="Select Target Cadre"
                  onChange={(e) => setTargetCadre(e.target.value as CadreLevel)}
                >
                  {allowedCadres.length > 0 ? (
                    allowedCadres.map((c) => (
                      <MenuItem key={c} value={c}>
                        {CADRE_DISPLAY_NAMES[c] || c}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="sales_executive" disabled>
                      No lower cadres available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCadreModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleSaveCadreChange}
            disabled={allowedCadres.length === 0 || !selectedMember}
            sx={{ fontWeight: 700 }}
          >
            Apply Cadre Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: '700' }}>Enroll New Network Member</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              size="small"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              required
            />
            <TextField
              label="Phone Number"
              fullWidth
              size="small"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              placeholder="+91 98480 00000"
              required
            />
            <FormControl fullWidth size="small">
              <InputLabel>Position / Rank</InputLabel>
              <Select
                value={newMember.position}
                label="Position / Rank"
                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
              >
                <MenuItem value="Sales Manager">Sales Manager (SM)</MenuItem>
                <MenuItem value="Senior Sales Manager">Senior Sales Manager (SSM)</MenuItem>
                <MenuItem value="General Manager">General Manager (GM)</MenuItem>
                <MenuItem value="Chief General Manager">Chief General Manager (CGM)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Assigned Parent / Sponsor"
              fullWidth
              size="small"
              value={newMember.parent}
              onChange={(e) => setNewMember({ ...newMember, parent: e.target.value })}
              helperText="The upline manager who will receive sponsor overrides"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddMember} disabled={!newMember.name || !newMember.phone}>
            Enroll Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NetworkMembersPage;
