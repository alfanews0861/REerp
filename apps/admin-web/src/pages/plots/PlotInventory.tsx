import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  DataTable, 
  FilterPanel, 
  MetricCard, 
  SearchBox, 
  StatusChip
} from '@real-estate-erp/ui';
import { getFirebaseInstance } from '@real-estate-erp/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

export const PlotInventory = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({
    total: 0,
    available: 0,
    booked: 0,
    registered: 0,
  });

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const { db } = getFirebaseInstance();
        // Since we are MVP, just fetch a chunk
        const q = query(collection(db, 'plots'), orderBy('updatedAt', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        const fetchedPlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setPlots(fetchedPlots);
        
        // Compute basic metrics
        const counts = { total: fetchedPlots.length, available: 0, booked: 0, registered: 0 };
        fetchedPlots.forEach(p => {
          if (p.status === 'AVAILABLE') counts.available++;
          else if (p.status === 'BOOKED') counts.booked++;
          else if (p.status === 'REGISTERED') counts.registered++;
        });
        setMetrics(counts);
      } catch (err) {
        console.error('Failed to fetch plots', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlots();
  }, []);

  const columns = [
    { id: 'plotNumber', label: 'Plot No.', sortable: true },
    { id: 'status', label: 'Status', sortable: true, render: (row: any) => <StatusChip status={row.status} /> },
    { id: 'price', label: 'Current Rate', render: (row: any) => `₹${row.price || 0}` },
    { id: 'facing', label: 'Facing' },
    { id: 'area', label: 'Area', render: (row: any) => `${row.area} ${row.areaUnit}` },
    { 
      id: 'actions', 
      label: 'Actions',
      render: (row: any) => (
        <Button size="small" onClick={() => navigate(`/plots/${row.id}`)}>
          View Details
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Plot Inventory</Typography>
        <Button variant="contained" color="primary">Bulk Import</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Plots" value={metrics.total} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Available" value={metrics.available} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Booked" value={metrics.booked} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Registered" value={metrics.registered} />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" gap={2} mb={2}>
          <SearchBox 
            placeholder="Search by plot number..." 
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
          <FilterPanel 
            {...({ filters: [{ id: 'status', label: 'Status', options: ['AVAILABLE', 'BOOKED', 'REGISTERED'] }], onApply: () => {} } as any)}
          />
        </Box>
        <DataTable
          {...({ columns, data: plots.filter(p => !searchTerm || p.plotNumber?.includes(searchTerm)), loading, onRowClick: (row: any) => navigate(`/plots/${row.id}`) } as any)}
        />
      </Paper>
    </Box>
  );
};
export default PlotInventory;
