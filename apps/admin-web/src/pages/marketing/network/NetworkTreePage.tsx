import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

interface TreeNode {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  teamSize: number;
  totalVolume: string;
  status: 'Active' | 'Inactive';
  level: number;
  children?: TreeNode[];
}

const mockNetworkTree: TreeNode = {
  id: 'NET-001',
  name: 'Ramesh Varma',
  role: 'Sr. Chief General Manager (Sr CGM)',
  phone: '+91 98480 12345',
  email: 'ramesh.varma@realestate.com',
  teamSize: 84,
  totalVolume: '₹28.4 Cr',
  status: 'Active',
  level: 1,
  children: [
    {
      id: 'NET-002',
      name: 'Kavitha Reddy',
      role: 'Chief General Manager (CGM - North Zone)',
      phone: '+91 98480 23456',
      email: 'kavitha.reddy@realestate.com',
      teamSize: 34,
      totalVolume: '₹11.8 Cr',
      status: 'Active',
      level: 2,
      children: [
        {
          id: 'NET-004',
          name: 'Vikram Rao',
          role: 'General Manager (GM - Cyber City)',
          phone: '+91 98480 34567',
          email: 'vikram.rao@realestate.com',
          teamSize: 18,
          totalVolume: '₹6.2 Cr',
          status: 'Active',
          level: 3,
          children: [
            {
              id: 'NET-006',
              name: 'Priya Sharma',
              role: 'Senior Sales Manager (SSM)',
              phone: '+91 98480 56789',
              email: 'priya.s@realestate.com',
              teamSize: 8,
              totalVolume: '₹3.2 Cr',
              status: 'Active',
              level: 4,
              children: [
                {
                  id: 'NET-010',
                  name: 'Anand Naidu',
                  role: 'Sales Manager (SM)',
                  phone: '+91 98480 66778',
                  email: 'anand.n@realestate.com',
                  teamSize: 3,
                  totalVolume: '₹1.4 Cr',
                  status: 'Active',
                  level: 5,
                  children: [
                    {
                      id: 'NET-014',
                      name: 'Ravi Teja Sharma',
                      role: 'Field Associate',
                      phone: '+91 98480 66781',
                      email: 'raviteja@realestate.com',
                      teamSize: 0,
                      totalVolume: '₹45 L',
                      status: 'Active',
                      level: 6,
                    },
                    {
                      id: 'NET-015',
                      name: 'Swathi Naidu',
                      role: 'Field Associate',
                      phone: '+91 98480 66782',
                      email: 'swathi.n@realestate.com',
                      teamSize: 0,
                      totalVolume: '₹65 L',
                      status: 'Active',
                      level: 6,
                    },
                  ],
                },
                {
                  id: 'NET-011',
                  name: 'Vamshi Krishna',
                  role: 'Sales Manager (SM)',
                  phone: '+91 98480 66779',
                  email: 'vamshi.k@realestate.com',
                  teamSize: 2,
                  totalVolume: '₹1.1 Cr',
                  status: 'Active',
                  level: 5,
                  children: [
                    {
                      id: 'NET-016',
                      name: 'Karthik Raja',
                      role: 'Field Associate',
                      phone: '+91 98480 66783',
                      email: 'karthik.r@realestate.com',
                      teamSize: 0,
                      totalVolume: '₹35 L',
                      status: 'Active',
                      level: 6,
                    },
                  ],
                },
              ],
            },
            {
              id: 'NET-007',
              name: 'Rajesh Gupta',
              role: 'Senior Sales Manager (SSM)',
              phone: '+91 98480 67890',
              email: 'rajesh.g@realestate.com',
              teamSize: 6,
              totalVolume: '₹2.1 Cr',
              status: 'Active',
              level: 4,
              children: [
                {
                  id: 'NET-012',
                  name: 'Sneha Latha',
                  role: 'Sales Manager (SM)',
                  phone: '+91 98480 66780',
                  email: 'sneha.l@realestate.com',
                  teamSize: 2,
                  totalVolume: '₹95 L',
                  status: 'Active',
                  level: 5,
                },
              ],
            },
          ],
        },
        {
          id: 'NET-005',
          name: 'Anil Kumar',
          role: 'General Manager (GM - Mini Bypass Hub)',
          phone: '+91 98480 45678',
          email: 'anil.k@iskondevelopers.com',
          teamSize: 14,
          totalVolume: '₹5.1 Cr',
          status: 'Active',
          level: 3,
        },
      ],
    },
    {
      id: 'NET-003',
      name: 'Suresh Babu',
      role: 'Chief General Manager (CGM - Nellore South)',
      phone: '+91 98480 78901',
      email: 'suresh.babu@iskondevelopers.com',
      teamSize: 26,
      totalVolume: '₹8.9 Cr',
      status: 'Active',
      level: 2,
      children: [
        {
          id: 'NET-008',
          name: 'Sunita Patel',
          role: 'General Manager (GM - Kovuru Highway)',
          phone: '+91 98480 89012',
          email: 'sunita.p@iskondevelopers.com',
          teamSize: 12,
          totalVolume: '₹4.5 Cr',
          status: 'Active',
          level: 3,
          children: [
            {
              id: 'NET-017',
              name: 'Sudhakar Goud',
              role: 'Senior Sales Manager (SSM)',
              phone: '+91 98480 89015',
              email: 'sudhakar.g@iskondevelopers.com',
              teamSize: 4,
              totalVolume: '₹1.8 Cr',
              status: 'Active',
              level: 4,
            },
          ],
        },
        {
          id: 'NET-009',
          name: 'Venkatesh Chowdary',
          role: 'General Manager (GM - Bombay Highway)',
          phone: '+91 98480 89013',
          email: 'venkatesh.c@iskondevelopers.com',
          teamSize: 11,
          totalVolume: '₹3.9 Cr',
          status: 'Active',
          level: 3,
        },
      ],
    },
    {
      id: 'NET-020',
      name: 'Murali Mohan',
      role: 'Chief General Manager (CGM - Podalakur Zone)',
      phone: '+91 98480 91001',
      email: 'murali.mohan@iskondevelopers.com',
      teamSize: 22,
      totalVolume: '₹7.7 Cr',
      status: 'Active',
      level: 2,
      children: [
        {
          id: 'NET-021',
          name: 'Radhika Nair',
          role: 'General Manager (GM - Chinthareddypalem Corridor)',
          phone: '+91 98480 91002',
          email: 'radhika.n@iskondevelopers.com',
          teamSize: 10,
          totalVolume: '₹3.8 Cr',
          status: 'Active',
          level: 3,
          children: [
            {
              id: 'NET-022',
              name: 'Praveen Teja',
              role: 'Senior Sales Manager (SSM - Podalakur Road)',
              phone: '+91 98480 22335',
              email: 'praveen.t@iskondevelopers.com',
              teamSize: 5,
              totalVolume: '₹2.2 Cr',
              status: 'Active',
              level: 4,
            },
          ],
        },
      ],
    },
  ],
};

