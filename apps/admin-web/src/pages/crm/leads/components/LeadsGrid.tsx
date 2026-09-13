import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { DataTable, Column, StatusChip } from '@real-estate-erp/ui';
import { Lead } from '@real-estate-erp/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setSelectedLeadId } from '../../../../store/leadsSlice';

interface LeadsGridProps {
  leads: Lead[];
  selected: string[];
  onSelectChange: (selected: string[]) => void;
}

export const LeadsGrid: React.FC<LeadsGridProps> = ({ leads, selected, onSelectChange }) => {
  const dispatch = useDispatch();
  const { hiddenColumns } = useSelector((state: RootState) => state.leads);

  const columns: Column<Lead>[] = useMemo(() => [
    {
      id: 'fullName',
      label: 'Name',
      minWidth: 140,
      format: (value: any, row?: Lead) => (
        <Box 
          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          onClick={() => row && dispatch(setSelectedLeadId(row.id))}
        >
          {value || 'Unknown'}
        </Box>
      )
    },
    { id: 'phone', label: 'Phone', minWidth: 115 },
    { id: 'email', label: 'Email', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      format: (value: any) => <StatusChip status={value as any} />
    },
    {
      id: 'source',
      label: 'Source',
      minWidth: 110,
      format: (value: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {value ? String(value).replace(/_/g, ' ') : '-'}
        </Typography>
      )
    },
    { id: 'city', label: 'City', minWidth: 90 },
    { 
      id: 'createdAt', 
      label: 'Created', 
      minWidth: 95,
      format: (value: any) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'
    },
    { 
      id: 'aiIntentScore', 
      label: 'Intent', 
      minWidth: 70,
      format: (value: any) => (
        <Typography fontWeight={700} sx={{ fontSize: '0.85rem' }} color={value > 75 ? 'success.main' : value > 40 ? 'warning.main' : 'error.main'}>
          {value ? `${value}%` : '-'}
        </Typography>
      )
    },
  ], [dispatch]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectChange(leads.map(l => l.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    onSelectChange(newSelected);
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={columns}
        data={leads}
        keyField="id"
        hiddenColumns={hiddenColumns}
        virtualScroll
        rowHeight={55}
        resizableColumns
        selected={selected}
        onSelectAllClick={handleSelectAll}
        onSelectClick={handleSelectOne}
      />
    </Box>
  );
};
