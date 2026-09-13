import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import BusinessIcon from '@mui/icons-material/Business';
import TableRowsIcon from '@mui/icons-material/TableRows';
import MapIcon from '@mui/icons-material/Map';
import { 
  DataTable, 
  MetricCard, 
  SearchBox, 
} from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { PlotLayoutMapView } from './components/PlotLayoutMapView';

export interface PlotItem {
  id: string;
  projectId?: string;
  projectName?: string;
  plotNumber: string;
  facing: string;
  length?: number;
  width?: number;
  area: number;
  areaUnit: string;
  isCornerPlot?: boolean;
  price: number;
  status: 'AVAILABLE' | 'BOOKED' | 'REGISTERED';
  isAvailable?: boolean;
  currentBookingId?: string;
  updatedAt?: string;
}

export const SEED_PLOTS: PlotItem[] = [
  {
    id: 'plot-101',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave',
    plotNumber: 'P-01',
    facing: 'EAST',
    length: 50,
    width: 36,
    area: 200,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: true,
    price: 4900000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'plot-102',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave',
    plotNumber: 'P-02',
    facing: 'NORTH',
    length: 50,
    width: 30,
    area: 167,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: false,
    price: 4091500,
    status: 'BOOKED',
    isAvailable: false,
    currentBookingId: 'bkg-1',
    updatedAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'plot-103',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave',
    plotNumber: 'P-03',
    facing: 'EAST',
    length: 60,
    width: 40,
    area: 267,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: false,
    price: 6541500,
    status: 'REGISTERED',
    isAvailable: false,
    updatedAt: '2026-08-20T14:00:00Z',
  },
  {
    id: 'plot-104',
    projectId: 'proj-1',
    projectName: 'Sunrise Enclave',
    plotNumber: 'P-04',
    facing: 'WEST',
    length: 50,
    width: 30,
    area: 167,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: false,
    price: 4091500,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: '2026-09-04T09:00:00Z',
  },
  {
    id: 'plot-201',
    projectId: 'proj-2',
    projectName: 'Green Valley Phase 2',
    plotNumber: 'GV-11',
    facing: 'NORTH_EAST',
    length: 60,
    width: 37.5,
    area: 250,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: true,
    price: 3500000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'plot-202',
    projectId: 'proj-2',
    projectName: 'Green Valley Phase 2',
    plotNumber: 'GV-12',
    facing: 'EAST',
    length: 50,
    width: 36,
    area: 200,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: false,
    price: 2800000,
    status: 'BOOKED',
    isAvailable: false,
    updatedAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'plot-301',
    projectId: 'proj-3',
    projectName: 'Palm County Villa Plots',
    plotNumber: 'PC-05',
    facing: 'NORTH',
    length: 60,
    width: 45,
    area: 300,
    areaUnit: 'SQ_YARDS',
    isCornerPlot: true,
    price: 11400000,
    status: 'AVAILABLE',
    isAvailable: true,
    updatedAt: '2026-09-05T12:00:00Z',
  },
];

