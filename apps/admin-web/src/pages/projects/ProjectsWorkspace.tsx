import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Stack,
  Divider,
  Tooltip,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ParkIcon from '@mui/icons-material/Park';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SecurityIcon from '@mui/icons-material/Security';
import { Project } from '@real-estate-erp/types';
import { DataTable, MetricCard, SearchBox } from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AddProjectDialog } from './components/AddProjectDialog';
import { ProjectDetailsDialog } from './components/ProjectDetailsDialog';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'ISKON City - 2',
    code: 'IC2-01',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00248/LO/Plg/2024',
    reraId: 'P02260007891',
    totalAreaAcres: 120,
    layoutMapUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Rural',
      village: 'Podalakur Road (Near Mattempadu)',
      surveyNumbers: ['Sy. No. 142/A', '143/B', '145'],
      googleMapsUrl: 'https://maps.google.com/?q=Podalakur+Road+Nellore',
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
      basePrice: 18500,
      launchOffer: 17500,
      currentPrice: 18500,
      maintenanceCharges: 500,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: true,
      hasTemple: false,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    totalArea: 120,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 4,
    totalPlotsCount: 450,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Dream City',
    code: 'DC-02',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'DTCP',
    approvalNumber: 'DTCP/AP/0912/2023',
    reraId: 'P02260006542',
    totalAreaAcres: 45,
    layoutMapUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Kovuru',
      village: 'Nellore-Bombay Highway (NH-67)',
      surveyNumbers: ['Sy. No. 210', '211/1', '212/A'],
      googleMapsUrl: 'https://maps.google.com/?q=Kovuru+Nellore',
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
      basePrice: 12500,
      launchOffer: 11500,
      currentPrice: 12500,
      maintenanceCharges: 350,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: false,
      hasTemple: true,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    totalArea: 45,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 3,
    totalPlotsCount: 310,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-08-28T09:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'ISKON Brundhavanam',
    code: 'IB-03',
    projectType: 'VILLA',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/00881/LO/Plg/2024',
    reraId: 'P02260009115',
    totalAreaAcres: 30,
    layoutMapUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Urban',
      village: 'Chinthareddypalem - Mini Bypass Corridor',
      surveyNumbers: ['Sy. No. 88', '89/1'],
      googleMapsUrl: 'https://maps.google.com/?q=Chinthareddypalem+Nellore',
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
      basePrice: 22000,
      launchOffer: 20500,
      currentPrice: 22000,
      maintenanceCharges: 600,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: true,
      hasTemple: false,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    totalArea: 30,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 2,
    totalPlotsCount: 160,
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: '2026-09-05T16:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'ISKON Elite Township',
    code: 'IET-04',
    projectType: 'RESIDENTIAL',
    status: 'ACTIVE',
    approvalAuthority: 'NUDA',
    approvalNumber: 'NUDA/0338/2023',
    reraId: 'P02260005432',
    totalAreaAcres: 50,
    layoutMapUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    location: {
      country: 'India',
      state: 'Andhra Pradesh',
      district: 'SPSR Nellore',
      mandal: 'Nellore Urban',
      village: 'Annamayya Circle Extn, Mini Bypass',
      surveyNumbers: ['Sy. No. 301', '304/A'],
      googleMapsUrl: 'https://maps.google.com/?q=Annamayya+Circle+Nellore',
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
      basePrice: 16500,
      launchOffer: 15500,
      currentPrice: 16500,
      maintenanceCharges: 400,
    },
    amenities: {
      hasRoads: true,
      hasElectricity: true,
      hasWater: true,
      hasDrainage: true,
      hasParks: true,
      hasCompoundWall: true,
      hasStreetLights: true,
      hasClubHouse: false,
      hasTemple: true,
    },
    media: {
      photos: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      ],
      videos: [],
      droneImages: [],
      images360: [],
    },
    totalArea: 50,
    areaUnit: 'ACRES',
    totalLayoutsCount: 1,
    totalBlocksCount: 3,
    totalPlotsCount: 350,
    createdAt: '2026-04-12T09:00:00Z',
    updatedAt: '2026-08-15T11:00:00Z',
  },
];