const TreeNodeCard: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'primary.main';
      case 2:
        return 'secondary.main';
      case 3:
        return 'info.main';
      default:
        return 'success.main';
    }
  };

  return (
    <Box sx={{ ml: depth * 3, mt: 2, position: 'relative' }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          borderLeft: 6,
          borderColor: getLevelColor(node.level),
          bgcolor: 'background.paper',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: getLevelColor(node.level), width: 44, height: 44, fontWeight: 'bold' }}>
              {node.name.charAt(0)}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight="700">
                  {node.name}
                </Typography>
                <Chip
                  label={node.status}
                  size="small"
                  color={node.status === 'Active' ? 'success' : 'default'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                {node.role} • ID: {node.id}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 13 }} /> {node.phone}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 13 }} /> {node.email}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Network Volume
              </Typography>
              <Typography variant="subtitle2" fontWeight="700" color="primary">
                {node.totalVolume}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Team Size
              </Typography>
              <Typography variant="subtitle2" fontWeight="700">
                {node.teamSize} Agents
              </Typography>
            </Box>
            {hasChildren && (
              <IconButton size="small" onClick={() => setOpen(!open)} color="primary">
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Paper>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ borderLeft: '2px dashed #cbd5e1', ml: 2, pl: 1 }}>
            {node.children!.map((child) => (
              <TreeNodeCard key={child.id} node={child} depth={1} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export const NetworkTreePage: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700">
            Organization Network Tree
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Multi-tier marketing hierarchy with real-time reporting and downline network visibility.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<AccountTreeIcon />} size="small">
            Expand All
          </Button>
        </Stack>
      </Stack>

      {/* Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Network Agents
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    48
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 44, height: 44 }}>
                  <PeopleIcon />
                </Avatar>
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
                    Hierarchy Levels
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    4 Tiers
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 44, height: 44 }}>
                  <WorkspacePremiumIcon />
                </Avatar>
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
                    Total Network Volume
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ₹14.8 Cr
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 44, height: 44 }}>
                  <TrendingUpIcon />
                </Avatar>
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
                    Active Downlines
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    100%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 44, height: 44 }}>
                  <AccountTreeIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search agents by name, role, or ID..."
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
      </Paper>

      {/* Hierarchy Tree */}
      <Box sx={{ pb: 4 }}>
        <TreeNodeCard node={mockNetworkTree} />
      </Box>
    </Box>
  );
};

export default NetworkTreePage;
