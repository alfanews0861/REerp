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
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PolicyIcon from '@mui/icons-material/Policy';
import PercentIcon from '@mui/icons-material/Percent';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface CommissionRule {
  id: string;
  position: string;
  project: string;
  type: 'PERCENTAGE' | 'FIXED_PER_SQYD';
  value: string;
  payoutTrigger: string;
  status: 'Active' | 'Draft' | 'Deprecated';
}

const initialRules: CommissionRule[] = [
  {
    id: 'RUL-001',
    position: 'Senior Chief General Manager (Sr CGM)',
    project: 'All Projects',
    type: 'PERCENTAGE',
    value: '2.0%',
    payoutTrigger: 'On Registration (100% Paid)',
    status: 'Active',
  },
  {
    id: 'RUL-002',
    position: 'Chief General Manager (CGM)',
    project: 'All Projects',
    type: 'PERCENTAGE',
    value: '1.5%',
    payoutTrigger: 'On Registration (100% Paid)',
    status: 'Active',
  },
  {
    id: 'RUL-003',
    position: 'General Manager (GM)',
    project: 'Cyber Meadows Phase II',
    type: 'PERCENTAGE',
    value: '2.5%',
    payoutTrigger: '50% Advance + Registration',
    status: 'Active',
  },
  {
    id: 'RUL-004',
    position: 'Sales Manager (SM)',
    project: 'Green Meadows Luxury Plots',
    type: 'PERCENTAGE',
    value: '3.0%',
    payoutTrigger: 'On Registration (100% Paid)',
    status: 'Active',
  },
  {
    id: 'RUL-005',
    position: 'Direct Sponsoring Override',
    project: 'All Projects',
    type: 'PERCENTAGE',
    value: '0.5%',
    payoutTrigger: 'On Direct Downline Sale',
    status: 'Active',
  },
  {
    id: 'RUL-006',
    position: 'Associate Field Agent',
    project: 'Sunrise Enclave Plots',
    type: 'FIXED_PER_SQYD',
    value: '₹150 / Sq. Yd',
    payoutTrigger: 'On Plot Allotment Token',
    status: 'Draft',
  },
];