export const ProjectsWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Dialog States
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[];
            // Merge with seeds without duplicate IDs
            const fetchedIds = new Set(fetched.map((p) => p.id));
            const merged = [...fetched, ...SEED_PROJECTS.filter((p) => !fetchedIds.has(p.id))];
            setProjects(merged);
          }
        }
      } catch (err) {
        console.warn('Firestore fetch projects fallback to seeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const handleViewPlots = (project: Project) => {
    navigate(`/plots?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`);
  };

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.approvalNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reraId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchAuthority =
        authorityFilter === 'ALL' || p.approvalAuthority === authorityFilter;

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchAuthority && matchStatus;
    });
  }, [projects, searchTerm, authorityFilter, statusFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalVentures = projects.length;
    const activeVentures = projects.filter((p) => p.status === 'ACTIVE').length;
    const totalAcres = projects.reduce(
      (sum, p) => sum + (p.totalAreaAcres || p.totalArea || 0),
      0
    );
    const totalPlots = projects.reduce((sum, p) => sum + (p.totalPlotsCount || 0), 0);

    return {
      totalVentures,
      activeVentures,
      totalAcres: totalAcres.toFixed(1),
      totalPlots,
    };
  }, [projects]);

  const columns = [
    {
      id: 'name',
      label: 'Venture & Code',
      sortable: true,
      render: (row: Project) => (
        <Box>
          <Typography variant="body2" fontWeight={600} color="primary">
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.code} • {row.projectType}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'authority',
      label: 'Approval Authority',
      render: (row: Project) => (
        <Box>
          <Chip
            size="small"
            label={row.approvalAuthority || 'DTCP'}
            color={
              row.approvalAuthority === 'HMDA'
                ? 'primary'
                : row.approvalAuthority === 'DTCP'
                ? 'success'
                : 'info'
            }
            variant="outlined"
            icon={<VerifiedIcon />}
          />
          {row.approvalNumber && (
            <Typography variant="caption" display="block" color="text.secondary">
              {row.approvalNumber}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      render: (row: Project) => (
        <Typography variant="body2">
          {row.location.village}, {row.location.district}
        </Typography>
      ),
    },
    {
      id: 'acreage',
      label: 'Total Extent',
      render: (row: Project) => `${row.totalAreaAcres || row.totalArea || 0} Acres`,
    },
    {
      id: 'plots',
      label: 'Total Units',
      render: (row: Project) => `${row.totalPlotsCount || 0} Plots`,
    },
    {
      id: 'basePrice',
      label: 'Base Rate',
      render: (row: Project) => `₹${row.pricing.basePrice.toLocaleString('en-IN')}/Sq.Yd`,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row: Project) => (
        <Chip
          label={row.status}
          size="small"
          color={
            row.status === 'ACTIVE'
              ? 'success'
              : row.status === 'PLANNING'
              ? 'info'
              : row.status === 'COMPLETED'
              ? 'primary'
              : 'default'
          }
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: Project) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails(row);
            }}
          >
            Details
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPlots(row);
            }}
          >
            Plots
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header Banner */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
            Projects & Ventures Workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage residential layouts, DTCP & HMDA approved ventures, land records, and plot inventories
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ px: 2, py: 0.75, fontWeight: 600, borderRadius: 2, fontSize: '0.85rem' }}
        >
          Add New Venture
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Ventures"
            value={metrics.totalVentures}
            subtitle="All Real Estate Projects"
            icon={<MapIcon />}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Layouts"
            value={metrics.activeVentures}
            subtitle="Open for Customer Sales"
            icon={<VerifiedIcon />}
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Acreage"
            value={metrics.totalAcres}
            unit="Acres"
            subtitle="Total Land Bank Developed"
            icon={<ParkIcon />}
            color="#0891b2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Plot Inventory"
            value={metrics.totalPlots}
            unit="Units"
            subtitle="Developed Plot Units"
            icon={<LocationOnIcon />}
            color="#d97706"
          />
        </Grid>
      </Grid>

      {/* Filters & Control Toolbar */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          {/* Search Box */}
          <Box sx={{ flex: 1, maxWidth: { md: 450 } }}>
            <SearchBox
              placeholder="Search ventures by name, location, LP No, or RERA ID..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </Box>

          {/* Quick Filters */}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <TextField
              select
              size="small"
              label="Authority"
              value={authorityFilter}
              onChange={(e) => setAuthorityFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="ALL">All Authorities</MenuItem>
              <MenuItem value="HMDA">HMDA Approved</MenuItem>
              <MenuItem value="DTCP">DTCP Approved</MenuItem>
              <MenuItem value="YTDA">YTDA Approved</MenuItem>
              <MenuItem value="RERA">RERA Registered</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PLANNING">Planning</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="SOLD_OUT">Sold Out</MenuItem>
            </TextField>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
            >
              <ToggleButton value="grid" aria-label="Grid View">
                <Tooltip title="Card Grid View">
                  <GridViewIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="table" aria-label="Table View">
                <Tooltip title="List Table View">
                  <ViewListIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      {/* Main Content Area */}
      {filteredProjects.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No ventures found matching your filter criteria. Try adjusting your search query.
        </Alert>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <Grid container spacing={3}>
          {filteredProjects.map((project) => {
            const defaultThumb =
              project.media?.photos?.[0] ||
              project.layoutMapUrl ||
              'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

            return (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Thumbnail Banner with Badges */}
                  <Box sx={{ position: 'relative', height: 180, bgcolor: 'grey.200' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={defaultThumb}
                      alt={project.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    {/* Authority Badge */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip
                        size="small"
                        icon={<VerifiedIcon />}
                        label={project.approvalAuthority || 'DTCP Approved'}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          fontWeight: 700,
                          color:
                            project.approvalAuthority === 'HMDA'
                              ? 'primary.main'
                              : 'success.dark',
                        }}
                      />
                    </Box>

                    {/* Status Badge */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Chip
                        label={project.status}
                        size="small"
                        color={
                          project.status === 'ACTIVE'
                            ? 'success'
                            : project.status === 'PLANNING'
                            ? 'info'
                            : project.status === 'COMPLETED'
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    {/* Extent Chip */}
                    <Box sx={{ position: 'absolute', bottom: 10, left: 12 }}>
                      <Chip
                        size="small"
                        label={`${project.totalAreaAcres || project.totalArea || 0} Acres`}
                        sx={{
                          bgcolor: 'rgba(0, 0, 0, 0.72)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                          {project.name}
                        </Typography>
                        <Chip
                          label={project.code}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {project.location.village}, {project.location.district}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Pricing & Units Grid */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Base Price
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} color="success.main">
                          ₹{project.pricing.basePrice.toLocaleString('en-IN')}
                          <Typography component="span" variant="caption" color="text.secondary">
                            /Sq.Yd
                          </Typography>
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box textAlign="right">
                        <Typography variant="caption" color="text.secondary" display="block">
                          Total Planned Units
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {project.totalPlotsCount || 0} Plots
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Amenities Checklist Preview */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', pt: 0.5 }}>
                      {project.amenities?.hasRoads && (
                        <Tooltip title="Blacktop Roads">
                          <ParkIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {project.amenities?.hasElectricity && (
                        <Tooltip title="Underground Electricity">
                          <ElectricBoltIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {project.amenities?.hasWater && (
                        <Tooltip title="Water Pipeline">
                          <WaterDropIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {project.amenities?.hasCompoundWall && (
                        <Tooltip title="Gated Compound Wall">
                          <SecurityIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {project.approvalNumber && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          LP: {project.approvalNumber}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  <Divider />

                  {/* Card Actions */}
                  <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenDetails(project)}
                    >
                      Layout Map
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<MapIcon />}
                      onClick={() => handleViewPlots(project)}
                    >
                      View Plots
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* Table View */
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <DataTable
            {...({
              columns,
              data: filteredProjects,
              loading,
              onRowClick: (row: Project) => handleOpenDetails(row),
            } as any)}
          />
        </Paper>
      )}

      {/* Dialogs */}
      <AddProjectDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onProjectAdded={handleProjectAdded}
      />

      <ProjectDetailsDialog
        project={selectedProject}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
      />
    </Box>
  );
};

export default ProjectsWorkspace;