export const PlotInventory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectParam = searchParams.get('projectId') || '';
  const projectNameParam = searchParams.get('projectName') || '';

  const [plots, setPlots] = useState<PlotItem[]>(SEED_PLOTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectParam);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  useEffect(() => {
    if (projectParam) {
      setSelectedProjectId(projectParam);
    }
  }, [projectParam]);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const q = query(collection(db, 'plots'), orderBy('updatedAt', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const fetchedPlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlotItem[];
            const fetchedIds = new Set(fetchedPlots.map(p => p.id));
            const merged = [...fetchedPlots, ...SEED_PLOTS.filter(p => !fetchedIds.has(p.id))];
            setPlots(merged);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch plots from Firestore, using seed plots:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const handleClearProjectFilter = () => {
    setSelectedProjectId('');
    searchParams.delete('projectId');
    searchParams.delete('projectName');
    setSearchParams(searchParams);
  };

  const handleProjectSelectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      searchParams.set('projectId', projectId);
    } else {
      searchParams.delete('projectId');
      searchParams.delete('projectName');
    }
    setSearchParams(searchParams);
  };

  // Distinct projects list for selector
  const availableProjects = useMemo(() => {
    const map = new Map<string, string>();
    plots.forEach(p => {
      if (p.projectId && p.projectName) {
        map.set(p.projectId, p.projectName);
      }
    });
    // Add default known seed projects if not present
    map.set('proj-1', 'Sunrise Enclave');
    map.set('proj-2', 'Green Valley Phase 2');
    map.set('proj-3', 'Palm County Villa Plots');
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [plots]);

  // Filtered plots
  const filteredPlots = useMemo(() => {
    return plots.filter(p => {
      const matchSearch = !searchTerm || 
        p.plotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchProject = !selectedProjectId || p.projectId === selectedProjectId;
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchProject && matchStatus;
    });
  }, [plots, searchTerm, selectedProjectId, statusFilter]);

  // Compute metrics based on filtered project scope
  const metrics = useMemo(() => {
    const scopePlots = selectedProjectId ? plots.filter(p => p.projectId === selectedProjectId) : plots;
    const counts = { total: scopePlots.length, available: 0, booked: 0, registered: 0 };
    scopePlots.forEach(p => {
      if (p.status === 'AVAILABLE') counts.available++;
      else if (p.status === 'BOOKED') counts.booked++;
      else if (p.status === 'REGISTERED') counts.registered++;
    });
    return counts;
  }, [plots, selectedProjectId]);

  const activeProjectName = useMemo(() => {
    if (!selectedProjectId) return '';
    if (projectNameParam) return projectNameParam;
    const found = availableProjects.find(p => p.id === selectedProjectId);
    return found ? found.name : selectedProjectId;
  }, [selectedProjectId, projectNameParam, availableProjects]);

  const columns = [
    { 
      id: 'plotNumber', 
      label: 'Plot No.', 
      sortable: true,
      render: (row: PlotItem) => (
        <Box>
          <Typography variant="body2" fontWeight={700} color="primary">
            {row.plotNumber}
          </Typography>
          {row.isCornerPlot && (
            <Chip label="Corner Plot" size="small" color="secondary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Box>
      )
    },
    {
      id: 'projectName',
      label: 'Venture / Project',
      render: (row: PlotItem) => (
        <Typography variant="body2" color="text.secondary">
          {row.projectName || 'Sunrise Enclave'}
        </Typography>
      )
    },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true, 
      render: (row: PlotItem) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'AVAILABLE' ? 'success' : row.status === 'BOOKED' ? 'warning' : 'primary'}
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { id: 'price', label: 'Current Rate', render: (row: PlotItem) => `₹${row.price ? row.price.toLocaleString('en-IN') : 0}` },
    { id: 'facing', label: 'Facing' },
    { id: 'area', label: 'Area', render: (row: PlotItem) => `${row.area} ${row.areaUnit.replace('_', ' ')}` },
    { 
      id: 'actions', 
      label: 'Actions',
      render: (row: PlotItem) => (
        <Button size="small" variant="outlined" onClick={() => navigate(`/plots/${row.id}`)}>
          View Details
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 0.5, md: 1 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header with Projects link */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.45rem' } }}>
              Plot Inventory
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Manage individual plot units, facing, dimensions, pricing, and live booking status
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button 
            variant="outlined" 
            size="medium"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/projects')}
            sx={{ py: 0.75, fontSize: '0.85rem' }}
          >
            All Ventures
          </Button>
          <Button variant="contained" color="primary" size="medium" sx={{ py: 0.75, fontSize: '0.85rem' }}>Bulk Import</Button>
        </Stack>
      </Box>

      {/* Active Project Banner */}
      {selectedProjectId && (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            border: 1,
            borderColor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BusinessIcon color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                FILTERED BY VENTURE PROJECT
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary.dark">
                {activeProjectName}
              </Typography>
            </Box>
          </Stack>
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<ClearIcon />}
            onClick={handleClearProjectFilter}
          >
            Show All Ventures Plots
          </Button>
        </Paper>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Plots"
            value={metrics.total}
            subtitle="Total Venture Plots"
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Available"
            value={metrics.available}
            subtitle="Open for Booking"
            color="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Booked"
            value={metrics.booked}
            subtitle="Token Advance Received"
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Registered"
            value={metrics.registered}
            subtitle="Sale Deeds Registered"
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2} alignItems="center">
          <Box sx={{ flex: 1, width: '100%' }}>
            <SearchBox 
              placeholder="Search by plot number or venture name..." 
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </Box>
          
          <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              select
              size="small"
              label="Filter by Venture"
              value={selectedProjectId}
              onChange={(e) => handleProjectSelectChange(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Ventures</MenuItem>
              {availableProjects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="BOOKED">Booked</MenuItem>
              <MenuItem value="REGISTERED">Registered</MenuItem>
            </TextField>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                startIcon={<TableRowsIcon />}
                onClick={() => setViewMode('table')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Table
              </Button>
              <Button
                size="small"
                variant={viewMode === 'map' ? 'contained' : 'outlined'}
                startIcon={<MapIcon />}
                onClick={() => setViewMode('map')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Layout Map
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {viewMode === 'table' ? (
          <DataTable
            {...({ 
              columns, 
              data: filteredPlots, 
              loading, 
              onRowClick: (row: PlotItem) => navigate(`/plots/${row.id}`) 
            } as any)}
          />
        ) : (
          <PlotLayoutMapView
            plots={filteredPlots}
            projectName={activeProjectName || 'All Ventures Plots'}
            onSelectPlot={(p) => navigate(`/plots/${p.id}`)}
          />
        )}
      </Paper>
    </Box>
  );
};

export default PlotInventory;