export const CommissionRulesPage: React.FC = () => {
  const [rules, setRules] = useState<CommissionRule[]>(initialRules);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [openModal, setOpenModal] = useState(false);

  // Form state
  const [newRule, setNewRule] = useState({
    position: 'Sales Manager (SM)',
    project: 'All Projects',
    type: 'PERCENTAGE' as CommissionRule['type'],
    value: '2.0%',
    payoutTrigger: 'On Registration (100% Paid)',
  });

  const filteredRules = rules.filter((r) => {
    const matchSearch =
      r.position.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.project.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === 'ALL' || r.project === projectFilter;
    return matchSearch && matchProject;
  });

  const handleAddRule = () => {
    const created: CommissionRule = {
      id: `RUL-00${rules.length + 1}`,
      position: newRule.position,
      project: newRule.project,
      type: newRule.type,
      value: newRule.value,
      payoutTrigger: newRule.payoutTrigger,
      status: 'Active',
    };
    setRules([created, ...rules]);
    setOpenModal(false);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Commission Rules Configurator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure multi-tier percentage margins, direct sponsor overrides, and milestone payout triggers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ fontWeight: '600' }}
        >
          Add New Rule
        </Button>
      </Stack>

      {/* Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Active Rules
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {rules.filter((r) => r.status === 'Active').length}
                  </Typography>
                </Box>
                <PolicyIcon color="primary" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Max Direct Margin
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="secondary.main">
                    3.0%
                  </Typography>
                </Box>
                <PercentIcon color="secondary" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Overriding Sponsoring
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    0.5%
                  </Typography>
                </Box>
                <PercentIcon color="success" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Special Project Overrides
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    3 Projects
                  </Typography>
                </Box>
                <ApartmentIcon color="info" sx={{ fontSize: 36 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search rules by position, ID, or project..."
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
            <InputLabel>Project Scope</InputLabel>
            <Select
              value={projectFilter}
              label="Project Scope"
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Projects</MenuItem>
              <MenuItem value="All Projects">Enterprise Default</MenuItem>
              <MenuItem value="Green Meadows Luxury Plots">Green Meadows</MenuItem>
              <MenuItem value="Cyber Meadows Phase II">Cyber Meadows</MenuItem>
              <MenuItem value="Sunrise Enclave Plots">Sunrise Enclave</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Rules Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: '700' }}>Rule ID</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Position / Tier Level</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Project Scope</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Calculation Type</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Value / Margin</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Trigger Stage</TableCell>
              <TableCell sx={{ fontWeight: '700' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: '700' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRules.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell sx={{ fontWeight: '600' }}>{rule.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    {rule.position}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.project}
                    size="small"
                    variant={rule.project === 'All Projects' ? 'filled' : 'outlined'}
                    color={rule.project === 'All Projects' ? 'default' : 'primary'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {rule.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="700" color="primary">
                    {rule.value}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {rule.payoutTrigger}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.status}
                    color={rule.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit Rule">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Rule">
                      <IconButton size="small" color="error" onClick={() => handleDeleteRule(rule.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Rule Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: '700' }}>Add Commission Rule</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Position / Hierarchy Level</InputLabel>
              <Select
                value={newRule.position}
                label="Position / Hierarchy Level"
                onChange={(e) => setNewRule({ ...newRule, position: e.target.value })}
              >
                <MenuItem value="Senior Chief General Manager (Sr CGM)">Sr. CGM</MenuItem>
                <MenuItem value="Chief General Manager (CGM)">CGM</MenuItem>
                <MenuItem value="General Manager (GM)">GM</MenuItem>
                <MenuItem value="Senior Sales Manager (SSM)">SSM</MenuItem>
                <MenuItem value="Sales Manager (SM)">SM</MenuItem>
                <MenuItem value="Associate Field Agent">Associate Field Agent</MenuItem>
                <MenuItem value="Direct Sponsoring Override">Direct Sponsoring Override</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Project Scope</InputLabel>
              <Select
                value={newRule.project}
                label="Project Scope"
                onChange={(e) => setNewRule({ ...newRule, project: e.target.value })}
              >
                <MenuItem value="All Projects">All Projects (Global Policy)</MenuItem>
                <MenuItem value="Green Meadows Luxury Plots">Green Meadows Luxury Plots</MenuItem>
                <MenuItem value="Cyber Meadows Phase II">Cyber Meadows Phase II</MenuItem>
                <MenuItem value="Sunrise Enclave Plots">Sunrise Enclave Plots</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Calculation Type</InputLabel>
              <Select
                value={newRule.type}
                label="Calculation Type"
                onChange={(e) => setNewRule({ ...newRule, type: e.target.value as CommissionRule['type'] })}
              >
                <MenuItem value="PERCENTAGE">Percentage of Total Deal Value (%)</MenuItem>
                <MenuItem value="FIXED_PER_SQYD">Fixed Amount per Square Yard (₹/Sq. Yd)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Commission Value"
              fullWidth
              size="small"
              value={newRule.value}
              onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
              placeholder="e.g., 2.5% or ₹200 / Sq. Yd"
              required
            />

            <FormControl fullWidth size="small">
              <InputLabel>Payout Trigger Stage</InputLabel>
              <Select
                value={newRule.payoutTrigger}
                label="Payout Trigger Stage"
                onChange={(e) => setNewRule({ ...newRule, payoutTrigger: e.target.value })}
              >
                <MenuItem value="On Registration (100% Paid)">On Registration (100% Paid)</MenuItem>
                <MenuItem value="50% Advance + Registration">50% Advance + Registration</MenuItem>
                <MenuItem value="On Direct Downline Sale">On Direct Downline Sale</MenuItem>
                <MenuItem value="On Plot Allotment Token">On Plot Allotment Token</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddRule}>
            Save Commission Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionRulesPage;
